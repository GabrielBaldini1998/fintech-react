import type { ReactNode, CSSProperties } from 'react';

interface SectionCardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const SectionCard = ({ children, style, className }: SectionCardProps) => (
  <div
    className={className}
    style={{
      background: 'var(--ft-bg-card)',
      border: '1px solid var(--ft-border)',
      borderRadius: 'var(--ft-radius-lg)',
      padding: '1.5rem',
      ...style,
    }}
  >
    {children}
  </div>
);

export default SectionCard;
