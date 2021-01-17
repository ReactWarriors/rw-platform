import { Body, Controller, Post } from '@nestjs/common';
import { AddPayedProjectAccessDTO } from './add_payed_project_access.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post('/project_access')
  async addPayedProjectAccess(@Body() data: AddPayedProjectAccessDTO) {
    return this.paymentService.addPayedProjectAccess(data);
  }
}
