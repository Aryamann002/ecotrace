import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Surface container for the "Organic Biophilic" look: rounded, soft-shadowed,
 * gently ringed. Renders a semantic element of your choice via `as`.
 */
interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
}

export function Card({ as: Tag = 'div', className, children, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-primary/10 backdrop-blur-sm sm:p-8',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
