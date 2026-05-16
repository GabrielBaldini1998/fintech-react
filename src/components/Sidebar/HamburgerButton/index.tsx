import { useMenu } from '@/contexts/MenuContext';
import './HamburgerButton.css';

const HamburgerButton = () => {
  const { toggleMenu } = useMenu();

  return (
    <button
      className="btn btn-link me-3 p-0"
      onClick={toggleMenu}
      aria-label="Abrir menu lateral"
      type="button"
    >
      <i className="bi bi-list fs-4 text-dark"></i>
    </button>
  );
};

export default HamburgerButton;
