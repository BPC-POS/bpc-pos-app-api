import { PartialType } from '@nestjs/swagger';
import { CreateProductCategoryMappingDto } from './create-product-category-mapping.dto';

export class UpdateProductCategoryMappingDto extends PartialType(CreateProductCategoryMappingDto) {}
