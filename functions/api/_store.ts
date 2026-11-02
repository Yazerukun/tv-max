// Cloudflare D1 Edge SQLite Store with In-Memory fallback for TV-MAX Licensing

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

const IN_MEMORY_STORE: { accounts: VendoAccount[] } = {
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

export async function getAccounts(env?: any): Promise<VendoAccount[]> {
  const db = env?.tvmax_db;
  if (db) {
    try {
      const { results } = await db.prepare(
        'SELECT * FROM accounts ORDER BY created_at DESC'
      ).all();
      if (results && results.length > 0) {
        return results as VendoAccount[];
      }
    } catch (e) {
      console.error('[Store] D1 query error:', e);
    }
  }
  return IN_MEMORY_STORE.accounts;
}

export async function getAccountByCredentials(username: string, pin: string, env?: any): Promise<VendoAccount | null> {
  const db = env?.tvmax_db;
  if (db) {
    try {
      const account = await db.prepare(
        'SELECT * FROM accounts WHERE LOWER(username) = LOWER(?) AND password = ? LIMIT 1'
      ).bind(username.trim(), pin.trim()).first();
      if (account) return account as VendoAccount;
    } catch (e) {
      console.error('[Store] D1 query by creds error:', e);
    }
  }
  const match = IN_MEMORY_STORE.accounts.find(
    a => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === pin.trim()
  );
  return match || null;
}

export async function getAccountById(id: string, env?: any): Promise<VendoAccount | null> {
  const db = env?.tvmax_db;
  if (db) {
    try {
      const account = await db.prepare(
        'SELECT * FROM accounts WHERE id = ? LIMIT 1'
      ).bind(id).first();
      if (account) return account as VendoAccount;
    } catch (e) {
      console.error('[Store] D1 query by id error:', e);
    }
  }
  const match = IN_MEMORY_STORE.accounts.find(a => a.id === id);
  return match || null;
}

export async function upsertAccount(acc: VendoAccount, env?: any): Promise<void> {
  const db = env?.tvmax_db;
  if (db) {
    try {
      await db.prepare(`
        INSERT INTO accounts (id, username, password, operator_name, tier, duration_hours, created_at, activated_at, expires_at, bound_hardware_hash, bound_ip, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          username=excluded.username,
          password=excluded.password,
          operator_name=excluded.operator_name,
          tier=excluded.tier,
          duration_hours=excluded.duration_hours,
          activated_at=excluded.activated_at,
          expires_at=excluded.expires_at,
          bound_hardware_hash=excluded.bound_hardware_hash,
          bound_ip=excluded.bound_ip,
          status=excluded.status
      `).bind(
        acc.id, acc.username, acc.password, acc.operator_name, acc.tier, acc.duration_hours,
        acc.created_at, acc.activated_at, acc.expires_at, acc.bound_hardware_hash, acc.bound_ip, acc.status
      ).run();
    } catch (e) {
      console.error('[Store] D1 upsert error:', e);
    }
  }

  // Also maintain in-memory fallback
  const idx = IN_MEMORY_STORE.accounts.findIndex(a => a.id === acc.id);
  if (idx >= 0) {
    IN_MEMORY_STORE.accounts[idx] = acc;
  } else {
    IN_MEMORY_STORE.accounts.unshift(acc);
  }
}

export async function deleteAccountById(id: string, env?: any): Promise<boolean> {
  const db = env?.tvmax_db;
  let changed = false;
  if (db) {
    try {
      const res = await db.prepare('DELETE FROM accounts WHERE id = ?').bind(id).run();
      changed = (res.meta?.changes ?? 0) > 0;
    } catch (e) {
      console.error('[Store] D1 delete error:', e);
    }
  }

  const initialLen = IN_MEMORY_STORE.accounts.length;
  IN_MEMORY_STORE.accounts = IN_MEMORY_STORE.accounts.filter(a => a.id !== id);
  if (IN_MEMORY_STORE.accounts.length < initialLen) {
    changed = true;
  }
  return changed;
}

export function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-master-key'
  };
}
