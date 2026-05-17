import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { Receita } from '@/types/finance';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SectionCard from '@/components/ui/SectionCard';

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
        {payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
    </div>
  );
};

const RevenueLineChart = ({ receitas }: Props) => {
  const now = new Date();

  const data = Array.from({ length: 6 }, (_, i) => {
    const ref = subMonths(now, 5 - i);
    const start = startOfMonth(ref);
    const end = endOfMonth(ref);
    const interval = { start, end };

    const total = receitas
      .filter(r => r.dtReceita && isWithinInterval(parseISO(r.dtReceita), interval))
      .reduce((sum, r) => sum + r.vlRecebido, 0);

    return { mes: format(ref, 'MMM', { locale: ptBR }), Receitas: total };
  });

  return (
    <SectionCard>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
        Evolução de Receitas — Últimos 6 meses
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="mes" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Receitas" stroke="#10B981" strokeWidth={2.5}
            fill="url(#greenGrad)" dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#10B981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </SectionCard>
  );
};

export default RevenueLineChart;
