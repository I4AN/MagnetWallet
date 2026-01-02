export type TransactionType = "expense" | "income";

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
  createdAt?: number;
};

export type TransactionCreateInput = Omit<Transaction, "id">;
