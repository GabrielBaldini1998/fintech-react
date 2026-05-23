import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Eye, EyeOff } from 'lucide-react';
import { useAuth, type RegisterData } from '@/contexts/AuthContext';

type Tab = 'login' | 'cadastro';

const emptyReg: RegisterData = {
  nmCompleto: '', dtNascimento: '', nmDocumento: '',
  tpTipo: 'CPF', dsEmail: '', dsSenha: '',
};

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoginLoading(false);
    }
  };

  const [reg, setReg] = useState<RegisterData>(emptyReg);
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReg(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);
    try {
      await register(reg);
      navigate('/dashboard');
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--ft-bg-page)', padding: '1.5rem',
    }}>
      <div style={{
        position: 'fixed', top: '20%', left: '10%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '15%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 500, position: 'relative', zIndex: 1,
        background: 'var(--ft-bg-card)', border: '1px solid var(--ft-border)',
        borderRadius: 'var(--ft-radius-xl)', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2C1F00 0%, #1A1200 100%)',
          padding: '2rem', textAlign: 'center',
          borderBottom: '1px solid rgba(245,158,11,0.2)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, background: 'rgba(245,158,11,0.15)',
            borderRadius: 'var(--ft-radius-md)', marginBottom: '0.875rem',
          }}>
            <Coins size={24} color="#F59E0B" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>
            FinCheck
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Gestão financeira inteligente
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--ft-border)' }}>
          {(['login', 'cadastro'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.875rem', border: 'none', cursor: 'pointer',
              background: tab === t ? 'rgba(245,158,11,0.08)' : 'transparent',
              color: tab === t ? 'var(--ft-amber)' : 'var(--ft-text-muted)',
              fontWeight: tab === t ? 700 : 500, fontSize: '0.875rem',
              borderBottom: tab === t ? '2px solid var(--ft-amber)' : '2px solid transparent',
              transition: 'all var(--ft-transition)',
            }}>
              {t === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.75rem' }}>
          {/* ── Login ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">E-mail</label>
                <input className="form-control" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                  autoComplete="email" required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Senha</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-control" type={showSenha ? 'text' : 'password'}
                    value={senha} onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••" autoComplete="current-password" required
                    style={{ paddingRight: '2.75rem' }} />
                  <button type="button" onClick={() => setShowSenha(p => !p)} style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--ft-text-muted)', padding: 0, display: 'flex',
                  }}>
                    {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {loginError && (
                <div className="alert alert-danger py-2 small" role="alert">{loginError}</div>
              )}
              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loginLoading} style={{ marginTop: '0.5rem', color: '#000' }}>
                {loginLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
                  : 'Entrar'}
              </button>
            </form>
          )}

          {/* ── Cadastro ── */}
          {tab === 'cadastro' && (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nome completo</label>
                  <input className="form-control" type="text" name="nmCompleto"
                    value={reg.nmCompleto} onChange={handleRegChange} placeholder="João Silva" required />
                </div>

                <div>
                  <label className="form-label">Tipo de documento</label>
                  <select className="form-select" name="tpTipo" value={reg.tpTipo} onChange={handleRegChange}>
                    <option value="CPF">CPF (Pessoa Física)</option>
                    <option value="CNPJ">CNPJ (Pessoa Jurídica)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{reg.tpTipo === 'CPF' ? 'CPF' : 'CNPJ'}</label>
                  <input className="form-control" type="text" name="nmDocumento"
                    value={reg.nmDocumento} onChange={handleRegChange}
                    maxLength={reg.tpTipo === 'CPF' ? 11 : 14}
                    inputMode="numeric"
                    placeholder={reg.tpTipo === 'CPF' ? '00000000000' : '00000000000000'}
                    required />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Data de nascimento</label>
                  <input className="form-control" type="date" name="dtNascimento"
                    value={reg.dtNascimento} onChange={handleRegChange} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">E-mail</label>
                  <input className="form-control" type="email" name="dsEmail"
                    value={reg.dsEmail} onChange={handleRegChange}
                    placeholder="seu@email.com" autoComplete="email" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Senha</label>
                  <input className="form-control" type="password" name="dsSenha"
                    value={reg.dsSenha} onChange={handleRegChange}
                    placeholder="Crie uma senha segura" autoComplete="new-password" required />
                </div>
              </div>

              {regError && (
                <div className="alert alert-danger mt-2 py-2 small" role="alert">{regError}</div>
              )}

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mt-2"
                disabled={regLoading} style={{ color: '#000' }}>
                {regLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Criando conta...</>
                  : 'Criar conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
