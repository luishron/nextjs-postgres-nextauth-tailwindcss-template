import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatting';
import { DEFAULT_CURRENCY, type CurrencyCode } from '@/lib/config/currencies';

export interface MoneyDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number | string;
  size?: 'sm' | 'md' | 'lg';
  positive?: boolean;
  currency?: CurrencyCode;
  showSign?: boolean;
}

export function MoneyDisplay({
  amount,
  size = 'md',
  positive,
  currency = DEFAULT_CURRENCY,
  showSign = false,
  className,
  ...props
}: MoneyDisplayProps) {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Use centralized formatCurrency function
  const formatted = formatCurrency(Math.abs(numericAmount), currency);

  const isPositive = positive ?? numericAmount >= 0;
  const sign = numericAmount < 0 ? '-' : showSign && isPositive ? '+' : '';

  return (
    <span
      className={cn(
        'font-mono tabular-nums tracking-tight',
        {
          'text-money-sm': size === 'sm',
          'text-money-md': size === 'md',
          'text-money-lg': size === 'lg',
          'text-success': isPositive && numericAmount !== 0,
          'text-destructive': !isPositive && numericAmount !== 0,
          'text-muted-foreground': numericAmount === 0
        },
        className
      )}
      {...props}
    >
      {sign}{formatted}
    </span>
  );
}
