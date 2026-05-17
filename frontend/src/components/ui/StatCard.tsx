import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  color: 'purple' | 'green' | 'red' | 'blue' | 'yellow';
  trend?: string;
  trendUp?: boolean;
}

const COLOR_MAP = {
  purple: { bg: 'var(--ft-purple-dim)',  icon: 'var(--ft-purple-light)', border: 'rgba(124,58,237,0.2)' },
  green:  { bg: 'var(--ft-green-dim)',   icon: 'var(--ft-green)',         border: 'rgba(16,185,129,0.2)' },
  red:    { bg: 'var(--ft-red-dim)',     icon: 'var(--ft-red)',           border: 'rgba(239,68,68,0.2)'  },
  blue:   { bg: 'var(--ft-blue-dim)',    icon: 'var(--ft-blue)',          border: 'rgba(59,130,246,0.2)' },
  yellow: { bg: 'var(--ft-yellow-dim)', icon: 'var(--ft-yellow)',         border: 'rgba(245,158,11,0.2)' },
};

const StatCard = ({ label, value, icon, color, trend, trendUp }: StatCardProps) => {
  const c = COLOR_MAP[color];
  return (
    <div style={{
      background: 'var(--ft-bg-card)', border: `1px solid ${c.border}`,
      borderRadius: 'var(--ft-radius-lg)', padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      transition: 'box-shadow var(--ft-transition)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--ft-radius-md)',
          background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: c.icon, flexShrink: 0,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px',
            borderRadius: 'var(--ft-radius-full)',
            background: trendUp ? 'var(--ft-green-dim)' : 'var(--ft-red-dim)',
            color: trendUp ? 'var(--ft-green)' : 'var(--ft-red)',
          }}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-text-muted)', fontWeight: 500 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--ft-text)', lineHeight: 1.2, marginTop: 2 }}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
