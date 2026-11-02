import { getAccounts, corsHeaders } from '../_store';

export const onRequestGet: PagesFunction = async (context) => {
  const accounts = await getAccounts(context.env);
  return new Response(JSON.stringify({ accounts }), {
    status: 200,
    headers: corsHeaders()
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders() });
};
