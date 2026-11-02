import { getAccounts, saveAccounts, corsHeaders, VendoAccount } from '../_store';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const opName = (data.operator_name || 'Vendo Operator').trim();
    const tier = data.tier === 'trial' ? 'trial' : 'pro_30d';
    const duration = tier === 'trial' ? 24 : 720; // 30 days

    const prefix = tier === 'trial' ? 'trial' : 'vendo';
    const randCode = Math.random().toString(36).substring(2, 6);
    const username = data.username ? data.username.trim().toLowerCase() : `${prefix}-${randCode}`;
    const password = data.password ? data.password.trim() : Math.floor(1000 + Math.random() * 9000).toString();

    const newAcc: VendoAccount = {
      id: `acc-${Math.random().toString(36).substring(2, 10)}`,
      username,
      password,
      operator_name: opName,
      tier,
      duration_hours: duration,
      created_at: Math.floor(Date.now() / 1000),
      activated_at: null,
      expires_at: null,
      bound_hardware_hash: null,
      bound_ip: null,
      status: 'UNBOUND_READY'
    };

    const accounts = getAccounts();
    accounts.unshift(newAcc);
    saveAccounts(accounts);

    return new Response(JSON.stringify({ success: true, account: newAcc }), {
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
