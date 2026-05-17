import { useMemo } from 'react';
import type { Receita, Despesa, Investimento } from '@/types/finance';

export interface SaldoCalculado {
  saldoCalculado: number;
  totalReceitas: number;
  totalDespesas: number;
  totalInvestido: number;
}

export function useSaldoCalculado(
  receitas: Receita[],
  despesas: Despesa[],
  investimentos: Investimento[],
): SaldoCalculado {
  return useMemo(() => {
    const totalReceitas   = receitas.reduce((s, r) => s + r.vlRecebido, 0);
    const totalDespesas   = despesas.reduce((s, d) => s + d.vlDespesa, 0);
    const totalInvestido  = investimentos.reduce((s, i) => s + i.vlAplicacao, 0);
    const saldoCalculado  = totalReceitas - totalDespesas - totalInvestido;
    return { saldoCalculado, totalReceitas, totalDespesas, totalInvestido };
  }, [receitas, despesas, investimentos]);
}
