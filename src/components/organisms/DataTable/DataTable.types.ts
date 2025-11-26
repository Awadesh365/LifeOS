import { ReactNode } from 'react';

/**
 * Column definition for DataTable
 * @template T - The type of data being displayed in the table
 */
export interface Column<T = any> {
  /** Unique identifier for the column */
  id: string;
  
  /** Display label for column header */
  label: string;
  
  /** Accessor to get cell value from row data */
  accessor?: keyof T | ((row: T) => any);
  
  /** Width of the column (CSS value) */
  width?: string | number;
  
  /** Minimum width of the column (CSS value) */
  minWidth?: string | number;
  
  /** Maximum width of the column (CSS value) */
  maxWidth?: string | number;
  
  /** Text alignment in cells */
  align?: 'left' | 'center' | 'right';
  
  /** Whether this column is sortable */
  sortable?: boolean;
  
  /** Whether this column is filterable */
  filterable?: boolean;
  
  /** Whether this column can be hidden */
  hideable?: boolean;
  
  /** Whether this column should be initially visible */
  initiallyVisible?: boolean;
  
  /** Whether this column is sticky (fixed) */
  sticky?: 'left' | 'right' | false;
  
  /** Custom render function for cell content */
  renderCell?: (value: any, row: T, index: number) => ReactNode;
  
  /** Custom render function for header content */
  renderHeader?: () => ReactNode;
  
  /** Custom filter component */
  renderFilter?: (value: any, onChange: (value: any) => void) => ReactNode;
  
  /** Data type for sorting/filtering logic */
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'custom';
  
  /** Custom sort function */
  sortFn?: (a: T, b: T, order: SortOrder) => number;
  
  /** Custom filter function */
  filterFn?: (row: T, filterValue: any) => boolean;
}

/**
 * Sort order type
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort state interface
 */
export interface SortState {
  columnId: string | null;
  order: SortOrder;
}

/**
 * Filter state interface
 */
export interface FilterState {
  [columnId: string]: any;
}

/**
 * Selection mode
 */
export type SelectionMode = 'single' | 'multiple' | 'none';

/**
 * Pagination state interface
 */
export interface PaginationState {
  page: number;
  rowsPerPage: number;
  totalRows: number;
}

/**
 * Table action button definition
 */
export interface TableAction<T = any> {
  /** Unique identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon to display */
  icon?: ReactNode;
  
  /** Click handler - receives selected rows */
  onClick: (selectedRows: T[]) => void;
  
  /** Whether action is disabled */
  disabled?: boolean | ((selectedRows: T[]) => boolean);
  
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  
  /** Tooltip text */
  tooltip?: string;
  
  /** Whether to show in dropdown menu (for mobile) */
  showInMenu?: boolean;
}

/**
 * Row action definition for three-dot menu
 */
export interface RowAction<T = any> {
  /** Unique identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon to display */
  icon?: ReactNode;
  
  /** Click handler - receives the row and its index */
  onClick: (row: T, index: number) => void;
  
  /** Whether action is disabled */
  disabled?: boolean | ((row: T, index: number) => boolean);
  
  /** Tooltip text */
  tooltip?: string;
  
  /** Color variant for the action */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

/**
 * Row expansion configuration
 */
export interface RowExpansionConfig<T = any> {
  /** Whether rows can be expanded */
  enabled: boolean;
  
  /** Render function for expanded row content */
  renderExpandedRow: (row: T, index: number) => ReactNode;
  
  /** Initially expanded row IDs */
  initiallyExpanded?: (string | number)[];
  
  /** Controlled expanded row IDs */
  expandedRows?: (string | number)[];
  
  /** Callback when expansion changes */
  onExpansionChange?: (expandedRowIds: (string | number)[]) => void;
  
  /** Whether only one row can be expanded at a time */
  singleExpansion?: boolean;
}

/**
 * Data export configuration
 */
export interface ExportConfig {
  /** Enable CSV export */
  csv?: boolean;
  
  /** Enable XLSX export */
  xlsx?: boolean;
  
  /** Filename for exported file (without extension) */
  filename?: string;
  
  /** Columns to include in export (defaults to all visible columns) */
  columnsToExport?: string[];
  
  /** Custom export data transformation */
  transformData?: (data: any[]) => any[];
}

/**
 * Virtualization configuration
 */
export interface VirtualizationConfig {
  /** Enable virtualization */
  enabled: boolean;
  
  /** Estimated row height in pixels */
  rowHeight?: number;
  
  /** Number of rows to render outside visible area */
  overscanCount?: number;
}

/**
 * Main DataTable component props
 * @template T - The type of data being displayed in the table
 */
export interface DataTableProps<T = any> {
  // ===== Required Props =====
  /** Array of data to display */
  data: T[];
  
  /** Column definitions */
  columns: Column<T>[];
  
