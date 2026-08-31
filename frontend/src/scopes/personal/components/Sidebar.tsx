import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Avatar, IconButton, Drawer, Tooltip, Collapse,
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { getPersonalNavItem, PERSONAL_NAV_GROUPS, type PersonalNavGroup } from '../navigation';
import { useAuth } from '../../../auth/AuthProvider';

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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: isCollapsed ? 0 : 2, py: 2.25, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
      <Avatar sx={{ bgcolor: 'secondary.main', width: 38, height: 38, fontWeight: 800, fontSize: 15, borderRadius: 2.25 }}>L</Avatar>
      {!isCollapsed && (
        <Box>
          <Typography variant="subtitle2" fontWeight={800} letterSpacing="-0.02em">LifeOS</Typography>
          <Typography variant="caption" color="text.secondary">Personal operating system</Typography>
        </Box>
      )}
    </Box>
  );
}

interface SidebarNavProps {
  items: PersonalNavGroup[];
  scopedPath: (path: string) => string;
  isCollapsed: boolean;
  onNavClick?: () => void;
}

function SidebarNav({ items, scopedPath, isCollapsed, onNavClick }: SidebarNavProps) {
  const location = useLocation();
  const activeSection = getPersonalNavItem(location.pathname)?.section;
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(activeSection ? [activeSection] : ['Overview']),
  );

  useEffect(() => {
    if (!activeSection) return;
    setOpenSections((current) => {
      if (current.has(activeSection)) return current;
      const next = new Set(current);
      next.add(activeSection);
      return next;
    });
  }, [activeSection]);

  const toggleSection = (section: string) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <List component="nav" sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: isCollapsed ? 0.75 : 1.25, py: 1 }}>
      {items.map((group, groupIndex) => {
        const isOpen = openSections.has(group.section);
        const controlsId = `sidebar-section-${group.section.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        return (
          <Box component="section" aria-label={group.section} key={group.section}>
          {!isCollapsed && (
            <Box
              component="button"
              type="button"
              className="sidebar-section-toggle"
              onClick={() => toggleSection(group.section)}
              aria-expanded={isOpen}
              aria-controls={controlsId}
            >
              <Typography component="span" variant="caption">
                {group.section}
              </Typography>
              <KeyboardArrowDownIcon className="sidebar-section-chevron" sx={{ fontSize: 17 }} />
            </Box>
          )}
          {isCollapsed && groupIndex > 0 && <Divider sx={{ mx: 1, my: 1 }} />}
          <Collapse in={isCollapsed || isOpen} timeout={180} unmountOnExit={!isCollapsed}>
            <Box id={controlsId}>
              {group.items.map((item) => (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                  <Tooltip title={isCollapsed ? `${item.label} · ${group.section}` : ''} placement="right" arrow>
                    <ListItemButton
                      component={NavLink}
                      to={scopedPath(item.path)}
                      end={item.path === '/'}
                      onClick={onNavClick}
                      aria-label={item.label}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: 40,
                        px: isCollapsed ? 1 : 2,
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        color: 'text.secondary',
                        '&:hover': { bgcolor: 'grey.100', color: 'text.primary' },
                        '&.active': {
                          bgcolor: 'secondary.main',
                          color: 'secondary.contrastText',
                          boxShadow: '0 8px 20px -14px rgba(30, 37, 48, 0.65)',
                          '& .MuiListItemIcon-root': { color: 'secondary.contrastText' },
                          '&:hover': { bgcolor: 'secondary.dark' },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 36, justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 20 }}>{item.icon}</span>
                      </ListItemIcon>
                      {!isCollapsed && <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
            </Box>
          </Collapse>
        </Box>
        );
      })}
    </List>
  );
}

function SidebarProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, logout } = useAuth();
  return (
    <Box sx={{ p: isCollapsed ? 1.25 : 2, borderTop: 1, borderColor: 'divider' }}>
      <Tooltip title={isCollapsed ? `${user?.displayName ?? 'LifeOS'} · Personal OS` : ''} placement="right" arrow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300', color: 'text.primary', fontWeight: 600, fontSize: 14 }}>{user?.displayName?.slice(0, 1).toUpperCase() ?? 'L'}</Avatar>
        {!isCollapsed && (
          <Box>
            <Typography variant="body2" fontWeight={600}>{user?.displayName}</Typography>
            <Typography variant="caption" color="text.secondary">Personal OS</Typography>
          </Box>
        )}
        {!isCollapsed && (
          <IconButton sx={{ ml: 'auto' }} size="small" aria-label="Sign out" title="Sign out" onClick={() => void logout()}>
            <LogoutOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        </Box>
      </Tooltip>
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
  const scopedPath = (path: string) =>
    path === '/' ? basePath : `${basePath.replace(/\/$/, '')}${path}`;

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const drawerWidth = isCollapsed ? 76 : 272;

  if (isMobile) {
    return (
      <>
        <Drawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: 'min(88vw, 304px)', bgcolor: 'background.paper', backgroundImage: 'none' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            <SidebarBrand isCollapsed={false} />
            <IconButton onClick={() => setSidebarOpen(false)} size="small" aria-label="Close navigation">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <SidebarNav items={PERSONAL_NAV_GROUPS} scopedPath={scopedPath} isCollapsed={false} onNavClick={handleNavClick} />
          <SidebarProfile isCollapsed={false} />
        </Drawer>
      </>
    );
  }

  return (
    <Box
      className="sidebar-shell"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', px: isCollapsed ? 0 : 2 }}>
        {!isCollapsed && <SidebarBrand isCollapsed={false} />}
        {isCollapsed && <SidebarBrand isCollapsed={true} />}
        <IconButton
          onClick={toggleSidebar}
          size="small"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          sx={{ flexShrink: 0 }}
        >
          {isCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
        </IconButton>
      </Box>
      <SidebarNav items={PERSONAL_NAV_GROUPS} scopedPath={scopedPath} isCollapsed={isCollapsed} />
      <SidebarProfile isCollapsed={isCollapsed} />
    </Box>
  );
}
