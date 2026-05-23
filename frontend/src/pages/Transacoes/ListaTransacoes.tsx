import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, RefreshCw, ArrowUpCircle, ArrowDownCircle, TrendingUp, Wallet } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Transacao } from '@/types/finance';
import { getTransacoesByUsuario, deleteTransacao } from '@/services/transacaoService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import StatCard from '@/components/ui/StatCard';

const CATEGORIAS_ICONS: Record<string, string> = {
  'Alimentação': '🍽️', 'Moradia': '🏠', 'Transporte': '🚗', 'Saúde': '💊',
  'Educação': '📚', 'Lazer': '🎉', 'Salário': '💼', 'Investimento': '📈',
  'Freelance': '💻', 'Outros': '📌',
};

const ListaTransacoes = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const idUsuario = session!.usuario.idUsuario;

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtro, setFiltro] = useState<'TODOS' | 'RECEITA' | 'DESPESA'>('TODOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getTransacoesByUsuario(idUsuario)
      .then(setTransacoes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [idUsuario]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number, ds: string) => {
    if (!window.confirm(`Excluir "${ds}"?`)) return;
    try {
      await deleteTransacao(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  const totalReceitas = transacoes.filter(t => t.tpTransacao === 'RECEITA').reduce((s, t) => s + t.vlTransacao, 0);
  const totalDespesas = transacoes.filter(t => t.tpTransacao === 'DESPESA').reduce((s, t) => s + t.vlTransacao, 0);
  const saldo = totalReceitas - totalDespesas;

  const exibidas = filtro === 'TODOS'
    ? transacoes
    : transacoes.filter(t => t.tpTransacao === filtro);

  return (
    <>
      <PageHeader title="Transações" subtitle="Receitas e despesas" />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatCard label="Saldo Disponível" value={formatCurrency(saldo)} icon={<Wallet size={18} />} color={saldo >= 0 ? 'green' : 'red'} />
          <StatCard label="Total Receitas" value={formatCurrency(totalReceitas)} icon={<ArrowUpCircle size={18} />} color="green" />
          <StatCard label="Total Despesas" value={formatCurrency(totalDespesas)} icon={<ArrowDownCircle size={18} />} color="red" />
          <StatCard label="Transações" value={String(transacoes.length)} icon={<TrendingUp size={18} />} color="blue" />
        </div>

        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ft-text)' }}>Lançamentos</h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'var(--ft-blue-dim)', color: 'var(--ft-blue)',
                }}>
                  {exibidas.length}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['TODOS', 'RECEITA', 'DESPESA'] as const).map(f => (
                <button key={f} onClick={() => setFiltro(f)} style={{
                  padding: '0.375rem 0.75rem', borderRadius: 'var(--ft-radius-full)',
                  border: filtro === f ? 'none' : '1px solid var(--ft-border)',
                  background: filtro === f
                    ? (f === 'RECEITA' ? 'var(--ft-green)' : f === 'DESPESA' ? 'var(--ft-red)' : 'var(--ft-gradient-primary)')
                    : 'transparent',
                  color: filtro === f ? '#fff' : 'var(--ft-text-muted)',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                }}>
                  {f === 'TODOS' ? 'Todos' : f === 'RECEITA' ? 'Receitas' : 'Despesas'}
                </button>
              ))}
              <button onClick={load} disabled={loading} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.75rem', borderRadius: 'var(--ft-radius-md)',
                border: '1px solid var(--ft-border)', background: 'transparent',
                color: 'var(--ft-text-muted)', cursor: 'pointer', fontSize: '0.78rem',
              }}>
                <RefreshCw size={13} />
              </button>
              <button onClick={() => navigate('/transacoes/nova')} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                border: 'none', background: 'var(--ft-gradient-primary)',
                color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              }}>
                <Plus size={14} /> Nova
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)' }}>
              Carregando...
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
          {!loading && !error && exibidas.length === 0 && (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhuma transação encontrada.
            </p>
          )}

          {!loading && !error && exibidas.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ft-border)' }}>
                    {['#', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Data', 'Ações'].map(h => (
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
                  {[...exibidas]
                    .sort((a, b) => (b.dtTransacao ?? '').localeCompare(a.dtTransacao ?? ''))
                    .map(t => (
                      <tr key={t.idTransacao} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.78rem' }}>{t.idTransacao}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px',
                            borderRadius: 'var(--ft-radius-full)',
                            background: t.tpTransacao === 'RECEITA' ? 'var(--ft-green-dim)' : 'var(--ft-red-dim)',
                            color: t.tpTransacao === 'RECEITA' ? 'var(--ft-green)' : 'var(--ft-red)',
                          }}>
                            {t.tpTransacao === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--ft-text)' }}>{t.dsTransacao}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>
                          {CATEGORIAS_ICONS[t.categoria] ?? '📌'} {t.categoria}
                        </td>
                        <td style={{
                          padding: '0.75rem', fontWeight: 700,
                          color: t.tpTransacao === 'RECEITA' ? 'var(--ft-green)' : 'var(--ft-red)',
                        }}>
                          {t.tpTransacao === 'RECEITA' ? '+' : '-'}{formatCurrency(t.vlTransacao)}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--ft-text-muted)', fontSize: '0.82rem' }}>{formatDate(t.dtTransacao)}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => navigate(`/transacoes/${t.idTransacao}`)} style={{
                              padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                              border: '1px solid var(--ft-border)', background: 'transparent',
                              color: 'var(--ft-text-muted)', cursor: 'pointer',
                            }} title="Editar"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(t.idTransacao, t.dsTransacao)} style={{
                              padding: '0.375rem 0.625rem', borderRadius: 'var(--ft-radius-sm)',
                              border: '1px solid rgba(239,68,68,0.3)', background: 'var(--ft-red-dim)',
                              color: 'var(--ft-red)', cursor: 'pointer',
                            }} title="Excluir"><Trash2 size={14} /></button>
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

export default ListaTransacoes;
