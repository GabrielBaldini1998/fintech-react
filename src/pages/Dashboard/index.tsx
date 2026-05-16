import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, DollarSign, BarChart3, User } from 'lucide-react';
import PageHeader from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import RevenueExpenseChart from '@/components/charts/RevenueExpenseChart';
import type { Despesa, Receita, Investimento } from '@/types/finance';
import { getDespesas } from '@/services/despesaService';
import { getReceitas } from '@/services/receitaService';
import { getInvestimentos } from '@/services/investimentoService';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const Dashboard = () => {
  const { session } = useAuth();
  const { usuario, conta } = session!;
  const numeroDaConta = conta.numeroDaConta;

  const [balanceHidden, setBalanceHidden] = useState(false);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);

  const load = useCallback(() => {
    const conta = numeroDaConta;
    getDespesas().then(all => setDespesas(all.filter(d => d.numeroDaConta === conta)));
    getReceitas().then(all => setReceitas(all.filter(r => r.numeroDaConta === conta)));
    getInvestimentos().then(all => setInvestimentos(all.filter(i => i.numeroDaConta === conta)));
  }, [numeroDaConta]);

  useEffect(() => { load(); }, [load]);

  /* KPIs do mês atual */
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };

  const receitasMes = receitas
    .filter(r => r.dtReceita && isWithinInterval(parseISO(r.dtReceita), interval))
    .reduce((s, r) => s + r.vlRecebido, 0);

  const despesasMes = despesas
    .filter(d => d.dtDespesa && isWithinInterval(parseISO(d.dtDespesa), interval))
    .reduce((s, d) => s + d.vlDespesa, 0);

  const saldoLiquido = receitasMes - despesasMes;
  const totalInvestido = investimentos.reduce((s, i) => s + i.vlAplicacao, 0);

  /* Últimas 5 despesas */
  const recentDespesas = [...despesas]
    .sort((a, b) => (b.dtDespesa ?? '').localeCompare(a.dtDespesa ?? ''))
    .slice(0, 5);

  const initials = usuario.nmCompleto.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Olá, ${usuario.nmCompleto.split(' ')[0]}!`} />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Card de Saldo Principal ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1a0b3b 0%, #0f1642 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 'var(--ft-radius-xl)',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Orbs decorativos */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 180, height: 180,
            background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -60, left: '30%', width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Saldo disponível
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <h2 style={{
                    margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#fff',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {balanceHidden ? '•••••••' : formatCurrency(conta.saldo)}
                  </h2>
                  <button
                    onClick={() => setBalanceHidden(p => !p)}
                    style={{
                      background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'rgba(255,255,255,0.7)', transition: 'background var(--ft-transition)',
                    }}
                    title={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
                  >
                    {balanceHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px',
                  borderRadius: 'var(--ft-radius-full)',
                  background: saldoLiquido >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  color: saldoLiquido >= 0 ? '#10B981' : '#EF4444',
                }}>
                  {saldoLiquido >= 0 ? '▲' : '▼'} Este mês
                </span>
              </div>
            </div>

            {/* Dados da conta em linha */}
            <div style={{
              display: 'flex', gap: '1.5rem', marginTop: '1.5rem',
              paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Conta', value: conta.numeroDaConta },
                { label: 'Agência', value: conta.agencia },
                { label: 'Tipo', value: conta.tipo },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatCard
            label="Receitas este mês" value={formatCurrency(receitasMes)}
            icon={<TrendingUp size={18} />} color="green"
          />
          <StatCard
            label="Despesas este mês" value={formatCurrency(despesasMes)}
            icon={<TrendingDown size={18} />} color="red"
          />
          <StatCard
            label="Saldo líquido" value={formatCurrency(saldoLiquido)}
            icon={<DollarSign size={18} />} color={saldoLiquido >= 0 ? 'green' : 'red'}
          />
          <StatCard
            label="Total investido" value={formatCurrency(totalInvestido)}
            icon={<BarChart3 size={18} />} color="blue"
          />
        </div>

        {/* ── Gráfico + Últimas Transações ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
          <RevenueExpenseChart despesas={despesas} receitas={receitas} />

          {/* Últimas 5 despesas */}
          <SectionCard>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
              Últimas Despesas
            </h3>
            {recentDespesas.length === 0 ? (
              <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                Nenhuma despesa registrada.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {recentDespesas.map(d => (
                  <div key={d.idDespesa} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem', borderRadius: 'var(--ft-radius-md)',
                    background: 'rgba(255,255,255,0.025)',
                    transition: 'background var(--ft-transition)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 'var(--ft-radius-md)',
                        background: 'var(--ft-red-dim)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', color: 'var(--ft-red)', fontWeight: 700,
                      }}>
                        {d.tpDespesa.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 600, color: 'var(--ft-text)' }}>
                          {d.tpDespesa}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--ft-text-muted)' }}>
                          {formatDate(d.dtDespesa)}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--ft-red)' }}>
                      -{formatCurrency(d.vlDespesa)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── Dados do Titular ── */}
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <User size={16} style={{ color: 'var(--ft-purple-light)' }} />
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)' }}>
              Dados do Titular
            </h3>
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
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--ft-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conta</p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--ft-text)' }}>{conta.numeroDaConta} · {conta.agencia}</p>
              </div>
            </div>
          </div>
        </SectionCard>

      </div>
    </>
  );
};

export default Dashboard;
