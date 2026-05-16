import { useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon } from 'lucide-react';
import HamburgerButton from '@/components/Sidebar/HamburgerButton';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  const { session } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const initials = session?.usuario.nmCompleto
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? '';

  const firstName = session?.usuario.nmCompleto.split(' ')[0] ?? '';

  const iconBtnStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border: '1px solid var(--ft-border)',
    borderRadius: '50%', width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--ft-text-muted)',
    position: 'relative' as const, transition: 'all var(--ft-transition)',
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 1.75rem',
      borderBottom: '1px solid var(--ft-border)',
      background: isDark ? 'rgba(15,15,19,0.85)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
      transition: 'background 250ms ease, border-color 250ms ease',
    }}>
      {/* Esquerda: hambúrguer + título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HamburgerButton />
        <div>
          <h2 style={{
            margin: 0, fontSize: '1.125rem', fontWeight: 700,
            color: 'var(--ft-text)', lineHeight: 1.2,
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-text-muted)', lineHeight: 1 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Direita: toggle tema + notificação + avatar */}
      {session && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>

          {/* Toggle dark/light */}
          <button
            onClick={toggleTheme}
            style={iconBtnStyle}
            title={isDark ? 'Mudar para Light mode' : 'Mudar para Dark mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Sino de notificação (visual) */}
          <button style={iconBtnStyle} title="Notificações">
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 6, right: 7, width: 7, height: 7,
              background: 'var(--ft-purple)', borderRadius: '50%',
              border: `1.5px solid ${isDark ? 'var(--ft-bg-page)' : '#fff'}`,
            }} />
          </button>

          {/* Avatar com iniciais → perfil */}
          <button
            onClick={() => navigate('/perfil')}
            style={{
              background: 'var(--ft-gradient-primary)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: '#fff',
              boxShadow: 'var(--ft-shadow-glow)',
            }}
            title={`${firstName} — ir para Perfil`}
          >
            {initials}
          </button>
        </div>
      )}
    </nav>
  );
};

export default PageHeader;
