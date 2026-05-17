import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Despesa } from '@/types/finance';
import { getDespesas, deleteDespesa } from '@/services/despesaService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import DespesasMetrics from '@/components/metrics/DespesasMetrics';

const ListaDespesas = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const numeroDaConta = session!.conta.numeroDaConta;

  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getDespesas()
      .then(all => setDespesas(all.filter(d => d.numeroDaConta === numeroDaConta)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [numeroDaConta]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number, tipo: string) => {
    if (!window.confirm(`Excluir despesa "${tipo}"?`)) return;
    try {
      await deleteDespesa(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  return (
    <>
      <PageHeader title="Despesas" subtitle={`Conta ${numeroDaConta}`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <DespesasMetrics despesas={despesas} />

        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ft-text)' }}>
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
                onClick={() => navigate('/despesas/novo')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                  border: 'none', background: 'var(--ft-gradient-primary)',
                  color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                }}
              >
                <Plus size={14} /> Nova Despesa
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
          {!loading && !error && despesas.length === 0 && (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhuma despesa registrada. Clique em "Nova Despesa" para começar.
            </p>
          )}

          {!loading && !error && despesas.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ft-border)' }}>
                    {['#', 'Tipo', 'Valor', 'Data', 'Conta', 'Ações'].map(h => (
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
                  {[...despesas]
                    .sort((a, b) => (b.dtDespesa ?? '').localeCompare(a.dtDespesa ?? ''))
                    .map(d => (
                      <tr key={d.idDespesa} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.78rem' }}>
                          {d.idDespesa}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px',
                            borderRadius: 'var(--ft-radius-full)',
                            background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
                          }}>
                            {d.tpDespesa}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--ft-red)' }}>
                          -{formatCurrency(d.vlDespesa)}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {formatDate(d.dtDespesa)}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {d.numeroDaConta}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => navigate(`/despesas/${d.idDespesa}`)}
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
                              onClick={() => handleDelete(d.idDespesa, d.tpDespesa)}
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

export default ListaDespesas;
