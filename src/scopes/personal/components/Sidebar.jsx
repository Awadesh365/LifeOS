import { NavLink } from 'react-router-dom';
import { api } from '../api/client';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { section: 'Overview', items: [
    { path: '/', icon: '📊', label: 'Dashboard' },
  ]},
  { section: 'Daily', items: [
    { path: '/habits', icon: '✅', label: 'Daily Tracker' },
    { path: '/routine', icon: '⏰', label: 'My Routine' },
    { path: '/health', icon: '💪', label: 'Health' },
    { path: '/diet', icon: '🥗', label: 'Diet & Nutrition' },
  ]},
  { section: 'Finance', items: [
    { path: '/wealth', icon: '💰', label: 'Wealth Management' },
    { path: '/debts', icon: '📉', label: 'Debt Tracker' },
    { path: '/funds', icon: '🏦', label: 'Emergency Fund' },
  ]},
  { section: 'Growth', items: [
    { path: '/learning', icon: '📚', label: 'Learning Paths' },
    { path: '/jobs', icon: '💼', label: 'Job Tracker' },
    { path: '/career', icon: '📈', label: 'Career Development' },
  ]},
  { section: 'People', items: [
    { path: '/networking', icon: '🤝', label: 'Networking' },
  ]},
  { section: 'Projects', items: [
    { path: '/projects', icon: '🚀', label: 'All Projects' },
  ]},
  { section: 'The Manifesto', items: [
    { path: '/articles', icon: '📜', label: 'The Manifesto' },
  ]},
  { section: 'Vision', items: [
    { path: '/goals', icon: '🎯', label: 'Goals & Dreams' },
    { path: '/future-plans', icon: '🔮', label: 'Future Plans' },
    { path: '/philosophy', icon: '📖', label: 'Core Philosophy' },
  ]},
];

export default function Sidebar({
  theme,
  toggleTheme,
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
          <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="sidebar-logo">
              <h1>LIFEOS PERSONAL</h1>
              <p>Awadesh · Personal OS</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((group) => (
              <div key={group.section}>
                <div className="nav-section-title">{group.section}</div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={scopedPath(item.path)}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                    end={item.path === '/'}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <div style={{ padding: '0 20px 10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Theme</span>
            <button 
              onClick={toggleTheme} 
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius)', 
                padding: '6px 12px', 
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'var(--transition)'
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="sidebar-quote">
            <p>"{quote}"</p>
          </div>
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        {!isCollapsed && (
          <div className="sidebar-logo">
            <h1>LIFEOS PERSONAL</h1>
            <p>Awadesh · Personal OS</p>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            margin: isCollapsed ? '0 auto' : '0'
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            {!isCollapsed && <div className="nav-section-title">{group.section}</div>}
            {isCollapsed && <div style={{ height: '16px' }}></div>}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={scopedPath(item.path)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
                end={item.path === '/'}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: isCollapsed ? '0 0 10px 0' : '0 20px 10px 20px', display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', color: 'var(--text-secondary)' }}>
        {!isCollapsed && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Theme</span>}
        <button 
          onClick={toggleTheme} 
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius)', 
            padding: isCollapsed ? '8px' : '6px 12px', 
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'var(--transition)'
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
          {!isCollapsed && (theme === 'dark' ? 'Light' : 'Dark')}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-quote">
          <p>"{quote}"</p>
        </div>
      )}
    </aside>
  );
}
