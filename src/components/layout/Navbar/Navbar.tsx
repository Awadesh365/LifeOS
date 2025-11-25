import {
  AppBar,
  Avatar,
  Box,
  Badge,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Chip,
  styled,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '../../../types/navigation';

// Styled components with premium glassmorphism
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  top: 16,
  left: 16,
  right: 16,
  width: 'calc(100% - 32px)',
  borderRadius: '16px',
  background: 'rgba(15, 15, 30, 0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '24px',
  background: theme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    filter: 'brightness(1.2)',
  },
}));

const NavChip = styled(Chip)<{ active?: boolean }>(({ theme, active }) => ({
  height: '36px',
  borderRadius: '18px',
  fontWeight: 500,
  fontSize: '14px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: active
    ? theme.gradients.primary
    : 'rgba(255, 255, 255, 0.05)',
  color: theme.palette.text.primary,
  border: active
    ? 'none'
    : `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  '&:hover': {
    background: active
      ? theme.gradients.primary
      : 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: active
      ? '0 4px 12px rgba(102, 126, 234, 0.4)'
      : '0 4px 12px rgba(255, 255, 255, 0.1)',
  },
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  backdropFilter: 'blur(10px)',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '200px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
  '&:focus-within': {
    width: '280px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '14px',
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  width: '40px',
  height: '40px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: theme.gradients.primary,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    borderColor: 'transparent',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: `2px solid transparent`,
  background: theme.gradients.primary,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)',
  },
}));

interface NavbarProps {
  items: NavItem[];
}

const PremiumNavbar: React.FC<NavbarProps> = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const enabledItems = items.filter((i) => i.enabled && i.key !== 'account-settings');
  const visibleItems = enabledItems.slice(0, 5); // Show 5 items max
  const moreItems = enabledItems.slice(5);

  // Mock user data
  const user = {
    name: 'John Doe',
    role: 'Administrator',
    avatar: '',
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMoreAnchorEl(null);
  };

  const handleNavigate = (item: NavItem) => {
    const getFirstVisibleRoute = (navItem: NavItem): string => {
      if (navItem.items && Array.isArray(navItem.items)) {
        for (const child of navItem.items) {
          if (child.items && Array.isArray(child.items)) {
            for (const nestedChild of child.items) {
              if (nestedChild.route && nestedChild.enabled !== false) {
                return nestedChild.route;
              }
            }
          }
          if (child.route && child.enabled !== false) {
            return child.route;
          }
        }
      }
      return navItem.key;
    };

    const targetRoute = getFirstVisibleRoute(item);
    const normalRoute = targetRoute.startsWith('/') ? targetRoute : `/${targetRoute}`;
    navigate(normalRoute);
    handleClose();
  };

  return (
    <StyledAppBar elevation={0}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
        }}
      >
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 32,
              borderRadius: '4px',
              background: (theme) => theme.gradients.primary,
            }}
          />
          <LogoText onClick={() => navigate('/dashboard')}>CityOS</LogoText>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {visibleItems.map((item) => {
            const isActive = location.pathname.includes(`/${item.key}`);
            return (
              <NavChip
                key={item.key}
                label={item.label}
                active={isActive}
                onClick={() => handleNavigate(item)}
                clickable
              />
            );
          })}
          {moreItems.length > 0 && (
            <>
              <NavChip
                label="More"
                icon={<KeyboardArrowDownIcon />}
                onClick={handleMoreClick}
                clickable
              />
              <Menu
                anchorEl={moreAnchorEl}
                open={Boolean(moreAnchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: '12px',
                    background: 'rgba(15, 15, 30, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {moreItems.map((item) => (
                  <MenuItem key={item.key} onClick={() => handleNavigate(item)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search */}
          <SearchBox>
            <Box
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SearchIcon sx={{ fontSize: 20, opacity: 0.7 }} />
            </Box>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchBox>

          {/* Notifications */}
          <Badge
            badgeContent={4}
            color="secondary"
            sx={{
              '& .MuiBadge-badge': {
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              },
            }}
          >
            <IconButtonStyled size="small">
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </IconButtonStyled>
          </Badge>

          {/* Settings */}
          <IconButtonStyled size="small">
            <SettingsIcon sx={{ fontSize: 20 }} />
          </IconButtonStyled>

          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" fontWeight={600}>
                {user.name.split(' ')[0]}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {user.role}
              </Typography>
            </Box>
            <UserAvatar onClick={handleUserClick}>
              {getUserInitials(user.name)}
            </UserAvatar>
          </Box>

          {/* User Menu Popover */}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: '12px',
                background: 'rgba(15, 15, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                {user.role}
              </Typography>
              <MenuItem
                onClick={() => {
                  navigate('/settings/account/profile');
                  handleClose();
                }}
                sx={{ borderRadius: '8px', mb: 0.5 }}
              >
                Profile Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/settings/account/security');
                  handleClose();
                }}
                sx={{ borderRadius: '8px', mb: 0.5 }}
              >
                Security
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                sx={{
                  borderRadius: '8px',
                  background: (theme) => theme.gradients.secondary,
                  color: 'white',
                  '&:hover': {
                    background: (theme) => theme.gradients.secondary,
                    filter: 'brightness(1.1)',
                  },
                }}
              >
                Logout
              </MenuItem>
            </Box>
          </Popover>
        </Box>
      </Box>
    </StyledAppBar>
  );
};

export default PremiumNavbar;
