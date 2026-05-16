import { useState, useCallback, useEffect } from 'react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Receita } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  getReceitas,
  createReceita,
  updateReceita,
  deleteReceita,
} from '@/services/receitaService';

type ReceitaForm = {
  dtReceita: string;
  vlRecebido: string;
  dsReceita: string;
};

const EMPTY: ReceitaForm = { dtReceita: '', vlRecebido: '', dsReceita: '' };

const Receitas = () => {
  const { session } = useAuth();
  const numeroDaConta = session!.conta.numeroDaConta;

  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [form, setForm] = useState<ReceitaForm>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getReceitas()
      .then(all => setReceitas(all.filter(r => r.numeroDaConta === numeroDaConta)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [numeroDaConta]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = (r: Receita) => {
    setEditingId(r.idReceita);
    setForm({
      dtReceita: r.dtReceita,
      vlRecebido: String(r.vlRecebido),
      dsReceita: r.dsReceita,
    });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFormError(null);
  };

  const handleDelete = async (id: number, ds: string) => {
    if (!window.confirm(`Excluir a receita "${ds}"?`)) return;
    try {
      await deleteReceita(id);
      setReceitas(prev => prev.filter(r => r.idReceita !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir receita.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const payload = {
      dtReceita: form.dtReceita,
      vlRecebido: parseFloat(form.vlRecebido),
      dsReceita: form.dsReceita,
      numeroDaConta,
    };
    try {
      if (editingId !== null) {
        await updateReceita(editingId, payload);
        setEditingId(null);
        setForm(EMPTY);
      } else {
        await createReceita(payload);
        setForm(EMPTY);
      }
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar receita.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Receitas" />
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
              {editingId !== null ? `Editando Receita #${editingId}` : 'Nova Receita'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Descrição</label>
                  <input
                    className="form-control"
                    type="text"
                    name="dsReceita"
                    placeholder="ex: Salário"
                    value={form.dsReceita}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Valor Recebido (R$)</label>
                  <input
                    className="form-control"
                    type="number"
                    name="vlRecebido"
                    placeholder="0,00"
                    min="0.01"
                    step="0.01"
                    value={form.vlRecebido}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Data</label>
                  <input
                    className="form-control"
                    type="date"
                    name="dtReceita"
                    value={form.dtReceita}
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
                  ) : editingId !== null ? 'Atualizar' : 'Adicionar Receita'}
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
                Receitas{' '}
                {!loading && (
                  <span className="badge bg-success ms-1">{receitas.length}</span>
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
            {!loading && !error && receitas.length === 0 && (
              <p className="text-muted text-center py-4">Nenhuma receita registrada.</p>
            )}
            {!loading && !error && receitas.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small fw-semibold text-muted">#</th>
                      <th className="small fw-semibold text-muted">Descrição</th>
                      <th className="small fw-semibold text-muted">Valor</th>
                      <th className="small fw-semibold text-muted">Data</th>
                      <th className="small fw-semibold text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receitas.map(r => (
                      <tr key={r.idReceita}>
                        <td className="text-muted small">{r.idReceita}</td>
                        <td className="fw-semibold">{r.dsReceita}</td>
                        <td className="text-success fw-semibold">
                          {formatCurrency(r.vlRecebido)}
                        </td>
                        <td className="text-muted small">{formatDate(r.dtReceita)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Editar"
                            onClick={() => handleEdit(r)}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Excluir"
                            onClick={() => handleDelete(r.idReceita, r.dsReceita)}
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

export default Receitas;
