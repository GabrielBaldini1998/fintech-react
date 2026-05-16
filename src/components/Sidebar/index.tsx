import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMenu } from '@/contexts/MenuContext';
import { useAuth } from '@/contexts/AuthContext';
import './Sidebar.css';

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: 'bi bi-speedometer2 me-2', path: '/dashboard' },
  { name: 'Despesas', icon: 'bi bi-receipt me-2', path: '/despesas' },
  { name: 'Receitas', icon: 'bi bi-cash-stack me-2', path: '/receitas' },
  { name: 'Investimentos', icon: 'bi bi-graph-up-arrow me-2', path: '/investimentos' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { closeMenu } = useMenu();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  return (
    <div className="text-white" id="sidebar-wrapper">
      <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-uppercase border-bottom">
        <h1>Fintech</h1>
      </div>
      <div className="list-group list-group-flush my-3">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={[
                'list-group-item list-group-item-action bg-transparent second-text fw-bold',
                isActive ? 'active' : '',
              ].join(' ')}
            >
              <i className={item.icon} /> {item.name}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="list-group-item list-group-item-action bg-transparent text-danger fw-bold mt-5 border-0 text-start"
          style={{ cursor: 'pointer' }}
        >
          <i className="bi bi-box-arrow-left me-2" /> Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
