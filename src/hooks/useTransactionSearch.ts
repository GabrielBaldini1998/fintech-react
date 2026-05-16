import { useMemo } from 'react';
import type { Transaction } from '@/types/finance';

export const useTransactionSearch = (
  transactions: Transaction[],
  searchTerm: string
): Transaction[] =>
  useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return transactions;

    return transactions.filter(({ descricao, categoria, data, status }) =>
      [descricao, categoria, data, status].some((field) =>
        field.toLowerCase().includes(term)
      )
    );
  }, [transactions, searchTerm]);
