// @ts-ignore
import { ADMIN_KEY, INVOICE_READ_KEY } from '$env/static/private';
import LNBits from 'lnbits';

export const GET = async ({ url }) => {
    const memo = url.searchParams.get('memo');

    const { wallet } = LNBits({
        adminKey: ADMIN_KEY,
        invoiceReadKey: INVOICE_READ_KEY,
        endpoint: 'https://legend.lnbits.com'
    });

    const invoice = await wallet.createInvoice({
        amount: 10000,
        memo: memo ? memo : '',
        out: false
    });

    return new Response(JSON.stringify(invoice), { status: 200 });
};
