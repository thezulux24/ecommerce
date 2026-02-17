import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class AddressDataDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MaxLength(100)
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es requerido' })
    @MaxLength(100)
    lastName: string;

    @IsString()
    @IsNotEmpty({ message: 'La dirección es requerida' })
    @MaxLength(300)
    address: string;

    @IsString()
    @IsNotEmpty({ message: 'La ciudad es requerida' })
    @MaxLength(100)
    city: string;

    @IsString()
    @IsNotEmpty({ message: 'El departamento es requerido' })
    @MaxLength(100)
    department: string;

    @IsString()
    @IsNotEmpty({ message: 'El teléfono es requerido' })
    @MaxLength(20)
    phone: string;
}

export class CreateOrderDto {
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDataDto)
    addressData: AddressDataDto;
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus, { message: 'Estado de pedido inválido' })
    status: OrderStatus;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    trackingNumber?: string;
}
