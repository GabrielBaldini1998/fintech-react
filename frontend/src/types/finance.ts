export interface Usuario {
  idUsuario: number;
  nmCompleto: string;
  dtNascimento: string;
  nmDocumento: string;
  tpTipo: 'CPF' | 'CNPJ';
  dsEmail: string;
  dsSenha: string;
}

export interface Transacao {
  idTransacao: number;
  tpTransacao: 'RECEITA' | 'DESPESA';
  dsTransacao: string;
  vlTransacao: number;
  dtTransacao: string;
  categoria: string;
  idUsuario: number;
  idCofrinho?: number | null;
}

export interface Cofrinho {
  idCofrinho: number;
  nmCofrinho: string;
  dsCofrinho?: string;
  vlMeta: number;
  vlAtual: number;
  dsIcone?: string;
  dsCor?: string;
  idUsuario: number;
}
