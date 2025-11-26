import {
  Table,
  TableContainer,
  Paper,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import { DataTableProps } from './DataTable.types';
import { TableHeader } from './components/TableHeader';
import { TableBody } from './components/TableBody';
import { TableToolbar } from './components/TableToolbar';
import { TablePagination } from './components/TablePagination';

// Hooks
import { useTableSort } from '../../../hooks/dataTable/useTableSort';
import { useTableFilter } from '../../../hooks/dataTable/useTableFilter';
import { useTablePagination } from '../../../hooks/dataTable/useTablePagination';
import { useColumnVisibility } from '../../../hooks/dataTable/useColumnVisibility';
import { useRowExpansion } from '../../../hooks/dataTable/useRowExpansion';

// Utils
import { generateRowKey } from '../../../utils/dataTable/tableUtils';
import { exportTableData } from '../../../utils/dataTable/tableExportUtils';

export function DataTable<T>({
  data,
  columns,
  title,
  sortable = true,
  filterable = true,
  searchable = true,
  paginated = true,
  columnVisibility = true,
  glassmorphism = true,
  stickyHeader = false,
  dense = false,
  maxHeight,
  minHeight,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  onRowClick,
  keyExtractor,
  // Advanced features
  rowExpansion,
  exportData,
  rowActions,
  // Controlled props
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  totalRows,
  onPageChange: controlledOnPageChange,
  onRowsPerPageChange: controlledOnRowsPerPageChange,
  sortBy: controlledSortBy,
  sortOrder: controlledSortOrder,
  onSortChange: controlledOnSortChange,
  searchValue: controlledSearchValue,
  onSearchChange: controlledOnSearchChange,
}: DataTableProps<T> & { defaultRowsPerPage?: number }) {
  const theme = useTheme();

  // 1. Column Management (Visibility & Reordering)
  const { visibleColumns, toggleColumn, visibleColumnIds } = useColumnVisibility(columns);
  // TODO: Integrate reordering when UI is ready
  // const { orderedColumns } = useColumnReordering(visibleColumns);
  const activeColumns = visibleColumns;

  // 2. Sorting
  const { sortedData, sortState, handleSort } = useTableSort(data, activeColumns, {
    sortable,
    sortBy: controlledSortBy,
    sortOrder: controlledSortOrder,
    onSortChange: controlledOnSortChange,
  });

  // 3. Filtering & Search
  const { filteredData, searchValue, handleSearchChange } = useTableFilter(
    sortedData,
    activeColumns,
    {
      searchable,
      filterable,
      searchValue: controlledSearchValue,
      onSearchChange: controlledOnSearchChange,
    }
  );

  // 4. Pagination
  const {
    paginatedData,
    paginationInfo,
    handlePageChange,
    handleRowsPerPageChange,
  } = useTablePagination(filteredData, {
    paginated,
    page: controlledPage,
    rowsPerPage: controlledRowsPerPage || defaultRowsPerPage,
    rowsPerPageOptions,
    totalRows, // Pass totalRows for server-side pagination
    onPageChange: controlledOnPageChange,
    onRowsPerPageChange: controlledOnRowsPerPageChange,
  });

  // 5. Row Expansion
  const { expandedRowIds, toggleRowExpansion } = useRowExpansion({
    singleExpansion: rowExpansion?.singleExpansion,
    initiallyExpanded: rowExpansion?.initiallyExpanded,
    expandedRows: rowExpansion?.expandedRows,
    onExpansionChange: rowExpansion?.onExpansionChange,
  });

  // 6. Export
  const handleExport = (format: 'csv' | 'xlsx') => {
    const dataToExport = exportData?.columnsToExport 
        ? data // TODO: Filter columns if needed, but export util handles columns
        : data;
    
    // Use visible columns if no specific columns defined
    const columnsToExport = exportData?.columnsToExport
        ? columns.filter(c => exportData.columnsToExport?.includes(c.id))
        : activeColumns;

    exportTableData(
        dataToExport,
        columnsToExport,
        format,
        exportData?.filename || title || 'table-export'
    );
  };

  // Helper for key extraction
  const getKey = (row: T, index: number) => generateRowKey(row, index, keyExtractor);

  // Styles
  const paperStyles = {
    width: '100%',
    mb: 2,
    overflow: 'hidden',
    ...(glassmorphism && {
      background: alpha(theme.palette.background.paper, 0.7),
      backdropFilter: 'blur(10px)',
      boxShadow: theme.shadows[4],
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }),
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={paperStyles}>
        {!title && !searchable && !exportData && !columnVisibility ? null : (
             <TableToolbar
                title={title}
                numSelected={0}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                searchable={searchable}
                // Export
                exportable={!!exportData}
                onExport={handleExport}
                // Column Visibility
                columnVisibility={columnVisibility}
                columns={columns}
                visibleColumns={visibleColumnIds}
                onToggleColumn={toggleColumn}
             />
        )}

        <TableContainer sx={{ maxHeight, minHeight }}>
          <Table
            stickyHeader={stickyHeader}
            size={dense ? 'small' : 'medium'}
            aria-label="data table"
          >
            <TableHeader
              columns={activeColumns}
              onSort={handleSort}
              sortColumn={sortState.columnId}
              sortOrder={sortState.order}
              stickyHeader={stickyHeader}
            />
            <TableBody
              data={paginatedData}
              columns={activeColumns}
              rowActions={rowActions}
              onRowClick={onRowClick}
              keyExtractor={getKey}
              // Expansion
              expandable={rowExpansion?.enabled}
              expandedRows={expandedRowIds}
              onRowExpand={toggleRowExpansion}
              renderExpandedRow={rowExpansion?.renderExpandedRow}
            />
          </Table>
        </TableContainer>

        {paginated && (
          <TablePagination
            count={paginationInfo.totalRows}
            page={paginationInfo.page}
            rowsPerPage={paginationInfo.rowsPerPage}
            onPageChange={(_, newPage) => handlePageChange(newPage)}
            onRowsPerPageChange={(e) => handleRowsPerPageChange(parseInt(e.target.value, 10))}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        )}
      </Paper>
    </Box>
  );
}

