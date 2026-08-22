import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, BookOpen,
  CalendarDays, Check, ChevronLeft, ChevronRight, CircleDashed, Copy, Database,
  Flame, Info, LayoutDashboard, Leaf, Plus, RotateCcw, Search, Settings2,
  Trash2, X,
} from 'lucide-react';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { addDietLog, deleteDietLog, fetchDiet } from '../../../redux/slices/personalSlice';
import type { DietLog } from '../types';

interface DietProps {
  isMobile?: boolean;
  initialView?: View;
  initialDate?: string;
  showHeader?: boolean;
}
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Coverage = 'complete' | 'partial' | 'uncertain' | 'untracked';
type View = 'overview' | 'today' | 'review';

const MEAL_TYPES: Array<{ value: MealType; label: string; window: string }> = [
  { value: 'breakfast', label: 'Breakfast', window: 'Morning' },
  { value: 'lunch', label: 'Lunch', window: 'Midday' },
  { value: 'dinner', label: 'Dinner', window: 'Evening' },
  { value: 'snack', label: 'Snacks', window: 'Any time' },
];

const COVERAGE_OPTIONS: Array<{ value: Coverage; label: string }> = [
  { value: 'uncertain', label: 'Not reviewed' },
  { value: 'complete', label: 'Likely complete' },
  { value: 'partial', label: 'Partially logged' },
  { value: 'untracked', label: 'Intentionally untracked' },
];

const isoToday = () => new Date().toISOString().slice(0, 10);
const atNoon = (date: string) => new Date(`${date}T12:00:00`);

function moveDate(date: string, amount: number) {
  const next = atNoon(date);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(atNoon(date));
}

function longDate(date: string) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(atNoon(date));
}

