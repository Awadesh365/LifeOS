import { NavLink } from 'react-router-dom';
import { api } from '../api/client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Avatar, IconButton, Drawer,
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

const NAV_ITEMS: NavGroup[] = [
  { section: 'Overview', items: [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
  ]},
  { section: 'Daily', items: [
    { path: '/habits', icon: 'task_alt', label: 'Daily Tracker' },
    { path: '/routine', icon: 'schedule', label: 'My Routine' },
    { path: '/health', icon: 'fitness_center', label: 'Health' },
    { path: '/training', icon: 'exercise', label: 'Gym & Training' },
    { path: '/diet', icon: 'restaurant', label: 'Diet & Nutrition' },
  ]},
  { section: 'Finance', items: [
    { path: '/wealth', icon: 'account_balance_wallet', label: 'Wealth Management' },
    { path: '/debts', icon: 'trending_down', label: 'Debt Tracker' },
    { path: '/funds', icon: 'savings', label: 'Emergency Fund' },
  ]},
  { section: 'Growth', items: [
    { path: '/learning', icon: 'menu_book', label: 'Learning Paths' },
    { path: '/jobs', icon: 'work', label: 'Job Tracker' },
    { path: '/career', icon: 'trending_up', label: 'Career Development' },
  ]},
  { section: 'People', items: [
    { path: '/networking', icon: 'handshake', label: 'Networking' },
  ]},
  { section: 'Projects', items: [
    { path: '/projects', icon: 'rocket_launch', label: 'All Projects' },
  ]},
  { section: 'The Manifesto', items: [
    { path: '/articles', icon: 'history_edu', label: 'The Manifesto' },
  ]},
  { section: 'Vision', items: [
    { path: '/goals', icon: 'flag', label: 'Goals & Dreams' },
    { path: '/future-plans', icon: 'auto_awesome', label: 'Future Plans' },
    { path: '/philosophy', icon: 'psychology', label: 'Core Philosophy' },
  ]},
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  basePath?: string;
}

function SidebarBrand({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: isCollapsed ? 0 : 2, py: 2, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 700, fontSize: 16 }}>L</Avatar>
      {!isCollapsed && (
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>LifeOS</Typography>
          <Typography variant="caption" color="text.secondary">Personal Tracker</Typography>
        </Box>
      )}
    </Box>
  );
}

interface SidebarNavProps {
  items: NavGroup[];
  scopedPath: (path: string) => string;
  isCollapsed: boolean;
  onNavClick?: () => void;
}

function SidebarNav({ items, scopedPath, isCollapsed, onNavClick }: SidebarNavProps) {
  return (
    <List component="nav" sx={{ flex: 1, px: isCollapsed ? 0.5 : 1 }}>
      {items.map((group) => (
        <Box key={group.section}>
          {!isCollapsed && (
            <Typography variant="caption" color="text.secondary" sx={{ px: 2, pt: 2, pb: 0.5, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
              {group.section}
            </Typography>
          )}
          {isCollapsed && <Divider sx={{ my: 1 }} />}
          {group.items.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                component={NavLink}
                to={scopedPath(item.path)}
                end={item.path === '/'}
                onClick={onNavClick}
                title={isCollapsed ? item.label : ''}
                sx={{
                  borderRadius: 1.5,
                  minHeight: 40,
                  px: isCollapsed ? 1 : 2,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36, justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      ))}
    </List>
  );
}

function SidebarProfile({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300', color: 'text.primary', fontWeight: 600, fontSize: 14 }}>A</Avatar>
        {!isCollapsed && (
          <Box>
            <Typography variant="body2" fontWeight={600}>Awadesh</Typography>
            <Typography variant="caption" color="text.secondary">Personal OS</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  basePath = '/',
}: SidebarProps) {
  const [quote, setQuote] = useState('');
  const scopedPath = (path: string) =>
    path === '/' ? basePath : `${basePath.replace(/\/$/, '')}${path}`;

  useEffect(() => {
    let isActive = true;
    api.getQuote()
      .then((data: any) => {
        if (isActive) setQuote(data.quote || '');
      })
      .catch(() => {
        if (isActive) setQuote('');
      });
    return () => { isActive = false; };
  }, []);

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const drawerWidth = isCollapsed ? 72 : 260;

  if (isMobile) {
    return (
      <>
        <Drawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          PaperProps={{ sx: { width: 260, bgcolor: 'background.paper' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            <SidebarBrand isCollapsed={false} />
            <IconButton onClick={() => setSidebarOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <SidebarNav items={NAV_ITEMS} scopedPath={scopedPath} isCollapsed={false} onNavClick={handleNavClick} />
          {quote && (
            <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontStyle="italic">"{quote}"</Typography>
            </Box>
          )}
          <SidebarProfile isCollapsed={false} />
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{ width: drawerWidth, flexShrink: 0, transition: 'width 0.3s', display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider', height: '100%', position: 'sticky', top: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', px: isCollapsed ? 0 : 2 }}>
        {!isCollapsed && <SidebarBrand isCollapsed={false} />}
        {isCollapsed && <SidebarBrand isCollapsed={true} />}
        <IconButton onClick={toggleSidebar} size="small" title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
        </IconButton>
      </Box>
      <SidebarNav items={NAV_ITEMS} scopedPath={scopedPath} isCollapsed={isCollapsed} />
      {!isCollapsed && quote && (
        <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" fontStyle="italic">"{quote}"</Typography>
        </Box>
      )}
      <SidebarProfile isCollapsed={isCollapsed} />
    </Box>
  );
}
