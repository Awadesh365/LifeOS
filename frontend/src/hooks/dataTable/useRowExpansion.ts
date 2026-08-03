import { useState, useCallback } from 'react';

/**
 * Custom hook for managing row expansion state
 * Allows rows to be expanded to show additional details
 */
export function useRowExpansion(
  options: {
    singleExpansion?: boolean;
    initiallyExpanded?: (string | number)[];
    expandedRows?: (string | number)[];
    onExpansionChange?: (expandedRowIds: (string | number)[]) => void;
  } = {}
) {
  const {
    singleExpansion = false,
    initiallyExpanded = [],
    expandedRows,
    onExpansionChange,
  } = options;

  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>(
    initiallyExpanded
  );

  // Determine if we're in controlled mode
  const isControlled = expandedRows !== undefined && onExpansionChange !== undefined;

  // Current expanded rows
  const currentExpanded = isControlled ? expandedRows : internalExpanded;

  // Toggle row expansion
  const toggleRowExpansion = useCallback(
    (rowId: string | number) => {
      let newExpanded: (string | number)[];

      if (currentExpanded.includes(rowId)) {
        // Collapse row
        newExpanded = currentExpanded.filter(id => id !== rowId);
      } else {
        // Expand row
        if (singleExpansion) {
          // Only one row can be expanded at a time
          newExpanded = [rowId];
        } else {
          // Multiple rows can be expanded
          newExpanded = [...currentExpanded, rowId];
        }
      }

      if (isControlled) {
        onExpansionChange?.(newExpanded);
      } else {
        setInternalExpanded(newExpanded);
      }
    },
    [currentExpanded, singleExpansion, isControlled, onExpansionChange]
  );

  // Expand row
  const expandRow = useCallback(
    (rowId: string | number) => {
      if (currentExpanded.includes(rowId)) return;

      let newExpanded: (string | number)[];

      if (singleExpansion) {
        newExpanded = [rowId];
      } else {
        newExpanded = [...currentExpanded, rowId];
      }

      if (isControlled) {
        onExpansionChange?.(newExpanded);
      } else {
        setInternalExpanded(newExpanded);
      }
    },
    [currentExpanded, singleExpansion, isControlled, onExpansionChange]
  );

  // Collapse row
  const collapseRow = useCallback(
    (rowId: string | number) => {
      const newExpanded = currentExpanded.filter(id => id !== rowId);

      if (isControlled) {
        onExpansionChange?.(newExpanded);
      } else {
        setInternalExpanded(newExpanded);
      }
    },
    [currentExpanded, isControlled, onExpansionChange]
  );

  // Expand all rows
  const expandAllRows = useCallback(
    (rowIds: (string | number)[]) => {
      if (singleExpansion) return; // Cannot expand all in single mode

      if (isControlled) {
        onExpansionChange?.(rowIds);
      } else {
        setInternalExpanded(rowIds);
      }
    },
    [singleExpansion, isControlled, onExpansionChange]
  );

  // Collapse all rows
  const collapseAllRows = useCallback(() => {
    if (isControlled) {
      onExpansionChange?.([]);
    } else {
      setInternalExpanded([]);
    }
  }, [isControlled, onExpansionChange]);

  // Check if row is expanded
  const isRowExpanded = useCallback(
    (rowId: string | number) => {
      return currentExpanded.includes(rowId);
    },
    [currentExpanded]
  );

  return {
    expandedRowIds: currentExpanded,
    isRowExpanded,
    toggleRowExpansion,
    expandRow,
    collapseRow,
    expandAllRows,
    collapseAllRows,
  };
}
