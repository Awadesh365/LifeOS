import { useState, useMemo, useCallback, useEffect } from 'react';

import { paginateData } from '../../utils/dataTable/tableUtils';

/**
 * Custom hook for table pagination logic
 * Handles both controlled and uncontrolled pagination
 */
export function useTablePagination<T>(
  data: T[],
  options: {
    paginated?: boolean;
    page?: number;
    rowsPerPage?: number;
    rowsPerPageOptions?: number[];
    totalRows?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
  } = {}
) {
  const {
    paginated = false,
    page,
    rowsPerPage,
    rowsPerPageOptions = [10, 25, 50, 100],
    totalRows,
    onPageChange,
    onRowsPerPageChange,
  } = options;

  const defaultRowsPerPage = rowsPerPageOptions[0] || 10;

  // Internal state for uncontrolled mode
  const [internalPage, setInternalPage] = useState(page || 0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(
    rowsPerPage || defaultRowsPerPage
  );

  // Determine if we're in controlled mode
  const isControlled = page !== undefined && onPageChange !== undefined;
  const isRowsPerPageControlled =
    rowsPerPage !== undefined && onRowsPerPageChange !== undefined;

  // Current state
  const currentPage = isControlled ? page : internalPage;
  const currentRowsPerPage = isRowsPerPageControlled
    ? rowsPerPage
    : internalRowsPerPage;

  // Calculate total rows (use provided totalRows for server-side pagination)
  const totalRowCount = totalRows !== undefined ? totalRows : data.length;

  // Calculate total pages
  const totalPages = Math.ceil(totalRowCount / currentRowsPerPage);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!paginated) return;

      // Validate page number
      const validPage = Math.max(0, Math.min(newPage, totalPages - 1));

      if (isControlled) {
        onPageChange?.(validPage);
      } else {
        setInternalPage(validPage);
      }
    },
    [paginated, totalPages, isControlled, onPageChange]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      if (!paginated) return;

      if (isRowsPerPageControlled) {
        onRowsPerPageChange?.(newRowsPerPage);
      } else {
        setInternalRowsPerPage(newRowsPerPage);
      }

      // Reset to first page when changing rows per page
      handlePageChange(0);
    },
    [paginated, isRowsPerPageControlled, onRowsPerPageChange, handlePageChange]
  );

  // Go to first page
  const goToFirstPage = useCallback(() => {
    handlePageChange(0);
  }, [handlePageChange]);

  // Go to last page
  const goToLastPage = useCallback(() => {
    handlePageChange(totalPages - 1);
  }, [handlePageChange, totalPages]);

  // Go to next page
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  // Go to previous page
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  // Reset to first page when data length changes
  useEffect(() => {
    if (paginated && !isControlled) {
      // Check if current page is beyond available pages
      const maxPage = Math.max(0, totalPages - 1);
      if (currentPage > maxPage) {
        setInternalPage(maxPage);
      }
    }
  }, [data.length, paginated, isControlled, currentPage, totalPages]);

  // Paginated data (only for client-side pagination)
  const paginatedData = useMemo(() => {
    if (!paginated || totalRows !== undefined) {
      // Server-side pagination or no pagination
      return data;
    }

    return paginateData(data, currentPage, currentRowsPerPage);
  }, [data, currentPage, currentRowsPerPage, paginated, totalRows]);

  // Pagination info
  const paginationInfo = {
    page: currentPage,
    rowsPerPage: currentRowsPerPage,
    totalRows: totalRowCount,
    totalPages,
    startRow: currentPage * currentRowsPerPage + 1,
    endRow: Math.min((currentPage + 1) * currentRowsPerPage, totalRowCount),
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0,
  };

  return {
    paginatedData,
    paginationInfo,
    handlePageChange,
    handleRowsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
  };
}
