import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Investimento } from '@/types/finance';
import SectionCard from '@/components/ui/SectionCard';

interface Props { investimentos: Investimento[] }

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E1E2E', border: '1px solid var(--ft-border)',
      borderRadius: 'var(--ft-radius-md)', padding: '0.75rem 1rem',
    }}>
      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--ft-text)' }}>{payload[0].name}</p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ft-text-muted)' }}>
        {payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
    </div>
  );
};

const InvestmentDonutChart = ({ investimentos }: Props) => {
  const grouped = investimentos.reduce<Record<string, number>>((acc, inv) => {
    acc[inv.nmBancoCorretora] = (acc[inv.nmBancoCorretora] ?? 0) + inv.vlAplicacao;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <SectionCard>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
          Alocação por Corretora
        </h3>
        <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
          Nenhum investimento para exibir.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ft-text)', marginBottom: '1rem' }}>
        Alocação por Corretora
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data} cx="50%" cy="50%"
            innerRadius={60} outerRadius={90}
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

export default InvestmentDonutChart;
