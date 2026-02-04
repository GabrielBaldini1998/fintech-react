import './MenuLateral.css'
import { Link, useLocation } from 'react-router-dom';
import { useMenu } from './MenuContext/MenuContext';

const MenuLateral = () => {
    const localizacao = useLocation();
    const { closeMenu } = useMenu();
    
    const Menu = [
        {
            nome: 'Dashboard',
            icon: 'bi bi-speedometer2 me-2',
            path: '/',
        },
        {
            nome: 'Investimentos',
            icon: 'bi bi-graph-up-arrow me-2',
            path: '/investimentos',
        },
        {
            nome: 'Transferir',
            icon: 'bi bi-arrow-left-right me-2',
            path: '/transferir',
        },
        {
            nome: 'Perfil',
            icon: 'bi bi-person-circle me-2',
            path: '/perfil',
        },
        {
            nome: 'Sair',
            icon: 'bi bi-box-arrow-left me-2',
            path: '/sair',
        }
    ]

    return (
        <div className="text-white" id="sidebar-wrapper">
            <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-uppercase border-bottom">
                <h1>Fintech</h1>
            </div>
            <div className="list-group list-group-flush my-3">
                {Menu.map((item, index) => {
                    const isActive = localizacao.pathname === item.path;
                    const isSair = item.nome === 'Sair';
                    
                    return (
                        <Link 
                            to={item.path} 
                            key={index} 
                            onClick={closeMenu}
                            className={`
                                list-group-item 
                                list-group-item-action 
                                bg-transparent 
                                second-text
                                ${isActive ? 'active' : ''}
                                ${isSair ? 'text-danger fw-bold mt-5' : 'fw-bold'}
                            `}
                        >
                            <i className={item.icon}></i> {item.nome}
                        </Link>
                    );
                })}
            </div>
        </div>
        
    )
}

export default MenuLateral;