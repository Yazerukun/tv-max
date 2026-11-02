import { deleteAccountById, corsHeaders } from '../_store';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const accountId = data.account_id;

    const ok = await deleteAccountById(accountId, context.env);
    if (!ok) {
      return new Response(JSON.stringify({ success: false, message: 'Account not found' }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Account permanently deleted and license revoked.'
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
