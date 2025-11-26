import React from 'react';
import { TableBody as MuiTableBody, TableRow, TableCell, Collapse, Box, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Column, RowAction } from '../DataTable.types';
import { getAccessorValue } from '../../../../utils/dataTable/tableUtils';
import { RowActions } from './RowActions';

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  rowActions?: RowAction<T>[];
  onRowClick?: (row: T, index: number, event: React.MouseEvent) => void;
  keyExtractor: (row: T, index: number) => string | number;
  emptyMessage?: string;
  // Expansion
  expandable?: boolean;
  expandedRows?: (string | number)[];
  onRowExpand?: (rowId: string | number) => void;
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
}

export function TableBody<T>({
  data,
  columns,
  rowActions,
  onRowClick,
  keyExtractor,
  emptyMessage = 'No data available',
  expandable = false,
  expandedRows = [],
  onRowExpand,
  renderExpandedRow,
}: TableBodyProps<T>) {
  const isExpanded = (id: string | number) => expandedRows.includes(id);

  if (data.length === 0) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length + 1 + (expandable ? 1 : 0)}
            align="center"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      </MuiTableBody>
    );
  }

  return (
    <MuiTableBody>
      {data.map((row, index) => {
        const rowId = keyExtractor(row, index);
        const isRowExpanded = isExpanded(rowId);

        return (
          <React.Fragment key={rowId}>
            <TableRow
              hover
              onClick={(event) => {
                onRowClick?.(row, index, event);
              }}
              tabIndex={-1}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {/* Actions Column - Always shown at the beginning */}
              <TableCell padding="checkbox">
                <RowActions row={row} index={index} actions={rowActions} />
              </TableCell>
              
              {expandable && (
                <TableCell padding="checkbox">
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowExpand?.(rowId);
                    }}
                  >
                    {isRowExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
              )}

              {columns.map((column) => {
                const value = getAccessorValue(row, column.accessor);
                return (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {column.renderCell ? column.renderCell(value, row, index) : value}
                  </TableCell>
                );
              })}
            </TableRow>
            
            {expandable && renderExpandedRow && (
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1 + (expandable ? 1 : 0)}>
                  <Collapse in={isRowExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      {renderExpandedRow(row, index)}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        );
      })}
    </MuiTableBody>
  );
}

