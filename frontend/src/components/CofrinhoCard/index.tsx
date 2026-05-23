import { useNavigate } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import type { Cofrinho } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  cofrinho: Cofrinho;
}

const CofrinhoCard = ({ cofrinho }: Props) => {
  const navigate = useNavigate();
  const pct = cofrinho.vlMeta > 0
    ? Math.min(100, (cofrinho.vlAtual / cofrinho.vlMeta) * 100)
    : 0;

  const size = 64;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);
  const barColor = pct >= 75 ? 'var(--ft-green)' : pct >= 40 ? 'var(--ft-amber)' : 'var(--ft-red)';

  return (
    <div
      onClick={() => navigate(`/cofrinhos/${cofrinho.idCofrinho}`)}
      style={{
        background: 'var(--ft-bg-card)', border: '1px solid var(--ft-border)',
        borderRadius: 'var(--ft-radius-lg)', padding: '1.25rem',
        cursor: 'pointer', transition: 'border-color var(--ft-transition), transform var(--ft-transition)',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ft-amber-dim)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ft-border)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Anel de progresso SVG */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke={barColor} strokeWidth={5}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: cofrinho.dsCor ?? 'var(--ft-amber)',
          }}>
            <PiggyBank size={20} />
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--ft-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {cofrinho.nmCofrinho}
          </p>
          {cofrinho.dsCofrinho && (
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--ft-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {cofrinho.dsCofrinho}
            </p>
          )}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ft-text)' }}>
            {formatCurrency(cofrinho.vlAtual)}
          </span>
          <span style={{ fontSize: '0.75rem', color: barColor, fontWeight: 600 }}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--ft-text-muted)', textAlign: 'right' }}>
          meta: {formatCurrency(cofrinho.vlMeta)}
        </p>
      </div>
    </div>
  );
};

export default CofrinhoCard;
