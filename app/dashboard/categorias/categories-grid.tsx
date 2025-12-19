'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, ArrowUpDown, X, Filter, Grid3x3, List } from 'lucide-react';
import { CategoryCard } from './category-card';
import { CategoryListItem } from './category-list-item';
import { AddCategoryDialog } from './add-category-dialog';
import type { CategoryWithStats } from '@/lib/db';

type SortOption =
  | 'highest-expense'
  | 'lowest-expense'
  | 'alphabetical'
  | 'most-used';

type FilterRange = 'all' | 'no-expenses' | 'low' | 'medium' | 'high';
type ViewMode = 'grid' | 'list';

interface CategoriesGridProps {
  categories: CategoryWithStats[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('highest-expense');
  const [filterRange, setFilterRange] = useState<FilterRange>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem('categories-sort-preference');
    if (savedSort) {
      setSortBy(savedSort as SortOption);
    }

    const savedView = localStorage.getItem('categories-view-mode');
    if (savedView) {
      setViewMode(savedView as ViewMode);
    }
  }, []);

  // Save sort preference to localStorage
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    localStorage.setItem('categories-sort-preference', value);
  };

  // Save view mode preference to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('categories-view-mode', mode);
  };

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    // Filter by search query and expense range
    let filtered = categories.filter((category) => {
      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const nameMatch = category.name.toLowerCase().includes(query);
        const descriptionMatch = category.description
          ?.toLowerCase()
          .includes(query);

        if (!nameMatch && !descriptionMatch) return false;
      }

      // Expense range filter
      if (filterRange !== 'all') {
        const total = category.total || 0;

        switch (filterRange) {
          case 'no-expenses':
            return total === 0;
          case 'low':
            return total > 0 && total < 1000;
          case 'medium':
            return total >= 1000 && total < 5000;
          case 'high':
            return total >= 5000;
          default:
            return true;
        }
      }

      return true;
    });

    // Sort categories (favorites first, then by selected criteria)
    const sorted = [...filtered].sort((a, b) => {
      // Always show favorites first
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;

      // Then apply the selected sort criteria
      switch (sortBy) {
        case 'highest-expense':
          return b.total - a.total;

        case 'lowest-expense':
          return a.total - b.total;

        case 'alphabetical':
          return a.name.localeCompare(b.name, 'es');

        case 'most-used':
          return b.expenseCount - a.expenseCount;

        default:
          return 0;
      }
    });

    return sorted;
  }, [categories, searchQuery, sortBy, filterRange]);

  const hasResults = filteredAndSortedCategories.length > 0;
  const isSearching = searchQuery.trim().length > 0;
  const hasActiveFilters = isSearching || filterRange !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterRange('all');
  };

  return (
    <>
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Results Counter */}
            <span className="text-sm text-muted-foreground">
              {filteredAndSortedCategories.length}{' '}
              {filteredAndSortedCategories.length === 1
                ? 'categoría'
                : 'categorías'}
            </span>

            {/* Filter by expense range */}
            <Select value={filterRange} onValueChange={(value: FilterRange) => setFilterRange(value)}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="no-expenses">Sin gastos</SelectItem>
                <SelectItem value="low">Bajo (&lt; $1,000)</SelectItem>
                <SelectItem value="medium">Medio ($1K-$5K)</SelectItem>
                <SelectItem value="high">Alto (≥ $5,000)</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest-expense">Mayor gasto</SelectItem>
                <SelectItem value="lowest-expense">Menor gasto</SelectItem>
                <SelectItem value="alphabetical">Alfabético (A-Z)</SelectItem>
                <SelectItem value="most-used">Más usadas</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            )}

            {/* View mode toggle */}
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid or Empty States */}
      {categories.length === 0 ? (
        // No categories at all
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No hay categorías</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primera categoría para comenzar a organizar tus gastos.
            </p>
            <AddCategoryDialog />
          </div>
        </div>
      ) : !hasResults && isSearching ? (
        // No search results
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Search className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              No se encontraron categorías
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              No hay categorías que coincidan con &quot;{searchQuery}&quot;.
              Intenta con otro término de búsqueda.
            </p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        // Show categories grid
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        // Show categories list
        <div className="flex flex-col gap-2">
          {filteredAndSortedCategories.map((category) => (
            <CategoryListItem key={category.id} category={category} />
          ))}
        </div>
      )}
    </>
  );
}
