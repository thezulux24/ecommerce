import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    private readonly apiKey = process.env.PAYU_API_KEY || '';
    private readonly merchantId = process.env.PAYU_MERCHANT_ID || '';
    private readonly accountId = process.env.PAYU_ACCOUNT_ID || '';
    private readonly sandbox = process.env.PAYU_SANDBOX === 'true';

    constructor(private prisma: PrismaService) { }

    generateSignature(reference: string, amount: number, currency: string): string {
        const signatureString = `${this.apiKey}~${this.merchantId}~${reference}~${amount}~${currency}`;
        return crypto.createHash('md5').update(signatureString).digest('hex');
    }

    /**
     * Verifica la firma enviada por PayU para evitar confirmaciones falsas
     */
    private verifyPayUSignature(data: any): boolean {
        if (!this.apiKey) {
            this.logger.warn('PAYU_API_KEY no está configurada. No se puede verificar la firma.');
            return false;
        }

        const { merchant_id, reference_sale, value, currency, state_pol, sign } = data;

        // PayU envía la firma usando: ApiKey~merchant_id~reference_sale~value~currency~state_pol
        // Formato del value: truncar a 1 decimal si .0, mantener si tiene decimales
        const formattedValue = Number(value) % 1 === 0
            ? `${Number(value).toFixed(1)}`
            : `${Number(value)}`;

        const signatureString = `${this.apiKey}~${merchant_id}~${reference_sale}~${formattedValue}~${currency}~${state_pol}`;
        const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');

        return expectedSignature === sign;
    }

    getCheckoutConfig(orderId: string, amount: number, email: string) {
        const currency = 'COP';
        return {
            merchantId: this.merchantId,
            accountId: this.accountId,
            description: `Order ${orderId} - Apex Labs`,
            referenceCode: orderId,
            amount: amount.toString(),
            tax: '0',
            taxReturnBase: '0',
            currency,
            signature: this.generateSignature(orderId, amount, currency),
            test: this.sandbox ? '1' : '0',
            buyerEmail: email,
            responseUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/payments/response`,
            confirmationUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/payments/confirmation`,
        };
    }

    /**
     * Webhook de confirmación de PayU
     * PayU state_pol: 4 = APPROVED, 5 = EXPIRED, 6 = DECLINED, 7 = PENDING
     */
    async handleConfirmation(data: any) {
        this.logger.log(`PayU confirmation received for reference: ${data.reference_sale}, state: ${data.state_pol}`);

        // 1. Verificar firma para prevenir confirmaciones falsas
        if (!this.verifyPayUSignature(data)) {
            this.logger.warn(`Firma inválida en confirmación de PayU para referencia: ${data.reference_sale}`);
            throw new BadRequestException('Firma de confirmación inválida');
        }

        const orderId = data.reference_sale;
        const statePol = parseInt(data.state_pol, 10);
        const transactionId = data.transaction_id;

        // 2. Verificar que la orden existe
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            this.logger.warn(`Orden no encontrada: ${orderId}`);
            throw new BadRequestException(`Orden ${orderId} no encontrada`);
        }

        // 3. Mapear estado de PayU a estado de pago
        let paymentStatus: string;
        let orderStatus: 'PROCESSING' | 'PENDING' | 'CANCELLED';

        switch (statePol) {
            case 4: // APPROVED
                paymentStatus = 'COMPLETED';
                orderStatus = 'PROCESSING';
                break;
            case 6: // DECLINED
                paymentStatus = 'FAILED';
                orderStatus = 'CANCELLED';
                break;
            case 5: // EXPIRED
                paymentStatus = 'EXPIRED';
                orderStatus = 'CANCELLED';
                break;
            case 7: // PENDING
                paymentStatus = 'PENDING';
                orderStatus = 'PENDING';
                break;
            default:
                paymentStatus = 'UNKNOWN';
                orderStatus = 'PENDING';
                this.logger.warn(`Estado PayU desconocido: ${statePol}`);
        }

        // 4. Crear o actualizar el registro de pago en una transacción
        await this.prisma.$transaction(async (tx) => {
            // Upsert payment record
            await tx.payment.upsert({
                where: { transactionId: transactionId || `fallback-${orderId}` },
                create: {
                    orderId,
                    provider: 'PAYU',
                    status: paymentStatus,
                    transactionId,
                    amount: order.totalAmount,
                    currency: data.currency || 'COP',
                    method: data.payment_method_name || 'UNKNOWN',
                    metadata: data,
                },
                update: {
                    status: paymentStatus,
                    metadata: data,
                },
            });

            // Actualizar estado de la orden
            await tx.order.update({
                where: { id: orderId },
                data: { status: orderStatus },
            });
        });

        this.logger.log(`Orden ${orderId} actualizada a ${orderStatus} (pago: ${paymentStatus})`);
        return { status: 'processed', orderId, paymentStatus };
    }
}
