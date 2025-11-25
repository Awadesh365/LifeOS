import { useState, useMemo, useCallback } from 'react';
import { Column, SortOrder, SortState } from '../../components/organisms/DataTable/DataTable.types';
import { sortData } from '../../utils/dataTable/tableUtils';

/**
 * Custom hook for table sorting logic
 * Handles both controlled and uncontrolled sorting
 */
export function useTableSort<T>(
  data: T[],
  columns: Column<T>[],
  options: {
    sortable?: boolean;
    sortBy?: string;
    sortOrder?: SortOrder;
    onSortChange?: (columnId: string, order: SortOrder) => void;
  } = {}
) {
  const { sortable = true, sortBy, sortOrder, onSortChange } = options;

  // Internal state for uncontrolled mode
  const [internalSort, setInternalSort] = useState<SortState>({
    columnId: sortBy || null,
    order: sortOrder || 'asc',
  });

  // Determine if we're in controlled mode
  const isControlled = sortBy !== undefined && onSortChange !== undefined;

  // Current sort state
  const currentSort: SortState = isControlled
    ? { columnId: sortBy, order: sortOrder || 'asc' }
    : internalSort;

  // Handle sort change
  const handleSort = useCallback(
    (columnId: string) => {
      if (!sortable) return;

      const column = columns.find(col => col.id === columnId);
      if (!column || column.sortable === false) return;

      const newOrder: SortOrder =
        currentSort.columnId === columnId && currentSort.order === 'asc'
          ? 'desc'
          : 'asc';

      if (isControlled) {
        onSortChange?.(columnId, newOrder);
      } else {
        setInternalSort({ columnId, order: newOrder });
      }
    },
    [sortable, columns, currentSort, isControlled, onSortChange]
  );

  // Clear sort
  const clearSort = useCallback(() => {
    if (isControlled) {
      onSortChange?.('', 'asc');
    } else {
      setInternalSort({ columnId: null, order: 'asc' });
    }
  }, [isControlled, onSortChange]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortable || !currentSort.columnId) {
      return data;
    }

    const column = columns.find(col => col.id === currentSort.columnId);
    return sortData(data, column || null, currentSort.order);
  }, [data, columns, currentSort, sortable]);

  return {
    sortedData,
    sortState: currentSort,
    handleSort,
    clearSort,
  };
}
