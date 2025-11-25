import { useState, useMemo, useCallback, useEffect } from 'react';
import { Column, FilterState } from '../../components/organisms/DataTable/DataTable.types';
import { filterDataBySearch, filterDataByFilters, debounce } from '../../utils/dataTable/tableUtils';

/**
 * Custom hook for table filtering logic
 * Handles both global search and column-specific filters
 */
export function useTableFilter<T>(
  data: T[],
  columns: Column<T>[],
  options: {
    searchable?: boolean;
    filterable?: boolean;
    searchValue?: string;
    filters?: FilterState;
    searchableColumns?: string[];
    onSearchChange?: (value: string) => void;
    onFilterChange?: (filters: FilterState) => void;
    debounceDelay?: number;
  } = {}
) {
  const {
    searchable = false,
    filterable = false,
    searchValue,
    filters,
    searchableColumns,
    onSearchChange,
    onFilterChange,
    debounceDelay = 300,
  } = options;

  // Internal state for uncontrolled mode
  const [internalSearch, setInternalSearch] = useState(searchValue || '');
  const [internalFilters, setInternalFilters] = useState<FilterState>(filters || {});

  // Determine if we're in controlled mode
  const isSearchControlled = searchValue !== undefined && onSearchChange !== undefined;
  const isFilterControlled = filters !== undefined && onFilterChange !== undefined;

  // Current state
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const currentFilters = isFilterControlled ? filters : internalFilters;

  // Debounced search handler for controlled mode
  const debouncedOnSearchChange = useMemo(
    () => onSearchChange ? debounce(onSearchChange, debounceDelay) : undefined,
    [onSearchChange, debounceDelay]
  );

  // Handle search change
  const handleSearchChange = useCallback(
    (value: string) => {
      if (!searchable) return;

      if (isSearchControlled) {
        debouncedOnSearchChange?.(value);
        // Update local state immediately for responsive UI
        setInternalSearch(value);
      } else {
        setInternalSearch(value);
      }
    },
    [searchable, isSearchControlled, debouncedOnSearchChange]
  );

  // Handle filter change for specific column
  const handleFilterChange = useCallback(
    (columnId: string, value: any) => {
      if (!filterable) return;

      const newFilters = { ...currentFilters, [columnId]: value };

      // Remove empty filters
      if (value === '' || value == null) {
        delete newFilters[columnId];
      }

      if (isFilterControlled) {
        onFilterChange?.(newFilters);
      } else {
        setInternalFilters(newFilters);
      }
    },
    [filterable, currentFilters, isFilterControlled, onFilterChange]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    if (isFilterControlled) {
      onFilterChange?.({});
    } else {
      setInternalFilters({});
    }
  }, [isFilterControlled, onFilterChange]);

  // Clear search
  const clearSearch = useCallback(() => {
    if (isSearchControlled) {
      onSearchChange?.('');
    } else {
      setInternalSearch('');
    }
  }, [isSearchControlled, onSearchChange]);

  // Clear all (search + filters)
  const clearAll = useCallback(() => {
    clearSearch();
    clearFilters();
  }, [clearSearch, clearFilters]);

  // Sync internal search with controlled value (for responsive UI)
  useEffect(() => {
    if (isSearchControlled && searchValue !== internalSearch) {
      setInternalSearch(searchValue);
    }
  }, [searchValue, isSearchControlled, internalSearch]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply global search
    if (searchable && currentSearch) {
      result = filterDataBySearch(result, currentSearch, columns, searchableColumns);
    }

    // Apply column filters
    if (filterable && Object.keys(currentFilters).length > 0) {
      result = filterDataByFilters(result, currentFilters, columns);
    }

    return result;
  }, [data, columns, currentSearch, currentFilters, searchable, filterable, searchableColumns]);

  return {
    filteredData,
    searchValue: currentSearch,
    filters: currentFilters,
    displaySearch: internalSearch, // For immediate UI feedback
    handleSearchChange,
    handleFilterChange,
    clearSearch,
    clearFilters,
    clearAll,
    hasActiveFilters: Object.keys(currentFilters).length > 0 || !!currentSearch,
  };
}
