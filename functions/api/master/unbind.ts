import { getAccountById, upsertAccount, corsHeaders } from '../_store';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const accountId = data.account_id;

    const acc = await getAccountById(accountId, context.env);
    if (!acc) {
      return new Response(JSON.stringify({ success: false, message: 'Account not found' }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    acc.bound_hardware_hash = null;
    acc.bound_ip = null;
    acc.status = 'UNBOUND_READY';
    await upsertAccount(acc, context.env);

    return new Response(JSON.stringify({
      success: true,
      message: 'Device binding cleared. Operator can pair a new machine.'
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders() });
};
