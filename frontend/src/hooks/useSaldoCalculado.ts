import { useMemo } from 'react';
import type { Receita, Despesa, Investimento } from '@/types/finance';

export interface SaldoCalculado {
  saldoCalculado: number;
  totalReceitas: number;
  totalDespesas: number;
  totalInvestido: number;
}

/**
 * Calcula o saldo real da conta somando o saldo base (initial deposit)
 * com todas as movimentações: receitas creditam, despesas e investimentos debitam.
 */
export function useSaldoCalculado(
  saldoBase: number,
  receitas: Receita[],
  despesas: Despesa[],
  investimentos: Investimento[],
): SaldoCalculado {
  return useMemo(() => {
    const totalReceitas   = receitas.reduce((s, r) => s + r.vlRecebido, 0);
    const totalDespesas   = despesas.reduce((s, d) => s + d.vlDespesa, 0);
    const totalInvestido  = investimentos.reduce((s, i) => s + i.vlAplicacao, 0);
    const saldoCalculado  = saldoBase + totalReceitas - totalDespesas - totalInvestido;
    return { saldoCalculado, totalReceitas, totalDespesas, totalInvestido };
  }, [saldoBase, receitas, despesas, investimentos]);
}
