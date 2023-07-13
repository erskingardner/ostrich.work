import { ADMIN_KEY, INVOICE_READ_KEY } from '$env/static/private';
import { dev } from '$app/environment';
// import LNBits from 'lnbits';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LNBits = require('lnbits');

export async function GET({ url }) {
    const memo = url.searchParams.get('memo');
    const { wallet } = LNBits({
        adminKey: dev ? ADMIN_KEY : process.env.ADMIN_KEY,
        invoiceReadKey: dev ? INVOICE_READ_KEY : process.env.INVOICE_READ_KEY,
        endpoint: 'https://legend.lnbits.com'
    });

    const invoice = await wallet.createInvoice({
        amount: 10000,
        memo: memo ? memo : '',
        out: false
    });

    return new Response(JSON.stringify(invoice), { status: 200 });
}
