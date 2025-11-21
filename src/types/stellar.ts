// types/transaction.ts
export interface StellarTransaction {
  id: string;
  hash: string;
  ledger: number;
  createdAt: string;
  sourceAccount: string;
  type: 'send' | 'receive' | 'payment' | 'create_account' | 'other';
  amount: string;
  asset: string;
  fee: string;
  memo: string;
  successful: boolean;
  signatures: string[];
  // Nuevos campos necesarios
  status?: 'success' | 'failed' | 'pending';
  from?: string;
  to?: string;
  timestamp?: string; // Alias para createdAt
}

export interface TransactionOperation {
  id: string;
  type: string;
  amount: string;
  asset: string;
  from: string;
  to: string;
}