import { memo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  hover?: boolean;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '', hover = true, ...props }: CardProps) => (
  <div
    className={`card card-custom border-0 shadow-sm ${className} ${hover ? 'card-hover' : ''}`}
    {...props}
  >
    {children}
  </div>
);

export const CardBody = memo(({ children, className = '' }: CardBodyProps) => (
  <div className={`card-body ${className}`}>{children}</div>
));

CardBody.displayName = 'CardBody';

export default memo(Card);
