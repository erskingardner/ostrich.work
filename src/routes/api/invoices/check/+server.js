import { ADMIN_KEY, INVOICE_READ_KEY } from '$env/static/private';
import LNBits from 'lnbits';

export const GET = async ({ url }) => {
    const paymentHash = url.searchParams.get('paymentHash');

    if (!paymentHash) {
        return new Response(JSON.stringify({ message: 'Missing required param: paymentHash' }), {
            status: 422
        });
    }

    const { wallet } = LNBits({
        adminKey: ADMIN_KEY,
        invoiceReadKey: INVOICE_READ_KEY,
        endpoint: 'https://legend.lnbits.com'
    });

    const invoiceCheck = await wallet.checkInvoice({ payment_hash: paymentHash });

    return new Response(JSON.stringify(invoiceCheck), { status: 200 });
};
