import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  styled,
  alpha,
} from '@mui/material';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { NavItem } from '../../../types/navigation';

const drawerWidth = 280;
const miniDrawerWidth = 80;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : miniDrawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : miniDrawerWidth,
    boxSizing: 'border-box',
    top: 88, // Below the floating navbar
    height: 'calc(100vh - 104px)',
    left: 16,
    borderRadius: '16px',
    background: 'rgba(15, 15, 30, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.gradients.primary,
      borderRadius: '3px',
    },
  },
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: theme.gradients.primary,
    transform: 'rotate(180deg)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
}));

const GroupTitle = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  background: theme.gradients.accent,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  padding: '12px 20px 8px',
  opacity: 0.9,
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean; component?: React.ElementType }>(({ theme, active }) => ({
  margin: '4px 12px',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: active
    ? 'rgba(102, 126, 234, 0.15)'
    : 'transparent',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: active ? theme.gradients.primary : 'transparent',
    borderRadius: '0 4px 4px 0',
  },
  '&:hover': {
    background: active
      ? 'rgba(102, 126, 234, 0.2)'
      : 'rgba(255, 255, 255, 0.05)',
    transform: 'translateX(4px)',
    '&::before': {
      background: theme.gradients.primary,
    },
  },
}));

const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  background: active
    ? theme.gradients.primary
    : 'rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .material-symbols-outlined': {
    fontSize: 22,
    color: theme.palette.text.primary,
  },
}));

const UserCard = styled(Box)(({ theme }) => ({
  margin: '12px',
  padding: '12px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
}));

interface SidebarProps {
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  items: NavItem[];
}

const PremiumSidebar: React.FC<SidebarProps> = ({ setIsOpen, isOpen, items }) => {
  const location = useLocation();

  const activeSidebar = React.useMemo(() => {
    return items.find((section) => {
      return location.pathname.startsWith(`/${section.key}`);
    });
  }, [location.pathname, items]);

  const itemsToRender = React.useMemo(() => {
    if (!activeSidebar) return [];
    if (Array.isArray(activeSidebar.items)) {
      if (activeSidebar.items.length > 0 && activeSidebar.items[0].items) {
        return activeSidebar.items[0].items;
      }
      return activeSidebar.items;
    }
    return [];
  }, [activeSidebar]);

  // Mock user data
  const user = {
    name: 'John Doe',
    role: 'Administrator',
    status: 'online',
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <StyledDrawer variant="permanent" open={isOpen}>
      {/* Toggle Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: isOpen ? 'flex-end' : 'center',
          p: 2,
          pb: 1,
        }}
      >
        <ToggleButton onClick={() => setIsOpen(!isOpen)} size="small">
          {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </ToggleButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 1 }} />

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {activeSidebar && (
          <>
            {isOpen && <GroupTitle>{activeSidebar.label}</GroupTitle>}
            {itemsToRender.map((item, index) => {
              const isActive = item.route
                ? location.pathname.includes(item.route)
                : false;

              return (
                <ListItem key={index} disablePadding>
                  <StyledListItemButton
                    component={Link}
                    {...({ to: `/${item.route}` } as any)}
                    active={isActive}
                  >
                    <ListItemIcon sx={{ minWidth: isOpen ? 56 : 40 }}>
                      <IconWrapper active={isActive}>
                        <Box
                          component="span"
                          className="material-symbols-outlined"
                        >
                          {item.icon}
                        </Box>
                      </IconWrapper>
                    </ListItemIcon>
                    {isOpen && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '14px',
                          sx: {
                            background: isActive
                              ? (theme) => theme.gradients.primary
                              : 'none',
                            WebkitBackgroundClip: isActive ? 'text' : 'unset',
                            WebkitTextFillColor: isActive ? 'transparent' : 'unset',
                            backgroundClip: isActive ? 'text' : 'unset',
                          },
                        }}
                      />
                    )}
                  </StyledListItemButton>
                </ListItem>
              );
            })}
          </>
        )}
      </List>

      {/* User Profile Card */}
      <UserCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: (theme) => theme.gradients. primary,
                fontWeight: 600,
              }}
            >
              {getUserInitials(user.name)}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: (theme) => theme.gradients.success,
                border: '2px solid rgba(15, 15, 30, 0.8)',
              }}
            />
          </Box>
          {isOpen && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name.split(' ')[0]}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.role}
              </Typography>
            </Box>
          )}
        </Box>
      </UserCard>
    </StyledDrawer>
  );
};

export default PremiumSidebar;
