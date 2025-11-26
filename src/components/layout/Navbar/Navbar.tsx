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
  styled,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Button,
  Fade,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { NavItem } from '../../../types/navigation';

// Clean, Professional Header
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: 64,
  background: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
  color: '#0f172a',
  display: 'flex',
  justifyContent: 'center',
}));

const ModuleSwitcher = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#0f172a',
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  '& .MuiButton-startIcon': {
    marginRight: 12,
  },
}));

const ModuleIconBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#fff',
  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
}));

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  backgroundColor: '#f1f5f9',
  border: '1px solid transparent',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: 400,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#e2e8f0',
  },
  '&:focus-within': {
    backgroundColor: '#ffffff',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#0f172a',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.875rem',
    '&::placeholder': {
      color: '#64748b',
      opacity: 1,
    },
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#64748b',
  borderRadius: 8,
  padding: 8,
  '&:hover': {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
  },
}));

import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export type ModuleType = 'command-center' | 'city-services' | 'analytics' | 'admin';

interface NavbarProps {
  items: NavItem[];
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const SimpleNavbar: React.FC<NavbarProps> = ({ items, currentModule, onModuleChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [moduleMenuAnchor, setModuleMenuAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumbs based on current path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const user = {
    name: 'Awadesh Kumar',
    role: 'Chief Magistrate',
    initials: 'AK',
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleModuleClick = (event: React.MouseEvent<HTMLElement>) => {
    setModuleMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setModuleMenuAnchor(null);
  };

  const handleModuleSelect = (module: ModuleType) => {
    onModuleChange(module);
    handleClose();
    // Optional: Navigate to default route for module
    if (module === 'command-center') navigate('/dashboard');
    if (module === 'city-services') navigate('/services/overview');
    if (module === 'analytics') navigate('/analytics/overview');
    if (module === 'admin') navigate('/admin/status');
  };

  const getModuleDetails = (type: ModuleType) => {
    switch (type) {
      case 'city-services':
        return { label: 'City Services', icon: <LocationCityIcon fontSize="small" />, color: '#10b981' }; // Emerald
      case 'analytics':
        return { label: 'Analytics', icon: <AnalyticsIcon fontSize="small" />, color: '#8b5cf6' }; // Violet
      case 'admin':
        return { label: 'Administration', icon: <AdminPanelSettingsIcon fontSize="small" />, color: '#64748b' }; // Slate
      default:
        return { label: 'Command Center', icon: <LocalPoliceIcon fontSize="small" />, color: '#3b82f6' }; // Blue
    }
  };

  const activeModule = getModuleDetails(currentModule);

  return (
    <StyledAppBar>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3 }}>
        
        {/* Left: Module Switcher & Breadcrumbs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <ModuleSwitcher
            onClick={handleModuleClick}
            endIcon={<KeyboardArrowDownIcon sx={{ color: '#94a3b8', fontSize: 18 }} />}
            startIcon={
              <ModuleIconBox sx={{ background: activeModule.color }}>
                {activeModule.icon}
              </ModuleIconBox>
            }
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {activeModule.label}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                {user.role}
              </Typography>
            </Box>
          </ModuleSwitcher>

          <Menu
            anchorEl={moduleMenuAnchor}
            open={Boolean(moduleMenuAnchor)}
            onClose={handleClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1,
                width: 260,
                borderRadius: 3,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                p: 1,
              }
            }}
          >
            <Typography variant="caption" sx={{ px: 2, py: 1, color: '#94a3b8', fontWeight: 600 }}>
              Switch Context
            </Typography>
            {[
              { id: 'command-center', label: 'Command Center', icon: <LocalPoliceIcon fontSize="small" /> },
              { id: 'city-services', label: 'City Services', icon: <LocationCityIcon fontSize="small" /> },
              { id: 'analytics', label: 'Analytics & Insights', icon: <AnalyticsIcon fontSize="small" /> },
              { id: 'admin', label: 'Administration', icon: <AdminPanelSettingsIcon fontSize="small" /> },
            ].map((m) => (
              <MenuItem
                key={m.id}
                onClick={() => handleModuleSelect(m.id as ModuleType)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1,
                  backgroundColor: currentModule === m.id ? '#f1f5f9' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: currentModule === m.id ? '#0f172a' : '#64748b' }}>
                  {m.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={m.label} 
                  primaryTypographyProps={{ 
                    fontWeight: currentModule === m.id ? 600 : 500,
                    fontSize: '0.875rem'
                  }} 
                />
                {currentModule === m.id && <CheckIcon fontSize="small" sx={{ color: '#0f172a' }} />}
              </MenuItem>
            ))}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />

          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: '#94a3b8' }} />} 
            aria-label="breadcrumb"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const label = value.charAt(0).toUpperCase() + value.slice(1);

              return last ? (
                <Typography key={to} sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
                  {label}
                </Typography>
              ) : (
                <MuiLink component={Link} to={to} key={to} underline="hover" color="inherit" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {label}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        </Box>

        {/* Right: Search & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchBox>
            <Box sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: '#64748b' }}>
              <SearchIcon fontSize="small" />
            </Box>
            <StyledInputBase placeholder="Search..." />
            <Box sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: '1px solid #e2e8f0', borderRadius: 1, px: 0.5, bgcolor: '#fff' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: 10, fontWeight: 700 }}>⌘K</Typography>
            </Box>
          </SearchBox>

          <ActionButton size="small">
            <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </ActionButton>

          <Box 
            onClick={handleUserClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer',
              p: 0.5,
              ml: 1,
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', 
                fontSize: '0.875rem', 
                fontWeight: 600 
              }}
            >
              {user.initials}
            </Avatar>
          </Box>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 200,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
              },
            }}
          >
            <Box sx={{ p: 1 }}>
              <MenuItem onClick={handleClose} sx={{ borderRadius: 1, fontSize: '0.875rem' }}>Profile</MenuItem>
              <MenuItem onClick={handleClose} sx={{ borderRadius: 1, fontSize: '0.875rem' }}>Settings</MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleClose} sx={{ borderRadius: 1, fontSize: '0.875rem', color: '#ef4444' }}>Logout</MenuItem>
            </Box>
          </Popover>
        </Box>
      </Box>
    </StyledAppBar>
  );
};

export default SimpleNavbar;
