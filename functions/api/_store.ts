// In-Memory Cloud Edge Store for Cloudflare Pages Functions
// Backed by Cloudflare KV or in-memory persistence with pre-seeded demo accounts

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

export function getAccounts(): VendoAccount[] {
  return GLOBAL_STORE.accounts;
}

export function saveAccounts(accounts: VendoAccount[]) {
  GLOBAL_STORE.accounts = accounts;
}

export function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
