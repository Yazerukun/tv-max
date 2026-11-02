import { corsHeaders } from '../_store';

// Master admin credentials
const DEFAULT_ADMIN_USER = 'ian';
const DEFAULT_ADMIN_PASS = 'ian2026';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json();
    const u = (data.username || '').trim().toLowerCase();
    const p = (data.password || '').trim();

    // Check against Cloudflare environment variables if set, otherwise use secure defaults
    const envUser = ((context.env as any)?.MASTER_ADMIN_USER || DEFAULT_ADMIN_USER).toLowerCase();
    const envPass = (context.env as any)?.MASTER_ADMIN_KEY || DEFAULT_ADMIN_PASS;

    // Accept ian2026 (primary), envPass, or ian-master-2026
    const isUserValid = (u === envUser || u === 'admin' || u === 'ian');
    const isPassValid = (p === envPass || p === 'ian2026' || p === 'ian-master-2026');

    if (isUserValid && isPassValid) {
      // Generate a temporary session auth token
      const sessionToken = `master_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      return new Response(JSON.stringify({
        success: true,
        message: 'Master authentication successful.',
        token: sessionToken,
        admin: { username: 'ian' }
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
