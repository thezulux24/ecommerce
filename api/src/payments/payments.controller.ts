import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('confirmation')
    handleConfirmation(@Body() data: any) {
        return this.paymentsService.handleConfirmation(data);
    }

    @Get('response')
    handleResponse(@Query() data: any) {
        // Redirect or return status
        return { message: 'Payment response received', data };
    }
}
