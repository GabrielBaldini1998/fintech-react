import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, TrendingDown, PiggyBank, ArrowLeftRight, User } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import CofrinhoCard from '@/components/CofrinhoCard';
import FarolSaude, { type Indicador } from '@/components/FarolSaude';
import DicasIA from '@/components/DicasIA';
import type { Transacao, Cofrinho } from '@/types/finance';
import { getTransacoesByUsuario } from '@/services/transacaoService';
import { getCofrinhosByUsuario } from '@/services/cofrinhoService';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { usuario } = session!;
  const idUsuario = usuario.idUsuario;

  const [balanceHidden, setBalanceHidden] = useState(false);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([]);

  const load = useCallback(() => {
    getTransacoesByUsuario(idUsuario).then(setTransacoes).catch(() => {});
    getCofrinhosByUsuario(idUsuario).then(setCofrinhos).catch(() => {});
  }, [idUsuario]);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };

  const receitasMes = transacoes
    .filter(t => t.tpTransacao === 'RECEITA' && t.dtTransacao && isWithinInterval(parseISO(t.dtTransacao), interval))
    .reduce((s, t) => s + t.vlTransacao, 0);

  const despesasMes = transacoes
    .filter(t => t.tpTransacao === 'DESPESA' && t.dtTransacao && isWithinInterval(parseISO(t.dtTransacao), interval))
    .reduce((s, t) => s + t.vlTransacao, 0);

  const totalReceitas = transacoes.filter(t => t.tpTransacao === 'RECEITA').reduce((s, t) => s + t.vlTransacao, 0);
  const totalDespesas = transacoes.filter(t => t.tpTransacao === 'DESPESA').reduce((s, t) => s + t.vlTransacao, 0);
  const saldo = totalReceitas - totalDespesas;
  const saldoMes = receitasMes - despesasMes;

  const totalMeta = cofrinhos.reduce((s, c) => s + (c.vlMeta || 0), 0);
  const totalAcumulado = cofrinhos.reduce((s, c) => s + (c.vlAtual || 0), 0);

  /* Faróis de saúde financeira */
  const taxaPoupanca = receitasMes > 0 ? ((receitasMes - despesasMes) / receitasMes) * 100 : 0;
  const indicadores: Indicador[] = [
    {
      label: 'Saldo geral',
      descricao: saldo >= 0 ? `Positivo: ${formatCurrency(saldo)} acumulado` : `Negativo: ${formatCurrency(Math.abs(saldo))} a descoberto`,
      status: saldo > 0 ? 'verde' : saldo === 0 ? 'amarelo' : 'vermelho',
    },
    {
      label: 'Taxa de poupança',
      descricao: `${taxaPoupanca.toFixed(1)}% da receita mensal poupada (meta: ≥ 10%)`,
      status: taxaPoupanca >= 20 ? 'verde' : taxaPoupanca >= 10 ? 'amarelo' : 'vermelho',
    },
    {
      label: 'Cofrinhos',
      descricao: cofrinhos.length === 0
        ? 'Nenhum cofrinho ativo'
        : `${cofrinhos.length} cofrinhos · ${totalMeta > 0 ? ((totalAcumulado / totalMeta) * 100).toFixed(0) : 0}% das metas alcançadas`,
      status: cofrinhos.length >= 2 ? 'verde' : cofrinhos.length === 1 ? 'amarelo' : 'vermelho',
    },
  ];

  /* Últimas 5 transações */
  const recentes = [...transacoes]
    .sort((a, b) => (b.dtTransacao ?? '').localeCompare(a.dtTransacao ?? ''))
    .slice(0, 5);

  const initials = usuario.nmCompleto.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Olá, ${usuario.nmCompleto.split(' ')[0]}!`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Card principal de saldo ── */}
        <div style={{
          background: 'linear-gradient(135deg, #2C1F00 0%, #1A1200 50%, #0D0C09 100%)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 'var(--ft-radius-xl)', padding: '2rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -60, left: '30%', width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Saldo disponível
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                    {balanceHidden ? '•••••••' : formatCurrency(saldo)}
                  </h2>
                  <button onClick={() => setBalanceHidden(p => !p)} style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                  }} title={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}>
                    {balanceHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px',
                borderRadius: 'var(--ft-radius-full)',
                background: saldoMes >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                color: saldoMes >= 0 ? '#22C55E' : '#EF4444',
              }}>
                {saldoMes >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(saldoMes))} este mês
              </span>
            </div>

            <div style={{
              display: 'flex', gap: '1.5rem', marginTop: '1.5rem',
              paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap',
            }}>
              {[
                { label: 'Receitas mês', value: formatCurrency(receitasMes) },
                { label: 'Despesas mês', value: formatCurrency(despesasMes) },
                { label: 'Cofrinhos', value: `${cofrinhos.length} ativo${cofrinhos.length !== 1 ? 's' : ''}` },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <StatCard label="Receitas este mês" value={formatCurrency(receitasMes)} icon={<TrendingUp size={18} />} color="green" />
          <StatCard label="Despesas este mês" value={formatCurrency(despesasMes)} icon={<TrendingDown size={18} />} color="red" />
          <StatCard label="Total em cofrinhos" value={formatCurrency(totalAcumulado)} icon={<PiggyBank size={18} />} color="yellow" />
          <StatCard label="Transações" value={String(transacoes.length)} icon={<ArrowLeftRight size={18} />} color="blue" />
        </div>

        {/* ── Cofrinhos grid ── */}
        {cofrinhos.length > 0 && (
          <SectionCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>Meus Cofrinhos</h3>
              <button onClick={() => navigate('/cofrinhos')} style={{
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--ft-amber)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                Ver todos →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
              {cofrinhos.slice(0, 4).map(c => <CofrinhoCard key={c.idCofrinho} cofrinho={c} />)}
            </div>
          </SectionCard>
        )}

        {/* ── Faróis + Transações recentes ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
          {/* Transações recentes */}
          <SectionCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>Lançamentos Recentes</h3>
              <button onClick={() => navigate('/transacoes')} style={{
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--ft-amber)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                Ver todos →
              </button>
            </div>
            {recentes.length === 0 ? (
              <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                Nenhuma transação registrada.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recentes.map(t => (
                  <div key={t.idTransacao} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem', borderRadius: 'var(--ft-radius-md)',
                    background: 'rgba(255,255,255,0.025)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 'var(--ft-radius-md)',
                        background: t.tpTransacao === 'RECEITA' ? 'var(--ft-green-dim)' : 'var(--ft-red-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700,
                        color: t.tpTransacao === 'RECEITA' ? 'var(--ft-green)' : 'var(--ft-red)',
                      }}>
                        {t.tpTransacao === 'RECEITA' ? '↑' : '↓'}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--ft-text)' }}>{t.dsTransacao}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-text-muted)' }}>{formatDate(t.dtTransacao)} · {t.categoria}</p>
                      </div>
                    </div>
                    <span style={{
                      fontWeight: 700, fontSize: '0.85rem',
                      color: t.tpTransacao === 'RECEITA' ? 'var(--ft-green)' : 'var(--ft-red)',
                    }}>
                      {t.tpTransacao === 'RECEITA' ? '+' : '-'}{formatCurrency(t.vlTransacao)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Faróis + IA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SectionCard>
              <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>
                Saúde Financeira
              </h3>
              <FarolSaude indicadores={indicadores} />
            </SectionCard>
            <DicasIA />
          </div>
        </div>

        {/* ── Dados do Titular ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <User size={16} style={{ color: 'var(--ft-amber)' }} />
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>Dados do Titular</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--ft-gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.125rem', color: '#fff',
              boxShadow: 'var(--ft-shadow-glow)', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome</p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--ft-text)' }}>{usuario.nmCompleto}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-mail</p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--ft-text)' }}>{usuario.dsEmail}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--ft-text)' }}>{usuario.tpTipo ?? 'CPF'} · {usuario.nmDocumento}</p>
              </div>
            </div>
          </div>
        </SectionCard>

      </div>
    </>
  );
};

export default Dashboard;
