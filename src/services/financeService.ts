import { useQuery } from '@tanstack/react-query';
import {
  dashboardSummaryCards,
  categoryExpenses,
  financialGoals,
  investmentSummaryCards,
} from '@/data/mockData';
import type { DashboardData, InvestmentData, Transaction } from '@/types/finance';
import transacoes from '@/data/transacoes.json';

export const QUERY_KEYS = {
  dashboard: ['dashboard'] as const,
  transactions: ['transactions'] as const,
  investments: ['investments'] as const,
} as const;

const fetchDashboard = async (): Promise<DashboardData> => ({
  summaryCards: dashboardSummaryCards,
  categoryExpenses,
  financialGoals,
});

const fetchTransactions = async (): Promise<Transaction[]> =>
  transacoes as Transaction[];

const fetchInvestments = async (): Promise<InvestmentData> => ({
  summaryCards: investmentSummaryCards,
});

export const useDashboardData = () =>
  useQuery({ queryKey: QUERY_KEYS.dashboard, queryFn: fetchDashboard });

export const useTransactions = () =>
  useQuery({ queryKey: QUERY_KEYS.transactions, queryFn: fetchTransactions });

export const useInvestmentsData = () =>
  useQuery({ queryKey: QUERY_KEYS.investments, queryFn: fetchInvestments });
