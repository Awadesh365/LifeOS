import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  styled,
  Tooltip,
  Collapse,
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavItem } from '../../../types/navigation';

const drawerWidth = 260;
const collapsedWidth = 72;

// Clean, Professional Sidebar
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    background: '#0f172a', // Slate 900 - Professional Dark
    borderRight: '1px solid rgba(255,255,255,0.05)',
    color: '#e2e8f0',
  },
}));

const BrandSection = styled(Box)(({ theme }) => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  zIndex: 1,
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'depth',
})<{
  active?: boolean;
  depth?: number;
  component?: React.ElementType;
  to?: string;
}>(({ theme, active, depth = 0 }) => ({
  minHeight: 44,
  margin: theme.spacing(0.5, 1.5),
  padding: theme.spacing(0, 1.5),
  paddingLeft: theme.spacing(1.5 + depth * 2), // Indent based on depth
  borderRadius: 8,
  transition: 'all 0.2s ease',
  backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
  color: active ? '#60a5fa' : '#94a3b8',
  '&:hover': {
    backgroundColor: active ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
    color: active ? '#60a5fa' : '#f1f5f9',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 36,
    color: active ? '#60a5fa' : '#64748b',
  },
}));

const UserProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255,255,255,0.05)',
  marginTop: 'auto',
}));

interface SidebarProps {
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  items: NavItem[];
}

const SimpleSidebar: React.FC<SidebarProps> = ({ setIsOpen, isOpen, items }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = item.route ? location.pathname.startsWith(`/${item.route}`) : false;
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedItems.includes(item.key);

    if (!isOpen && depth > 0) return null; // Hide nested items when collapsed

    const handleClick = () => {
      if (hasChildren) {
        handleToggleExpand(item.key);
      }
    };

    return (
      <React.Fragment key={item.key}>
        <Tooltip title={!isOpen ? item.label : ''} placement="right" arrow>
          {item.route ? (
            <StyledListItemButton
              component={Link}
              to={item.route.startsWith('/') ? item.route : `/${item.route}`}
              active={isActive}
              depth={depth}
              onClick={handleClick}
            >
              <ListItemIcon>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ fontSize: 20 }}
                >
                  {item.icon}
                </Box>
              </ListItemIcon>
              {isOpen && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                  {hasChildren &&
                    (isExpanded ? (
                      <ExpandLess sx={{ fontSize: 18, opacity: 0.5 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18, opacity: 0.5 }} />
                    ))}
                </>
              )}
            </StyledListItemButton>
          ) : (
            <StyledListItemButton active={isActive} depth={depth} onClick={handleClick}>
              <ListItemIcon>
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ fontSize: 20 }}
                >
                  {item.icon}
                </Box>
              </ListItemIcon>
              {isOpen && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                  {hasChildren &&
                    (isExpanded ? (
                      <ExpandLess sx={{ fontSize: 18, opacity: 0.5 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18, opacity: 0.5 }} />
                    ))}
                </>
              )}
            </StyledListItemButton>
          )}
        </Tooltip>

        {hasChildren && isOpen && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.items?.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const user = {
    name: 'Awadesh Kumar',
    role: 'Super Admin',
    initials: 'AK',
  };

  return (
    <StyledDrawer variant="permanent" open={isOpen}>
      {/* Brand / Toggle */}
      <BrandSection>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}
            >
              C
            </Typography>
          </Box>
          {isOpen && (
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}
            >
              CityOS
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          sx={{
            color: '#64748b',
            '&:hover': { color: '#f1f5f9', background: 'rgba(255,255,255,0.05)' },
          }}
        >
          {isOpen ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </IconButton>
      </BrandSection>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List component="nav" disablePadding>
          {items.map((item) => renderNavItem(item))}
        </List>
      </Box>

      {/* User Profile */}
      <UserProfileSection>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#334155',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#f8fafc',
            }}
          >
            {user.initials}
          </Avatar>
          {isOpen && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: '#f1f5f9', fontWeight: 600, lineHeight: 1.2 }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', lineHeight: 1.2 }}
              >
                {user.role}
              </Typography>
            </Box>
          )}
        </Box>
      </UserProfileSection>
    </StyledDrawer>
  );
};

export default SimpleSidebar;