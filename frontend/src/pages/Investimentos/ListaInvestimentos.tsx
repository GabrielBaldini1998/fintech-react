import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Investimento, Receita, Despesa } from '@/types/finance';
import { getInvestimentos, deleteInvestimento } from '@/services/investimentoService';
import { getReceitas } from '@/services/receitaService';
import { getDespesas } from '@/services/despesaService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import InvestimentosMetrics from '@/components/metrics/InvestimentosMetrics';
import { useSaldoCalculado } from '@/hooks/useSaldoCalculado';

const ListaInvestimentos = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { conta } = session!;
  const numeroDaConta = conta.numeroDaConta;

  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [receitas, setReceitas]           = useState<Receita[]>([]);
  const [despesas, setDespesas]           = useState<Despesa[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getInvestimentos().then(all => all.filter(i => i.numeroDaConta === numeroDaConta)),
      getReceitas().then(all => all.filter(r => r.numeroDaConta === numeroDaConta)),
      getDespesas().then(all => all.filter(d => d.numeroDaConta === numeroDaConta)),
    ])
      .then(([inv, rec, desp]) => {
        setInvestimentos(inv);
        setReceitas(rec);
        setDespesas(desp);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [numeroDaConta]);

  useEffect(() => { load(); }, [load]);

  const { saldoCalculado } = useSaldoCalculado(conta.saldo, receitas, despesas, investimentos);

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Excluir investimento "${nome}"?`)) return;
    try {
      await deleteInvestimento(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  return (
    <>
      <PageHeader title="Investimentos" subtitle={`Conta ${numeroDaConta}`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <InvestimentosMetrics investimentos={investimentos} saldoDisponivel={saldoCalculado} />

        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                Todos os Investimentos
              </h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'rgba(59,130,246,0.15)', color: 'var(--ft-blue, #3B82F6)',
                }}>
                  {investimentos.length}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={load}
                disabled={loading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                  border: '1px solid var(--ft-border)', background: 'transparent',
                  color: 'var(--ft-text-muted)', cursor: 'pointer', fontSize: '0.8rem',
                }}
              >
                <RefreshCw size={13} /> Recarregar
              </button>
              <button
                onClick={() => navigate('/investimentos/novo')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                  border: 'none', background: 'var(--ft-gradient-primary)',
                  color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                }}
              >
                <Plus size={14} /> Novo Investimento
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)' }}>
              <span style={{ marginRight: '0.5rem' }}>⏳</span> Carregando...
            </div>
          )}
          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--ft-radius-md)',
              background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
              border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}
          {!loading && !error && investimentos.length === 0 && (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhum investimento registrado. Clique em "Novo Investimento" para começar.
            </p>
          )}

          {!loading && !error && investimentos.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ft-border)' }}>
                    {['#', 'Aplicação', 'Banco/Corretora', 'Valor', 'Aplicação', 'Vencimento', 'Ações'].map(h => (
                      <th key={h} style={{
                        padding: '0.625rem 0.75rem', textAlign: 'left',
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
                        textTransform: 'uppercase', color: 'var(--ft-text-muted)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...investimentos]
                    .sort((a, b) => (b.dtAplicacao ?? '').localeCompare(a.dtAplicacao ?? ''))
                    .map(i => (
                      <tr key={i.idInvestimento} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.78rem' }}>
                          {i.idInvestimento}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text)', fontWeight: 500 }}>
                          {i.nmAplicacao}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.85rem' }}>
                          {i.nmBancoCorretora}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--ft-blue, #3B82F6)' }}>
                          {formatCurrency(i.vlAplicacao)}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {formatDate(i.dtAplicacao)}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {formatDate(i.dtVencimentoAplicacao)}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => navigate(`/investimentos/${i.idInvestimento}`)}
                              style={{
                                padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                                border: '1px solid var(--ft-border)', background: 'transparent',
                                color: 'var(--ft-text-muted)', cursor: 'pointer',
                              }}
                              title="Editar"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(i.idInvestimento, i.nmAplicacao)}
                              style={{
                                padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                                border: '1px solid rgba(239,68,68,0.3)', background: 'var(--ft-red-dim)',
                                color: 'var(--ft-red)', cursor: 'pointer',
                              }}
                              title="Excluir"
                            >
                              <Trash2 size={14} />
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

export default ListaInvestimentos;
