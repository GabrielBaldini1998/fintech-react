import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, RefreshCw, PiggyBank, Target, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import type { Cofrinho } from '@/types/finance';
import { getCofrinhosByUsuario, deleteCofrinho } from '@/services/cofrinhoService';
import { formatCurrency } from '@/utils/formatters';
import SectionCard from '@/components/ui/SectionCard';
import StatCard from '@/components/ui/StatCard';

const ListaCofrinhos = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const idUsuario = session!.usuario.idUsuario;

  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getCofrinhosByUsuario(idUsuario)
      .then(setCofrinhos)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [idUsuario]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Excluir cofrinho "${nome}"?`)) return;
    try {
      await deleteCofrinho(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  const totalMeta = cofrinhos.reduce((s, c) => s + (c.vlMeta || 0), 0);
  const totalAtual = cofrinhos.reduce((s, c) => s + (c.vlAtual || 0), 0);
  const progresso = totalMeta > 0 ? Math.min(100, (totalAtual / totalMeta) * 100) : 0;

  return (
    <>
      <PageHeader title="Cofrinhos" subtitle="Metas financeiras e poupanças" />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatCard label="Cofrinhos Ativos" value={String(cofrinhos.length)} icon={<PiggyBank size={18} />} color="yellow" />
          <StatCard label="Total Acumulado" value={formatCurrency(totalAtual)} icon={<TrendingUp size={18} />} color="green" />
          <StatCard label="Total em Metas" value={formatCurrency(totalMeta)} icon={<Target size={18} />} color="blue" />
          <StatCard label="Progresso Geral" value={`${progresso.toFixed(1)}%`} icon={<TrendingUp size={18} />} color={progresso >= 75 ? 'green' : progresso >= 40 ? 'yellow' : 'red'} />
        </div>

        <SectionCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ft-text)' }}>Meus Cofrinhos</h3>
              {!loading && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: 'var(--ft-radius-full)', background: 'var(--ft-yellow-dim)', color: 'var(--ft-yellow)',
                }}>
                  {cofrinhos.length}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={load} disabled={loading} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                border: '1px solid var(--ft-border)', background: 'transparent',
                color: 'var(--ft-text-muted)', cursor: 'pointer', fontSize: '0.8rem',
              }}>
                <RefreshCw size={13} /> Recarregar
              </button>
              <button onClick={() => navigate('/cofrinhos/novo')} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: 'var(--ft-radius-md)',
                border: 'none', background: 'var(--ft-gradient-primary)',
                color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              }}>
                <Plus size={14} /> Novo Cofrinho
              </button>
            </div>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)' }}>Carregando...</div>}
          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--ft-radius-md)',
              background: 'var(--ft-red-dim)', color: 'var(--ft-red)',
              border: '1px solid rgba(239,68,68,0.3)', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}
          {!loading && !error && cofrinhos.length === 0 && (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--ft-text-muted)', fontSize: '0.875rem' }}>
              Nenhum cofrinho criado ainda. Crie seu primeiro cofrinho!
            </p>
          )}

          {!loading && !error && cofrinhos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {cofrinhos.map(c => {
                const pct = c.vlMeta > 0 ? Math.min(100, (c.vlAtual / c.vlMeta) * 100) : 0;
                const barColor = pct >= 75 ? 'var(--ft-green)' : pct >= 40 ? 'var(--ft-yellow)' : 'var(--ft-red)';
                return (
                  <div key={c.idCofrinho} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ft-border)',
                    borderRadius: 'var(--ft-radius-lg)', padding: '1.25rem',
                    display: 'flex', flexDirection: 'column', gap: '0.875rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{
                          width: 36, height: 36, borderRadius: 'var(--ft-radius-md)',
                          background: c.dsCor ? `${c.dsCor}22` : 'var(--ft-yellow-dim)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.1rem', color: c.dsCor ?? 'var(--ft-yellow)', flexShrink: 0,
                        }}>
                          <PiggyBank size={18} />
                        </span>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--ft-text)' }}>{c.nmCofrinho}</p>
                          {c.dsCofrinho && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>{c.dsCofrinho}</p>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button onClick={() => navigate(`/cofrinhos/${c.idCofrinho}`)} style={{
                          padding: '0.3rem 0.5rem', borderRadius: 'var(--ft-radius-sm)',
                          border: '1px solid var(--ft-border)', background: 'transparent',
                          color: 'var(--ft-text-muted)', cursor: 'pointer',
                        }} title="Editar"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(c.idCofrinho, c.nmCofrinho)} style={{
                          padding: '0.3rem 0.5rem', borderRadius: 'var(--ft-radius-sm)',
                          border: '1px solid rgba(239,68,68,0.3)', background: 'var(--ft-red-dim)',
                          color: 'var(--ft-red)', cursor: 'pointer',
                        }} title="Excluir"><Trash2 size={13} /></button>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>Acumulado</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: barColor }}>{pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ft-text)' }}>{formatCurrency(c.vlAtual)}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>de {formatCurrency(c.vlMeta)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
};

export default ListaCofrinhos;
