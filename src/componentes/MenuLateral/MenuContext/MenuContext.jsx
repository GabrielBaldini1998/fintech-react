import { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu deve ser usado dentro de MenuProvider');
    }
    return context;
};

export const MenuProvider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Atualiza a classe do body quando o estado muda
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('toggled');
        } else {
            document.body.classList.remove('toggled');
        }
    }, [isMenuOpen]);

    return (
        <MenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

