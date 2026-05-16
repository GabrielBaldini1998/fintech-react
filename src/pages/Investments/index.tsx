import { useState, useCallback, useEffect } from 'react';
import { Plus, RefreshCw, Layers, CalendarClock, BarChart3, Wallet } from 'lucide-react';
import { differenceInDays, parseISO, isAfter } from 'date-fns';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Investimento } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  getInvestimentos, createInvestimento, updateInvestimento, deleteInvestimento,
} from '@/services/investimentoService';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import InvestmentDonutChart from '@/components/charts/InvestmentDonutChart';
import MaturityTimeline from '@/components/investments/MaturityTimeline';
import RenderingSimulator from '@/components/investments/RenderingSimulator';

type InvestimentoForm = {
  nmAplicacao: string; nmBancoCorretora: string; vlAplicacao: string;
  dtAplicacao: string; dtVencimentoAplicacao: string;
};

const EMPTY: InvestimentoForm = {
  nmAplicacao: '', nmBancoCorretora: '', vlAplicacao: '',
  dtAplicacao: '', dtVencimentoAplicacao: '',
};

function getStatusBadge(dtVencimento: string) {
  const hoje = new Date();
  const venc = parseISO(dtVencimento);
  const dias = differenceInDays(venc, hoje);
  if (!isAfter(venc, hoje)) return { label: 'Vencido',         color: '#EF4444', bg: 'var(--ft-red-dim)'    };
  if (dias <= 30)           return { label: 'Vence em breve',  color: '#F59E0B', bg: 'var(--ft-yellow-dim)' };
  return                           { label: 'Ativo',            color: '#10B981', bg: 'var(--ft-green-dim)'  };
}

