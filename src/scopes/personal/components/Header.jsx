import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="header-left">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="header-right">
        <div className="header-search">
          <SearchIcon className="header-search-icon" sx={{ fontSize: 18 }} />
          <input type="text" placeholder="Search..." aria-label="Search" />
          <span className="header-search-kbd">⌘K</span>
        </div>

        <button type="button" className="header-action-btn" aria-label="Notifications">
          <NotificationsIcon sx={{ fontSize: 19 }} />
          <span className="header-action-badge">3</span>
        </button>

        <button type="button" className="header-avatar-pill" aria-label="Account">
          <span className="header-avatar">A</span>
          <span className="header-avatar-name">Awadesh</span>
          <KeyboardArrowDownIcon sx={{ fontSize: 14 }} className="header-avatar-caret" />
        </button>
      </div>
    </header>
  );
}
