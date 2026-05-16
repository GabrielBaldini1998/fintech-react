import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Despesa } from '@/types/finance';
import { getDespesas, createDespesa } from '@/services/despesaService';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface FormState {
  tpDespesa: string;
  vlDespesa: string;
  dtDespesa: string;
}

const FORM_INITIAL: FormState = { tpDespesa: '', vlDespesa: '', dtDespesa: '' };

const Despesas = () => {
  const { session } = useAuth();
  const numeroDaConta = session!.conta.numeroDaConta;

  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [form, setForm] = useState<FormState>(FORM_INITIAL);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getDespesas()
      .then(all => setDespesas(all.filter(d => d.numeroDaConta === numeroDaConta)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [numeroDaConta]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await createDespesa({
        tpDespesa: form.tpDespesa,
        vlDespesa: parseFloat(form.vlDespesa),
        dtDespesa: form.dtDespesa,
        numeroDaConta,
      });
      setForm(FORM_INITIAL);
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar despesa.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Despesas" />
      <div className="px-5 py-4">

        {/* Conta info */}
        <p className="text-muted small mb-4">
          <i className="bi bi-bank me-1" />
          Conta: <strong>{numeroDaConta}</strong>
        </p>

        {/* Formulário */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Nova Despesa</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Tipo de Despesa</label>
                  <input
                    className="form-control"
                    type="text"
                    name="tpDespesa"
                    placeholder="ex: Alimentação"
                    value={form.tpDespesa}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Valor (R$)</label>
                  <input
                    className="form-control"
                    type="number"
                    name="vlDespesa"
                    placeholder="0,00"
                    min="0.01"
                    step="0.01"
                    value={form.vlDespesa}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Data</label>
                  <input
                    className="form-control"
                    type="date"
                    name="dtDespesa"
                    value={form.dtDespesa}
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

              <div className="mt-4">
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
                  ) : (
                    'Adicionar Despesa'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabela */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                Despesas{' '}
                {!loading && (
                  <span className="badge bg-danger ms-1">{despesas.length}</span>
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
                <span className="spinner-border spinner-border-sm me-2" />
                Carregando...
              </div>
            )}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {!loading && !error && despesas.length === 0 && (
              <p className="text-muted text-center py-4">Nenhuma despesa registrada.</p>
            )}
            {!loading && !error && despesas.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small fw-semibold text-muted">#</th>
                      <th className="small fw-semibold text-muted">Tipo</th>
                      <th className="small fw-semibold text-muted">Valor</th>
                      <th className="small fw-semibold text-muted">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map(d => (
                      <tr key={d.idDespesa}>
                        <td className="text-muted small">{d.idDespesa}</td>
                        <td className="fw-semibold">{d.tpDespesa}</td>
                        <td className="text-danger fw-semibold">
                          {formatCurrency(d.vlDespesa)}
                        </td>
                        <td className="text-muted small">{formatDate(d.dtDespesa)}</td>
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

export default Despesas;
