import { getAccounts, corsHeaders } from '../_store';

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const accountId = url.searchParams.get('id');

  const accounts = await getAccounts(context.env);
  const acc = accounts.find(a => a.id === accountId);

  if (!acc) {
    return new Response(JSON.stringify({
      hardware_hash: 'edge-cloudflare',
      session: null
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
