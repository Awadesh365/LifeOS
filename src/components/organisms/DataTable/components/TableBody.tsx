import React from 'react';
import { TableBody as MuiTableBody, TableRow, TableCell, Checkbox, Collapse, Box, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Column } from '../DataTable.types';
import { getAccessorValue } from '../../../../utils/dataTable/tableUtils';

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable: boolean | 'single' | 'multiple' | 'none';
  selectedRows: (string | number)[];
  onRowClick?: (row: T, index: number, event: React.MouseEvent) => void;
  onRowSelect: (row: T, index: number) => void;
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
  selectable,
  selectedRows,
  onRowClick,
  onRowSelect,
  keyExtractor,
  emptyMessage = 'No data available',
  expandable = false,
  expandedRows = [],
  onRowExpand,
  renderExpandedRow,
}: TableBodyProps<T>) {
  const isSelected = (id: string | number) => selectedRows.includes(id);
  const isExpanded = (id: string | number) => expandedRows.includes(id);

  if (data.length === 0) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length + (selectable !== 'none' ? 1 : 0) + (expandable ? 1 : 0)}
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
        const isRowSelected = isSelected(rowId);
        const isRowExpanded = isExpanded(rowId);

        return (
          <React.Fragment key={rowId}>
            <TableRow
              hover
              onClick={(event) => {
                onRowClick?.(row, index, event);
                if (selectable !== 'none' && !expandable) {
                   // If expandable, maybe click shouldn't select? Or separate click areas?
                   // Standard behavior: row click triggers selection or custom action
                   onRowSelect(row, index);
                }
              }}
              role="checkbox"
              aria-checked={isRowSelected}
              tabIndex={-1}
              selected={isRowSelected}
              sx={{ cursor: 'pointer' }}
            >
              {selectable !== 'none' && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isRowSelected}
                    inputProps={{
                      'aria-labelledby': `enhanced-table-checkbox-${index}`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onRowSelect(row, index)}
                  />
                </TableCell>
              )}
              
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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + (selectable !== 'none' ? 1 : 0) + 1}>
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
