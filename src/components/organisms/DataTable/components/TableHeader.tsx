import React from 'react';
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from '@mui/material';
import { Column, SortOrder } from '../DataTable.types';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  onSort: (columnId: string) => void;
  sortColumn: string | null;
  sortOrder: SortOrder;
  selectable: boolean | 'single' | 'multiple' | 'none';
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  stickyHeader?: boolean;
}

export function TableHeader<T>({
  columns,
  onSort,
  sortColumn,
  sortOrder,
  selectable,
  numSelected,
  rowCount,
  onSelectAllClick,
  stickyHeader,
}: TableHeaderProps<T>) {
  return (
    <TableHead sx={{ position: stickyHeader ? 'sticky' : 'static', top: 0, zIndex: 1 }}>
      <TableRow>
        {selectable === 'multiple' && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
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
