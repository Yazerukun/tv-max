import { getAccounts, saveAccounts, corsHeaders } from '../_store';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const accountId = data.account_id;
    const additionalDays = data.days || 30;

    const accounts = getAccounts();
    const acc = accounts.find(a => a.id === accountId);

    if (!acc) {
      return new Response(JSON.stringify({ success: false, message: 'Account not found' }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const baseTime = Math.max(now, acc.expires_at || now);
    acc.expires_at = baseTime + (additionalDays * 86400);
    acc.tier = 'pro_30d';
    acc.duration_hours = (acc.duration_hours || 0) + (additionalDays * 24);
    acc.status = 'ACTIVE';

    saveAccounts(accounts);

    return new Response(JSON.stringify({
      success: true,
      message: `Account renewed for +${additionalDays} days.`,
      account: acc
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
