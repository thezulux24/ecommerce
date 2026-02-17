import { IsString, IsNumber, IsOptional, IsArray, Min, Max, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class AddCartItemDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === null ? undefined : value)
    productId?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === null ? undefined : value)
    bundleId?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: 'La cantidad mínima es 1' })
    @Max(99, { message: 'La cantidad máxima es 99' })
    quantity: number;
}

export class UpdateCartItemDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(99)
    quantity: number;
}

export class SyncCartItemDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === null ? undefined : value)
    productId?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === null ? undefined : value)
    bundleId?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class SyncCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SyncCartItemDto)
    items: SyncCartItemDto[];
}
