'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils/formatting';
import type { DailyExpenseFrequency } from '@/lib/db';
import type { CurrencyCode } from '@/lib/config/currencies';
import { useTranslations } from 'next-intl';
import {
  eachDayOfInterval,
  format,
  differenceInDays,
  startOfDay,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';

type ViewMode = 'month' | 'quarter' | 'year';

interface ExpenseHeatmapClientProps {
  data: DailyExpenseFrequency[];
  currency: CurrencyCode;
  initialView?: ViewMode;
}

type DayData = {
  date: string;
  count: number;
  total: number;
  dayOfWeek: number;
  weekNumber: number;
};

export function ExpenseHeatmapClient({
  data,
  currency,
  initialView = 'month',
}: ExpenseHeatmapClientProps) {
  const t = useTranslations('pages.dashboard.heatmap');
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);

  // Convert sparse data to Map for O(1) lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, DailyExpenseFrequency>();
    data.forEach((item) => map.set(item.date, item));
    return map;
  }, [data]);

  // Calculate date range for current view
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();

    switch (viewMode) {
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }, [viewMode]);

  // Generate all days in range (fill gaps)
  const allDays = useMemo(() => {
    return eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    }).map((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayData = dataMap.get(dateKey);

      return {
        date: dateKey,
        count: dayData?.count || 0,
        total: dayData?.total || 0,
        dayOfWeek: date.getDay(), // 0-6 (Sunday-Saturday)
        weekNumber: Math.floor(
          differenceInDays(date, dateRange.startDate) / 7
        ),
      };
    });
  }, [dataMap, dateRange]);

  // Group days by week for grid layout
  const weeks = useMemo(() => {
    const weekMap = new Map<number, DayData[]>();
    allDays.forEach((day) => {
      const existing = weekMap.get(day.weekNumber) || [];
      existing.push(day);
      weekMap.set(day.weekNumber, existing);
    });
    return Array.from(weekMap.values());
  }, [allDays]);

  // Calculate color intensity based on count
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-muted/30 dark:bg-muted/10';
    if (count <= 2) return 'bg-primary/30';
    if (count <= 4) return 'bg-primary/60';
    return 'bg-primary'; // 5+
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = allDays.length;
    const activeDays = allDays.filter((d) => d.count > 0).length;
    const totalExpenses = allDays.reduce((sum, d) => sum + d.count, 0);
    const streak = calculateCurrentStreak(allDays);

    return {
      activeDays,
      totalDays,
      totalExpenses,
      streak,
      consistency: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
    };
  }, [allDays]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              {t('title')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('subtitle', {
                activeDays: stats.activeDays,
                totalDays: stats.totalDays,
                consistency: stats.consistency,
              })}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="min-h-[40px]"
            >
              {t('view.month')}
            </Button>
            <Button
              variant={viewMode === 'quarter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('quarter')}
              className="min-h-[40px]"
            >
              {t('view.quarter')}
            </Button>
            <Button
              variant={viewMode === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('year')}
              className="min-h-[40px]"
            >
              {t('view.year')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          {/* Heatmap grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-1 min-w-full">
              {/* Day labels (L, M, M, J, V, S, D) - only show on larger screens */}
              <div className="hidden sm:flex gap-1 mb-2 ml-8">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 flex items-center justify-center text-[10px] text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Weeks grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <button
                            className={`
                              w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-primary
                              focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none
                              ${getIntensityClass(day.count)}
                            `}
                            aria-label={t('cell.ariaLabel', {
                              date: format(parseISO(day.date), 'PPP', {
                                locale: es,
                              }),
                              count: day.count,
                            })}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-semibold">
                              {format(parseISO(day.date), 'PPP', { locale: es })}
                            </p>
                            <p className="text-muted-foreground">
                              {t('tooltip.expenses', { count: day.count })}
                            </p>
                            {day.total > 0 && (
                              <p className="font-medium text-primary">
                                {formatCurrency(day.total, currency)}
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>{t('legend.less')}</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted/30 dark:bg-muted/10" />
                  <div className="w-3 h-3 rounded-sm bg-primary/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/60" />
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                </div>
                <span>{t('legend.more')}</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate current streak
function calculateCurrentStreak(days: DayData[]): number {
  let streak = 0;
  const sortedDays = [...days].reverse(); // Start from most recent

  for (const day of sortedDays) {
    if (day.count > 0) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}
