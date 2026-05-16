import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Usuario, Conta } from '@/types/finance';
import { getUsuarios, createUsuario } from '@/services/usuarioService';
import { getContas, createConta, updateConta } from '@/services/contaService';

interface Session {
  usuario: Usuario;
  conta: Conta;
}

export interface RegisterData {
  nmCompleto: string;
  dtNascimento: string;
  nmCpfUsuario: string;
  dsEmail: string;
  dsSenha: string;
  numeroDaConta: string;
  agencia: string;
  tipo: string;
}

interface AuthContextValue {
  session: Session | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  /** Ajusta o saldo em `delta` (positivo = crédito, negativo = débito) e persiste no backend. */
  updateContaSaldo: (delta: number) => Promise<void>;
  /** Re-busca a conta no backend e atualiza a sessão. */
  refreshConta: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'fintech_session';

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(loadSession);

  // Ref para acessar a sessão mais recente dentro de callbacks assíncronos
  const sessionRef = useRef(session);
  const persistSession = useCallback((s: Session) => {
    sessionRef.current = s;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const usuarios = await getUsuarios();
    const usuario = usuarios.find(u => u.dsEmail === email && u.dsSenha === senha);
    if (!usuario) throw new Error('Usuário ou senha inválidos.');

    const contas = await getContas();
    const conta = contas.find(c => c.idUsuario === usuario.idUsuario);
    if (!conta) throw new Error('Nenhuma conta bancária encontrada para este usuário.');

    persistSession({ usuario, conta });
  }, [persistSession]);

  const register = useCallback(async (data: RegisterData) => {
    await createUsuario({
      nmCompleto: data.nmCompleto,
      dtNascimento: data.dtNascimento,
      nmCpfUsuario: data.nmCpfUsuario,
      dsEmail: data.dsEmail,
      dsSenha: data.dsSenha,
    });

    const usuarios = await getUsuarios();
    const usuario = usuarios.find(u => u.dsEmail === data.dsEmail);
    if (!usuario) throw new Error('Erro ao localizar o usuário recém-criado.');

    // Saldo inicial sempre R$ 0,00
    await createConta({
      numeroDaConta: data.numeroDaConta,
      titular: data.nmCompleto,
      agencia: data.agencia,
      tipo: data.tipo,
      saldo: 0,
      idUsuario: usuario.idUsuario,
    });

    const contas = await getContas();
    const conta = contas.find(c => c.numeroDaConta === data.numeroDaConta);
    if (!conta) throw new Error('Erro ao localizar a conta recém-criada.');

    persistSession({ usuario, conta });
  }, [persistSession]);

  const logout = useCallback(() => {
    sessionRef.current = null;
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const updateContaSaldo = useCallback(async (delta: number) => {
    const current = sessionRef.current;
    if (!current) return;

    const novoSaldo = Math.max(0, current.conta.saldo + delta);
    const contaAtualizada: Conta = { ...current.conta, saldo: novoSaldo };
    const novaSession: Session = { ...current, conta: contaAtualizada };

    // Atualiza localmente primeiro (otimista)
    persistSession(novaSession);

    // Persiste no backend (best-effort)
    try {
      await updateConta(contaAtualizada.numeroDaConta, contaAtualizada);
    } catch {
      // Se o backend falhar, o saldo local continua atualizado.
      // O usuário verá o valor correto até o próximo login.
    }
  }, [persistSession]);

  const refreshConta = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) return;
    try {
      const contas = await getContas();
      const conta = contas.find(c => c.numeroDaConta === current.conta.numeroDaConta);
      if (conta) persistSession({ ...current, conta });
    } catch {
      // ignora — mantém dados locais
    }
  }, [persistSession]);

  return (
    <AuthContext.Provider value={{ session, login, register, logout, updateContaSaldo, refreshConta }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
