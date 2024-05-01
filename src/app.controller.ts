import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/customer')
  registerCustomer(@Body() body: CreateCustomerDto) {
    return body;
  }
}
