import { Column, SortOrder } from '../../components/organisms/DataTable/DataTable.types';

/**
 * Utility functions for data manipulation in DataTable
 */

/**
 * Compare two values for sorting
 */
export function compareValues(
  a: any,
  b: any,
  order: SortOrder,
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'custom'
): number {
  // Handle null/undefined
  if (a == null && b == null) return 0;
  if (a == null) return order === 'asc' ? 1 : -1;
  if (b == null) return order === 'asc' ? -1 : 1;

  let comparison = 0;

  switch (dataType) {
    case 'number':
      comparison = Number(a) - Number(b);
      break;

    case 'date':
      const dateA = a instanceof Date ? a : new Date(a);
      const dateB = b instanceof Date ? b : new Date(b);
      comparison = dateA.getTime() - dateB.getTime();
      break;

    case 'boolean':
      comparison = (a === b) ? 0 : a ? 1 : -1;
      break;

    case 'string':
    default:
      comparison = String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      break;
  }

  return order === 'asc' ? comparison : -comparison;
}

/**
 * Sort array of data by column
 */
export function sortData<T>(
  data: T[],
  column: Column<T> | null,
  order: SortOrder
): T[] {
  if (!column) return data;

  return [...data].sort((a, b) => {
    // Use custom sort function if provided
    if (column.sortFn) {
      return column.sortFn(a, b, order);
    }

    // Get values to compare
    let valueA: any;
    let valueB: any;

    if (typeof column.accessor === 'function') {
      valueA = column.accessor(a);
      valueB = column.accessor(b);
    } else if (column.accessor) {
      valueA = a[column.accessor];
      valueB = b[column.accessor];
    } else {
      return 0;
    }

    return compareValues(valueA, valueB, order, column.dataType);
  });
}

/**
 * Filter data by search value (global search)
 */
export function filterDataBySearch<T>(
  data: T[],
  searchValue: string,
  columns: Column<T>[],
  searchableColumns?: string[]
): T[] {
  if (!searchValue) return data;

  const lowerSearch = searchValue.toLowerCase();
  const columnsToSearch = searchableColumns
    ? columns.filter(col => searchableColumns.includes(col.id))
    : columns.filter(col => col.filterable !== false);

  return data.filter(row => {
    return columnsToSearch.some(column => {
      let value: any;

      if (typeof column.accessor === 'function') {
        value = column.accessor(row);
      } else if (column.accessor) {
        value = row[column.accessor];
      }

      if (value == null) return false;

      return String(value).toLowerCase().includes(lowerSearch);
    });
  });
}

/**
 * Filter data by column-specific filters
 */
export function filterDataByFilters<T>(
  data: T[],
  filters: Record<string, any>,
  columns: Column<T>[]
): T[] {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value != null && value !== '');

  if (activeFilters.length === 0) return data;

  return data.filter(row => {
    return activeFilters.every(([columnId, filterValue]) => {
      const column = columns.find(col => col.id === columnId);
      if (!column) return true;

      // Use custom filter function if provided
      if (column.filterFn) {
        return column.filterFn(row, filterValue);
      }

      // Get cell value
      let cellValue: any;
      if (typeof column.accessor === 'function') {
        cellValue = column.accessor(row);
      } else if (column.accessor) {
        cellValue = row[column.accessor];
      }

      if (cellValue == null) return false;

      // Default filtering logic
      if (column.dataType === 'number') {
        return Number(cellValue) === Number(filterValue);
      } else if (column.dataType === 'boolean') {
        return Boolean(cellValue) === Boolean(filterValue);
      } else {
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
      }
    });
  });
}

/**
 * Paginate data
 */
export function paginateData<T>(
  data: T[],
  page: number,
  rowsPerPage: number
): T[] {
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return data.slice(startIndex, endIndex);
}

/**
 * Get accessor value from row
 */
export function getAccessorValue<T>(
  row: T,
  accessor:  | string | number | symbol | ((row: T) => any) | undefined
): any {
  if (!accessor) return null;

  if (typeof accessor === 'function') {
    return accessor(row);
  }

  return row[accessor as keyof T];
}

/**
 * Generate unique key for row
 */
export function generateRowKey<T>(
  row: T,
  index: number,
  keyExtractor?: (row: T, index: number) => string | number
): string | number {
  if (keyExtractor) {
    return keyExtractor(row, index);
  }

  // Try common ID fields
  const commonIdFields = ['id', '_id', 'uuid', 'key'];
  for (const field of commonIdFields) {
    if (row && typeof row === 'object' && field in row) {
      const value = row[field as keyof T];
      if (value != null) {
        return String(value);
      }
    }
  }

  // Fallback to index
  return index;
}

/**
 * Check if value matches search query
 */
export function matchesSearch(value: any, search: string): boolean {
  if (value == null) return false;
  if (!search) return true;

  const lowerValue = String(value).toLowerCase();
  const lowerSearch = search.toLowerCase();

  return lowerValue.includes(lowerSearch);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Get visible columns based on visibility settings
 */
export function getVisibleColumns<T>(
  columns: Column<T>[],
  visibleColumnIds: string[]
): Column<T>[] {
  return columns.filter(col => visibleColumnIds.includes(col.id));
}

/**
 * Reorder array based on drag and drop
 */
export function reorderArray<T>(
  array: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
