import { useState, useCallback, useEffect } from 'react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Investimento } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  getInvestimentos,
  createInvestimento,
  updateInvestimento,
  deleteInvestimento,
} from '@/services/investimentoService';

type InvestimentoForm = {
  nmAplicacao: string;
  nmBancoCorretora: string;
  vlAplicacao: string;
  dtAplicacao: string;
  dtVencimentoAplicacao: string;
};

const EMPTY: InvestimentoForm = {
  nmAplicacao: '',
  nmBancoCorretora: '',
  vlAplicacao: '',
  dtAplicacao: '',
  dtVencimentoAplicacao: '',
};

const Investments = () => {
  const { session } = useAuth();
  const numeroDaConta = session!.conta.numeroDaConta;

  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [form, setForm] = useState<InvestimentoForm>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getInvestimentos()
      .then(all => setInvestimentos(all.filter(i => i.numeroDaConta === numeroDaConta)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [numeroDaConta]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = (inv: Investimento) => {
    setEditingId(inv.idInvestimento);
    setForm({
      nmAplicacao: inv.nmAplicacao,
      nmBancoCorretora: inv.nmBancoCorretora,
      vlAplicacao: String(inv.vlAplicacao),
      dtAplicacao: inv.dtAplicacao,
      dtVencimentoAplicacao: inv.dtVencimentoAplicacao,
    });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFormError(null);
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Excluir o investimento "${nome}"?`)) return;
    try {
      await deleteInvestimento(id);
      setInvestimentos(prev => prev.filter(i => i.idInvestimento !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir investimento.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const payload = {
      nmAplicacao: form.nmAplicacao,
      nmBancoCorretora: form.nmBancoCorretora,
      vlAplicacao: parseFloat(form.vlAplicacao),
      dtAplicacao: form.dtAplicacao,
      dtVencimentoAplicacao: form.dtVencimentoAplicacao,
      numeroDaConta,
    };
    try {
      if (editingId !== null) {
        await updateInvestimento(editingId, payload);
        setEditingId(null);
        setForm(EMPTY);
      } else {
        await createInvestimento(payload);
        setForm(EMPTY);
      }
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar investimento.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAplicado = investimentos.reduce((acc, i) => acc + i.vlAplicacao, 0);

  return (
    <>
      <PageHeader title="Investimentos" />
      <div className="px-5 py-4">

        {/* Conta info */}
        <p className="text-muted small mb-4">
          <i className="bi bi-bank me-1" />
          Conta: <strong>{numeroDaConta}</strong>
        </p>

        {/* Formulário */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">
              {editingId !== null
                ? `Editando Investimento #${editingId}`
                : 'Novo Investimento'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Nome da Aplicação</label>
                  <input
                    className="form-control"
                    type="text"
                    name="nmAplicacao"
                    placeholder="ex: Tesouro Direto"
                    value={form.nmAplicacao}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Banco / Corretora</label>
                  <input
                    className="form-control"
                    type="text"
                    name="nmBancoCorretora"
                    placeholder="ex: XP Investimentos"
                    value={form.nmBancoCorretora}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Valor (R$)</label>
                  <input
                    className="form-control"
                    type="number"
                    name="vlAplicacao"
                    placeholder="0,00"
                    min="0.01"
                    step="0.01"
                    value={form.vlAplicacao}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Data de Aplicação</label>
                  <input
                    className="form-control"
                    type="date"
                    name="dtAplicacao"
                    value={form.dtAplicacao}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Data de Vencimento</label>
                  <input
                    className="form-control"
                    type="date"
                    name="dtVencimentoAplicacao"
                    value={form.dtVencimentoAplicacao}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {formError && (
                <div className="alert alert-danger mt-3 py-2 small" role="alert">
                  {formError}
                </div>
              )}

              <div className="mt-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Salvando...
                    </>
                  ) : editingId !== null ? 'Atualizar' : 'Adicionar Investimento'}
                </button>
                {editingId !== null && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Tabela */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                Investimentos{' '}
                {!loading && (
                  <span className="badge bg-primary ms-1">{investimentos.length}</span>
                )}
                {!loading && investimentos.length > 0 && (
                  <span className="ms-2 small text-muted fw-normal">
                    — Total:{' '}
                    <strong className="text-primary">
                      {formatCurrency(totalAplicado)}
                    </strong>
                  </span>
                )}
              </h5>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={load}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1" />Recarregar
              </button>
            </div>

            {loading && (
              <div className="text-center py-5 text-muted">
                <span className="spinner-border spinner-border-sm me-2" />Carregando...
              </div>
            )}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {!loading && !error && investimentos.length === 0 && (
              <p className="text-muted text-center py-4">Nenhum investimento registrado.</p>
            )}
            {!loading && !error && investimentos.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small fw-semibold text-muted">#</th>
                      <th className="small fw-semibold text-muted">Aplicação</th>
                      <th className="small fw-semibold text-muted">Corretora</th>
                      <th className="small fw-semibold text-muted">Valor</th>
                      <th className="small fw-semibold text-muted">Data</th>
                      <th className="small fw-semibold text-muted">Vencimento</th>
                      <th className="small fw-semibold text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investimentos.map(inv => (
                      <tr key={inv.idInvestimento}>
                        <td className="text-muted small">{inv.idInvestimento}</td>
                        <td className="fw-semibold">{inv.nmAplicacao}</td>
                        <td className="text-muted small">{inv.nmBancoCorretora}</td>
                        <td className="text-primary fw-semibold">
                          {formatCurrency(inv.vlAplicacao)}
                        </td>
                        <td className="text-muted small">{formatDate(inv.dtAplicacao)}</td>
                        <td className="text-muted small">
                          {formatDate(inv.dtVencimentoAplicacao)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Editar"
                            onClick={() => handleEdit(inv)}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Excluir"
                            onClick={() => handleDelete(inv.idInvestimento, inv.nmAplicacao)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default Investments;
