import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

export interface ButtonLoadingProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ children, loading = false, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(loading && 'cursor-wait', className)}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

ButtonLoading.displayName = 'ButtonLoading';

export { ButtonLoading };
