import { getAccounts, corsHeaders } from '../_store';

export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ accounts: getAccounts() }), {
    status: 200,
    headers: corsHeaders()
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders() });
};
