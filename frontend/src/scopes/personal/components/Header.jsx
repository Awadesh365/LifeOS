import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const destinations = [
  ['Dashboard', '/app', 'Overview'],
  ['Daily Tracker', '/app/habits', 'Daily'],
  ['My Routine', '/app/routine', 'Daily'],
  ['Health', '/app/health', 'Daily'],
  ['Gym & Training', '/app/training', 'Daily'],
  ['Diet & Nutrition', '/app/diet', 'Daily'],
  ['Wealth Management', '/app/wealth', 'Finance'],
  ['Debt Tracker', '/app/debts', 'Finance'],
  ['Emergency Fund', '/app/funds', 'Finance'],
  ['Learning Paths', '/app/learning', 'Growth'],
  ['Job Tracker', '/app/jobs', 'Growth'],
  ['Career Development', '/app/career', 'Growth'],
  ['Networking', '/app/networking', 'People'],
  ['All Projects', '/app/projects', 'Projects'],
  ['The Manifesto', '/app/articles', 'Knowledge'],
  ['Goals & Dreams', '/app/goals', 'Vision'],
  ['Future Plans', '/app/future-plans', 'Vision'],
  ['Core Philosophy', '/app/philosophy', 'Vision'],
];

export default function Header({ title, subtitle, navigation, hideSearch = false, compactAvatar = false }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return destinations.slice(0, 7);
    return destinations.filter(([label, , group]) =>
      `${label} ${group}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => inputRef.current?.focus(), 0);
    else setQuery('');
  }, [searchOpen]);

  const goTo = (path) => {
    setSearchOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className={`header ${navigation ? 'header--with-navigation' : ''} ${!title && !subtitle ? 'header--navigation-only' : ''}`}>
        {(title || subtitle) && <div className="header-left">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>}

        {navigation && <div className="header-navigation">{navigation}</div>}

        <div className="header-right">
          {!hideSearch && <button type="button" className="header-search" onClick={() => setSearchOpen(true)}>
            <SearchIcon className="header-search-icon" sx={{ fontSize: 18 }} />
            <span>Search LifeOS</span>
            <kbd className="header-search-kbd">⌘K</kbd>
          </button>}

          <div className="header-today" aria-label="Today's date">
            <span>Today</span>
            <strong>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date())}</strong>
          </div>

          <button type="button" className={`header-avatar-pill ${compactAvatar ? 'header-avatar-pill--compact' : ''}`} aria-label="Account for Awadesh">
            <span className="header-avatar">A</span>
            {!compactAvatar && <span className="header-avatar-name">Awadesh</span>}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="command-backdrop" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <section
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Navigate LifeOS"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="command-search-row">
              <SearchIcon sx={{ fontSize: 21 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && matches[0]) goTo(matches[0][1]);
                }}
                placeholder="Search pages and tools…"
                aria-label="Search pages and tools"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="command-results">
              <p className="command-label">{query ? 'Search results' : 'Quick navigation'}</p>
              {matches.length > 0 ? matches.map(([label, path, group]) => (
                <button type="button" className="command-result" key={path} onClick={() => goTo(path)}>
                  <span><strong>{label}</strong><small>{group}</small></span>
                  <ArrowForwardIcon sx={{ fontSize: 17 }} />
                </button>
              )) : (
                <div className="command-empty">No page matches “{query}”.</div>
              )}
            </div>
            <footer className="command-footer"><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></footer>
          </section>
        </div>
      )}
    </>
  );
}
