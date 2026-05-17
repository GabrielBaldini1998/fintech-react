import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MenuContextValue {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

interface MenuProviderProps {
  children: ReactNode;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenu = (): MenuContextValue => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu deve ser usado dentro de MenuProvider');
  return context;
};

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle('toggled', isMenuOpen);
  }, [isMenuOpen]);

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
