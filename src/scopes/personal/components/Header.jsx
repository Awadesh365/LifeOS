export default function Header({ title, subtitle }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  return (
    <header className="header">
      <div className="header-left">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header-right">
        <span className="header-date">
          {isWeekend ? '🔥 ' : ''}
          {dateStr}
          {isWeekend ? ' · AI Day' : ' · Strong Stack Day'}
        </span>
      </div>
    </header>
  );
}
