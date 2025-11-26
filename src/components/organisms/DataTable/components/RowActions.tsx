import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Edit, Visibility, Archive } from '@mui/icons-material';
import { useState } from 'react';
import type { RowAction } from '../DataTable.types';

interface RowActionsProps<T> {
  row: T;
  index: number;
  actions?: RowAction<T>[];
}

const defaultActions = <T,>(): RowAction<T>[] => [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit fontSize="small" />,
    onClick: (row: T) => console.log('Edit:', row),
  },
  {
    id: 'view',
    label: 'View',
    icon: <Visibility fontSize="small" />,
    onClick: (row: T) => console.log('View:', row),
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive fontSize="small" />,
    onClick: (row: T) => console.log('Archive:', row),
  },
];

export function RowActions<T>({ row, index, actions }: RowActionsProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Use provided actions or default actions
  const menuActions = actions || defaultActions<T>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: RowAction<T>, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Check if action is disabled
    const isDisabled = typeof action.disabled === 'function' 
      ? action.disabled(row, index)
      : action.disabled;
    
    if (!isDisabled) {
      action.onClick(row, index);
    }
    
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="more actions"
        aria-controls={open ? 'row-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size="small"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'row-actions-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {menuActions.map((action) => {
          const isDisabled = typeof action.disabled === 'function' 
            ? action.disabled(row, index)
            : action.disabled;

          return (
            <MenuItem
              key={action.id}
              onClick={(e) => handleActionClick(action, e)}
              disabled={isDisabled}
            >
              {action.icon && (
                <ListItemIcon>
                  {action.icon}
                </ListItemIcon>
              )}
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

