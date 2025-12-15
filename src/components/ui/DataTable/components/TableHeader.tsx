import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { Column, SortOrder } from '../DataTable.types';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  onSort: (columnId: string) => void;
  sortColumn: string | null;
  sortOrder: SortOrder;
  stickyHeader?: boolean;
}

export function TableHeader<T>({
  columns,
  onSort,
  sortColumn,
  sortOrder,
  stickyHeader,
}: TableHeaderProps<T>) {
  return (
    <TableHead sx={{ position: stickyHeader ? 'sticky' : 'static', top: 0, zIndex: 1 }}>
      <TableRow>
        {/* Actions Column Header - Empty */}
        <TableCell padding="checkbox" />
        
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            style={{ minWidth: column.minWidth, width: column.width }}
            sortDirection={sortColumn === column.id ? sortOrder : false}
          >
            {column.sortable !== false ? (
              <TableSortLabel
                active={sortColumn === column.id}
                direction={sortColumn === column.id ? sortOrder : 'asc'}
                onClick={() => onSort(column.id)}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

