import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/formatters';

const Dashboard = () => {
  const { session } = useAuth();
  const { usuario, conta } = session!;

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="px-5 py-4">

        {/* Boas-vindas */}
        <div
          className="card border-0 shadow-sm mb-4 text-white"
          style={{ background: 'var(--primary-gradient)' }}
        >
          <div className="card-body p-4">
            <h4 className="fw-bold mb-1">
              Olá, {usuario.nmCompleto.split(' ')[0]}!
            </h4>
            <p className="mb-0 opacity-75">
              Bem-vindo ao seu painel financeiro.
            </p>
          </div>
        </div>

        {/* Dados da conta */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">
              <i className="bi bi-bank me-2 text-primary" />
              Minha Conta
            </h5>
            <div className="row g-3">
              <div className="col-sm-6 col-lg-3">
                <div className="rounded p-3" style={{ background: 'var(--bg-light)' }}>
                  <p className="text-muted small mb-1">Número da Conta</p>
                  <p className="fw-bold mb-0">{conta.numeroDaConta}</p>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="rounded p-3" style={{ background: 'var(--bg-light)' }}>
                  <p className="text-muted small mb-1">Agência</p>
                  <p className="fw-bold mb-0">{conta.agencia}</p>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="rounded p-3" style={{ background: 'var(--bg-light)' }}>
                  <p className="text-muted small mb-1">Tipo</p>
                  <p className="fw-bold mb-0">{conta.tipo}</p>
                </div>
              </div>
              <div
                className="col-sm-6 col-lg-3"
                style={{ background: 'var(--success-light)', borderRadius: 'var(--radius-sm)' }}
              >
                <div className="rounded p-3">
                  <p className="text-muted small mb-1">Saldo</p>
                  <p className="fw-bold mb-0 text-success fs-5">
                    {formatCurrency(conta.saldo)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dados do titular */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">
              <i className="bi bi-person-circle me-2 text-primary" />
              Dados do Titular
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <p className="text-muted small mb-1">Nome completo</p>
                <p className="fw-semibold mb-0">{usuario.nmCompleto}</p>
              </div>
              <div className="col-md-6">
                <p className="text-muted small mb-1">E-mail</p>
                <p className="fw-semibold mb-0">{usuario.dsEmail}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
