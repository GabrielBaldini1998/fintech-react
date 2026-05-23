import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Usuario } from '@/types/finance';
import { apiRequest, jsonBody } from '@/services/apiClient';
import { createUsuario } from '@/services/usuarioService';

interface Session {
  usuario: Usuario;
}

export interface RegisterData {
  nmCompleto: string;
  dtNascimento: string;
  nmDocumento: string;
  tpTipo: 'CPF' | 'CNPJ';
  dsEmail: string;
  dsSenha: string;
}

interface AuthContextValue {
  session: Session | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUsuario: (u: Usuario) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'fincheck_session';

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

  const persistSession = useCallback((s: Session) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const usuario = await apiRequest<Usuario>(
      'http://localhost:8080/api/auth/login',
      jsonBody('POST', { email, senha })
    );
    persistSession({ usuario });
  }, [persistSession]);

  const register = useCallback(async (data: RegisterData) => {
    const usuario = await createUsuario({
      nmCompleto: data.nmCompleto,
      dtNascimento: data.dtNascimento,
      nmDocumento: data.nmDocumento,
      tpTipo: data.tpTipo,
      dsEmail: data.dsEmail,
      dsSenha: data.dsSenha,
    });
    persistSession({ usuario });
  }, [persistSession]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const updateUsuario = useCallback((u: Usuario) => {
    const current = session;
    if (!current) return;
    persistSession({ ...current, usuario: u });
  }, [session, persistSession]);

  return (
    <AuthContext.Provider value={{ session, login, register, logout, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
