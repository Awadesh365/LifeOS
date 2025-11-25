import { useState, useCallback } from 'react';
import { Column } from '../../components/organisms/DataTable/DataTable.types';
import { reorderArray } from '../../utils/dataTable/tableUtils';

/**
 * Custom hook for managing column order (drag and drop reordering)
 */
export function useColumnReordering<T>(columns: Column<T>[]) {
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map(col => col.id)
  );

  // Reorder columns
  const reorderColumns = useCallback((startIndex: number, endIndex: number) => {
    setColumnOrder(prev => reorderArray(prev, startIndex, endIndex));
  }, []);

  // Reset to original order
  const resetColumnOrder = useCallback(() => {
    setColumnOrder(columns.map(col => col.id));
  }, [columns]);

  // Set specific order
  const setCustomColumnOrder = useCallback((newOrder: string[]) => {
    setColumnOrder(newOrder);
  }, []);

  // Get ordered columns
  const orderedColumns = useCallback(() => {
    return columnOrder
      .map(id => columns.find(col => col.id === id))
      .filter((col): col is Column<T> => col !== undefined);
  }, [columnOrder, columns]);

  return {
    columnOrder,
    orderedColumns,
    reorderColumns,
    resetColumnOrder,
    setCustomColumnOrder,
  };
}
