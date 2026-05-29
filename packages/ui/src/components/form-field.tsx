import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn';

// ── Props ───────────────────────────────────────────────────

export interface FormFieldProps {
  /** Label text displayed above the input. */
  label?: string;
  /** Error message displayed below the input. */
  error?: string;
  /** Helper text displayed below the input (when no error). */
  helpText?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** The input component. */
  children: ReactNode;
  /** Additional wrapper className. */
  className?: string;
}

// ── Component ───────────────────────────────────────────────

export function FormField({
  label,
  error,
  helpText,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = useId();

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
