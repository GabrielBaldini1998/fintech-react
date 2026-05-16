import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type RegisterData } from '@/contexts/AuthContext';

type Tab = 'login' | 'cadastro';

type RegForm = Omit<RegisterData, 'saldo'> & { saldoStr: string };

const emptyReg: RegForm = {
  nmCompleto: '',
  dtNascimento: '',
  nmCpfUsuario: '',
  dsEmail: '',
  dsSenha: '',
  numeroDaConta: '',
  agencia: '',
  tipo: 'Corrente',
  saldoStr: '',
};

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');

  // --- Login ---
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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

  // --- Cadastro ---
  const [reg, setReg] = useState<RegForm>(emptyReg);
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const handleRegChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReg(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);
    try {
      const { saldoStr, ...rest } = reg;
      await register({ ...rest, saldo: parseFloat(saldoStr) || 0 });
      navigate('/dashboard');
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{ background: 'var(--bg-light)' }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{ maxWidth: 540 }}
      >
        {/* Header */}
        <div
          className="text-center py-4 px-4"
          style={{
            background: 'var(--primary-gradient)',
            borderRadius: '0.5rem 0.5rem 0 0',
          }}
        >
          <h1
            className="text-white fw-bold mb-0"
            style={{ fontSize: '1.75rem', letterSpacing: 2 }}
          >
            FINTECH
          </h1>
          <p className="text-white-50 small mb-0">Seu banco digital</p>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs border-0 px-4 pt-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold${tab === 'login' ? ' active' : ''}`}
              onClick={() => setTab('login')}
            >
              Entrar
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold${tab === 'cadastro' ? ' active' : ''}`}
              onClick={() => setTab('cadastro')}
            >
              Cadastrar nova conta
            </button>
          </li>
        </ul>

        <div className="px-4 py-4">
          {/* ── Login ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">E-mail</label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Senha</label>
                <input
                  className="form-control"
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              {loginError && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          )}

          {/* ── Cadastro ── */}
          {tab === 'cadastro' && (
            <form onSubmit={handleRegister}>
              <p className="text-muted small fw-semibold mb-3 text-uppercase">
                Dados do usuário
              </p>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold small">Nome completo</label>
                  <input
                    className="form-control"
                    type="text"
                    name="nmCompleto"
                    value={reg.nmCompleto}
                    onChange={handleRegChange}
                    placeholder="João Silva"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">CPF (só números)</label>
                  <input
                    className="form-control"
                    type="text"
                    name="nmCpfUsuario"
                    value={reg.nmCpfUsuario}
                    onChange={handleRegChange}
                    maxLength={11}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="00000000000"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Data de nascimento</label>
                  <input
                    className="form-control"
                    type="date"
                    name="dtNascimento"
                    value={reg.dtNascimento}
                    onChange={handleRegChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small">E-mail</label>
                  <input
                    className="form-control"
                    type="email"
                    name="dsEmail"
                    value={reg.dsEmail}
                    onChange={handleRegChange}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small">Senha</label>
                  <input
                    className="form-control"
                    type="password"
                    name="dsSenha"
                    value={reg.dsSenha}
                    onChange={handleRegChange}
                    placeholder="Crie uma senha segura"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <p className="text-muted small fw-semibold mb-3 text-uppercase">
                Dados da conta bancária
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Número da conta</label>
                  <input
                    className="form-control"
                    type="text"
                    name="numeroDaConta"
                    value={reg.numeroDaConta}
                    onChange={handleRegChange}
                    placeholder="ex: 12345-6"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Agência</label>
                  <input
                    className="form-control"
                    type="text"
                    name="agencia"
                    value={reg.agencia}
                    onChange={handleRegChange}
                    placeholder="ex: 0001"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Tipo de conta</label>
                  <select
                    className="form-select"
                    name="tipo"
                    value={reg.tipo}
                    onChange={handleRegChange}
                  >
                    <option value="Corrente">Corrente</option>
                    <option value="Poupança">Poupança</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Saldo inicial (R$)</label>
                  <input
                    className="form-control"
                    type="number"
                    name="saldoStr"
                    value={reg.saldoStr}
                    onChange={handleRegChange}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {regError && (
                <div className="alert alert-danger mt-3 py-2 small" role="alert">
                  {regError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mt-4"
                disabled={regLoading}
              >
                {regLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
