import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingDown, AlertCircle, Calendar } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import type { Despesa } from '@/types/finance';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import { formatCurrency } from '@/utils/formatters';

interface Props { despesas: Despesa[] }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E1E2E', border: '1px solid var(--ft-border)',
      borderRadius: 'var(--ft-radius-md)', padding: '0.75rem 1rem',
    }}>
      <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ft-text)' }}>
        {payload[0].payload.name}
      </p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ft-red)' }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

const DespesasMetrics = ({ despesas }: Props) => {
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };

  const totalGasto = despesas.reduce((s, d) => s + d.vlDespesa, 0);

  const totalMes = despesas
    .filter(d => d.dtDespesa && isWithinInterval(parseISO(d.dtDespesa), interval))
    .reduce((s, d) => s + d.vlDespesa, 0);

  const maiorDespesa = despesas.reduce<Despesa | null>(
    (max, d) => (!max || d.vlDespesa > max.vlDespesa) ? d : max,
    null,
  );

  const top5 = useMemo(() => {
    const grouped = despesas.reduce<Record<string, number>>((acc, d) => {
      acc[d.tpDespesa] = (acc[d.tpDespesa] ?? 0) + d.vlDespesa;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [despesas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label="Total gasto (histórico)" value={formatCurrency(totalGasto)}
          icon={<TrendingDown size={18} />} color="red"
        />
        <StatCard
          label="Este mês" value={formatCurrency(totalMes)}
          icon={<Calendar size={18} />} color="yellow"
        />
        <StatCard
          label={maiorDespesa ? `Maior: ${maiorDespesa.tpDespesa}` : 'Maior despesa'}
          value={maiorDespesa ? formatCurrency(maiorDespesa.vlDespesa) : 'R$ 0,00'}
          icon={<AlertCircle size={18} />} color="red"
        />
      </div>

      <SectionCard>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
          Maiores categorias de gasto
        </h3>
        {top5.length === 0 ? (
          <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
            Nenhuma despesa para exibir.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(top5.length * 44, 160)}>
            <BarChart
              layout="vertical" data={top5}
              margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
            >
              <XAxis
                type="number" axisLine={false} tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`}
              />
              <YAxis
                type="category" dataKey="name" width={110}
                axisLine={false} tickLine={false}
                tick={{ fill: '#E2E8F0', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {top5.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? '#EF4444' : `rgba(239,68,68,${Math.max(0.35, 0.75 - i * 0.1)})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </SectionCard>
    </div>
  );
};

export default DespesasMetrics;
