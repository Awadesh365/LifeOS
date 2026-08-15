import { NavLink } from 'react-router-dom';
import { api } from '../api/client';
import { useState, useEffect } from 'react';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Material Symbols icon names (matches the City scope sidebar icon set).
const NAV_ITEMS = [
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

function SidebarBrand() {
  return (
    <div className="sidebar-brand">
      <div className="sidebar-brand-mark">L</div>
      <div className="sidebar-brand-text">
        <span className="sidebar-brand-title">LifeOS</span>
        <span className="sidebar-brand-sub">Personal Scope</span>
      </div>
    </div>
  );
}

function SidebarNav({ items, scopedPath, isCollapsed, onNavClick }) {
  return (
    <nav className="sidebar-nav">
      {items.map((group) => (
        <div key={group.section} className="nav-group">
          {!isCollapsed && <div className="nav-section-title">{group.section}</div>}
          {isCollapsed && <div className="nav-group-spacer" />}
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={scopedPath(item.path)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
              onClick={onNavClick}
              end={item.path === '/'}
            >
              <span className="nav-icon material-symbols-outlined">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

function SidebarProfile({ isCollapsed }) {
  return (
    <div className="sidebar-footer">
      <div className={`sidebar-profile ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-profile-avatar">A</div>
        {!isCollapsed && (
          <div className="sidebar-profile-text">
            <span className="sidebar-profile-name">Awadesh</span>
            <span className="sidebar-profile-role">Personal OS</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  basePath = '/personal',
}) {
  const [quote, setQuote] = useState('');
  const scopedPath = (path) => (path === '/' ? basePath : `${basePath}${path}`);

  useEffect(() => {
    let isActive = true;

    api.getQuote()
      .then((data) => {
        if (isActive) setQuote(data.quote || '');
      })
      .catch(() => {
        if (isActive) setQuote('');
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  // Mobile: overlay + drawer
  if (isMobile) {
    return (
      <>
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`sidebar sidebar-mobile ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <SidebarBrand />
            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          <SidebarNav
            items={NAV_ITEMS}
            scopedPath={scopedPath}
            isCollapsed={false}
            onNavClick={handleNavClick}
          />

          {quote && (
            <div className="sidebar-quote">
              <p>"{quote}"</p>
            </div>
          )}
          <SidebarProfile isCollapsed={false} />
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`sidebar-header ${isCollapsed ? 'collapsed' : ''}`}>
        {!isCollapsed && <SidebarBrand />}
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <MenuIcon sx={{ fontSize: 18 }} /> : <MenuOpenIcon sx={{ fontSize: 18 }} />}
        </button>
      </div>

      <SidebarNav
        items={NAV_ITEMS}
        scopedPath={scopedPath}
        isCollapsed={isCollapsed}
        onNavClick={undefined}
      />

      {!isCollapsed && quote && (
        <div className="sidebar-quote">
          <p>"{quote}"</p>
        </div>
      )}
      <SidebarProfile isCollapsed={isCollapsed} />
    </aside>
  );
}
