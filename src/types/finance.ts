export type TransactionStatus = 'Pago' | 'Recebido' | 'Enviado';
export type TrendDirection = 'up' | 'down' | 'stable';
export type BootstrapVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export interface Transaction {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  status: TransactionStatus;
}

export interface SummaryCardData {
  id: number;
  title: string;
  value: number;
  icon: string;
  iconColor: BootstrapVariant;
  subtitle: string;
  trend: TrendDirection;
}

export interface ProgressItem {
  id: number;
  label: string;
  value: number;
  percentage: number;
  variant: BootstrapVariant;
}

export interface DashboardData {
  summaryCards: SummaryCardData[];
  categoryExpenses: ProgressItem[];
  financialGoals: ProgressItem[];
}

export interface InvestmentData {
  summaryCards: SummaryCardData[];
}

export interface Despesa {
  idDespesa: number;
  tpDespesa: string;
  vlDespesa: number;
  dtDespesa: string;
  numeroDaConta: string;
}

export interface Usuario {
  idUsuario: number;
  nmCompleto: string;
  dtNascimento: string;
  nmCpfUsuario: string;
  dsEmail: string;
  dsSenha: string;
}

export interface Conta {
  numeroDaConta: string;
  titular: string;
  agencia: string;
  tipo: string;
  saldo: number;
  idUsuario: number;
}

export interface Receita {
  idReceita: number;
  dtReceita: string;
  vlRecebido: number;
  dsReceita: string;
  numeroDaConta: string;
}

export interface Investimento {
  idInvestimento: number;
  nmAplicacao: string;
  nmBancoCorretora: string;
  vlAplicacao: number;
  dtAplicacao: string;
  dtVencimentoAplicacao: string;
  numeroDaConta: string;
}
