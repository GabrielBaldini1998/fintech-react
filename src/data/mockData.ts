import type { SummaryCardData, ProgressItem } from '@/types/finance';

export const dashboardSummaryCards: SummaryCardData[] = [
  {
    id: 1,
    title: 'Saldo Total',
    value: 12500.0,
    icon: 'bi bi-cash-coin',
    iconColor: 'primary',
    subtitle: '5% este mês',
    trend: 'up',
  },
  {
    id: 2,
    title: 'Investido',
    value: 4200.0,
    icon: 'bi bi-graph-up-arrow',
    iconColor: 'success',
    subtitle: 'Renda Fixa e FIIs',
    trend: 'up',
  },
  {
    id: 3,
    title: 'Despesas',
    value: 1850.0,
    icon: 'bi bi-credit-card',
    iconColor: 'danger',
    subtitle: 'Fatura fecha em 5 dias',
    trend: 'down',
  },
];

export const categoryExpenses: ProgressItem[] = [
  { id: 1, label: 'Alimentação', value: 535.0, percentage: 35, variant: 'danger' },
  { id: 2, label: 'Assinaturas', value: 54.8, percentage: 18, variant: 'warning' },
  { id: 3, label: 'Transporte', value: 28.5, percentage: 12, variant: 'info' },
  { id: 4, label: 'Outros', value: 231.1, percentage: 35, variant: 'secondary' },
];

export const financialGoals: ProgressItem[] = [
  { id: 1, label: 'Reserva de Emergência', value: 8000.0, percentage: 53, variant: 'success' },
  { id: 2, label: 'Viagem para Europa', value: 2500.0, percentage: 25, variant: 'primary' },
  { id: 3, label: 'Apartamento', value: 42500.0, percentage: 14, variant: 'warning' },
  { id: 4, label: 'Carro Novo', value: 15000.0, percentage: 30, variant: 'info' },
];

export const investmentSummaryCards: SummaryCardData[] = [
  {
    id: 1,
    title: 'Patrimônio Total',
    value: 42500.0,
    icon: 'bi bi-safe',
    iconColor: 'primary',
    subtitle: '+1.2% este mês',
    trend: 'up',
  },
  {
    id: 2,
    title: 'Renda Fixa',
    value: 30000.0,
    icon: 'bi bi-shield-check',
    iconColor: 'warning',
    subtitle: 'CDI, Tesouro',
    trend: 'stable',
  },
  {
    id: 3,
    title: 'Renda Variável',
    value: 12500.0,
    icon: 'bi bi-graph-up-arrow',
    iconColor: 'info',
    subtitle: '-0.5% hoje',
    trend: 'down',
  },
];
