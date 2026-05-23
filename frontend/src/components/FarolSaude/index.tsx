interface Indicador {
  label: string;
  descricao: string;
  status: 'verde' | 'amarelo' | 'vermelho';
}

interface Props {
  indicadores: Indicador[];
}

const COR = {
  verde:    { bg: 'var(--ft-green-dim)',  text: 'var(--ft-green)',  dot: '#22C55E', label: 'Saudável' },
  amarelo:  { bg: 'var(--ft-amber-dim)', text: 'var(--ft-amber)',  dot: '#F59E0B', label: 'Atenção'  },
  vermelho: { bg: 'var(--ft-red-dim)',    text: 'var(--ft-red)',    dot: '#EF4444', label: 'Crítico'  },
};

const FarolSaude = ({ indicadores }: Props) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
    {indicadores.map(ind => {
      const c = COR[ind.status];
      return (
        <div key={ind.label} style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          padding: '0.75rem', borderRadius: 'var(--ft-radius-md)',
          background: c.bg, border: `1px solid ${c.dot}33`,
        }}>
          {/* Semáforo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
            {(['verde', 'amarelo', 'vermelho'] as const).map(s => (
              <div key={s} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: ind.status === s ? COR[s].dot : 'rgba(255,255,255,0.1)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: c.text }}>{ind.label}</p>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                borderRadius: 'var(--ft-radius-full)', background: `${c.dot}33`, color: c.text,
              }}>
                {c.label}
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--ft-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ind.descricao}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default FarolSaude;
export type { Indicador };
