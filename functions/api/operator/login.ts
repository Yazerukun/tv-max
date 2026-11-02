import { getAccountByCredentials, upsertAccount, corsHeaders } from '../_store';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const u = (data.username || '').trim();
    const p = (data.password || '').trim();
    const clientHwHash = data.hardware_hash || 'web-puf-client';
    const clientIp = context.request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    const account = await getAccountByCredentials(u, p, context.env);

    if (!account) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Username or PIN.' }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    const now = Math.floor(Date.now() / 1000);

    // Anti-Cloning Lock: Check if already bound to another machine
    if (account.bound_hardware_hash && account.bound_hardware_hash !== clientHwHash) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Anti-Piracy Lock: This account is already paired with another machine. Each account is valid for 1 machine only. Contact Ian to reset pairing.'
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    // First-time activation: bind hardware and set expiration
    if (!account.activated_at) {
      account.activated_at = now;
      account.expires_at = now + (account.duration_hours * 3600);
      account.bound_hardware_hash = clientHwHash;
      account.bound_ip = clientIp;
      account.status = 'ACTIVE';
      await upsertAccount(account, context.env);
      return new Response(JSON.stringify({
        success: true,
        message: 'Device paired and activated successfully!',
        account
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    // Check expiration
    if (account.expires_at && now > account.expires_at) {
      account.status = 'EXPIRED';
      await upsertAccount(account, context.env);
      return new Response(JSON.stringify({
        success: false,
        message: 'This account subscription has expired. Please renew with Ian via GCash.',
        account
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    // Re-login on authorized machine
    account.status = 'ACTIVE';
    account.bound_ip = clientIp;
    await upsertAccount(account, context.env);

    return new Response(JSON.stringify({
      success: true,
      message: 'Session restored on paired machine.',
      account
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