const Investments = () => {
  const { session, updateContaSaldo } = useAuth();
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
      nmAplicacao: inv.nmAplicacao, nmBancoCorretora: inv.nmBancoCorretora,
      vlAplicacao: String(inv.vlAplicacao), dtAplicacao: inv.dtAplicacao,
      dtVencimentoAplicacao: inv.dtVencimentoAplicacao,
    });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => { setEditingId(null); setForm(EMPTY); setFormError(null); };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Excluir o investimento "${nome}"? O valor aplicado será estornado ao saldo.`)) return;
    const inv = investimentos.find(i => i.idInvestimento === id);
    try {
      await deleteInvestimento(id);
      setInvestimentos(prev => prev.filter(i => i.idInvestimento !== id));
      // Estorna o valor ao saldo
      if (inv) await updateContaSaldo(+inv.vlAplicacao);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir investimento.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const novoVl = parseFloat(form.vlAplicacao);
    const saldoAtual = session!.conta.saldo;

    if (editingId === null) {
      // Novo investimento: valida saldo suficiente
      if (novoVl > saldoAtual) {
        setFormError(`Saldo insuficiente. Saldo disponível: ${formatCurrency(saldoAtual)}`);
        return;
      }
    } else {
      // Edição: valida a diferença (se o novo valor for maior que o antigo, precisa de saldo)
      const antigoVl = investimentos.find(i => i.idInvestimento === editingId)?.vlAplicacao ?? 0;
      const delta = novoVl - antigoVl;
      if (delta > saldoAtual) {
        setFormError(`Saldo insuficiente para o aumento. Saldo disponível: ${formatCurrency(saldoAtual)}`);
        return;
      }
    }

    setSubmitting(true);
    const payload = {
      nmAplicacao: form.nmAplicacao, nmBancoCorretora: form.nmBancoCorretora,
      vlAplicacao: novoVl, dtAplicacao: form.dtAplicacao,
      dtVencimentoAplicacao: form.dtVencimentoAplicacao, numeroDaConta,
    };
    try {
      if (editingId !== null) {
        const antigoVl = investimentos.find(i => i.idInvestimento === editingId)?.vlAplicacao ?? 0;
        await updateInvestimento(editingId, payload);
        // Diferença: positivo = investiu mais (debita), negativo = reduziu (credita)
        const delta = novoVl - antigoVl;
        await updateContaSaldo(-delta);
        setEditingId(null);
        setForm(EMPTY);
      } else {
        await createInvestimento(payload);
        // Debita o valor do saldo
        await updateContaSaldo(-novoVl);
        setForm(EMPTY);
      }
      load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar investimento.');
    } finally {
      setSubmitting(false);
    }
  };

  /* KPIs */
  const saldoAtual = session!.conta.saldo;
  const totalAplicado = investimentos.reduce((s, i) => s + i.vlAplicacao, 0);
  const maisProxVenc = [...investimentos]
    .filter(i => isAfter(parseISO(i.dtVencimentoAplicacao), new Date()))
    .sort((a, b) => parseISO(a.dtVencimentoAplicacao).getTime() - parseISO(b.dtVencimentoAplicacao).getTime())[0];

  const vlForm = parseFloat(form.vlAplicacao) || 0;
  const antigoVlEditing = editingId !== null
    ? (investimentos.find(i => i.idInvestimento === editingId)?.vlAplicacao ?? 0)
    : 0;
  const deltaForm = editingId !== null ? vlForm - antigoVlEditing : vlForm;
  const saldoInsuficiente = deltaForm > saldoAtual;

  return (
    <>
      <PageHeader title="Investimentos" subtitle={`Conta ${numeroDaConta}`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <StatCard
            label="Saldo disponível" value={formatCurrency(saldoAtual)}
            icon={<Wallet size={18} />} color={saldoAtual > 0 ? 'green' : 'red'}
          />
          <StatCard
            label="Total investido" value={formatCurrency(totalAplicado)}
            icon={<BarChart3 size={18} />} color="blue"
          />
          <StatCard
            label="Aplicações ativas" value={String(investimentos.length)}
            icon={<Layers size={18} />} color="purple"
          />
          <StatCard
            label="Próximo vencimento"
            value={maisProxVenc ? formatDate(maisProxVenc.dtVencimentoAplicacao) : '—'}
            icon={<CalendarClock size={18} />} color="yellow"
          />
        </div>

        {/* ── Formulário + Donut Chart ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          <SectionCard>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
              {editingId !== null ? `Editando Investimento #${editingId}` : 'Novo Investimento'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Nome da Aplicação</label>
                  <input className="form-control" type="text" name="nmAplicacao"
                    placeholder="ex: Tesouro Direto" value={form.nmAplicacao} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">Banco / Corretora</label>
                  <input className="form-control" type="text" name="nmBancoCorretora"
                    placeholder="ex: XP Investimentos" value={form.nmBancoCorretora} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">
                    Valor (R$){' '}
                    <span style={{ color: 'var(--ft-text-muted)', fontWeight: 400 }}>
                      — disponível: {formatCurrency(saldoAtual)}
                    </span>
                  </label>
                  <input
                    className="form-control" type="number" name="vlAplicacao"
                    placeholder="0,00" min="0.01" step="0.01"
                    value={form.vlAplicacao} onChange={handleChange} required
                    style={saldoInsuficiente ? { borderColor: 'var(--ft-red)' } : {}}
                  />
                  {saldoInsuficiente && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--ft-red)' }}>
                      {editingId !== null
                        ? `Aumento de ${formatCurrency(deltaForm)} excede o saldo disponível`
                        : 'Valor excede o saldo disponível'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="form-label">Data de Aplicação</label>
                  <input className="form-control" type="date" name="dtAplicacao"
                    value={form.dtAplicacao} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label">Data de Vencimento</label>
                  <input className="form-control" type="date" name="dtVencimentoAplicacao"
                    value={form.dtVencimentoAplicacao} onChange={handleChange} required />
                </div>
              </div>

              {formError && (
                <div className="alert alert-danger mt-3 py-2 small" role="alert">{formError}</div>
              )}

              {/* Informativo: impacto no saldo */}
              {vlForm > 0 && !saldoInsuficiente && (
                <div style={{
                  marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                  background: deltaForm > 0 ? 'var(--ft-blue-dim)' : deltaForm < 0 ? 'var(--ft-green-dim)' : 'transparent',
                  borderRadius: 'var(--ft-radius-sm)',
                  border: `1px solid ${deltaForm > 0 ? 'rgba(59,130,246,0.2)' : deltaForm < 0 ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
                  fontSize: '0.78rem',
                  color: deltaForm > 0 ? 'var(--ft-blue)' : 'var(--ft-green)',
                  display: deltaForm !== 0 ? 'block' : 'none',
                }}>
                  {editingId !== null
                    ? deltaForm > 0
                      ? `-${formatCurrency(deltaForm)} a mais será debitado · Saldo: ${formatCurrency(saldoAtual - deltaForm)}`
                      : `+${formatCurrency(Math.abs(deltaForm))} será estornado · Saldo: ${formatCurrency(saldoAtual + Math.abs(deltaForm))}`
                    : `-${formatCurrency(vlForm)} será debitado · Saldo resultante: ${formatCurrency(saldoAtual - vlForm)}`}
                </div>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary px-4"
                  disabled={submitting || saldoInsuficiente}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm" /> Salvando...</>
                    : editingId !== null ? 'Atualizar'
                      : <><Plus size={16} /> Adicionar Investimento</>}
                </button>
                {editingId !== null && (
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </SectionCard>

          <InvestmentDonutChart investimentos={investimentos} />
        </div>

        {/* ── Simulador + Timeline ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <RenderingSimulator investimentos={investimentos} />
          <MaturityTimeline investimentos={investimentos} />
        </div>

        {/* ── Tabela ── */}
        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                Carteira de Investimentos
              </h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'var(--ft-blue-dim)', color: 'var(--ft-blue)',
                }}>
                  {investimentos.length}
                </span>
              )}
              {!loading && investimentos.length > 0 && (
                <span style={{ fontSize: '0.78rem', color: 'var(--ft-text-muted)' }}>
                  — Total: <strong style={{ color: 'var(--ft-blue)' }}>{formatCurrency(totalAplicado)}</strong>
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
          {!loading && !error && investimentos.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhum investimento registrado.
            </p>
          )}

          {!loading && !error && investimentos.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Aplicação</th>
                    <th>Corretora</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Vencimento</th>
                    <th>Prazo Rest.</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {investimentos.map(inv => {
                    const status = getStatusBadge(inv.dtVencimentoAplicacao);
                    const diasRestantes = differenceInDays(parseISO(inv.dtVencimentoAplicacao), new Date());
                    return (
                      <tr key={inv.idInvestimento}>
                        <td style={{ color: 'var(--ft-text-dim)', fontSize: '0.78rem' }}>{inv.idInvestimento}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.nmAplicacao}</td>
                        <td style={{ color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>{inv.nmBancoCorretora}</td>
                        <td style={{ fontWeight: 700, color: 'var(--ft-blue)' }}>
                          {formatCurrency(inv.vlAplicacao)}
                        </td>
                        <td style={{ color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {formatDate(inv.dtAplicacao)}
                        </td>
                        <td style={{ color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {formatDate(inv.dtVencimentoAplicacao)}
                        </td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600, color: diasRestantes > 0 ? 'var(--ft-text-secondary)' : 'var(--ft-red)' }}>
                          {diasRestantes > 0 ? `${diasRestantes}d` : 'Vencido'}
                        </td>
                        <td>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px',
                            borderRadius: 'var(--ft-radius-full)',
                            background: status.bg, color: status.color,
                          }}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <button className="btn btn-sm btn-outline-primary" title="Editar"
                              onClick={() => handleEdit(inv)}
                              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, padding: 0 }}>
                              <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }} />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" title="Excluir (estorna saldo)"
                              onClick={() => handleDelete(inv.idInvestimento, inv.nmAplicacao)}
                              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, padding: 0 }}>
                              <i className="bi bi-trash" style={{ fontSize: '0.75rem' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

      </div>
    </>
  );
};

export default Investments;
