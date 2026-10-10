import React from 'react';
import { SortOrder, ViewMode } from '../types/blog';
import { LayoutGrid, List, ArrowDownWideNarrow, Bookmark, Search, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  savedCount: number;
  isOnlySaved: boolean;
  onToggleOnlySaved: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  savedCount,
  isOnlySaved,
  onToggleOnlySaved,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Category Segmented Controls (Interactive Filter Buttons) */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-stone-200/60 dark:border-stone-800/60">
        <button
          onClick={() => {
            if (isOnlySaved) onToggleOnlySaved();
            onSelectCategory('all');
          }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            !isOnlySaved && selectedCategory === 'all'
              ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
          }`}
        >
          Todos los artículos
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (isOnlySaved) onToggleOnlySaved();
              onSelectCategory(cat);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              !isOnlySaved && selectedCategory === cat
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={onToggleOnlySaved}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            isOnlySaved
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-950/40'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Guardados para Offline ({savedCount})</span>
        </button>
      </div>

      {/* Secondary Bar: Real-time Search, Sort & Layout Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search Input in-line */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filtrar por texto o concepto..."
            className="w-full pl-8 pr-8 py-1.5 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right tools: Sort selector and ViewMode toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-stone-600 dark:text-stone-400">
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            {totalFiltered} artículo{totalFiltered === 1 ? '' : 's'}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowDownWideNarrow className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md px-2 py-1 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="readingTime">Tiempo de lectura</option>
            </select>
          </div>

          {/* Grid / List switch */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista cuadrícula"
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
              title="Vista cuadrícula"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              aria-label="Vista lista"
              className={`p-1 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
              title="Vista lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
