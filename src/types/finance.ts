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
