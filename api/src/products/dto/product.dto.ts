import { IsString, IsNumber, IsOptional, IsArray, Min, MaxLength, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @MaxLength(200)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    slug?: string;

    @IsString()
    @MaxLength(5000)
    description: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
    price: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock: number;

    @IsUUID('4', { message: 'Categoría inválida' })
    categoryId: string;

    @IsOptional()
    @IsUUID('4', { message: 'Marca inválida' })
    brandId?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    slug?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsUUID('4')
    categoryId?: string;

    @IsOptional()
    @IsUUID('4')
    brandId?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
