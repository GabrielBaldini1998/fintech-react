import { memo } from 'react';
import Card, { CardBody } from '@/components/Card';
import type { BootstrapVariant, TrendDirection } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor?: BootstrapVariant;
  subtitle?: string;
  trend?: TrendDirection;
}

const trendVariant: Record<TrendDirection, BootstrapVariant> = {
  up: 'success',
  down: 'danger',
  stable: 'secondary',
};

const SummaryCard = ({
  title,
  value,
  icon,
  iconColor = 'primary',
  subtitle,
  trend,
}: SummaryCardProps) => {
  const textVariant = trend ? trendVariant[trend] : 'secondary';

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-uppercase text-muted mb-0">{title}</h6>
          <i className={`${icon} fs-4 text-${iconColor}`}></i>
        </div>
        <h3 className="fw-bold text-dark">{formatCurrency(value)}</h3>
        {subtitle && (
          <small className={`text-${textVariant} fw-semibold`}>
            {trend && trend !== 'stable' && (
              <i className={`bi bi-arrow-${trend === 'up' ? 'up' : 'down'}`}></i>
            )}{' '}
            {subtitle}
          </small>
        )}
      </CardBody>
    </Card>
  );
};

export default memo(SummaryCard);
