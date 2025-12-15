import { useState, useCallback, useMemo } from 'react';
import { SelectionMode } from '../../components/ui/DataTable/DataTable.types';
import { generateRowKey } from '../../utils/dataTable/tableUtils';

/**
 * Custom hook for table row selection logic
 * Supports single and multiple selection modes
 */
export function useTableSelection<T>(
  data: T[],
  options: {
    selectable?: boolean | SelectionMode;
    selectedRows?: (string | number)[];
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
    keyExtractor?: (row: T, index: number) => string | number;
  } = {}
) {
  const {
    selectable = false,
    selectedRows,
    onSelectionChange,
    keyExtractor,
  } = options;

  // Determine selection mode
  const selectionMode: SelectionMode =
    typeof selectable === 'boolean'
      ? selectable
        ? 'multiple'
        : 'none'
      : selectable;

  // Internal state for uncontrolled mode
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>(
    selectedRows || []
  );

  // Determine if we're in controlled mode
  const isControlled = selectedRows !== undefined && onSelectionChange !== undefined;

  // Current selection
  const currentSelection = isControlled ? selectedRows : internalSelected;

  // Get row ID
  const getRowId = useCallback(
    (row: T, index: number) => {
      return generateRowKey(row, index, keyExtractor);
    },
    [keyExtractor]
  );

  // Check if row is selected
  const isRowSelected = useCallback(
    (row: T, index: number) => {
      const rowId = getRowId(row, index);
      return currentSelection.includes(rowId);
    },
    [currentSelection, getRowId]
  );

  // Toggle single row selection
  const toggleRowSelection = useCallback(
    (row: T, index: number) => {
      if (selectionMode === 'none') return;

      const rowId = getRowId(row, index);
      let newSelection: (string | number)[];

      if (selectionMode === 'single') {
        // Single selection: replace selection
        newSelection = isRowSelected(row, index) ? [] : [rowId];
      } else {
        // Multiple selection: toggle row
        if (isRowSelected(row, index)) {
          newSelection = currentSelection.filter(id => id !== rowId);
        } else {
          newSelection = [...currentSelection, rowId];
        }
      }

      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelected(newSelection);
      }
    },
    [
      selectionMode,
      currentSelection,
      isRowSelected,
      getRowId,
      isControlled,
      onSelectionChange,
    ]
  );

  // Select all rows
  const selectAllRows = useCallback(() => {
    if (selectionMode !== 'multiple') return;

    const allRowIds = data.map((row, index) => getRowId(row, index));

    if (isControlled) {
      onSelectionChange?.(allRowIds);
    } else {
      setInternalSelected(allRowIds);
    }
  }, [selectionMode, data, getRowId, isControlled, onSelectionChange]);

  // Deselect all rows
  const deselectAllRows = useCallback(() => {
    if (selectionMode === 'none') return;

    if (isControlled) {
      onSelectionChange?.([]);
    } else {
      setInternalSelected([]);
    }
  }, [selectionMode, isControlled, onSelectionChange]);

  // Toggle all rows (select all if none/some selected, deselect all if all selected)
  const toggleAllRows = useCallback(() => {
    if (selectionMode !== 'multiple') return;

    const allRowIds = data.map((row, index) => getRowId(row, index));
    const allSelected = allRowIds.every(id => currentSelection.includes(id));

    if (allSelected) {
      deselectAllRows();
    } else {
      selectAllRows();
    }
  }, [
    selectionMode,
    data,
    getRowId,
    currentSelection,
    selectAllRows,
    deselectAllRows,
  ]);

  // Get selected rows data
  const selectedRowsData = useMemo(() => {
    return data.filter((row, index) => isRowSelected(row, index));
  }, [data, isRowSelected]);

  // Selection state info
  const selectionInfo = {
    selectedCount: currentSelection.length,
    totalCount: data.length,
    allSelected:
      data.length > 0 &&
      currentSelection.length === data.length &&
      selectionMode === 'multiple',
    someSelected:
      currentSelection.length > 0 &&
      currentSelection.length < data.length &&
      selectionMode === 'multiple',
    noneSelected: currentSelection.length === 0,
  };

  return {
    selectedIds: currentSelection,
    selectedRowsData,
    selectionInfo,
    isRowSelected,
    toggleRowSelection,
    selectAllRows,
    deselectAllRows,
    toggleAllRows,
    selectionMode,
  };
}
