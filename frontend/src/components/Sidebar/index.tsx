import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMenu } from '@/contexts/MenuContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank,
  User, LogOut, Coins,
} from 'lucide-react';
import './Sidebar.css';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard',   icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { name: 'Transações',  icon: <ArrowLeftRight size={18} />,  path: '/transacoes' },
  { name: 'Cofrinhos',   icon: <PiggyBank size={18} />,       path: '/cofrinhos' },
  { name: 'Perfil',      icon: <User size={18} />,            path: '/perfil' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { closeMenu } = useMenu();
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  const initials = session?.usuario.nmCompleto
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? '';

  return (
    <div id="sidebar-wrapper">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Coins size={18} /></div>
        <div>
          <span className="sidebar-logo-text">FinCheck</span>
          <span className="sidebar-logo-sub">Gestão Financeira</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Menu</span>
        {MENU_ITEMS.map(item => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`sidebar-item${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer com avatar + logout */}
      <div className="sidebar-footer">
        {session && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem', padding: '0.5rem 0.25rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--ft-gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ft-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.usuario.nmCompleto.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--ft-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.usuario.tpTipo ?? 'CPF'}
              </div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-item danger">
          <span className="sidebar-icon"><LogOut size={18} /></span>
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
