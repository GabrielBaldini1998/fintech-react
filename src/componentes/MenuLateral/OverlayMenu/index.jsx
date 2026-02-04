import { useMenu } from '../MenuContext/MenuContext';
import './OverlayMenu.css';

const OverlayMenu = () => {
  const { isMenuOpen, closeMenu } = useMenu();

  if (!isMenuOpen) return null;

  return (
    <div 
      className="overlay-menu" 
      onClick={closeMenu}
      aria-label="Fechar menu"
    />
  );
};

export default OverlayMenu;

