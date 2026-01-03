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
  eachWeekOfInterval,
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  getMonth,
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
};

type WeekData = {
  days: (DayData | null)[]; // null for days outside the range
  weekStart: Date;
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
    const days = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    });

    return days.map((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayData = dataMap.get(dateKey);

      return {
        date: dateKey,
        count: dayData?.count || 0,
        total: dayData?.total || 0,
        dayOfWeek: date.getDay(), // 0 (Sunday) - 6 (Saturday)
      };
    });
  }, [dataMap, dateRange]);

  // Group by weeks (GitHub style: 7 rows for days of week, columns for weeks)
  const gridData = useMemo(() => {
    // Get all weeks in the range
    const weeks = eachWeekOfInterval(
      {
        start: dateRange.startDate,
        end: dateRange.endDate,
      },
      { weekStartsOn: 1 } // Start on Monday
    );

    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      // Create 7 slots for each day of the week (Mon-Sun)
      const days: (DayData | null)[] = Array(7).fill(null);

      // Fill in days that exist in our data range
      allDays.forEach((day) => {
        const dayDate = parseISO(day.date);
        if (dayDate >= weekStart && dayDate <= weekEnd) {
          const dayOfWeek = dayDate.getDay();
          // Convert Sunday (0) to index 6, Monday (1) to index 0
          const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          days[dayIndex] = day;
        }
      });

      return { days, weekStart };
    });
  }, [allDays, dateRange]);

  // Calculate month labels positions
  const monthLabels = useMemo(() => {
    const labels: Array<{ text: string; colIndex: number }> = [];
    let lastMonth = -1;

    gridData.forEach((week, index) => {
      const month = getMonth(week.weekStart);
      if (month !== lastMonth) {
        labels.push({
          text: format(week.weekStart, 'MMM', { locale: es }),
          colIndex: index,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [gridData]);

  // Calculate color intensity based on count
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-transparent border border-muted/30 dark:border-muted/20';
    if (count <= 2) return 'bg-primary/30 border border-primary/40';
    if (count <= 4) return 'bg-primary/60 border border-primary/70';
    return 'bg-primary border border-primary'; // 5+
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

  // Day labels (Mon-Sun) - i18n
  const dayLabels = [
    t('days.mon'),
    t('days.tue'),
    t('days.wed'),
    t('days.thu'),
    t('days.fri'),
    t('days.sat'),
    t('days.sun'),
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {t('title')}
                {/* Streak Badge */}
                {stats.streak >= 3 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                    🔥 {stats.streak} {stats.streak === 1 ? 'día' : 'días'}
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('subtitle', {
                  activeDays: stats.activeDays,
                  totalDays: stats.totalDays,
                  consistency: stats.consistency,
                })}
              </p>
            </div>
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
        {/* Empty State for new users */}
        {stats.activeDays === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t('emptyState.title')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              {t('emptyState.description')}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted/30 border border-muted/30" />
                <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/40" />
                <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/70" />
                <div className="w-3 h-3 rounded-sm bg-primary border border-primary" />
              </div>
              <span>{t('emptyState.hint')}</span>
            </div>
          </div>
        ) : (
          <TooltipProvider>
            {/* Heatmap grid - GitHub style */}
            <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-full">
              {/* Month labels (horizontal) */}
              <div className="flex mb-1">
                <div className="w-8 flex-shrink-0" /> {/* Space for day labels */}
                <div className="flex gap-[2px] relative">
                  {monthLabels.map((label, index) => (
                    <div
                      key={index}
                      className="text-[10px] text-muted-foreground absolute"
                      style={{
                        left: `${label.colIndex * 14}px`, // 12px cell + 2px gap
                      }}
                    >
                      {label.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: 7 rows (days of week) × N columns (weeks) */}
              <div className="flex gap-1 mt-5">
                {/* Day labels (vertical) */}
                <div className="flex flex-col gap-[2px] w-8 flex-shrink-0">
                  {dayLabels.map((label, index) => (
                    <div
                      key={index}
                      className="h-3 flex items-center justify-end pr-1 text-[10px] text-muted-foreground"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Heatmap cells */}
                <div className="flex gap-[2px]">
                  {gridData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                      {week.days.map((day, dayIndex) => (
                        <div key={dayIndex}>
                          {day ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className={`
                                    w-3 h-3 rounded-sm transition-all duration-200
                                    hover:ring-2 hover:ring-primary hover:scale-125 hover:z-10
                                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:scale-125
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
                          ) : (
                            <div className="w-3 h-3" /> // Empty space for days outside range
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
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
        )}
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