  // ===== Optional Configuration =====
  /** Function to extract unique key from each row */
  keyExtractor?: (row: T, index: number) => string | number;
  
  /** Table title */
  title?: string;
  
  /** Table subtitle/description */
  subtitle?: string;
  
  // ===== Feature Toggles =====
  /** Enable sorting */
  sortable?: boolean;
  
  /** Enable filtering */
  filterable?: boolean;
  
  /** Enable global search */
  searchable?: boolean;
  
  /** Enable row selection */
  selectable?: boolean | SelectionMode;
  
  /** Enable pagination */
  paginated?: boolean;
  
  /** Enable column visibility toggle */
  columnVisibility?: boolean;
  
  /** Enable column reordering */
  columnReordering?: boolean;
  
  /** Row expansion configuration */
  rowExpansion?: RowExpansionConfig<T>;
  
  /** Data export configuration */
  exportData?: ExportConfig;
  
  /** Virtualization configuration */
  virtualization?: VirtualizationConfig;
  
  // ===== Styling Options =====
  /** Apply glassmorphism effect */
  glassmorphism?: boolean;
  
  /** Sticky header */
  stickyHeader?: boolean;
  
  /** Hover effect on rows */
  hoverable?: boolean;
  
  /** Striped rows (alternating colors) */
  striped?: boolean;
  
  /** Dense padding */
  dense?: boolean;
  
  /** Maximum height for scroll */
  maxHeight?: string | number;
  
  /** Minimum height */
  minHeight?: string | number;
  
  // ===== Pagination Props =====
  /** Current page (0-indexed, controlled) */
  page?: number;
  
  /** Rows per page */
  rowsPerPage?: number;
  
  /** Options for rows per page dropdown */
  rowsPerPageOptions?: number[];
  
  /** Total number of rows (for server-side pagination) */
  totalRows?: number;
  
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  
  /** Callback when rows per page changes */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  
  // ===== Selection Props =====
  /** Controlled selected row IDs */
  selectedRows?: (string | number)[];
  
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  
  // ===== Sorting Props =====
  /** Controlled sort column ID */
  sortBy?: string;
  
  /** Controlled sort order */
  sortOrder?: SortOrder;
  
  /** Callback when sort changes */
  onSortChange?: (columnId: string, order: SortOrder) => void;
  
  // ===== Filtering Props =====
  /** Controlled filter values */
  filters?: FilterState;
  
  /** Callback when filters change */
  onFilterChange?: (filters: FilterState) => void;
  
  // ===== Search Props =====
  /** Controlled search value */
  searchValue?: string;
  
  /** Callback when search changes */
  onSearchChange?: (value: string) => void;
  
  /** Search input placeholder */
  searchPlaceholder?: string;
  
  /** Columns to search in (defaults to all) */
  searchableColumns?: string[];
  
  // ===== Actions & Toolbar =====
  /** Action buttons for selected rows */
  actions?: TableAction<T>[];
  
  /** Row-level actions for three-dot menu */
  rowActions?: RowAction<T>[];
  
  /** Custom content for toolbar */
  toolbarContent?: ReactNode;
  
  /** Hide toolbar completely */
  hideToolbar?: boolean;
  
  // ===== Loading & Empty States =====
  /** Loading state */
  loading?: boolean;
  
  /** Number of skeleton rows to show when loading */
  loadingRows?: number;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Empty state icon */
  emptyIcon?: ReactNode;
  
  /** Custom empty state renderer */
  renderEmpty?: () => ReactNode;
  
  // ===== Row Events =====
  /** Callback when row is clicked */
  onRowClick?: (row: T, index: number, event: React.MouseEvent) => void;
  
  /** Callback when row is double-clicked */
  onRowDoubleClick?: (row: T, index: number, event: React.MouseEvent) => void;
  
  /** Callback when row context menu is opened */
  onRowContextMenu?: (row: T, index: number, event: React.MouseEvent) => void;
  
  // ===== Customization =====
  /** Custom class name for container */
  className?: string;
  
  /** Custom class name for rows */
  rowClassName?: string | ((row: T, index: number) => string);
  
  /** Custom class name for cells */
  cellClassName?: string | ((column: Column<T>, row: T, index: number) => string);
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** Accessibility label */
  'aria-label'?: string;
  
  /** Accessibility description */
  'aria-describedby'?: string;
}

/**
 * Internal table state (for uncontrolled mode)
 */
export interface TableState {
  sort: SortState;
  filters: FilterState;
  searchValue: string;
  selectedRows: (string | number)[];
  expandedRows: (string | number)[];
  page: number;
  rowsPerPage: number;
  visibleColumns: string[];
  columnOrder: string[];
}

/**
 * Export types
 */
export type ExportFormat = 'csv' | 'xlsx';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  data: any[];
  columns: Column[];
}
