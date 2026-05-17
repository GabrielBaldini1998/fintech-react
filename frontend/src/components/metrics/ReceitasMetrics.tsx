import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import type { Receita } from '@/types/finance';
import StatCard from '@/components/ui/StatCard';
import SectionCard from '@/components/ui/SectionCard';
import { formatCurrency } from '@/utils/formatters';

interface Props { receitas: Receita[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E1E2E', border: '1px solid var(--ft-border)',
      borderRadius: 'var(--ft-radius-md)', padding: '0.75rem 1rem',
    }}>
      <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--ft-text-muted)' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#10B981' }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

const ReceitasMetrics = ({ receitas }: Props) => {
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };

  const totalRecebido = receitas.reduce((s, r) => s + r.vlRecebido, 0);

  const totalMes = receitas
    .filter(r => r.dtReceita && isWithinInterval(parseISO(r.dtReceita), interval))
    .reduce((s, r) => s + r.vlRecebido, 0);

  const chartData = useMemo(() => {
    const grouped = receitas.reduce<Record<string, number>>((acc, r) => {
      if (!r.dtReceita) return acc;
      const key = r.dtReceita.substring(0, 7); // "YYYY-MM"
      acc[key] = (acc[key] ?? 0) + r.vlRecebido;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        return { mes: `${month}/${year.substring(2)}`, value };
      });
  }, [receitas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label="Total recebido (histórico)" value={formatCurrency(totalRecebido)}
          icon={<TrendingUp size={18} />} color="green"
        />
        <StatCard
          label="Este mês" value={formatCurrency(totalMes)}
          icon={<Calendar size={18} />} color="blue"
        />
      </div>

      <SectionCard>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
          Evolução das receitas
        </h3>
        {chartData.length < 2 ? (
          <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
            Adicione mais receitas para visualizar a evolução.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="mes" tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5}
                fill="url(#receitaGrad)"
                dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </SectionCard>
    </div>
  );
};

export default ReceitasMetrics;
