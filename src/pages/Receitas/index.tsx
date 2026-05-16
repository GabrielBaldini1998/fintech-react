import { useState, useCallback, useEffect } from 'react';
import { Plus, RefreshCw, TrendingUp, Wallet } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Receita } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  getReceitas, createReceita, updateReceita, deleteReceita,
} from '@/services/receitaService';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import RevenueLineChart from '@/components/charts/RevenueLineChart';

type ReceitaForm = { dtReceita: string; vlRecebido: string; dsReceita: string; };
const EMPTY: ReceitaForm = { dtReceita: '', vlRecebido: '', dsReceita: '' };

const Receitas = () => {
  const { session, updateContaSaldo } = useAuth();
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
    setForm({ dtReceita: r.dtReceita, vlRecebido: String(r.vlRecebido), dsReceita: r.dsReceita });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => { setEditingId(null); setForm(EMPTY); setFormError(null); };

  const handleDelete = async (id: number, ds: string) => {
    if (!window.confirm(`Excluir a receita "${ds}"?`)) return;
    const receita = receitas.find(r => r.idReceita === id);
    try {
      await deleteReceita(id);
      setReceitas(prev => prev.filter(r => r.idReceita !== id));
      // Receita excluída → reverte crédito do saldo
      if (receita) await updateContaSaldo(-receita.vlRecebido);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir receita.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const novoVl = parseFloat(form.vlRecebido);
    const payload = {
      dtReceita: form.dtReceita,
      vlRecebido: novoVl,
      dsReceita: form.dsReceita,
      numeroDaConta,
    };
    try {
      if (editingId !== null) {
        // Calcula diferença: novo - antigo (pode ser positivo ou negativo)
        const antigoVl = receitas.find(r => r.idReceita === editingId)?.vlRecebido ?? 0;
        await updateReceita(editingId, payload);
        await updateContaSaldo(novoVl - antigoVl);
        setEditingId(null);
        setForm(EMPTY);
      } else {
        await createReceita(payload);
        // Nova receita → credita no saldo
        await updateContaSaldo(novoVl);
        setForm(EMPTY);
      }
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar receita.');
    } finally {
      setSubmitting(false);
    }
  };

  /* KPIs */
  const totalRecebido = receitas.reduce((s, r) => s + r.vlRecebido, 0);
  const ultimaReceita = [...receitas].sort((a, b) => (b.dtReceita ?? '').localeCompare(a.dtReceita ?? ''))[0];
  const saldoAtual = session!.conta.saldo;

  return (
    <>
      <PageHeader title="Receitas" subtitle={`Conta ${numeroDaConta}`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <StatCard
            label="Saldo atual da conta" value={formatCurrency(saldoAtual)}
            icon={<Wallet size={18} />} color="green"
          />
          <StatCard
            label="Total recebido (histórico)" value={formatCurrency(totalRecebido)}
            icon={<TrendingUp size={18} />} color="blue"
          />
          <StatCard
            label="Última receita"
            value={ultimaReceita ? formatCurrency(ultimaReceita.vlRecebido) : 'R$ 0,00'}
            icon={<TrendingUp size={18} />} color="purple"
          />
        </div>

        {/* ── Formulário + Gráfico ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          <SectionCard>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
              {editingId !== null ? `Editando Receita #${editingId}` : 'Nova Receita'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Descrição</label>
                  <input className="form-control" type="text" name="dsReceita"
                    placeholder="ex: Salário" value={form.dsReceita} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">Valor Recebido (R$)</label>
                  <input className="form-control" type="number" name="vlRecebido"
                    placeholder="0,00" min="0.01" step="0.01" value={form.vlRecebido} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">Data</label>
                  <input className="form-control" type="date" name="dtReceita"
                    value={form.dtReceita} onChange={handleChange} required />
                </div>
              </div>

              {formError && (
                <div className="alert alert-danger mt-3 py-2 small" role="alert">{formError}</div>
              )}

              {/* Informativo: impacto no saldo */}
              {form.vlRecebido && parseFloat(form.vlRecebido) > 0 && (
                <div style={{
                  marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                  background: 'var(--ft-green-dim)', borderRadius: 'var(--ft-radius-sm)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  fontSize: '0.78rem', color: 'var(--ft-green)',
                }}>
                  {editingId !== null
                    ? `Saldo será ajustado em ${
                        parseFloat(form.vlRecebido) - (receitas.find(r => r.idReceita === editingId)?.vlRecebido ?? 0) >= 0 ? '+' : ''
                      }${formatCurrency(parseFloat(form.vlRecebido) - (receitas.find(r => r.idReceita === editingId)?.vlRecebido ?? 0))}`
                    : `+${formatCurrency(parseFloat(form.vlRecebido))} será creditado no saldo`}
                </div>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary px-4" disabled={submitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm" /> Salvando...</>
                    : editingId !== null ? 'Atualizar' : <><Plus size={16} /> Adicionar Receita</>}
                </button>
                {editingId !== null && (
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </SectionCard>

          <RevenueLineChart receitas={receitas} />
        </div>

        {/* ── Tabela ── */}
        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                Todas as Receitas
              </h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'var(--ft-green-dim)', color: 'var(--ft-green)',
                }}>
                  {receitas.length}
                </span>
              )}
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={load} disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
              <RefreshCw size={13} /> Recarregar
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)' }}>
              <span className="spinner-border spinner-border-sm me-2" />Carregando...
            </div>
          )}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {!loading && !error && receitas.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhuma receita registrada.
            </p>
          )}

          {!loading && !error && receitas.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {[...receitas]
                    .sort((a, b) => (b.dtReceita ?? '').localeCompare(a.dtReceita ?? ''))
                    .map(r => (
                    <tr key={r.idReceita}>
                      <td style={{ color: 'var(--ft-text-dim)', fontSize: '0.78rem' }}>{r.idReceita}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 30, height: 30, borderRadius: 'var(--ft-radius-md)',
                            background: 'var(--ft-green-dim)', fontSize: '0.9rem',
                          }}>💰</span>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.dsReceita}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--ft-green)' }}>
                        +{formatCurrency(r.vlRecebido)}
                      </td>
                      <td style={{ color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                        {formatDate(r.dtReceita)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button className="btn btn-sm btn-outline-primary" title="Editar"
                            onClick={() => handleEdit(r)}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, padding: 0 }}>
                            <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" title="Excluir"
                            onClick={() => handleDelete(r.idReceita, r.dsReceita)}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, padding: 0 }}>
                            <i className="bi bi-trash" style={{ fontSize: '0.75rem' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

      </div>
    </>
  );
};

export default Receitas;
