import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Despesa } from '@/types/finance';
import SectionCard from '@/components/ui/SectionCard';

interface Props { despesas: Despesa[] }

const COLORS = ['#7C3AED', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{
      background: '#1E1E2E', border: '1px solid var(--ft-border)',
      borderRadius: 'var(--ft-radius-md)', padding: '0.75rem 1rem',
    }}>
      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--ft-text)' }}>{name}</p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ft-text-muted)' }}>
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
    </div>
  );
};

const ExpenseDonutChart = ({ despesas }: Props) => {
  const grouped = despesas.reduce<Record<string, number>>((acc, d) => {
    acc[d.tpDespesa] = (acc[d.tpDespesa] ?? 0) + d.vlDespesa;
    return acc;
  }, {});

  const data = Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  if (data.length === 0) {
    return (
      <SectionCard>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
          Despesas por Categoria
        </h3>
        <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
          Nenhuma despesa para exibir.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
        Despesas por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data} cx="50%" cy="50%"
            innerRadius={55} outerRadius={85}
            paddingAngle={3} dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle" iconSize={8}
            formatter={(value: string) => (
              <span style={{ color: 'var(--ft-text-muted)', fontSize: '0.78rem' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </SectionCard>
  );
};

export default ExpenseDonutChart;
