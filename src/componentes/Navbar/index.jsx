import BotaoHamburguer from '../MenuLateral/BotaoHamburguer';

const Titulo = ({ titulo }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-2 px-4">
            <div className="d-flex align-items-center">
                <BotaoHamburguer />
                <h2 className="fw-bold text-dark mb-0">{titulo}</h2>
            </div>
        </nav>
    )
}

export default Titulo;