function loadRecord<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function Diet({ isMobile = false, initialView = 'overview', initialDate, showHeader = true }: DietProps) {
  const dispatch = useAppDispatch();
  const { logs, history, loading, error } = useAppSelector((state) => state.personal.diet);
  const [date, setDate] = useState(initialDate || isoToday());
  const [view, setView] = useState<View>(initialView);
  const [showForm, setShowForm] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverageByDate, setCoverageByDate] = useState<Record<string, Coverage>>(() => loadRecord('lifeos-nutrition-coverage', {}));
  const [targets, setTargets] = useState(() => loadRecord('lifeos-nutrition-targets', { calories: 2100, protein: 130 }));
  const [form, setForm] = useState<Omit<DietLog, 'id' | 'date'>>({
    mealType: 'breakfast', items: '', protein: 0, calories: 0, notes: '',
  });

  useEffect(() => { dispatch(fetchDiet(date)); }, [dispatch, date]);

  const totalProtein = logs.reduce((sum, log) => sum + Number(log.protein || 0), 0);
  const totalCalories = logs.reduce((sum, log) => sum + Number(log.calories || 0), 0);
  const coverage = coverageByDate[date] || 'uncertain';
  const currentCoverage = COVERAGE_OPTIONS.find((option) => option.value === coverage)!;

  const recentMeals = useMemo(() => {
    const seen = new Set<string>();
    return [...history]
      .filter((meal) => meal.date !== date)
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((meal) => {
        const key = `${meal.mealType}:${meal.items.trim().toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3);
  }, [date, history]);

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => moveDate(date, index - 6)), [date]);
  const weeklyStats = useMemo(() => {
    const days = weekDates.map((day) => {
      const dayLogs = history.filter((meal) => meal.date === day);
      return {
        date: day,
        logs: dayLogs,
        calories: dayLogs.reduce((sum, meal) => sum + Number(meal.calories || 0), 0),
        protein: dayLogs.reduce((sum, meal) => sum + Number(meal.protein || 0), 0),
        coverage: coverageByDate[day] || 'uncertain' as Coverage,
      };
    });
    const sufficient = days.filter((day) => day.coverage === 'complete');
    return {
      days, sufficient,
      averageCalories: sufficient.length ? Math.round(sufficient.reduce((sum, day) => sum + day.calories, 0) / sufficient.length) : 0,
      averageProtein: sufficient.length ? Math.round(sufficient.reduce((sum, day) => sum + day.protein, 0) / sufficient.length) : 0,
    };
  }, [coverageByDate, history, weekDates]);

  const updateCoverage = (value: Coverage) => {
    setCoverageByDate((current) => {
      const next = { ...current, [date]: value };
      localStorage.setItem('lifeos-nutrition-coverage', JSON.stringify(next));
      return next;
    });
  };

  const updateTargets = (field: 'calories' | 'protein', value: number) => {
    setTargets((current) => {
      const next = { ...current, [field]: Math.max(0, value) };
      localStorage.setItem('lifeos-nutrition-targets', JSON.stringify(next));
      return next;
    });
  };

  const openMealForm = (mealType: MealType = 'breakfast') => {
    setForm((current) => ({ ...current, mealType }));
    setShowForm(true);
  };

  const handleAddLog = async () => {
    if (!form.items.trim() || saving) return;
    setSaving(true);
    try {
      await dispatch(addDietLog({ date, ...form, items: form.items.trim() })).unwrap();
      setForm({ mealType: 'breakfast', items: '', protein: 0, calories: 0, notes: '' });
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const copyRecentMeal = async (meal: DietLog) => {
    if (saving) return;
    setSaving(true);
    try {
      await dispatch(addDietLog({
        date, mealType: meal.mealType, items: meal.items,
        protein: Number(meal.protein || 0), calories: Number(meal.calories || 0),
        notes: meal.notes ? `${meal.notes} · Copied from ${shortDate(meal.date)}` : `Copied from ${shortDate(meal.date)}`,
      })).unwrap();
    } finally { setSaving(false); }
  };

  const proteinProgress = targets.protein ? Math.min(100, (totalProtein / targets.protein) * 100) : 0;
  const calorieProgress = targets.calories ? Math.min(100, (totalCalories / targets.calories) * 100) : 0;
  const selectedIsToday = date === isoToday();

  return (
    <>
      {showHeader && <Header title="Nutrition" subtitle="Capture reality. Review patterns. Change one useful thing." />}
      <main className={`nutrition-page ${isMobile ? 'nutrition-page--mobile' : ''}`}>
        {error && <div className="nutrition-alert nutrition-alert--error" role="alert"><Info size={17} /><span>{error}</span></div>}

        <div className="nutrition-topbar">
          <div className="nutrition-tabs" role="tablist" aria-label="Nutrition views">
            <button role="tab" aria-selected={view === 'overview'} className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')} type="button"><LayoutDashboard size={16} /> Overview</button>
            <button role="tab" aria-selected={view === 'today'} className={view === 'today' ? 'active' : ''} onClick={() => setView('today')} type="button"><BookOpen size={16} /> Diary</button>
            <button role="tab" aria-selected={view === 'review'} className={view === 'review' ? 'active' : ''} onClick={() => setView('review')} type="button"><BarChart3 size={16} /> Weekly review</button>
          </div>
          <div className="nutrition-date-control">
            <button type="button" aria-label="Previous day" onClick={() => setDate(moveDate(date, -1))}><ChevronLeft size={18} /></button>
            <label><CalendarDays size={16} /><input type="date" value={date} max={isoToday()} onChange={(event) => setDate(event.target.value)} /><span>{selectedIsToday ? 'Today' : shortDate(date)}</span></label>
            <button type="button" aria-label="Next day" disabled={selectedIsToday} onClick={() => setDate(moveDate(date, 1))}><ChevronRight size={18} /></button>
          </div>
        </div>

        {loading && <div className="nutrition-loading"><span /> Updating nutrition record…</div>}

        {view === 'overview' ? (
          <NutritionOverview
            endDate={date}
            stats={weeklyStats}
            targets={targets}
            onOpenDiary={() => setView('today')}
            onOpenReview={() => setView('review')}
            onOpenTargets={() => { setView('today'); setShowTargets(true); }}
            onSelectDay={(nextDate) => { setDate(nextDate); setView('today'); }}
          />
        ) : view === 'today' ? (
          <div className="nutrition-layout">
            <section className="nutrition-main-column">
              <article className="nutrition-overview-card">
                <div className="nutrition-card-heading">
                  <div><span className="nutrition-eyebrow">{longDate(date)}</span><h1>Nutrition today</h1></div>
                  <label className={`coverage-select coverage-select--${coverage}`}>
                    {coverage === 'complete' ? <Check size={14} /> : <CircleDashed size={14} />}
                    <select value={coverage} onChange={(event) => updateCoverage(event.target.value as Coverage)}>
                      {COVERAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                </div>
                <div className="nutrition-metrics">
                  <Metric label="Energy recorded" value={totalCalories.toLocaleString()} unit={`/ ${targets.calories.toLocaleString()} kcal`} progress={calorieProgress} />
                  <Metric label="Protein recorded" value={`${totalProtein}`} unit={`/ ${targets.protein} g`} progress={proteinProgress} />
                  <Metric label="Meals recorded" value={`${logs.length}`} unit="entries" progress={Math.min(100, logs.length * 25)} />
                </div>
                <div className="nutrition-data-note"><Info size={15} /><span>Totals reflect what you recorded, not necessarily everything you ate. Fiber and micronutrients need structured food data and are not estimated here.</span></div>
              </article>

              <article className="nutrition-section-card nutrition-quick-log">
                <div className="nutrition-card-heading compact">
                  <div><span className="nutrition-eyebrow">Low-friction capture</span><h2>Log a meal</h2></div>
                  <button type="button" className="nutrition-primary-button" onClick={() => openMealForm()}><Plus size={17} /> Add manually</button>
                </div>
                {recentMeals.length > 0 ? (
                  <div className="recent-meals">
                    <p className="nutrition-section-label">Eat a recent meal again</p>
                    <div className="recent-meal-grid">
                      {recentMeals.map((meal) => (
                        <button key={meal.id} type="button" className="recent-meal-card" onClick={() => copyRecentMeal(meal)} disabled={saving}>
                          <span className="recent-meal-icon"><RotateCcw size={17} /></span>
                          <span className="recent-meal-copy"><strong>{meal.items}</strong><small>{meal.mealType} · {meal.protein}g protein · {meal.calories} kcal</small></span>
                          <Copy size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="nutrition-empty-inline"><Search size={19} /><div><strong>Your recent meals will appear here.</strong><span>After you log a meal, repeating it takes one tap.</span></div></div>
                )}
              </article>

              <article className="nutrition-section-card">
                <div className="nutrition-card-heading compact">
                  <div><span className="nutrition-eyebrow">Meal record</span><h2>What you ate</h2></div>
                  <span className="entry-count">{logs.length} {logs.length === 1 ? 'entry' : 'entries'}</span>
                </div>
                <div className="meal-timeline">
                  {MEAL_TYPES.map((mealType) => {
                    const entries = logs.filter((log) => log.mealType === mealType.value);
                    return (
                      <div className="meal-slot" key={mealType.value}>
                        <div className="meal-slot-marker"><span /></div>
                        <div className="meal-slot-content">
                          <div className="meal-slot-title">
                            <div><h3>{mealType.label}</h3><span>{mealType.window}</span></div>
                            <button type="button" onClick={() => openMealForm(mealType.value)}><Plus size={15} /> Log</button>
                          </div>
                          {entries.length ? entries.map((entry) => (
                            <div className="logged-meal" key={entry.id}>
                              <div className="logged-meal-main">
                                <strong>{entry.items}</strong>
                                <div className="logged-meal-meta"><span>{entry.protein}g protein</span><i /><span>{entry.calories} kcal</span><i /><span className="source-chip"><Check size={11} /> Manual · confirmed</span></div>
                                {entry.notes && <p>{entry.notes}</p>}
                              </div>
                              <button className="meal-delete" type="button" onClick={() => dispatch(deleteDietLog(entry.id))} aria-label={`Delete ${entry.items}`}><Trash2 size={16} /></button>
                            </div>
                          )) : <p className="meal-slot-empty">Nothing recorded</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </section>

            <aside className="nutrition-side-column">
              <article className="nutrition-insight-card">
                <span className="insight-icon"><ArrowUpRight size={19} /></span><span className="nutrition-eyebrow">Worth noticing</span>
                <h2>{logs.length === 0 ? 'Start with a representative day.' : coverage === 'uncertain' ? 'How complete is this record?' : proteinProgress < 75 ? 'Protein is below your configured context.' : 'Your protein record is near its target.'}</h2>
                <p>{logs.length === 0 ? 'Capture what actually happens. There is no score to protect and no streak to break.' : coverage === 'uncertain' ? 'Mark the day likely complete or partial so it can be interpreted honestly in the weekly review.' : proteinProgress < 75 ? 'This is an observation, not a failure. A repeated meal may be the smallest useful adjustment.' : 'Keep the meal pattern repeatable before adding more complexity.'}</p>
                <button type="button" onClick={() => setView('review')}>Open weekly context <ArrowRight size={15} /></button>
              </article>

              <article className="nutrition-side-card">
                <div className="nutrition-card-heading compact"><div><span className="nutrition-eyebrow">Your context</span><h2>Targets</h2></div><button className="icon-button" type="button" onClick={() => setShowTargets((value) => !value)} aria-label="Adjust targets"><Settings2 size={17} /></button></div>
                <div className="target-summary"><div><span>Energy</span><strong>{targets.calories.toLocaleString()} kcal</strong></div><div><span>Protein</span><strong>{targets.protein} g</strong></div></div>
                {showTargets && <div className="target-form">
                  <label>Energy context<input type="number" min="0" value={targets.calories} onChange={(event) => updateTargets('calories', Number(event.target.value))} /></label>
                  <label>Protein context<input type="number" min="0" value={targets.protein} onChange={(event) => updateTargets('protein', Number(event.target.value))} /></label>
                  <p>Manually configured. Targets are context, not commandments.</p>
                </div>}
              </article>

              <article className="nutrition-side-card coverage-card">
                <span className="nutrition-eyebrow">Data quality</span><h2>{currentCoverage.label}</h2>
                <p>{coverage === 'complete' ? 'This day can be included in trend averages.' : coverage === 'partial' ? 'This day stays visible but is excluded from averages.' : coverage === 'untracked' ? 'Nothing was expected from this day.' : 'Review coverage before using this day in analysis.'}</p>
              </article>
            </aside>
          </div>
        ) : <WeeklyReview endDate={date} stats={weeklyStats} targets={targets} onSelectDay={(nextDate) => { setDate(nextDate); setView('today'); }} />}
      </main>

      {showForm && (
        <div className="nutrition-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowForm(false); }}>
          <section className="nutrition-modal" role="dialog" aria-modal="true" aria-labelledby="meal-dialog-title">
            <div className="nutrition-modal-header"><div><span className="nutrition-eyebrow">Manual · confirmed by you</span><h2 id="meal-dialog-title">Log a meal</h2></div><button type="button" onClick={() => setShowForm(false)} aria-label="Close meal form"><X size={20} /></button></div>
            <div className="meal-form-grid">
              <label>Meal<select value={form.mealType} onChange={(event) => setForm({ ...form, mealType: event.target.value as MealType })}>{MEAL_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
              <label className="meal-form-wide">What did you eat?<input autoFocus placeholder="e.g. rice, dal, paneer and curd" value={form.items} onChange={(event) => setForm({ ...form, items: event.target.value })} /></label>
              <label>Protein recorded (g)<input type="number" min="0" step="0.1" placeholder="0" value={form.protein || ''} onChange={(event) => setForm({ ...form, protein: Number(event.target.value) || 0 })} /></label>
              <label>Energy recorded (kcal)<input type="number" min="0" step="1" placeholder="0" value={form.calories || ''} onChange={(event) => setForm({ ...form, calories: Number(event.target.value) || 0 })} /></label>
              <label className="meal-form-wide">Context or notes <span>Optional</span><textarea rows={3} placeholder="Restaurant meal, estimated portion, busy workday…" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            </div>
            <div className="nutrition-modal-note"><Info size={15} /> Enter only values you know. Missing is more useful than false precision.</div>
            <div className="nutrition-modal-actions"><button className="nutrition-secondary-button" type="button" onClick={() => setShowForm(false)}>Cancel</button><button className="nutrition-primary-button" type="button" disabled={!form.items.trim() || saving} onClick={handleAddLog}>{saving ? 'Saving…' : 'Confirm meal'} <Check size={17} /></button></div>
          </section>
        </div>
      )}
    </>
  );
}

interface NutritionOverviewProps {
  endDate: string;
  stats: WeeklyReviewProps['stats'];
  targets: WeeklyReviewProps['targets'];
  onOpenDiary: () => void;
  onOpenReview: () => void;
  onOpenTargets: () => void;
  onSelectDay: (date: string) => void;
}

function NutritionOverview({ endDate, stats, targets, onOpenDiary, onOpenReview, onOpenTargets, onSelectDay }: NutritionOverviewProps) {
  const recordedDays = stats.days.filter((day) => day.logs.length > 0);
  const includedDays = stats.sufficient;
  const averageEnergy = includedDays.length ? stats.averageCalories : null;
  const averageProtein = includedDays.length ? stats.averageProtein : null;
  const proteinPercent = averageProtein !== null && targets.protein ? Math.round((averageProtein / targets.protein) * 100) : null;
  const maximumEnergy = Math.max(targets.calories || 1, ...stats.days.map((day) => day.calories));
  const mealCounts = MEAL_TYPES.map((meal) => ({
    ...meal,
    count: stats.days.reduce((sum, day) => sum + day.logs.filter((log) => log.mealType === meal.value).length, 0),
  }));
  const mostLoggedMeal = [...mealCounts].sort((a, b) => b.count - a.count)[0];
  const periodStart = stats.days[0]?.date || endDate;
  const hasReliableData = includedDays.length > 0;

  return (
    <section className="nutrition-dashboard" aria-labelledby="nutrition-overview-title">
      <div className="nutrition-dashboard-hero">
        <div>
          <span className="nutrition-eyebrow">7-day overview</span>
          <h1 id="nutrition-overview-title">Your nutrition, in context</h1>
          <p>{shortDate(periodStart)} – {shortDate(endDate)} · Only likely complete days contribute to averages.</p>
        </div>
        <button type="button" className="nutrition-primary-button" onClick={onOpenDiary}><Plus size={17} /> Log food</button>
      </div>

      <div className="overview-metric-grid">
        <button type="button" className="overview-metric-card" onClick={onOpenReview}>
          <span className="overview-metric-icon overview-metric-icon--energy"><Flame size={18} /></span>
          <span>Energy</span>
          <strong>{averageEnergy === null ? '—' : averageEnergy.toLocaleString()} <small>kcal avg</small></strong>
          <em>{hasReliableData ? `${includedDays.length} reliable ${includedDays.length === 1 ? 'day' : 'days'}` : 'Needs a complete day'} <ArrowRight size={14} /></em>
        </button>
        <button type="button" className="overview-metric-card" onClick={onOpenReview}>
          <span className="overview-metric-icon overview-metric-icon--protein"><Activity size={18} /></span>
          <span>Protein</span>
          <strong>{averageProtein === null ? '—' : averageProtein} <small>g avg</small></strong>
          <em>{proteinPercent === null ? 'No reliable average' : `${proteinPercent}% of context`} <ArrowRight size={14} /></em>
        </button>
        <button type="button" className="overview-metric-card overview-metric-card--unknown" onClick={onOpenDiary}>
          <span className="overview-metric-icon overview-metric-icon--fiber"><Leaf size={18} /></span>
          <span>Fiber</span>
          <strong>— <small>g avg</small></strong>
          <em>Structured foods needed <ArrowRight size={14} /></em>
        </button>
        <button type="button" className="overview-metric-card" onClick={onOpenReview}>
          <span className="overview-metric-icon overview-metric-icon--quality"><Database size={18} /></span>
          <span>Data completeness</span>
          <strong>{includedDays.length}<small>/ 7 days</small></strong>
          <em>{recordedDays.length} with entries <ArrowRight size={14} /></em>
        </button>
      </div>

      <div className="overview-main-grid">
        <article className="nutrition-section-card overview-trend-card">
          <div className="nutrition-card-heading compact">
            <div><span className="nutrition-eyebrow">Recorded energy</span><h2>Weekly trend</h2></div>
            <span className="overview-legend"><i /> Recorded <i /> Target context</span>
          </div>
          {recordedDays.length ? (
            <div className="nutrition-bar-chart" role="group" aria-label={`Energy recorded over seven days. ${recordedDays.length} days contain entries and ${includedDays.length} are marked likely complete.`}>
              <div className="chart-target-line" style={{ bottom: `${Math.min(90, (targets.calories / maximumEnergy) * 82)}%` }}><span>{targets.calories.toLocaleString()} kcal</span></div>
              {stats.days.map((day) => {
                const height = day.logs.length ? Math.max(5, (day.calories / maximumEnergy) * 82) : 0;
                return <button key={day.date} type="button" className={`chart-day chart-day--${day.coverage}`} onClick={() => onSelectDay(day.date)} aria-label={`${shortDate(day.date)}: ${day.logs.length ? `${day.calories} kilocalories recorded, ${day.coverage}` : 'no record'}`}>
                  <span className="chart-value">{day.logs.length ? day.calories.toLocaleString() : '—'}</span>
                  <span className="chart-bar-track"><i style={{ height: `${height}%` }} /></span>
                  <strong>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(atNoon(day.date))}</strong>
                </button>;
              })}
            </div>
          ) : (
            <div className="overview-empty-chart"><CircleDashed size={24} /><div><strong>No trend to show yet</strong><span>Log a representative day to begin building useful context.</span></div><button type="button" onClick={onOpenDiary}>Open diary</button></div>
          )}
          <p className="chart-caption">Missing days remain gaps. Partial and unreviewed days are visible but excluded from the reliable-day average.</p>
        </article>

        <article className="nutrition-section-card overview-adequacy-card">
          <div className="nutrition-card-heading compact"><div><span className="nutrition-eyebrow">Target context</span><h2>Nutrient adequacy</h2></div><button className="icon-button" type="button" onClick={onOpenTargets} aria-label="Adjust nutrition targets"><Settings2 size={17} /></button></div>
          <div className="adequacy-list">
            <AdequacyRow label="Protein" value={proteinPercent} detail={proteinPercent === null ? 'Not enough reliable days' : `${averageProtein} g of ${targets.protein} g`} />
            <AdequacyRow label="Fiber" value={null} detail="Not captured by manual logs" />
            <AdequacyRow label="Micronutrients" value={null} detail="Structured food data required" />
          </div>
          <div className="nutrition-data-note"><Info size={15} /><span>Unknown values are not treated as zero. Add only reference values you can verify.</span></div>
        </article>
      </div>

      <div className="overview-lower-grid">
        <article className="nutrition-section-card">
          <div className="nutrition-card-heading compact"><div><span className="nutrition-eyebrow">Meal pattern</span><h2>What was captured</h2></div><span className="entry-count">{stats.days.reduce((sum, day) => sum + day.logs.length, 0)} entries</span></div>
          <div className="meal-pattern-grid">
            {mealCounts.map((meal) => <div key={meal.value}><span>{meal.label}</span><strong>{meal.count}</strong><i><b style={{ width: `${Math.min(100, (meal.count / 7) * 100)}%` }} /></i></div>)}
          </div>
          <button type="button" className="overview-text-link" onClick={onOpenDiary}>Browse diary <ArrowRight size={15} /></button>
        </article>
        <article className="overview-insight-card">
          <span className="insight-icon"><ArrowUpRight size={19} /></span>
          <span className="nutrition-eyebrow">Observation · this week</span>
          <h2>{recordedDays.length === 0 ? 'Build context with one representative day.' : includedDays.length === 0 ? 'Review completeness before interpreting this week.' : `${mostLoggedMeal.label} was your most consistently recorded meal.`}</h2>
          <p>{recordedDays.length === 0 ? 'There is no score to protect and no streak to break.' : includedDays.length === 0 ? `${recordedDays.length} ${recordedDays.length === 1 ? 'day has' : 'days have'} entries, but none are marked likely complete.` : `Based on ${includedDays.length} likely complete ${includedDays.length === 1 ? 'day' : 'days'}. This describes your records, not food quality.`}</p>
          <button type="button" onClick={onOpenReview}>Review evidence and limits <ArrowRight size={15} /></button>
        </article>
      </div>

      <div className="overview-actions">
        <div><strong>Ready to look back?</strong><span>Turn this week’s records into one practical next step.</span></div>
        <button type="button" className="nutrition-primary-button" onClick={onOpenReview}>Review week <ArrowRight size={16} /></button>
        <button type="button" className="nutrition-secondary-button" onClick={onOpenDiary}>Open diary</button>
      </div>
    </section>
  );
}

function AdequacyRow({ label, value, detail }: { label: string; value: number | null; detail: string }) {
  const boundedValue = value === null ? 0 : Math.min(100, value);
  return <div className={`adequacy-row ${value === null ? 'adequacy-row--unknown' : ''}`}><div><strong>{label}</strong><span>{detail}</span></div><em>{value === null ? 'Unknown' : `${value}%`}</em><i><b style={{ width: `${boundedValue}%` }} /></i></div>;
}

function Metric({ label, value, unit, progress }: { label: string; value: string; unit: string; progress: number }) {
  return <div className="nutrition-metric"><span>{label}</span><div><strong>{value}</strong><small>{unit}</small></div><div className="nutrition-progress"><i style={{ width: `${progress}%` }} /></div></div>;
}

interface WeeklyReviewProps {
  endDate: string;
  stats: { days: Array<{ date: string; logs: DietLog[]; calories: number; protein: number; coverage: Coverage }>; sufficient: Array<{ date: string; logs: DietLog[]; calories: number; protein: number; coverage: Coverage }>; averageCalories: number; averageProtein: number; };
  targets: { calories: number; protein: number };
  onSelectDay: (date: string) => void;
}

function WeeklyReview({ endDate, stats, targets, onSelectDay }: WeeklyReviewProps) {
  const proteinRatio = targets.protein ? stats.averageProtein / targets.protein : 0;
  const action = proteinRatio < 0.8 ? 'Add one repeatable protein-rich food to the meal that is easiest to control.' : 'Keep one reliable meal unchanged next week and continue collecting representative data.';
  const [actionState, setActionState] = useState<'idle' | 'saved' | 'ignored'>(() =>
    loadRecord(`lifeos-nutrition-action-${endDate}`, 'idle'),
  );

  const chooseAction = (next: 'saved' | 'ignored') => {
    localStorage.setItem(`lifeos-nutrition-action-${endDate}`, JSON.stringify(next));
    setActionState(next);
  };

  return (
    <section className="weekly-review">
      <div className="weekly-review-hero">
        <div><span className="nutrition-eyebrow">Week ending {shortDate(endDate)}</span><h1>Your weekly nutrition review</h1><p>Only days marked likely complete are used in averages. Partial and unreviewed days remain visible without becoming zero-intake days.</p></div>
        <div className="coverage-score"><strong>{stats.sufficient.length}<span>/7</span></strong><p>days sufficiently logged</p></div>
      </div>
      <div className="weekly-day-strip">
        {stats.days.map((day) => <button key={day.date} type="button" onClick={() => onSelectDay(day.date)} className={`week-day week-day--${day.coverage}`}><span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(atNoon(day.date))}</span><strong>{atNoon(day.date).getDate()}</strong><i>{day.logs.length ? `${day.logs.length} logged` : 'No record'}</i></button>)}
      </div>
      {stats.sufficient.length ? (
        <div className="review-grid">
          <article className="review-patterns nutrition-section-card">
            <div className="nutrition-card-heading compact"><div><span className="nutrition-eyebrow">Reliable-day averages</span><h2>Patterns</h2></div><span className="entry-count">{stats.sufficient.length} included</span></div>
            <div className="pattern-list">
              <PatternRow label="Protein" value={`${stats.averageProtein} g average`} status={proteinRatio >= 0.85 ? 'Consistent' : 'Worth attention'} tone={proteinRatio >= 0.85 ? 'positive' : 'attention'} />
              <PatternRow label="Energy" value={`${stats.averageCalories.toLocaleString()} kcal recorded`} status="Context only" tone="neutral" />
              <PatternRow label="Fiber" value="Structured food data needed" status="Insufficient data" tone="neutral" />
              <PatternRow label="Fruit + vegetables" value="Food groups not yet captured" status="Insufficient data" tone="neutral" />
            </div>
          </article>
          <article className="review-action-card">
            <span className="insight-icon"><ArrowRight size={19} /></span><span className="nutrition-eyebrow">One possible action</span><h2>{action}</h2>
            <p>{proteinRatio < 0.8 ? `Protein averaged ${stats.averageProtein} g across ${stats.sufficient.length} sufficiently logged days, against your manually configured ${targets.protein} g context.` : 'The current data does not justify a more complicated recommendation.'}</p>
            <div className="review-action-buttons">
              <button type="button" onClick={() => chooseAction('saved')}>{actionState === 'saved' ? 'Added to next week' : 'Use next week'} {actionState === 'saved' ? <Check size={15} /> : <ArrowRight size={15} />}</button>
              <button type="button" onClick={() => chooseAction('ignored')}>{actionState === 'ignored' ? 'Ignored' : 'Not useful'}</button>
            </div>
          </article>
        </div>
      ) : (
        <div className="review-empty-state"><span><CircleDashed size={24} /></span><div><h2>No trustworthy weekly average yet</h2><p>Mark days “Likely complete” after reviewing them. LifeOS will not turn missing or partial records into confident conclusions.</p></div><button type="button" onClick={() => onSelectDay(endDate)}>Review today <ArrowRight size={16} /></button></div>
      )}
      <div className="review-footnote"><Info size={16} /><span><strong>Associations:</strong> no cross-domain insight yet. More sufficiently logged paired nutrition, training, sleep, or body data is required.</span></div>
    </section>
  );
}

function PatternRow({ label, value, status, tone }: { label: string; value: string; status: string; tone: 'positive' | 'attention' | 'neutral' }) {
  return <div className="pattern-row"><div className={`pattern-trend pattern-trend--${tone}`}>{tone === 'positive' ? <ArrowUpRight size={17} /> : tone === 'attention' ? <ArrowDownRight size={17} /> : <CircleDashed size={17} />}</div><div><strong>{label}</strong><span>{value}</span></div><em className={`pattern-status pattern-status--${tone}`}>{status}</em></div>;
}
