import { Injectable } from '@nestjs/common';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';

@Injectable()
export class ProductTagsService {
  create(createProductTagDto: CreateProductTagDto) {
    return 'This action adds a new productTag'+createProductTagDto;
  }

  findAll() {
    return `This action returns all productTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productTag`;
  }

  update(id: number, updateProductTagDto: UpdateProductTagDto) {
    return `This action updates a #${id} productTag`+ updateProductTagDto;
  }

  remove(id: number) {
    return `This action removes a #${id} productTag`;
  }
}
