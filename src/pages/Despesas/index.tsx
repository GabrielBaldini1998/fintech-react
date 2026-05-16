import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, TrendingDown, AlertCircle, Wallet } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Despesa } from '@/types/finance';
import { getDespesas, createDespesa } from '@/services/despesaService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import ExpenseDonutChart from '@/components/charts/ExpenseDonutChart';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface FormState { tpDespesa: string; vlDespesa: string; dtDespesa: string; }
const FORM_INITIAL: FormState = { tpDespesa: '', vlDespesa: '', dtDespesa: '' };

const CATEGORY_ICONS: Record<string, string> = {
  alimentação: '🍽️', alimentacao: '🍽️', mercado: '🛒', transporte: '🚗',
  moradia: '🏠', saúde: '🏥', saude: '🏥', lazer: '🎮', educação: '📚',
  educacao: '📚', vestuário: '👕', vestuario: '👕', outros: '💳',
};

function getCategoryIcon(tipo: string): string {
  const key = tipo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const [k, v] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return v;
  }
  return '💳';
}

const Despesas = () => {
  const { session, updateContaSaldo } = useAuth();
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

    const vlDespesa = parseFloat(form.vlDespesa);
    const saldoAtual = session!.conta.saldo;

    // Valida se há saldo suficiente
    if (vlDespesa > saldoAtual) {
      setFormError(`Saldo insuficiente. Saldo atual: ${formatCurrency(saldoAtual)}`);
      return;
    }

    setSubmitting(true);
    try {
      await createDespesa({
        tpDespesa: form.tpDespesa,
        vlDespesa,
        dtDespesa: form.dtDespesa,
        numeroDaConta,
      });
      // Débita do saldo
      await updateContaSaldo(-vlDespesa);
      setForm(FORM_INITIAL);
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar despesa.');
    } finally {
      setSubmitting(false);
    }
  };

  /* KPIs */
  const saldoAtual = session!.conta.saldo;
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };
  const despesasMes = despesas.filter(d => d.dtDespesa && isWithinInterval(parseISO(d.dtDespesa), interval));
  const totalMes = despesasMes.reduce((s, d) => s + d.vlDespesa, 0);
  const maiorDespesa = despesas.reduce<Despesa | null>((max, d) => (!max || d.vlDespesa > max.vlDespesa) ? d : max, null);

  const vlForm = parseFloat(form.vlDespesa) || 0;
  const saldoInsuficiente = vlForm > 0 && vlForm > saldoAtual;

  return (
    <>
      <PageHeader title="Despesas" subtitle={`Conta ${numeroDaConta}`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <StatCard
            label="Saldo atual da conta" value={formatCurrency(saldoAtual)}
            icon={<Wallet size={18} />} color={saldoAtual > 0 ? 'green' : 'red'}
          />
          <StatCard
            label="Total gasto este mês" value={formatCurrency(totalMes)}
            icon={<TrendingDown size={18} />} color="red"
          />
          <StatCard
            label="Maior despesa"
            value={maiorDespesa ? formatCurrency(maiorDespesa.vlDespesa) : 'R$ 0,00'}
            icon={<AlertCircle size={18} />} color="yellow"
          />
        </div>

        {/* ── Formulário + Gráfico ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          <SectionCard>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
              Nova Despesa
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Tipo de Despesa</label>
                  <input className="form-control" type="text" name="tpDespesa"
                    placeholder="ex: Alimentação" value={form.tpDespesa} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">
                    Valor (R$){' '}
                    <span style={{ color: 'var(--ft-text-muted)', fontWeight: 400 }}>
                      — disponível: {formatCurrency(saldoAtual)}
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number" name="vlDespesa"
                    placeholder="0,00" min="0.01" step="0.01"
                    max={saldoAtual}
                    value={form.vlDespesa} onChange={handleChange} required
                    style={saldoInsuficiente ? { borderColor: 'var(--ft-red)' } : {}}
                  />
                  {saldoInsuficiente && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--ft-red)' }}>
                      Valor excede o saldo disponível
                    </p>
                  )}
                </div>
                <div>
                  <label className="form-label">Data</label>
                  <input className="form-control" type="date" name="dtDespesa"
                    value={form.dtDespesa} onChange={handleChange} required />
                </div>
              </div>

              {formError && (
                <div className="alert alert-danger mt-3 py-2 small" role="alert">{formError}</div>
              )}

              {/* Informativo: impacto no saldo */}
              {vlForm > 0 && !saldoInsuficiente && (
                <div style={{
                  marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                  background: 'var(--ft-red-dim)', borderRadius: 'var(--ft-radius-sm)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  fontSize: '0.78rem', color: 'var(--ft-red)',
                }}>
                  -{formatCurrency(vlForm)} será debitado · Saldo resultante: {formatCurrency(saldoAtual - vlForm)}
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary px-4"
                  disabled={submitting || saldoInsuficiente}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm" /> Salvando...</>
                    : <><Plus size={16} /> Adicionar Despesa</>}
                </button>
              </div>
            </form>
          </SectionCard>

          <ExpenseDonutChart despesas={despesas} />
        </div>

        {/* ── Tabela ── */}
        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                Todas as Despesas
              </h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
                }}>
                  {despesas.length}
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
          {!loading && !error && despesas.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhuma despesa registrada.
            </p>
          )}

          {!loading && !error && despesas.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {[...despesas]
                    .sort((a, b) => (b.dtDespesa ?? '').localeCompare(a.dtDespesa ?? ''))
                    .map(d => (
                    <tr key={d.idDespesa}>
                      <td style={{ color: 'var(--ft-text-dim)', fontSize: '0.78rem' }}>{d.idDespesa}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 32, height: 32, borderRadius: 'var(--ft-radius-md)',
                          background: 'var(--ft-red-dim)', fontSize: '1rem',
                        }}>
                          {getCategoryIcon(d.tpDespesa)}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px',
                          borderRadius: 'var(--ft-radius-full)',
                          background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
                        }}>
                          {d.tpDespesa}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--ft-red)' }}>
                        -{formatCurrency(d.vlDespesa)}
                      </td>
                      <td style={{ color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                        {formatDate(d.dtDespesa)}
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

export default Despesas;
