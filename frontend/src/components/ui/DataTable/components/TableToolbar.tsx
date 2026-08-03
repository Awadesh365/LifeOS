import { useState } from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemText,
  Checkbox,
  Box,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ViewColumn as ViewColumnIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { Column } from "../DataTable.types";

interface TableToolbarProps<T> {
  title?: string;
  numSelected: number;
  onSearchChange: (value: string) => void;
  searchValue: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  // Export
  onExport?: (format: "csv" | "xlsx") => void;
  exportable?: boolean;
  // Column Visibility
  columns?: Column<T>[];
  visibleColumns?: string[];
  onToggleColumn?: (columnId: string) => void;
  columnVisibility?: boolean;
}

export function TableToolbar<T>({
  title,
  numSelected,
  onSearchChange,
  searchValue,
  searchPlaceholder = "Search...",
  searchable,
  onExport,
  exportable,
  columns = [],
  visibleColumns = [],
  onToggleColumn,
  columnVisibility,
}: TableToolbarProps<T>) {
  // Menu states
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [columnsAnchorEl, setColumnsAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format: "csv" | "xlsx") => {
    onExport?.(format);
    handleExportClose();
  };

  const handleColumnsClick = (event: React.MouseEvent<HTMLElement>) => {
    setColumnsAnchorEl(event.currentTarget);
  };

  const handleColumnsClose = () => {
    setColumnsAnchorEl(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.primary.main
              : theme.palette.primary.dark,
          color: (theme) => theme.palette.primary.contrastText,
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      {numSelected === 0 && searchable && (
        <TextField
          variant="standard"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
      )}

      {/* Export Menu */}
      {numSelected === 0 && exportable && (
        <>
          <Tooltip title="Export data">
            <IconButton onClick={handleExportClick}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleExport("csv")}>
              Export as CSV
            </MenuItem>
            <MenuItem onClick={() => handleExport("xlsx")}>
              Export as Excel
            </MenuItem>
          </Menu>
        </>
      )}

      {/* Column Visibility Menu */}
      {numSelected === 0 && columnVisibility && (
        <>
          <Tooltip title="Show/Hide Columns">
            <IconButton onClick={handleColumnsClick}>
              <ViewColumnIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={columnsAnchorEl}
            open={Boolean(columnsAnchorEl)}
            onClose={handleColumnsClose}
            PaperProps={{
              style: { maxHeight: 300, width: 250 },
            }}
          >
            <Box sx={{ p: 1, fontWeight: "bold" }}>Visible Columns</Box>
            {columns.map((col) => (
              <MenuItem key={col.id} onClick={() => onToggleColumn?.(col.id)}>
                <Checkbox checked={visibleColumns.includes(col.id)} />
                <ListItemText primary={col.label} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      {numSelected === 0 && (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
