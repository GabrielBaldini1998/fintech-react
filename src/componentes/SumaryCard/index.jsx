import Card, { CardBody } from '../Card';

const SummaryCard = ({ 
    title, 
    value, 
    icon, 
    iconColor = 'primary', 
    subtitle, 
    trend, 
    trendType = 'success' 
}) => {
    return (
        <Card>
            <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-uppercase text-muted mb-0">{title}</h6>
                    <i className={`bi ${icon} fs-4 text-${iconColor}`}></i>
                </div>
                <h3 className="fw-bold text-dark">{value}</h3>
                {subtitle && (
                    <small className={`text-${trendType} fw-semibold`}>
                        {trend && trend !== 'stable' && (
                            <i className={`bi bi-arrow-${trend === 'up' ? 'up' : 'down'}`}></i>
                        )} {subtitle}
                    </small>
                )}
            </CardBody>
        </Card>
    );
};

export default SummaryCard;

