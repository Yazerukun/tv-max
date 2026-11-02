// In-Memory & Cloud Edge KV Store for Cloudflare Pages Functions
// Backed by Cloudflare KV with fallback to in-memory persistence

export interface VendoAccount {
  id: string;
  username: string;
  password: string;
  operator_name: string;
  tier: 'trial' | 'pro_30d';
  duration_hours: number;
  created_at: number;
  activated_at: number | null;
  expires_at: number | null;
  bound_hardware_hash: string | null;
  bound_ip: string | null;
  status: 'UNBOUND_READY' | 'ACTIVE' | 'EXPIRED' | 'FROZEN_LOCKED';
}

const GLOBAL_STORE: { accounts: VendoAccount[] } = {
  accounts: [
    {
      id: 'acc-demo-trial',
      username: 'trial-juan',
      password: '123',
      operator_name: 'Juan Vendo (Demo 24h Trial)',
      tier: 'trial',
      duration_hours: 24,
      created_at: Math.floor(Date.now() / 1000) - 3600,
      activated_at: null,
      expires_at: null,
      bound_hardware_hash: null,
      bound_ip: null,
      status: 'UNBOUND_READY'
    },
    {
      id: 'acc-demo-30d',
      username: 'pro-pedro',
      password: '300',
      operator_name: 'Pedro Vendo (Paid 30 Days)',
      tier: 'pro_30d',
      duration_hours: 720,
      created_at: Math.floor(Date.now() / 1000) - 3600,
      activated_at: null,
      expires_at: null,
      bound_hardware_hash: null,
      bound_ip: null,
      status: 'UNBOUND_READY'
    }
  ]
};

const KV_KEY = 'tvmax_vendo_accounts_v1';

export async function getAccounts(env?: any): Promise<VendoAccount[]> {
  const kv = env?.TVMAX_ACCOUNTS;
  if (kv) {
    try {
      const data = await kv.get(KV_KEY, 'json');
      if (Array.isArray(data) && data.length > 0) {
        GLOBAL_STORE.accounts = data;
        return data;
      } else {
        // Seed initial accounts to KV if empty
        await kv.put(KV_KEY, JSON.stringify(GLOBAL_STORE.accounts));
      }
    } catch (e) {
      console.error('[Store] KV get error:', e);
    }
  }
  return GLOBAL_STORE.accounts;
}

export async function saveAccounts(accounts: VendoAccount[], env?: any): Promise<void> {
  GLOBAL_STORE.accounts = accounts;
  const kv = env?.TVMAX_ACCOUNTS;
  if (kv) {
    try {
      await kv.put(KV_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('[Store] KV save error:', e);
    }
  }
}

export function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-master-key'
  };
}
