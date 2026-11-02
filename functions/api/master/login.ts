import { corsHeaders } from '../_store';

// Default master admin credentials (can be overridden by Cloudflare environment variables)
const DEFAULT_ADMIN_USER = 'ian';
const DEFAULT_ADMIN_PASS = 'ian-master-2026';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const u = (data.username || '').trim();
    const p = (data.password || '').trim();

    // Check against Cloudflare environment variables if set, otherwise use secure defaults
    const envUser = (context.env as any)?.MASTER_ADMIN_USER || DEFAULT_ADMIN_USER;
    const envPass = (context.env as any)?.MASTER_ADMIN_KEY || DEFAULT_ADMIN_PASS;

    if (u === envUser && p === envPass) {
      // Generate a temporary session auth token
      const sessionToken = `master_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      return new Response(JSON.stringify({
        success: true,
        message: 'Master authentication successful.',
        token: sessionToken,
        admin: { username: u }
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Invalid Master Admin Username or Password.'
    }), {
      status: 401,
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
