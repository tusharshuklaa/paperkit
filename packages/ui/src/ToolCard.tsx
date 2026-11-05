import type { HTMLAttributes, ReactNode } from 'react';
import { Badge } from './Badge';

export type ToolCardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  name: string;
  description: string;
  category: string;
  format: string;
  icon: ReactNode;
} & ({ status: 'live'; href: string } | { status: 'coming-soon'; href?: never });

export function ToolCard({
  name,
  description,
  category,
  format,
  status,
  href,
  icon,
  className,
  ...props
}: ToolCardProps) {
  if ((status === 'live' && !href?.trim()) || (status === 'coming-soon' && href !== undefined)) {
    throw new Error('ToolCard requires a destination only when status is live.');
  }

  return (
    <article {...props} className={`pk-tool-card pk-tool-card--${status} ${className ?? ''}`}>
      <div className="pk-tool-card__top">
        <span className="pk-tool-card__icon" aria-hidden="true">
          {icon}
        </span>
        <Badge variant={status === 'live' ? 'success' : 'neutral'}>
          {status === 'live' ? 'Live' : 'Coming Soon'}
        </Badge>
      </div>
      <div className="pk-tool-card__category">{category}</div>
      <h3 className="pk-tool-card__name">
        {status === 'live' ? (
          <a href={href} className="pk-tool-card__link">
            {name}
          </a>
        ) : (
          name
        )}
      </h3>
      <p className="pk-tool-card__description">{description}</p>
      <div className="pk-tool-card__meta">
        <span>FORMAT: {format}</span>
        {status === 'live' && <a href={href}>Open generator →</a>}
      </div>
    </article>
  );
}
