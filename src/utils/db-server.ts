import fs from 'fs';
import path from 'path';

export interface SubscriptionRow {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: 'ativo' | 'cancelado' | 'inativo' | 'inadimplente' | string;
  plano: string;
  valor: number;
  moeda: string;
  data_inicio: string;
  proxima_cobranca: string;
  created_at: string;
  updated_at: string;
}

const DB_FILE = path.join(process.cwd(), 'src', 'data', 'subscriptions_db.json');

// Ensure parent directories exist
const ensureDbDirExists = () => {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const dbServer = {
  // Read all subscriptions
  getSubscriptions(): SubscriptionRow[] {
    try {
      ensureDbDirExists();
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw || '[]');
    } catch (e) {
      console.error('Error reading subscription database:', e);
      return [];
    }
  },

  // Save/overwrite entire array
  saveSubscriptions(rows: SubscriptionRow[]): void {
    try {
      ensureDbDirExists();
      fs.writeFileSync(DB_FILE, JSON.stringify(rows, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing subscription database:', e);
    }
  },

  // Get subscription by user ID (email)
  getSubscriptionByUserId(userId: string): SubscriptionRow | null {
    const list = this.getSubscriptions();
    const cleanId = userId.toLowerCase().trim();
    return list.find(row => row.user_id.toLowerCase().trim() === cleanId) || null;
  },

  // Get subscription by customer ID
  getSubscriptionByCustomerId(customerId: string): SubscriptionRow | null {
    const list = this.getSubscriptions();
    return list.find(row => row.stripe_customer_id === customerId) || null;
  },

  // Get subscription by subscription ID
  getSubscriptionBySubscriptionId(subId: string): SubscriptionRow | null {
    const list = this.getSubscriptions();
    return list.find(row => row.stripe_subscription_id === subId) || null;
  },

  // Create or Update subscription row
  upsertSubscription(row: Partial<SubscriptionRow> & { user_id: string }): SubscriptionRow {
    const list = this.getSubscriptions();
    const cleanUserId = row.user_id.toLowerCase().trim();
    const index = list.findIndex(r => r.user_id.toLowerCase().trim() === cleanUserId);

    const nowStr = new Date().toISOString();

    let finalRow: SubscriptionRow;

    if (index >= 0) {
      // Update
      finalRow = {
        ...list[index],
        ...row,
        updated_at: nowStr,
      } as SubscriptionRow;
      list[index] = finalRow;
    } else {
      // Create
      finalRow = {
        user_id: cleanUserId,
        stripe_customer_id: row.stripe_customer_id || '',
        stripe_subscription_id: row.stripe_subscription_id || '',
        status: row.status || 'inativo',
        plano: row.plano || 'Projeto Alpha Premium Mensal',
        valor: row.valor !== undefined ? row.valor : 17.90,
        moeda: row.moeda || 'BRL',
        data_inicio: row.data_inicio || nowStr,
        proxima_cobranca: row.proxima_cobranca || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: row.created_at || nowStr,
        updated_at: nowStr,
      };
      list.push(finalRow);
    }

    this.saveSubscriptions(list);
    return finalRow;
  },

  // Remove subscription
  deleteSubscription(userId: string): boolean {
    const list = this.getSubscriptions();
    const cleanUserId = userId.toLowerCase().trim();
    const filtered = list.filter(r => r.user_id.toLowerCase().trim() !== cleanUserId);
    if (filtered.length !== list.length) {
      this.saveSubscriptions(filtered);
      return true;
    }
    return false;
  }
};
