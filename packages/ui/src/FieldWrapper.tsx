import {
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
} from 'react';

export interface FieldWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string;
  label: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  children: ReactElement<InputHTMLAttributes<HTMLInputElement>>;
}

export function FieldWrapper({
  id,
  label,
  helper,
  error,
  children,
  className,
  ...props
}: FieldWrapperProps) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasHelper = helper !== undefined && helper !== null && helper !== false;
  const hasError = error !== undefined && error !== null && error !== false;
  const describedBy =
    [children.props['aria-describedby'], hasHelper && helperId, hasError && errorId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div {...props} className={`pk-field ${className ?? ''}`}>
      <label className="pk-field__label" htmlFor={id}>
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': hasError || children.props['aria-invalid'] || undefined,
      })}
      <div className="pk-field__messages">
        {hasHelper && (
          <div className="pk-field__helper" id={helperId}>
            {helper}
          </div>
        )}
        <div className="pk-field__error" aria-live="polite" aria-atomic="true" id={errorId}>
          {hasError ? error : null}
        </div>
      </div>
    </div>
  );
}
