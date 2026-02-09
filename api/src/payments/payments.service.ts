import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private readonly apiKey = process.env.PAYU_API_KEY || 'your_api_key';
    private readonly merchantId = process.env.PAYU_MERCHANT_ID || 'your_merchant_id';
    private readonly accountId = process.env.PAYU_ACCOUNT_ID || 'your_account_id';
    private readonly sandbox = process.env.PAYU_SANDBOX === 'true';

    generateSignature(reference: string, amount: number, currency: string): string {
        const signature = `${this.apiKey}~${this.merchantId}~${reference}~${amount}~${currency}`;
        return crypto.createHash('md5').update(signature).digest('hex');
    }

    getCheckoutConfig(orderId: string, amount: number, email: string) {
        const currency = 'COP'; // Default for PayU Latam
        return {
            merchantId: this.merchantId,
            accountId: this.accountId,
            description: `Order ${orderId} - OnlineStore`,
            referenceCode: orderId,
            amount: amount.toString(),
            tax: '0',
            taxReturnBase: '0',
            currency: currency,
            signature: this.generateSignature(orderId, amount, currency),
            test: this.sandbox ? '1' : '0',
            buyerEmail: email,
            responseUrl: `${process.env.BASE_URL}/payments/response`,
            confirmationUrl: `${process.env.BASE_URL}/payments/confirmation`,
        };
    }

    // Confirmation webhook from PayU
    async handleConfirmation(data: any) {
        // Logic to update order status based on 'state_pol' from PayU
        // 4 = APPROVED, 6 = DECLINED, 5 = EXPIRED
        return { status: 'handled' };
    }
}
