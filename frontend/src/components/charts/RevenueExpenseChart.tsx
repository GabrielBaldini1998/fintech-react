import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import type { Despesa, Receita } from '@/types/finance';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SectionCard from '@/components/ui/SectionCard';

interface Props {
  despesas: Despesa[];
  receitas: Receita[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E1E2E', border: '1px solid var(--ft-border)',
      borderRadius: 'var(--ft-radius-md)', padding: '0.75rem 1rem',
      boxShadow: 'var(--ft-shadow-lg)',
    }}>
      <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--ft-text-muted)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ margin: '2px 0', fontSize: '0.85rem', color: p.fill, fontWeight: 600 }}>
          {p.name}: {p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      ))}
    </div>
  );
};

const RevenueExpenseChart = ({ despesas, receitas }: Props) => {
  const now = new Date();

  const data = Array.from({ length: 6 }, (_, i) => {
    const ref = subMonths(now, 5 - i);
    const start = startOfMonth(ref);
    const end = endOfMonth(ref);
    const interval = { start, end };

    const totalDespesas = despesas
      .filter(d => d.dtDespesa && isWithinInterval(parseISO(d.dtDespesa), interval))
      .reduce((sum, d) => sum + d.vlDespesa, 0);

    const totalReceitas = receitas
      .filter(r => r.dtReceita && isWithinInterval(parseISO(r.dtReceita), interval))
      .reduce((sum, r) => sum + r.vlRecebido, 0);

    return {
      mes: format(ref, 'MMM', { locale: ptBR }),
      Receitas: totalReceitas,
      Despesas: totalDespesas,
    };
  });

  return (
    <SectionCard>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1.25rem' }}>
        Receitas vs Despesas — Últimos 6 meses
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="mes" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: '0.8rem', paddingTop: '0.5rem' }}
            formatter={(value: string) => <span style={{ color: 'var(--ft-text-muted)' }}>{value}</span>}
          />
          <Bar dataKey="Receitas" fill="#10B981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Despesas" fill="#EF4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </SectionCard>
  );
};

export default RevenueExpenseChart;
