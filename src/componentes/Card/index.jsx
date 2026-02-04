import './Card.css';

const Card = ({ children, className = '', hover = true, ...props }) => {
    const cardClasses = `card card-custom border-0 shadow-sm ${className} ${hover ? 'card-hover' : ''}`;
    
    return (
        <div className={cardClasses} {...props}>
            {children}
        </div>
    );
};

export const CardBody = ({ children, className = '' }) => {
    return (
        <div className={`card-body ${className}`}>
            {children}
        </div>
    );
};

export default Card;
