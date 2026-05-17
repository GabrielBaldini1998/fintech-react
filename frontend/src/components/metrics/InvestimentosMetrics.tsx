import { useMemo } from 'react';
import { BarChart3, Layers, CalendarClock, Wallet } from 'lucide-react';
import { differenceInDays, parseISO, isAfter } from 'date-fns';
import type { Investimento } from '@/types/finance';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import InvestmentDonutChart from '@/components/charts/InvestmentDonutChart';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface Props {
  investimentos: Investimento[];
  saldoDisponivel?: number;
}

function getStatus(dtVencimento: string): { label: string; color: string; bg: string } {
  const hoje = new Date();
  const venc = parseISO(dtVencimento);
  const dias = differenceInDays(venc, hoje);
  if (!isAfter(venc, hoje)) return { label: 'Vencido',        color: '#EF4444', bg: 'var(--ft-red-dim)'    };
  if (dias <= 30)           return { label: 'Vence em breve', color: '#F59E0B', bg: 'var(--ft-yellow-dim)' };
  return                           { label: 'Ativo',           color: '#10B981', bg: 'var(--ft-green-dim)'  };
}

const InvestimentosMetrics = ({ investimentos, saldoDisponivel }: Props) => {
  const totalInvestido = investimentos.reduce((s, i) => s + i.vlAplicacao, 0);

  const proximoVencimento = useMemo(() =>
    [...investimentos]
      .filter(i => isAfter(parseISO(i.dtVencimentoAplicacao), new Date()))
      .sort((a, b) =>
        parseISO(a.dtVencimentoAplicacao).getTime() - parseISO(b.dtVencimentoAplicacao).getTime()
      )[0],
    [investimentos],
  );

  const vencimentosSorted = useMemo(() =>
    [...investimentos].sort((a, b) =>
      parseISO(a.dtVencimentoAplicacao).getTime() - parseISO(b.dtVencimentoAplicacao).getTime()
    ),
    [investimentos],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label="Total investido" value={formatCurrency(totalInvestido)}
          icon={<BarChart3 size={18} />} color="blue"
        />
        <StatCard
          label="Aplicações registradas" value={String(investimentos.length)}
          icon={<Layers size={18} />} color="purple"
        />
        <StatCard
          label={proximoVencimento ? `Venc.: ${proximoVencimento.nmAplicacao}` : 'Próximo vencimento'}
          value={proximoVencimento ? formatDate(proximoVencimento.dtVencimentoAplicacao) : '—'}
          icon={<CalendarClock size={18} />} color="yellow"
        />
        {saldoDisponivel !== undefined && (
          <StatCard
            label="Disponível para investir" value={formatCurrency(saldoDisponivel)}
            icon={<Wallet size={18} />}
            color={saldoDisponivel > 0 ? 'green' : 'red'}
          />
        )}
      </div>

      {/* Donut chart — reutiliza componente existente */}
      <InvestmentDonutChart investimentos={investimentos} />

      {/* Lista de vencimentos com status */}
      {vencimentosSorted.length > 0 && (
        <SectionCard>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
            Status de Vencimentos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {vencimentosSorted.map(inv => {
              const status = getStatus(inv.dtVencimentoAplicacao);
              return (
                <div key={inv.idInvestimento} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--ft-radius-md)',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--ft-border)',
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--ft-text)' }}>
                      {inv.nmAplicacao}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-text-muted)' }}>
                      Vence em {formatDate(inv.dtVencimentoAplicacao)}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px',
                    borderRadius: 'var(--ft-radius-full)',
                    background: status.bg, color: status.color,
                  }}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default InvestimentosMetrics;
