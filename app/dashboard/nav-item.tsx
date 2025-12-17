'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 relative group',
            'md:h-9 md:w-9',
            isActive
              ? 'bg-primary text-primary-foreground shadow-md scale-110'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105'
          )}
        >
          {/* Active indicator - vertical bar */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />
          )}
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-card text-card-foreground border">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
