import { memo } from 'react';
import type { BootstrapVariant } from '@/types/finance';
import './ProgressBar.css';

interface ProgressBarProps {
  label: string;
  value: string;
  percentage: number;
  variant?: BootstrapVariant;
  showValue?: boolean;
  height?: number;
}

const ProgressBar = ({
  label,
  value,
  percentage,
  variant = 'primary',
  showValue = true,
  height = 10,
}: ProgressBarProps) => (
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
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  </div>
);

export default memo(ProgressBar);
