import { getAccountById, corsHeaders } from '../_store';

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const accountId = url.searchParams.get('id');

  if (!accountId) {
    return new Response(JSON.stringify({
      hardware_hash: 'edge-cloudflare',
      session: null
    }), {
      status: 200,
      headers: corsHeaders()
    });
  }

  const acc = await getAccountById(accountId, context.env);

  if (!acc) {
    return new Response(JSON.stringify({
      hardware_hash: 'edge-cloudflare',
      session: {
        status: 'REVOKED',
        message: 'Account no longer exists or was deleted by Master Admin.'
      }
    }), {
      status: 200,
      headers: corsHeaders()
    });
  }

  return new Response(JSON.stringify({
    hardware_hash: acc.bound_hardware_hash,
    session: {
      status: acc.status,
      account: acc
    }
  }), {
    status: 200,
    headers: corsHeaders()
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders() });
};
