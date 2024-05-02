import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class AddressCustomerType {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  address: string;
}

export class CreateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressCustomerType)
  address: AddressCustomerType;
}
