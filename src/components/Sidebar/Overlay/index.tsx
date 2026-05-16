import { useMenu } from '@/contexts/MenuContext';
import './Overlay.css';

const Overlay = () => {
  const { isMenuOpen, closeMenu } = useMenu();

  if (!isMenuOpen) return null;

  return (
    <div
      className="overlay"
      onClick={closeMenu}
      aria-label="Fechar menu"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
    />
  );
};

export default Overlay;
