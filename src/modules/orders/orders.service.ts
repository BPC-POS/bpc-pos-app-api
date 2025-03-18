import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  Order,
  OrderItem,
  Product,
  ProductVariant,
} from '../../database/entities';
import PDFDocument from 'pdfkit';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!createOrderDto.items || createOrderDto.items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      for (const item of createOrderDto.items) {
        const product = await this.productRepository.findOneBy({
          id: item.product_id,
        });
        if (!product) {
          throw new BadRequestException(
            `Product with ID ${item.product_id} not found`,
          );
        }

        if (item.variant_id) {
          const variant = await this.productVariantRepository.findOneBy({
            id: item.variant_id,
            product_id: item.product_id,
          });

          if (!variant) {
            throw new BadRequestException(
              `Variant with ID ${item.variant_id} not found for product ${item.product_id}`,
            );
          }

          if (variant.stock_quantity < item.quantity) {
            throw new BadRequestException(
              `Not enough stock for variant ${item.variant_id} of product ${item.product_id}`,
            );
          }

          await queryRunner.manager.update(
            ProductVariant,
            { id: item.variant_id },
            { stock_quantity: () => `stock_quantity - ${item.quantity}` },
          );
        } else {
          if (product.stock_quantity < item.quantity) {
            throw new BadRequestException(
              `Not enough stock for product ${item.product_id}`,
            );
          }

          await queryRunner.manager.update(
            Product,
            { id: item.product_id },
            { stock_quantity: () => `stock_quantity - ${item.quantity}` },
          );
        }
      }

      const order = queryRunner.manager.create(Order, {
        member_id: createOrderDto.member_id || null,
        user_id: createOrderDto.user_id || null,
        order_date: createOrderDto.order_date || new Date(),
        total_amount: createOrderDto.total_amount,
        discount: createOrderDto.discount || 0,
        tax: createOrderDto.tax || 0,
        status: createOrderDto.status || 1,
        payment_info: createOrderDto.payment_info,
        shipping_address: createOrderDto.shipping_address,
        meta: createOrderDto.meta,
      });

      const savedOrder = await queryRunner.manager.save(order);
      console.log(createOrderDto.items);
      const orderItems = createOrderDto.items.map((item) => ({
        order_id: savedOrder.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        price: item.unit_price,
        discount: item.discount || 0,
        meta: item.meta,
      }));

      await queryRunner.manager.save(OrderItem, orderItems);
      await queryRunner.commitTransaction();

      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        relations: ['orderItems', 'orderItems.product'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.product', 'orderItems.variant'],
      });

      if (!order) {
        throw new NotFoundException(`Order #${id} not found`);
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrder = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems'],
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order #${id} not found`);
      }

      const { items, ...orderData } = updateOrderDto;
      await queryRunner.manager.update(Order, id, orderData);

      if (items && items.length > 0) {
        await queryRunner.manager.delete(OrderItem, { order_id: id });

        for (const oldItem of existingOrder.orderItems) {
          if (oldItem.variant_id) {
            await queryRunner.manager.update(
              ProductVariant,
              { id: oldItem.variant_id },
              { stock_quantity: () => `stock_quantity + ${oldItem.quantity}` },
            );
          } else {
            await queryRunner.manager.update(
              Product,
              { id: oldItem.product_id },
              { stock_quantity: () => `stock_quantity + ${oldItem.quantity}` },
            );
          }
        }

        for (const item of items) {
          const product = await this.productRepository.findOneBy({
            id: item.product_id,
          });
          if (!product) {
            throw new BadRequestException(
              `Product with ID ${item.product_id} not found`,
            );
          }

          if (item.variant_id) {
            const variant = await this.productVariantRepository.findOneBy({
              id: item.variant_id,
              product_id: item.product_id,
            });

            if (!variant) {
              throw new BadRequestException(
                `Variant with ID ${item.variant_id} not found for product ${item.product_id}`,
              );
            }

            if (variant.stock_quantity < item.quantity) {
              throw new BadRequestException(
                `Not enough stock for variant ${item.variant_id} of product ${item.product_id}`,
              );
            }

            await queryRunner.manager.update(
              ProductVariant,
              { id: item.variant_id },
              { stock_quantity: () => `stock_quantity - ${item.quantity}` },
            );
          } else {
            if (product.stock_quantity < item.quantity) {
              throw new BadRequestException(
                `Not enough stock for product ${item.product_id}`,
              );
            }

            await queryRunner.manager.update(
              Product,
              { id: item.product_id },
              { stock_quantity: () => `stock_quantity - ${item.quantity}` },
            );
          }
        }

        const orderItems = items.map((item) =>
          this.orderItemRepository.create({
            order_id: id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount: item.discount || 0,
            meta: item.meta,
          }),
        );

        await queryRunner.manager.save(OrderItem, orderItems);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unknown error occurred');
    } finally {
      await queryRunner.release();
    }
  }

  async generateInvoicePdf(orderId: number, res: any): Promise<void> {
    const order = await this.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${orderId}.pdf`,
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    // Order Details
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Order Date: ${order.createdAt}`);
    doc.text(`Customer ID: ${order.member_id || 'N/A'}`);
    doc.text(`Total Amount: $${order.total_amount}`);
    doc.moveDown();

    // Items Table
    doc.fontSize(14).text('Order Items:', { underline: true });
    doc.moveDown();

    order.orderItems.forEach((item, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. Product ID: ${item.product_id}, Quantity: ${item.quantity}, Unit Price: $${item.unit_price}, Total: $${item.quantity * item.unit_price}`,
        );
    });

    doc.end();
  }
  async generateInvoicePdfV2(orderId: number, res: any): Promise<void> {
    const order = await this.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${orderId}.pdf`,
    );

    doc.pipe(res);

    // Add company logo and information
    doc.fontSize(20).text('BPC POS SYSTEM', { align: 'center' });
    doc
      .fontSize(12)
      .text('Professional Point of Sale Solution', { align: 'center' });
    doc.moveDown();

    // Add divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Invoice header
    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Order information
    const invoiceTableTop = doc.y;

    // Left column - Order details
    doc
      .font('Helvetica-Bold')
      .text('Invoice Details:', { continued: true })
      .font('Helvetica')
      .text(`  #${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${order.status === 1 ? 'Completed' : order.status}`);

    // Right column - Customer info
    doc
      .font('Helvetica-Bold')
      .text('Customer Information:', 260, invoiceTableTop);
    doc
      .font('Helvetica')
      .text(`Customer ID: ${order.member_id || ''}`, 260, doc.y);

    doc.moveDown(2);

    // Items table header
    const tableTop = doc.y;
    const tableHeaders = [
      'Item',
      'Product',
      'Variant',
      'Qty',
      'Unit Price',
      // 'Discount',
      'Total',
    ];
    const tableColumnWidths = [35, 160, 90, 40, 70, 60, 70];

    let currentPosition = 50;

    // Draw table header
    doc.font('Helvetica-Bold').fontSize(10);
    tableHeaders.forEach((header, i) => {
      const columnWidth = tableColumnWidths[i] ?? 0; // Default to 0 if undefined
      doc.text(header, currentPosition, tableTop, {
        width: columnWidth,
        align: 'left',
      });
      currentPosition += columnWidth;
    });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Draw table rows
    doc.font('Helvetica').fontSize(9);
    let tableRowPosition = tableTop + 25;

    for (let i = 0; i < order.orderItems.length; i++) {
      const item = order.orderItems[i];
      if (!item) continue;

      const product = item.product;
      // const variant = item.variant;

      currentPosition = 50;

      // Item number
      doc.text((i + 1).toString(), currentPosition, tableRowPosition, {
        width: tableColumnWidths[0] ?? 0,
      });
      currentPosition += tableColumnWidths[0] ?? 0;

      // Product name
      const productName = product
        ? product.name
        : `Product ID: ${item.product_id}`;
      doc.text(productName, currentPosition, tableRowPosition, {
        width: tableColumnWidths[1] ?? 0,
      });
      currentPosition += tableColumnWidths[1] ?? 0;

      // // Variant
      // const variantInfo = variant ? variant?.variant_name || variant?.id?.toString() : 'N/A';
      // doc.text(variantInfo, currentPosition, tableRowPosition, { width: tableColumnWidths[2] });
      currentPosition += tableColumnWidths[2] ?? 0;

      // Quantity
      doc.text(item.quantity.toString(), currentPosition, tableRowPosition, {
        width: tableColumnWidths[3],
      });
      currentPosition += tableColumnWidths[3] ?? 0;

      // Unit price
      doc.text(
        `$${item.unit_price.toFixed(2)}`,
        currentPosition,
        tableRowPosition,
        { width: tableColumnWidths[4] },
      );
      currentPosition += tableColumnWidths[4] ?? 0;

      // // Discount
      // doc.text(`$${(item.discount || 0).toFixed(2)}`, currentPosition, tableRowPosition, { width: tableColumnWidths[5] });
      // currentPosition += tableColumnWidths[5]?? 0;

      // Total
      const itemTotal = item.quantity * item.unit_price - (item.discount || 0);
      doc.text(`$${itemTotal.toFixed(2)}`, currentPosition, tableRowPosition, {
        width: tableColumnWidths[6],
      });

      tableRowPosition += 20;
    }

    // Draw bottom line
    doc.moveTo(50, tableRowPosition).lineTo(550, tableRowPosition).stroke();

    // Add totals
    tableRowPosition += 10;
    doc.font('Helvetica').fontSize(10);

    // if (order.discount > 0) {
    //   doc.text(`Subtotal:`, 380, tableRowPosition);
    //   doc.text(`$${(order.total_amount + order.discount).toFixed(2)}`, 480, tableRowPosition);
    //   tableRowPosition += 15;

    //   doc.text(`Discount:`, 380, tableRowPosition);
    //   doc.text(`$${order.discount.toFixed(2)}`, 480, tableRowPosition);
    //   tableRowPosition += 15;
    // }

    //   doc.text(`Tax (8%):`, 380, tableRowPosition);
    //   doc.text(`$${order.tax.toFixed(2)}`, 480, tableRowPosition);
    // tableRowPosition += 15;

    doc.font('Helvetica-Bold');
    doc.text(`Total Amount:`, 380, tableRowPosition);
    doc.text(`$${order.total_amount}`, 480, tableRowPosition);

    // Add QR Code for payment
    if (order.total_amount > 0) {
      doc.moveDown(2);
      // Generate VietQR code
      // You might want to replace these parameters with your actual bank details
      const bankId = 'vietinbank'; // Example bank ID
      const accountNo = '101877496008'; // Your account number
      const template = 'compact2';
      const accountName = 'BPC%20POS%20SYSTEM';
      const description = `Payment%20for%20order%20${order.id}`;

      const qrCodeUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${order.total_amount}&addInfo=${description}&accountName=${accountName}`;

      // Add QR code image to the PDF
      try {
        const response = await axios.get(qrCodeUrl, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data, 'binary');
        const pageWidth = doc.page.width;
        const imageWidth = 200;
        const x = (pageWidth - imageWidth) / 2;
        
        // Add QR code with some space above the footer
        const footerPosition = 700;
        const qrCodeHeight = 200;
        const qrCodeY = footerPosition - qrCodeHeight - 20; // 20px space between QR code and footer
        
        doc.image(imageBuffer, x, qrCodeY, {
          fit: [200, 200],
          align: 'center',
        });
            } catch (error) {
        console.error('Failed to add QR code to PDF:', error);
        doc.text('QR Code not available', { align: 'center' });
            }
          }

          // Footer
          doc.fontSize(10).font('Helvetica');
          doc.text('Thank you!', 50, 700, { align: 'center' });

          doc.text(
            `Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            50,
            715,
            { align: 'center' },
          );

          doc.end();
  }
}
