import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth, type RegisterData } from '@/contexts/AuthContext';

type Tab = 'login' | 'cadastro';
type RegForm = RegisterData;

const emptyReg: RegForm = {
  nmCompleto: '', dtNascimento: '', nmCpfUsuario: '',
  dsEmail: '', dsSenha: '', numeroDaConta: '', agencia: '',
  tipo: 'Corrente',
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

  const [reg, setReg] = useState<RegForm>(emptyReg);
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
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '15%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 520, position: 'relative', zIndex: 1,
        background: 'var(--ft-bg-card)', border: '1px solid var(--ft-border)',
        borderRadius: 'var(--ft-radius-xl)', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3B1F8C 0%, #1a2b6b 100%)',
          padding: '2rem', textAlign: 'center',
          borderBottom: '1px solid rgba(124,58,237,0.3)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, background: 'rgba(255,255,255,0.1)',
            borderRadius: 'var(--ft-radius-md)', marginBottom: '0.875rem',
          }}>
            <Zap size={24} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
            FINTECH
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            Seu banco digital
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--ft-border)' }}>
          {(['login', 'cadastro'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '0.875rem', border: 'none', cursor: 'pointer',
                background: tab === t ? 'rgba(124,58,237,0.1)' : 'transparent',
                color: tab === t ? 'var(--ft-purple-light)' : 'var(--ft-text-muted)',
                fontWeight: tab === t ? 700 : 500, fontSize: '0.875rem',
                borderBottom: tab === t ? '2px solid var(--ft-purple)' : '2px solid transparent',
                transition: 'all var(--ft-transition)',
              }}
            >
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
                  <button type="button" onClick={() => setShowSenha(p => !p)}
                    style={{
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
                disabled={loginLoading} style={{ marginTop: '0.5rem' }}>
                {loginLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
                  : 'Entrar na conta'}
              </button>
            </form>
          )}

          {/* ── Cadastro ── */}
          {tab === 'cadastro' && (
            <form onSubmit={handleRegister}>
              <p style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--ft-text-muted)', marginBottom: '0.75rem',
              }}>
                Dados pessoais
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nome completo</label>
                  <input className="form-control" type="text" name="nmCompleto"
                    value={reg.nmCompleto} onChange={handleRegChange} placeholder="João Silva" required />
                </div>
                <div>
                  <label className="form-label">CPF (só números)</label>
                  <input className="form-control" type="text" name="nmCpfUsuario"
                    value={reg.nmCpfUsuario} onChange={handleRegChange}
                    maxLength={11} pattern="[0-9]*" inputMode="numeric"
                    placeholder="00000000000" required />
                </div>
                <div>
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

              <hr style={{ borderColor: 'var(--ft-border)', margin: '1rem 0' }} />

              <p style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--ft-text-muted)', marginBottom: '0.75rem',
              }}>
                Dados bancários
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Número da conta</label>
                  <input className="form-control" type="text" name="numeroDaConta"
                    value={reg.numeroDaConta} onChange={handleRegChange}
                    placeholder="ex: 12345-6" required />
                </div>
                <div>
                  <label className="form-label">Agência</label>
                  <input className="form-control" type="text" name="agencia"
                    value={reg.agencia} onChange={handleRegChange} placeholder="ex: 0001" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Tipo de conta</label>
                  <select className="form-select" name="tipo" value={reg.tipo} onChange={handleRegChange}>
                    <option value="Corrente">Corrente</option>
                    <option value="Poupança">Poupança</option>
                  </select>
                </div>
              </div>

              {/* Nota informativa sobre saldo inicial */}
              <div style={{
                marginTop: '0.875rem', padding: '0.625rem 0.875rem',
                background: 'var(--ft-blue-dim)', borderRadius: 'var(--ft-radius-sm)',
                border: '1px solid rgba(59,130,246,0.2)',
              }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--ft-blue)' }}>
                  💡 Sua conta será criada com saldo R$ 0,00. Adicione receitas para movimentar seu saldo.
                </p>
              </div>

              {regError && (
                <div className="alert alert-danger mt-3 py-2 small" role="alert">{regError}</div>
              )}

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mt-3"
                disabled={regLoading}>
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
