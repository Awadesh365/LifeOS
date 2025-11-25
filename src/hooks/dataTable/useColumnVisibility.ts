import { useState, useCallback, useMemo } from 'react';
import { Column } from '../../components/organisms/DataTable/DataTable.types';

/**
 * Custom hook for managing column visibility
 * Allows users to show/hide columns dynamically
 */
export function useColumnVisibility<T>(
  columns: Column<T>[],
  defaultVisibleColumns?: string[]
) {
  // Initialize visible columns
  const initialVisibleColumns = useMemo(() => {
    if (defaultVisibleColumns) {
      return defaultVisibleColumns;
    }
    
    // By default, show all columns that are initially visible
    return columns
      .filter(col => col.initiallyVisible !== false)
      .map(col => col.id);
  }, [columns, defaultVisibleColumns]);

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(
    initialVisibleColumns
  );

  // Toggle column visibility
  const toggleColumn = useCallback((columnId: string) => {
    setVisibleColumnIds(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  // Show column
  const showColumn = useCallback((columnId: string) => {
    setVisibleColumnIds(prev => {
      if (prev.includes(columnId)) {
        return prev;
      }
      return [...prev, columnId];
    });
  }, []);

  // Hide column
  const hideColumn = useCallback((columnId: string) => {
    setVisibleColumnIds(prev => prev.filter(id => id !== columnId));
  }, []);

  // Show all columns
  const showAllColumns = useCallback(() => {
    setVisibleColumnIds(columns.map(col => col.id));
  }, [columns]);

  // Hide all columns (except non-hideable ones)
  const hideAllColumns = useCallback(() => {
    setVisibleColumnIds(
      columns.filter(col => col.hideable === false).map(col => col.id)
    );
  }, [columns]);

  // Reset to default
  const resetVisibility = useCallback(() => {
    setVisibleColumnIds(initialVisibleColumns);
  }, [initialVisibleColumns]);

  // Set specific columns
  const setVisibleColumns = useCallback((columnIds: string[]) => {
    setVisibleColumnIds(columnIds);
  }, []);

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(col => visibleColumnIds.includes(col.id));
  }, [columns, visibleColumnIds]);

  // Get hidden columns
  const hiddenColumns = useMemo(() => {
    return columns.filter(col => !visibleColumnIds.includes(col.id));
  }, [columns, visibleColumnIds]);

  // Check if column is visible
  const isColumnVisible = useCallback(
    (columnId: string) => {
      return visibleColumnIds.includes(columnId);
    },
    [visibleColumnIds]
  );

  return {
    visibleColumnIds,
    visibleColumns,
    hiddenColumns,
    isColumnVisible,
    toggleColumn,
    showColumn,
    hideColumn,
    showAllColumns,
    hideAllColumns,
    resetVisibility,
    setVisibleColumns,
  };
}
