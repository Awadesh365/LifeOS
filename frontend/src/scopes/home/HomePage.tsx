import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  Compass,
  HeartPulse,
  Menu,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import './home.css';

const HeroScene = lazy(() => import('./HeroScene'));

const domains = [
  {
    className: 'home-domain home-domain--health',
    icon: HeartPulse,
    eyebrow: 'Body',
    title: 'Protect your capacity.',
    description: 'See sleep, movement, training, hydration, nutrition, and mental wellbeing as one connected system.',
    metric: '8.2',
    metricLabel: 'readiness',
  },
  {
    className: 'home-domain home-domain--wealth',
    icon: WalletCards,
    eyebrow: 'Wealth',
    title: 'Give every rupee direction.',
    description: 'Bring cashflow, debt, investments, and your emergency buffer into a calm monthly view.',
    metric: '34%',
    metricLabel: 'buffer funded',
  },
  {
    className: 'home-domain home-domain--growth',
    icon: Brain,
    eyebrow: 'Mastery',
    title: 'Turn effort into evidence.',
    description: 'Connect daily habits with skills, career moves, projects, and the person you are becoming.',
    metric: '12',
    metricLabel: 'weeks focused',
  },
  {
    className: 'home-domain home-domain--vision',
    icon: Compass,
    eyebrow: 'Direction',
    title: 'Keep the long game visible.',
    description: 'Translate philosophy, dreams, and future plans into decisions you can make today.',
    metric: '01',
    metricLabel: 'clear direction',
  },
];

const principles = [
  ['01', 'Capture reality', 'Record the few signals that tell the truth about your day.'],
  ['02', 'See the system', 'Notice the relationships between energy, focus, money, and progress.'],
  ['03', 'Act deliberately', 'Choose the next useful action—then let consistency compound.'],
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    document.title = 'LifeOS — Design a life that compounds';
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  return (
    <main className="lifeos-home">
      <header className="home-nav">
        <a className="home-brand" href="#top" aria-label="LifeOS home">
          <span className="home-brand-mark">L</span>
          <span>LifeOS</span>
        </a>

        <nav className={`home-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Homepage navigation">
          <a href="#system" onClick={() => setMenuOpen(false)}>The system</a>
          <a href="#method" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#privacy" onClick={() => setMenuOpen(false)}>Privacy</a>
          <Link className="home-nav-cta" to="/app" onClick={() => setMenuOpen(false)}>
            Enter workspace <ArrowUpRight size={15} />
          </Link>
        </nav>

        <button
          className="home-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <section className="home-hero" id="top">
        <div className="home-hero-ambient home-hero-ambient--one" />
        <div className="home-hero-ambient home-hero-ambient--two" />
        <div className="home-container home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-eyebrow"><Sparkles size={14} /> Your personal operating system</div>
            <h1>Live with <span>clarity.</span><br />Move with intent.</h1>
            <p>
              LifeOS turns the scattered parts of your life into one coherent system—so your daily actions and long-term direction finally reinforce each other.
            </p>
            <div className="home-hero-actions">
              <Link className="home-primary-button" to="/app">
                Open your workspace <ArrowRight size={17} />
              </Link>
              <a className="home-secondary-button" href="#system">
                Explore the system <ArrowDown size={16} />
              </a>
            </div>
            <div className="home-trust-row">
              <span><Check size={14} /> Private by default</span>
              <span><Check size={14} /> Built for daily use</span>
              <span><Check size={14} /> One coherent view</span>
            </div>
          </div>

          <div className="home-visual" aria-label="Interactive LifeOS system visualization">
            <div className="home-scene-wrap">
              <Suspense fallback={<div className="home-scene-loading"><span /></div>}>
                <HeroScene reducedMotion={reducedMotion} />
              </Suspense>
            </div>
            <div className="home-orbit-label home-orbit-label--health"><i /> Health</div>
            <div className="home-orbit-label home-orbit-label--wealth"><i /> Wealth</div>
            <div className="home-orbit-label home-orbit-label--growth"><i /> Growth</div>
            <div className="home-visual-card">
              <div>
                <span className="home-live-dot" /> Today’s system
                <strong>Aligned</strong>
              </div>
              <Activity size={22} />
            </div>
          </div>
        </div>

        <div className="home-container home-hero-foot">
          <span>One life</span><i />
          <span>One system</span><i />
          <span>Eighteen connected modules</span>
        </div>
      </section>

      <section className="home-system-section" id="system">
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-kicker">A complete view</span>
              <h2>One operating system.<br />Every part of life.</h2>
            </div>
            <p>
              Most tools optimize one isolated metric. LifeOS helps you understand the whole system—because no meaningful part of life exists alone.
            </p>
          </div>

          <div className="home-domain-grid">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <article className={domain.className} key={domain.eyebrow}>
                  <div className="home-domain-top">
                    <span className="home-domain-icon"><Icon size={20} /></span>
                    <span>{domain.eyebrow}</span>
                  </div>
                  <div>
                    <h3>{domain.title}</h3>
                    <p>{domain.description}</p>
                  </div>
                  <div className="home-domain-metric">
                    <strong>{domain.metric}</strong>
                    <span>{domain.metricLabel}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-method-section" id="method">
        <div className="home-container home-method-grid">
          <div className="home-method-intro">
            <span className="home-section-kicker home-section-kicker--dark">A quieter way to progress</span>
            <h2>Less noise.<br />Better decisions.</h2>
            <p>LifeOS is not another productivity contest. It is a simple rhythm for staying honest, seeing clearly, and choosing well.</p>
            <Link to="/app" className="home-text-link">See your dashboard <ArrowRight size={16} /></Link>
          </div>
          <div className="home-principles">
            {principles.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-privacy-section" id="privacy">
        <div className="home-container home-privacy-card">
          <div className="home-privacy-icon"><ShieldCheck size={25} /></div>
          <div>
            <span className="home-section-kicker">Personal means personal</span>
            <h2>Your life is not an engagement metric.</h2>
            <p>LifeOS is designed as a private workspace for reflection and action—not a feed, not a leaderboard, and not another source of noise.</p>
          </div>
          <div className="home-privacy-points">
            <span><Check size={15} /> No social comparison</span>
            <span><Check size={15} /> No manipulative streaks</span>
            <span><Check size={15} /> Your system, your pace</span>
          </div>
        </div>
      </section>

      <section className="home-closing-section">
        <div className="home-container home-closing-card">
          <div>
            <span className="home-section-kicker home-section-kicker--light">Your next chapter</span>
            <h2>A better life is built<br />by better defaults.</h2>
          </div>
          <div>
            <p>Start with today. See the whole. Keep moving.</p>
            <Link className="home-closing-button" to="/app">Enter LifeOS <ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-container">
          <a className="home-brand home-brand--footer" href="#top"><span className="home-brand-mark">L</span><span>LifeOS</span></a>
          <p>Designed for a deliberate life.</p>
          <span>© {new Date().getFullYear()} LifeOS</span>
        </div>
      </footer>
    </main>
  );
}
