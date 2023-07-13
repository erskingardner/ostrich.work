import { ADMIN_KEY, INVOICE_READ_KEY } from '$env/static/private';
import LNBits from 'lnbits';
import { dev } from '$app/environment';

export async function GET({ url }) {
    const paymentHash = url.searchParams.get('paymentHash');

    if (!paymentHash) {
        return new Response(JSON.stringify({ message: 'Missing required param: paymentHash' }), {
            status: 422
        });
    }

    const { wallet } = LNBits({
        adminKey: dev ? ADMIN_KEY : process.env.ADMIN_KEY,
        invoiceReadKey: dev ? INVOICE_READ_KEY : process.env.INVOICE_READ_KEY,
        endpoint: 'https://legend.lnbits.com'
    });

    const invoiceCheck = await wallet.checkInvoice({ payment_hash: paymentHash });

    return new Response(JSON.stringify(invoiceCheck), { status: 200 });
}
