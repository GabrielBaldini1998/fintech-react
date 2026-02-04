import { useMenu } from '../MenuContext/MenuContext';
import './BotaoHamburguer.css';

const BotaoHamburguer = () => {
    const { toggleMenu } = useMenu();

    return (
        <button
            className="btn-hamburguer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            type="button"
        >
            <i className="bi bi-list primary-text fs-4"></i>
        </button>
    );
};

export default BotaoHamburguer;

