import { useNavigate } from 'react-router-dom';
import HamburgerButton from '@/components/Sidebar/HamburgerButton';
import { useAuth } from '@/contexts/AuthContext';

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const firstName = session?.usuario.nmCompleto.split(' ')[0] ?? '';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-2 px-4">
      <div className="d-flex align-items-center flex-grow-1">
        <HamburgerButton />
        <h2 className="fw-bold text-dark mb-0">{title}</h2>
      </div>
      {session && (
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small d-none d-md-inline">
            <i className="bi bi-person-circle me-1" />
            {firstName}
          </span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-1" />
            Sair
          </button>
        </div>
      )}
    </nav>
  );
};

export default PageHeader;
