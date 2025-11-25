import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Column } from '../../components/organisms/DataTable/DataTable.types';
import { getAccessorValue } from './tableUtils';

/**
 * Export data to CSV format
 */
export function exportToCSV<T>(
  data: T[],
  columns: Column<T>[],
  filename: string = 'table-export'
) {
  // Prepare headers
  const headers = columns.map(col => col.label);

  // Prepare rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = getAccessorValue(row, col.accessor);
      // Handle complex values
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    });
  });

  // Combine headers and rows
  const csvData = [headers, ...rows];

  // Convert to CSV string
  const csv = Papa.unparse(csvData);

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}

/**
 * Export data to XLSX format
 */
export function exportToXLSX<T>(
  data: T[],
  columns: Column<T>[],
  filename: string = 'table-export',
  sheetName: string = 'Sheet1'
) {
  // Prepare data for XLSX
  const worksheetData = data.map(row => {
    const rowData: any = {};
    columns.forEach(col => {
      const value = getAccessorValue(row, col.accessor);
      rowData[col.label] = value;
    });
    return rowData;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate XLSX file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create blob and download
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${filename}.xlsx`);
}

/**
 * Main export function that handles both CSV and XLSX
 */
export function exportTableData<T>(
  data: T[],
  columns: Column<T>[],
  format: 'csv' | 'xlsx',
  filename: string = 'table-export'
) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  if (format === 'csv') {
    exportToCSV(data, columns, filename);
  } else if (format === 'xlsx') {
    exportToXLSX(data, columns, filename);
  } else {
    throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Export selected rows only
 */
export function exportSelectedRows<T>(
  allData: T[],
  selectedIds: (string | number)[],
  columns: Column<T>[],
  format: 'csv' | 'xlsx',
  filename: string = 'table-export-selected',
  keyExtractor?: (row: T, index: number) => string | number
) {
  // Filter data to only selected rows
  const selectedData = allData.filter((row, index) => {
    let rowId: string | number;
    if (keyExtractor) {
      rowId = keyExtractor(row, index);
    } else {
      // Try to get ID from common fields
      if (row && typeof row === 'object') {
        if ('id' in row) rowId = (row as any).id;
        else if ('_id' in row) rowId = (row as any)._id;
        else rowId = index;
      } else {
        rowId = index;
      }
    }
    return selectedIds.includes(rowId);
  });

  exportTableData(selectedData, columns, format, filename);
}
