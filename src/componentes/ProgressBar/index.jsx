import './ProgressBar.css';

const ProgressBar = ({ 
    label, 
    value, 
    percentage, 
    variant = 'primary', 
    showValue = true,
    height = 10 
}) => {
    return (
        <div className="progress-item mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">{label}</span>
                {showValue && <span className="text-muted">{value}</span>}
            </div>
            <div className="progress" style={{ height: `${height}px` }}>
                <div 
                    className={`progress-bar bg-${variant}`} 
                    role="progressbar" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;