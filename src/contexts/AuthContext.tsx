import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Usuario, Conta } from '@/types/finance';
import { getUsuarios, createUsuario } from '@/services/usuarioService';
import { getContas, createConta } from '@/services/contaService';

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
  saldo: number;
}

interface AuthContextValue {
  session: Session | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
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

  const saveSession = (s: Session) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  };

  const login = useCallback(async (email: string, senha: string) => {
    const usuarios = await getUsuarios();
    const usuario = usuarios.find(u => u.dsEmail === email && u.dsSenha === senha);
    if (!usuario) throw new Error('Usuário ou senha inválidos.');

    const contas = await getContas();
    const conta = contas.find(c => c.idUsuario === usuario.idUsuario);
    if (!conta) throw new Error('Nenhuma conta bancária encontrada para este usuário.');

    saveSession({ usuario, conta });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await createUsuario({
      nmCompleto: data.nmCompleto,
      dtNascimento: data.dtNascimento,
      nmCpfUsuario: data.nmCpfUsuario,
      dsEmail: data.dsEmail,
      dsSenha: data.dsSenha,
    });

    // POST retorna 201 sem body — busca o usuário recém-criado pelo e-mail
    const usuarios = await getUsuarios();
    const usuario = usuarios.find(u => u.dsEmail === data.dsEmail);
    if (!usuario) throw new Error('Erro ao localizar o usuário recém-criado.');

    await createConta({
      numeroDaConta: data.numeroDaConta,
      titular: data.nmCompleto,
      agencia: data.agencia,
      tipo: data.tipo,
      saldo: data.saldo,
      idUsuario: usuario.idUsuario,
    });

    const contas = await getContas();
    const conta = contas.find(c => c.numeroDaConta === data.numeroDaConta);
    if (!conta) throw new Error('Erro ao localizar a conta recém-criada.');

    saveSession({ usuario, conta });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
