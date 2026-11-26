import type { HTMLAttributes } from 'react';

export interface PaperSheetProps extends HTMLAttributes<HTMLElement> {}

export function PaperSheet({ children, className, ...props }: PaperSheetProps) {
  return (
    <article {...props} className={`pk-paper-sheet ${className ?? ''}`}>
      {children}
    </article>
  );
}
