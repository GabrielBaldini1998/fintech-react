import { useMenu } from '@/contexts/MenuContext';
import './HamburgerButton.css';

const HamburgerButton = () => {
  const { toggleMenu } = useMenu();
  return (
    <button className="btn-hamburguer" onClick={toggleMenu} aria-label="Abrir menu lateral" type="button">
      <i className="bi bi-list fs-5" />
    </button>
  );
};

export default HamburgerButton;
