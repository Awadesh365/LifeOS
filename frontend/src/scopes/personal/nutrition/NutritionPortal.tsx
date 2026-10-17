import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, Apple, ArrowRight, BarChart3, Bell, BookOpen, CalendarDays,
  Check, ChevronLeft, ChevronRight, ClipboardList, Database, Download, FileBarChart, Filter,
  Camera, Footprints, HeartHandshake, Info, LayoutDashboard, Link2, Lock, MessageCircle, Plus, Scale, Search,
  Settings2, ShieldCheck, ShoppingBasket, SlidersHorizontal, Sparkles, Target,
  Trash2, UtensilsCrossed, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Diet from '../pages/Diet';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { addDietLog, fetchDiet } from '../../../redux/slices/personalSlice';
import { secureFetch } from '../../../auth/authApi';
import '../nutrition-portal.css';

type NutritionValue = number | null;
type NutritionNavItem = readonly [label: string, path: string, icon: LucideIcon];

interface FoodItem {
  id: string;
  name: string;
  category: string;
  preparation: string;
  basis: string;
  calories: NutritionValue;
  protein: NutritionValue;
  fiber: NutritionValue;
  source: string;
  completeness: 'complete' | 'partial' | 'reference-needed';
  ingredients: string[];
  note: string;
  custom?: boolean;
}

interface PlanItem { id: string; date: string; slot: string; foodId: string; }
type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
interface GroceryPriceEntry { id: string; product: string; store: string; amount: number; currency: string; quantity: string; url: string; recordedAt: string; }

const FOOD_IDEAS: FoodItem[] = [
  { id: 'vegetable-poha', name: 'Vegetable poha', category: 'Breakfast', preparation: 'Poha with peas, carrot, onion, lemon and peanuts', basis: 'One prepared bowl', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['poha', 'peas', 'carrot', 'onion', 'lemon', 'peanuts'], note: 'A quick savory breakfast idea. Confirm ingredients and portions before calculating nutrition.' },
  { id: 'moong-chilla', name: 'Moong dal chilla plate', category: 'Breakfast', preparation: 'Chillas with mint chutney and plain curd', basis: 'One prepared plate', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['moong dal', 'ginger', 'coriander', 'mint', 'plain curd'], note: 'Batch-soak the dal to make this easier on busy mornings.' },
  { id: 'oats-fruit', name: 'Oats, fruit and yogurt bowl', category: 'Breakfast', preparation: 'Rolled oats, plain yogurt, seasonal fruit and seeds', basis: 'One assembled bowl', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['rolled oats', 'plain yogurt', 'seasonal fruit', 'mixed seeds'], note: 'A no-cook option when prepared as overnight oats.' },
  { id: 'dal-rice-sabzi', name: 'Dal, rice and seasonal sabzi', category: 'Lunch', preparation: 'Cooked dal, rice, vegetable sabzi and salad', basis: 'One prepared plate', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['dal', 'rice', 'seasonal vegetables', 'cucumber', 'tomato'], note: 'A flexible everyday plate. Portion and recipe details determine its nutrition.' },
  { id: 'rajma-rice', name: 'Rajma rice bowl', category: 'Lunch', preparation: 'Rajma, rice, onion-cucumber salad and lemon', basis: 'One prepared bowl', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['rajma', 'rice', 'onion', 'cucumber', 'lemon'], note: 'Cook rajma in a larger batch and freeze meal-sized portions.' },
  { id: 'paneer-roti', name: 'Paneer bhurji with roti', category: 'Lunch', preparation: 'Paneer bhurji, whole-wheat roti and crunchy vegetables', basis: 'One prepared plate', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['paneer', 'whole-wheat atta', 'onion', 'tomato', 'capsicum'], note: 'To calculate accurately, use the paneer label and actual oil and roti amounts.' },
  { id: 'chickpea-wrap', name: 'Chickpea salad wrap', category: 'Lunch', preparation: 'Chickpeas, vegetables, yogurt dressing and roti wrap', basis: 'One prepared wrap', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['chickpeas', 'roti', 'plain yogurt', 'lettuce', 'tomato'], note: 'Portable and easy to assemble from cooked chickpeas.' },
  { id: 'khichdi', name: 'Moong dal khichdi', category: 'Dinner', preparation: 'Rice and moong dal khichdi with vegetables and curd', basis: 'One prepared bowl', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['rice', 'moong dal', 'mixed vegetables', 'plain curd'], note: 'A simple one-pot dinner; record the dry ingredients for reliable nutrition.' },
  { id: 'tofu-stir-fry', name: 'Tofu vegetable stir-fry', category: 'Dinner', preparation: 'Tofu and mixed vegetables with rice or noodles', basis: 'One prepared plate', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['tofu', 'broccoli', 'capsicum', 'carrot', 'rice'], note: 'Use the tofu package label as the reference source.' },
  { id: 'egg-roti', name: 'Egg bhurji and roti', category: 'Dinner', preparation: 'Egg bhurji, roti and tomato-cucumber salad', basis: 'One prepared plate', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['eggs', 'whole-wheat atta', 'onion', 'tomato', 'cucumber'], note: 'A fast dinner idea; quantities and cooking fat remain user-confirmed.' },
  { id: 'fruit-nuts', name: 'Fruit with nuts', category: 'Snack', preparation: 'Seasonal fruit with a small handful of nuts', basis: 'One serving', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['seasonal fruit', 'mixed nuts'], note: 'Choose amounts that fit your appetite; no default portion is assumed.' },
  { id: 'roasted-chana', name: 'Roasted chana snack', category: 'Snack', preparation: 'Roasted chana with fruit or chaas', basis: 'One serving', calories: null, protein: null, fiber: null, source: 'Meal idea · nutrition not imported', completeness: 'reference-needed', ingredients: ['roasted chana', 'seasonal fruit', 'chaas'], note: 'Use the package label if you want to add nutrient values.' },
];

const PRIMARY_NAV: readonly NutritionNavItem[] = [
  ['Overview', '', LayoutDashboard], ['Diary', 'diary', BookOpen], ['Meal scan', 'scan', Camera], ['AI coach', 'coach', MessageCircle],
  ['Foods', 'foods', Apple], ['Meals', 'meals', UtensilsCrossed],
  ['Recipes', 'recipes', ClipboardList], ['Planner', 'planner', CalendarDays],
  ['Insights', 'insights', Sparkles],
] as const;

const SECONDARY_NAV: readonly { label: string; items: readonly NutritionNavItem[] }[] = [
  { label: 'Review', items: [['Coverage', 'history', CalendarDays], ['Reports', 'reports', FileBarChart], ['Exports', 'exports', Download]] },
  { label: 'Plan & data', items: [['Groceries', 'grocery', ShoppingBasket], ['Targets', 'targets', Target], ['Body & steps', 'body', Scale], ['Weekly check-in', 'check-in', Footprints], ['Data sources', 'data-sources', Database], ['Data quality', 'data-quality', ShieldCheck]] },
  { label: 'System', items: [['Integrations', 'integrations', Link2], ['Settings', 'settings/preferences', Settings2]] },
] as const;

const NUTRITION_API = import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:3001/api';
const shiftDateByDays = (date: string, days: number) => { const result = new Date(`${date}T12:00:00`); result.setDate(result.getDate() + days); return result.toISOString().slice(0, 10); };

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) as T : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    let active = true;
    const pendingKey = `${key}--pending`;
    const endpoint = `${NUTRITION_API}/diet/records/${encodeURIComponent(key)}`;
    const sync = async () => {
      try {
        const pending = localStorage.getItem(pendingKey);
        if (pending !== null) {
          const response = await secureFetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: JSON.parse(pending) }) });
          if (response.ok) localStorage.removeItem(pendingKey);
          return;
        }
        const response = await secureFetch(endpoint);
        if (!response.ok) return;
        const record = await response.json() as { value: T | null };
        if (record.value !== null && active) {
          setValue(record.value);
          localStorage.setItem(key, JSON.stringify(record.value));
        } else if (record.value === null) {
          const local = localStorage.getItem(key);
          if (local !== null) await secureFetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: JSON.parse(local) }) });
        }
      } catch {
        // Local data remains available and mutations stay queued for the next mount.
      }
    };
    void sync();
    return () => { active = false; };
  }, [key]);
  const persist = (next: T | ((current: T) => T)) => setValue((current) => {
    const result = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
    localStorage.setItem(key, JSON.stringify(result));
    const pendingKey = `${key}--pending`;
    localStorage.setItem(pendingKey, JSON.stringify(result));
    void secureFetch(`${NUTRITION_API}/diet/records/${encodeURIComponent(key)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: result }) })
      .then((response) => { if (response.ok && localStorage.getItem(pendingKey) === JSON.stringify(result)) localStorage.removeItem(pendingKey); })
      .catch(() => undefined);
    return result;
  });
  return [value, persist] as const;
}

export default function NutritionPortal({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <Header hideSearch compactAvatar navigation={<NutritionNavigation />} />
      <div className="nutrition-portal">
        <div className="nutrition-workspace">
          <Routes>
            <Route index element={<Diet isMobile={isMobile} showHeader={false} initialView="overview" />} />
            <Route path="diary" element={<Diet isMobile={isMobile} showHeader={false} initialView="today" />} />
            <Route path="diary/:date" element={<DatedDiary isMobile={isMobile} />} />
            <Route path="history" element={<CoveragePage />} />
            <Route path="foods" element={<FoodLibrary mode="all" />} />
            <Route path="foods/mine" element={<FoodLibrary mode="mine" />} />
            <Route path="foods/custom" element={<CustomFoodEditor />} />
            <Route path="foods/custom/:id" element={<CustomFoodEditor />} />
            <Route path="foods/:foodId" element={<FoodDetail />} />
            <Route path="meals" element={<MealLibrary />} />
            <Route path="meals/:mealId" element={<MealDetail />} />
            <Route path="recipes" element={<RecipeLibrary />} />
            <Route path="recipes/:recipeId/edit" element={<RecipeEditor />} />
            <Route path="recipes/:recipeId" element={<RecipeDetail />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="planner/:date/meal/:id" element={<PlannerPage />} />
            <Route path="planner/:date/meal" element={<PlannerPage />} />
            <Route path="planner/:date" element={<PlannerPage />} />
            <Route path="grocery" element={<GroceryPage />} />
            <Route path="targets" element={<TargetsPage mode="profiles" />} />
            <Route path="targets/:profileId/micronutrients" element={<TargetsPage mode="micronutrients" />} />
            <Route path="targets/:profileId" element={<TargetsPage mode="editor" />} />
            <Route path="insights" element={<InsightsPage section="overview" />} />
            <Route path="insights/macros" element={<InsightsPage section="macros" />} />
            <Route path="insights/micronutrients" element={<InsightsPage section="micronutrients" />} />
            <Route path="insights/nutrient/:key" element={<InsightsPage section="nutrient" />} />
            <Route path="insights/patterns" element={<InsightsPage section="patterns" />} />
            <Route path="scan" element={<MealScannerPage />} />
            <Route path="coach" element={<FitnessCoachPage />} />
            <Route path="body" element={<BodyCompositionPage />} />
            <Route path="check-in" element={<NutritionCheckInPage />} />
            <Route path="reviews/:week" element={<Diet isMobile={isMobile} showHeader={false} initialView="review" />} />
            <Route path="reports" element={<ReportsPage mode="center" />} />
            <Route path="reports/new" element={<ReportsPage mode="builder" />} />
            <Route path="reports/:reportId" element={<ReportsPage mode="preview" />} />
            <Route path="exports" element={<ExportsPage />} />
            <Route path="sharing" element={<SharingPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="integrations/:id" element={<IntegrationDetail />} />
            <Route path="data-sources" element={<DataPage mode="sources" />} />
            <Route path="data-quality" element={<DataPage mode="quality" />} />
            <Route path="data-sources/report-issue" element={<DataPage mode="issue" />} />
            <Route path="settings/notifications" element={<SettingsPage section="notifications" />} />
            <Route path="settings/preferences" element={<SettingsPage section="preferences" />} />
            <Route path="settings/privacy" element={<SettingsPage section="privacy" />} />
            <Route path="settings/delete" element={<SettingsPage section="delete" />} />
            <Route path="settings/audit" element={<SettingsPage section="audit" />} />
            <Route path="settings/safety" element={<SettingsPage section="safety" />} />
            <Route path="*" element={<Navigate to="/app/diet" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function NutritionNavigation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: true });
  const updateScrollState = () => {
    const element = scrollRef.current;
    if (!element) return;
    setScrollState({ left: element.scrollLeft > 2, right: element.scrollLeft + element.clientWidth < element.scrollWidth - 2 });
  };
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    updateScrollState();
    element.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => { element.removeEventListener('scroll', updateScrollState); window.removeEventListener('resize', updateScrollState); };
  }, []);
  const links = [...PRIMARY_NAV, ...SECONDARY_NAV.flatMap((group) => group.items)];
  const scroll = (direction: -1 | 1) => scrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  return (
    <nav className="nutrition-topnav" aria-label="Nutrition navigation">
      <button className="nutrition-scroll-button" type="button" disabled={!scrollState.left} onClick={() => scroll(-1)} aria-label="Scroll nutrition navigation left"><ChevronLeft size={17} /></button>
      <div className="nutrition-topnav-primary" ref={scrollRef}>{links.map(([label, path, Icon]) => <NavLink key={path || 'overview'} to={`/app/diet${path ? `/${path}` : ''}`} end={!path}><Icon size={15} /><span>{label}</span></NavLink>)}</div>
      <button className="nutrition-scroll-button" type="button" disabled={!scrollState.right} onClick={() => scroll(1)} aria-label="Scroll nutrition navigation right"><ChevronRight size={17} /></button>
    </nav>
  );
}

function DatedDiary({ isMobile }: { isMobile: boolean }) {
  const { date } = useParams();
  const validDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  return <Diet isMobile={isMobile} showHeader={false} initialView="today" initialDate={validDate} />;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="nutrition-page-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

function EmptyState({ icon: Icon = Info, title, body, action }: { icon?: typeof Info; title: string; body: string; action?: React.ReactNode }) {
  return <div className="nutrition-portal-empty"><span><Icon size={23} /></span><div><h2>{title}</h2><p>{body}</p></div>{action}</div>;
}

function QualityBadge({ value }: { value: FoodItem['completeness'] }) {
  return <span className={`food-quality food-quality--${value}`}>{value === 'reference-needed' ? 'Nutrition pending' : value}</span>;
}

function FoodLibrary({ mode }: { mode: 'all' | 'mine' }) {
  const navigate = useNavigate();
  const [customFoods] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const foods = mode === 'mine' ? customFoods : [...FOOD_IDEAS, ...customFoods];
  const categories = ['All', ...new Set(foods.map((food) => food.category))];
  const filtered = foods.filter((food) => (category === 'All' || food.category === category) && `${food.name} ${food.preparation} ${food.ingredients.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="nutrition-module">
    <PageHeader eyebrow={mode === 'mine' ? 'Your library' : 'Food database'} title={mode === 'mine' ? 'My foods' : 'Foods and meal ideas'} description={mode === 'mine' ? 'Foods you created with values and source notes you control.' : 'Practical ideas to eat. Nutrition remains unknown until a verified reference or label is attached.'} action={<button className="portal-primary" type="button" onClick={() => navigate('/app/diet/foods/custom')}><Plus size={16} /> Create food</button>} />
    <div className="food-library-links"><NavLink to="/app/diet/foods" end>All ideas</NavLink><NavLink to="/app/diet/foods/mine">My foods</NavLink></div>
    <div className="nutrition-filter-bar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods, meals or ingredients" /></label><label><Filter size={15} /><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>{(query || category !== 'All') && <button type="button" onClick={() => { setQuery(''); setCategory('All'); }}><X size={14} /> Clear</button>}</div>
    {filtered.length ? <div className="food-card-grid">{filtered.map((food) => <button className="food-card" type="button" key={food.id} onClick={() => navigate(`/app/diet/foods/${food.id}`)}><div className="food-card-top"><span className="food-emoji">{food.category === 'Breakfast' ? '☀️' : food.category === 'Snack' ? '🍎' : food.category === 'Dinner' ? '🌙' : '🥗'}</span><QualityBadge value={food.completeness} /></div><h2>{food.name}</h2><p>{food.preparation}</p><div className="food-card-meta"><span>{food.category}</span><span>{food.basis}</span></div><div className="food-nutrients"><span><strong>{food.calories ?? '—'}</strong> kcal</span><span><strong>{food.protein ?? '—'}</strong> protein</span><span><strong>{food.fiber ?? '—'}</strong> fiber</span></div><em>View details <ArrowRight size={14} /></em></button>)}</div> : <EmptyState icon={Apple} title="No foods match" body={mode === 'mine' && !customFoods.length ? 'Create your first food and record values from its package label or another named source.' : 'Change or clear the current filters.'} action={<button className="portal-secondary" type="button" onClick={() => { setQuery(''); setCategory('All'); }}>Reset filters</button>} />}
  </section>;
}

function findFood(id?: string, custom: FoodItem[] = []) { return [...FOOD_IDEAS, ...custom].find((food) => food.id === id); }

function FoodDetail() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [customFoods] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const [savedMeals, setSavedMeals] = useLocalState<string[]>('lifeos-saved-meals', []);
  const [showLog, setShowLog] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [logForm, setLogForm] = useState<{ date: string; mealType: MealSlot }>({ date: new Date().toISOString().slice(0, 10), mealType: 'lunch' });
  const food = findFood(foodId, customFoods);
  if (!food) return <EmptyState icon={Apple} title="Food not found" body="This item may have been removed from your custom library." action={<button className="portal-secondary" onClick={() => navigate('/app/diet/foods')}>Back to foods</button>} />;
  const saved = savedMeals.includes(food.id);
  const logMeal = async () => {
    if (savingLog) return;
    setSavingLog(true);
    try {
      await dispatch(addDietLog({ date: logForm.date, mealType: logForm.mealType, items: food.name, protein: food.protein, calories: food.calories, notes: `${food.preparation} · Source: ${food.source}` })).unwrap();
      setShowLog(false);
      navigate(`/app/diet/diary/${logForm.date}`);
    } finally { setSavingLog(false); }
  };
  return <section className="nutrition-module"><PageHeader eyebrow={`${food.category} · ${food.basis}`} title={food.name} description={food.preparation} action={<div className="portal-header-actions"><button type="button" className="portal-secondary" onClick={() => setSavedMeals((current) => saved ? current.filter((id) => id !== food.id) : [...current, food.id])}>{saved ? <Check size={16} /> : <Plus size={16} />}{saved ? 'Saved' : 'Save meal'}</button><button type="button" className="portal-primary" onClick={() => setShowLog(true)}><BookOpen size={16} /> Log this meal</button></div>} />
    <div className="food-detail-grid"><article className="portal-card"><div className="portal-card-heading"><h2>Nutrition reference</h2><QualityBadge value={food.completeness} /></div><div className="nutrition-reference-grid"><div><span>Energy</span><strong>{food.calories ?? 'Unknown'}{food.calories !== null && ' kcal'}</strong></div><div><span>Protein</span><strong>{food.protein ?? 'Unknown'}{food.protein !== null && ' g'}</strong></div><div><span>Fiber</span><strong>{food.fiber ?? 'Unknown'}{food.fiber !== null && ' g'}</strong></div></div><div className="portal-info"><Info size={16} /><span>{food.calories === null ? 'This is a meal idea, not a nutrition reference. Enter actual ingredients and verified package or database values before analysis.' : `Values use the stated basis: ${food.basis}.`}</span></div></article>
    <article className="portal-card"><h2>Ingredients</h2><div className="ingredient-list">{food.ingredients.map((ingredient) => <span key={ingredient}><Check size={13} />{ingredient}</span>)}</div><p className="portal-body-copy">{food.note}</p></article>
    <article className="portal-card source-panel"><span className="nutrition-eyebrow">Provenance</span><h2>{food.source}</h2><dl><div><dt>Basis</dt><dd>{food.basis}</dd></div><div><dt>Completeness</dt><dd>{food.completeness}</dd></div><div><dt>Preparation</dt><dd>{food.preparation}</dd></div></dl><button className="portal-text-button" type="button" onClick={() => navigate('/app/diet/data-sources/report-issue')}>Report a data issue <ArrowRight size={14} /></button></article></div>
    {showLog && <div className="portal-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowLog(false)}><section className="portal-dialog" role="dialog" aria-modal="true" aria-labelledby="log-food-title"><div className="portal-dialog-head"><div><span className="nutrition-eyebrow">Confirmation required</span><h2 id="log-food-title">Log {food.name}</h2></div><button onClick={() => setShowLog(false)} aria-label="Close"><X size={18} /></button></div><div className="portal-form-grid"><label>Date<input type="date" max={new Date().toISOString().slice(0, 10)} value={logForm.date} onChange={(event) => setLogForm({ ...logForm, date: event.target.value })} /></label><label>Meal<select value={logForm.mealType} onChange={(event) => setLogForm({ ...logForm, mealType: event.target.value as MealSlot })}><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select></label></div><div className="portal-info"><Info size={15} /><span>{food.calories === null || food.protein === null ? 'Unknown nutrients will stay unknown in the diary; they will not be saved as zero.' : `This logs the confirmed reference values for ${food.basis}.`}</span></div><div className="portal-form-actions"><button className="portal-secondary" onClick={() => setShowLog(false)}>Cancel</button><button className="portal-primary" disabled={savingLog || !logForm.date} onClick={logMeal}>{savingLog ? 'Saving…' : 'Confirm meal'}</button></div></section></div>}
  </section>;
}

function CustomFoodEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const existing = foods.find((food) => food.id === id);
  const [form, setForm] = useState({ name: existing?.name || '', category: existing?.category || 'Other', preparation: existing?.preparation || '', basis: existing?.basis || '100 g', calories: existing?.calories?.toString() || '', protein: existing?.protein?.toString() || '', fiber: existing?.fiber?.toString() || '', source: existing?.source || '', ingredients: existing?.ingredients.join(', ') || '', note: existing?.note || '' });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.name.trim() || !form.source.trim()) return;
    const food: FoodItem = { id: existing?.id || `custom-${Date.now()}`, name: form.name.trim(), category: form.category, preparation: form.preparation.trim() || 'Preparation not specified', basis: form.basis.trim(), calories: form.calories === '' ? null : Number(form.calories), protein: form.protein === '' ? null : Number(form.protein), fiber: form.fiber === '' ? null : Number(form.fiber), source: form.source.trim(), completeness: form.calories && form.protein && form.fiber ? 'complete' : 'partial', ingredients: form.ingredients.split(',').map((item) => item.trim()).filter(Boolean), note: form.note.trim(), custom: true };
    setFoods((current) => existing ? current.map((item) => item.id === existing.id ? food : item) : [...current, food]);
    navigate(`/app/diet/foods/${food.id}`);
  };
  return <section className="nutrition-module"><PageHeader eyebrow="Food editor" title={existing ? 'Edit custom food' : 'Create a custom food'} description="Record only values you can trace to a label or named reference. Leave anything unknown blank." />
    <div className="portal-form-card"><div className="portal-form-grid"><label>Name *<input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. My usual paneer" /></label><label>Category<select value={form.category} onChange={(e) => set('category', e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Ingredient</option><option>Other</option></select></label><label className="span-two">Preparation<input value={form.preparation} onChange={(e) => set('preparation', e.target.value)} placeholder="Brand, cooked/raw state or recipe method" /></label><label>Reference basis *<input value={form.basis} onChange={(e) => set('basis', e.target.value)} /></label><label>Source *<input value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="Package label, database and version" /></label><label>Energy (kcal)<input type="number" min="0" value={form.calories} onChange={(e) => set('calories', e.target.value)} /></label><label>Protein (g)<input type="number" min="0" step="0.1" value={form.protein} onChange={(e) => set('protein', e.target.value)} /></label><label>Fiber (g)<input type="number" min="0" step="0.1" value={form.fiber} onChange={(e) => set('fiber', e.target.value)} /></label><label className="span-two">Ingredients, comma separated<input value={form.ingredients} onChange={(e) => set('ingredients', e.target.value)} /></label><label className="span-two">Notes<textarea rows={3} value={form.note} onChange={(e) => set('note', e.target.value)} /></label></div><div className="portal-info"><ShieldCheck size={16} /><span>LifeOS will preserve blank nutrients as unknown. Saving requires a source description.</span></div><div className="portal-form-actions"><button type="button" className="portal-secondary" onClick={() => navigate(-1)}>Cancel</button><button type="button" className="portal-primary" disabled={!form.name.trim() || !form.source.trim()} onClick={save}><Check size={16} /> Save food</button></div></div>
  </section>;
}

function MealLibrary() {
  const navigate = useNavigate();
  const [savedIds] = useLocalState<string[]>('lifeos-saved-meals', []);
  const [custom] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const meals = savedIds.map((id) => findFood(id, custom)).filter(Boolean) as FoodItem[];
  return <section className="nutrition-module"><PageHeader eyebrow="Saved meals" title="Meals you can repeat" description="Save a food idea or a custom meal once, then reuse it without retyping." action={<button className="portal-primary" onClick={() => navigate('/app/diet/foods')}><Plus size={16} /> Find meal ideas</button>} />{meals.length ? <div className="food-card-grid">{meals.map((meal) => <button type="button" className="food-card compact" key={meal.id} onClick={() => navigate(`/app/diet/meals/${meal.id}`)}><span className="food-emoji">🍽️</span><h2>{meal.name}</h2><p>{meal.preparation}</p><em>Edit saved meal <ArrowRight size={14} /></em></button>)}</div> : <EmptyState icon={UtensilsCrossed} title="No saved meals yet" body="Open the food ideas library and save meals you expect to repeat." action={<button className="portal-primary" onClick={() => navigate('/app/diet/foods')}>Browse ideas</button>} />}</section>;
}

function MealDetail() { const { mealId } = useParams(); return <Navigate to={`/app/diet/foods/${mealId || ''}`} replace />; }

function RecipeLibrary() {
  const navigate = useNavigate();
  const [recipes] = useLocalState<FoodItem[]>('lifeos-recipes', []);
  return <section className="nutrition-module"><PageHeader eyebrow="Recipe library" title="Recipes" description="Build recipes from explicit ingredients and keep the calculation basis visible." action={<button className="portal-primary" onClick={() => navigate('/app/diet/recipes/new/edit')}><Plus size={16} /> New recipe</button>} />{recipes.length ? <div className="food-card-grid">{recipes.map((recipe) => <button className="food-card" key={recipe.id} onClick={() => navigate(`/app/diet/recipes/${recipe.id}`)}><span className="food-emoji">📖</span><h2>{recipe.name}</h2><p>{recipe.ingredients.length} ingredients · {recipe.basis}</p><QualityBadge value={recipe.completeness} /></button>)}</div> : <EmptyState icon={ClipboardList} title="No recipes yet" body="Create a recipe and add ingredient references. Missing ingredient values remain unknown." action={<button className="portal-primary" onClick={() => navigate('/app/diet/recipes/new/edit')}>Create recipe</button>} />}</section>;
}

function RecipeEditor() {
  const { recipeId } = useParams(); const navigate = useNavigate(); const [recipes, setRecipes] = useLocalState<FoodItem[]>('lifeos-recipes', []); const existing = recipes.find((item) => item.id === recipeId);
  const [name, setName] = useState(existing?.name || ''); const [ingredients, setIngredients] = useState(existing?.ingredients.join('\n') || ''); const [servings, setServings] = useState(existing?.basis.replace(/\D/g, '') || '4');
  const save = () => { if (!name.trim()) return; const item: FoodItem = { id: existing?.id || `recipe-${Date.now()}`, name: name.trim(), category: 'Recipe', preparation: 'User-created recipe', basis: `${Math.max(1, Number(servings) || 1)} servings`, calories: null, protein: null, fiber: null, source: 'User recipe · ingredients pending references', completeness: 'reference-needed', ingredients: ingredients.split('\n').map((v) => v.trim()).filter(Boolean), note: 'Nutrition is not totaled until every ingredient has a verified value.', custom: true }; setRecipes((current) => existing ? current.map((r) => r.id === existing.id ? item : r) : [...current, item]); navigate(`/app/diet/recipes/${item.id}`); };
  return <section className="nutrition-module"><PageHeader eyebrow="Recipe builder" title={existing ? 'Edit recipe' : 'Create a recipe'} description="List actual ingredient quantities. LifeOS will not infer missing reference values." /><div className="portal-form-card"><div className="portal-form-grid"><label className="span-two">Recipe name<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Servings<input type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} /></label><label className="span-two">Ingredients, one per line<textarea rows={9} value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder={'200 g ingredient\n1 tbsp ingredient'} /></label></div><div className="portal-form-actions"><button className="portal-secondary" onClick={() => navigate(-1)}>Cancel</button><button className="portal-primary" disabled={!name.trim()} onClick={save}>Save recipe</button></div></div></section>;
}

function RecipeDetail() {
  const { recipeId } = useParams(); const navigate = useNavigate(); const [recipes, setRecipes] = useLocalState<FoodItem[]>('lifeos-recipes', []); const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return <EmptyState icon={ClipboardList} title="Recipe not found" body="Create a recipe to start calculating from real ingredients." action={<button className="portal-primary" onClick={() => navigate('/app/diet/recipes/new/edit')}>New recipe</button>} />;
  const duplicate = () => { const copy = { ...recipe, id: `recipe-${Date.now()}`, name: `${recipe.name} copy`, ingredients: [...recipe.ingredients] }; setRecipes((current) => [...current, copy]); navigate(`/app/diet/recipes/${copy.id}`); };
  return <section className="nutrition-module"><PageHeader eyebrow={recipe.basis} title={recipe.name} description="User-created recipe" action={<><button className="portal-secondary" onClick={duplicate}>Duplicate recipe</button><button className="portal-primary" onClick={() => navigate(`/app/diet/recipes/${recipe.id}/edit`)}>Edit recipe</button></>} /><div className="food-detail-grid"><article className="portal-card"><h2>Ingredients</h2><div className="ingredient-list">{recipe.ingredients.map((item) => <span key={item}><Check size={13} />{item}</span>)}</div></article><article className="portal-card"><h2>Nutrition per serving</h2><EmptyState icon={Database} title="Calculation unavailable" body="Ingredient quantities exist, but verified nutrient references have not been linked." /></article></div></section>;
}

function weekDates(baseDate?: string) { const now = baseDate ? new Date(`${baseDate}T12:00:00`) : new Date(); const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7)); return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d.toISOString().slice(0, 10); }); }

function PlannerPage() {
  const { date: routeDate } = useParams(); const validRouteDate = routeDate && /^\d{4}-\d{2}-\d{2}$/.test(routeDate) ? routeDate : undefined; const [plans, setPlans] = useLocalState<PlanItem[]>('lifeos-meal-plans', []); const [picker, setPicker] = useState<{ date: string; slot: string } | null>(null); const [custom] = useLocalState<FoodItem[]>('lifeos-custom-foods', []); const foods = [...FOOD_IDEAS, ...custom]; const days = weekDates(validRouteDate); const slots = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const add = (foodId: string) => { if (!picker) return; setPlans((current) => [...current, { id: `plan-${Date.now()}`, ...picker, foodId }]); setPicker(null); };
  return <section className="nutrition-module"><PageHeader eyebrow="Weekly planner" title="Plan what to eat" description="Planned meals remain separate from actual diary entries until you confirm what you ate." action={<NavLink className="portal-secondary" to="/app/diet/grocery"><ShoppingBasket size={16} /> Grocery list</NavLink>} /><div className="planner-scroll"><div className="planner-grid"><div className="planner-corner">Meal</div>{days.map((date) => <div className="planner-day" key={date}><span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</span><strong>{new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))}</strong></div>)}{slots.map((slot) => <div className="planner-row" key={slot}><strong>{slot}</strong>{days.map((date) => { const item = plans.find((plan) => plan.date === date && plan.slot === slot); const food = findFood(item?.foodId, custom); return <div className="planner-cell" key={`${date}-${slot}`}>{food ? <div className="planned-meal"><span>{food.name}</span><button aria-label={`Remove ${food.name}`} onClick={() => setPlans((current) => current.filter((plan) => plan.id !== item?.id))}><X size={13} /></button></div> : <button type="button" onClick={() => setPicker({ date, slot })}><Plus size={14} /> Add</button>}</div>; })}</div>)}</div></div>{picker && <div className="portal-dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setPicker(null)}><section className="portal-dialog" role="dialog" aria-modal="true" aria-label="Choose a meal"><div className="portal-dialog-head"><div><span className="nutrition-eyebrow">{picker.slot} · {picker.date}</span><h2>Choose something to eat</h2></div><button onClick={() => setPicker(null)} aria-label="Close"><X size={18} /></button></div><div className="meal-picker-list">{foods.filter((food) => food.category === picker.slot || picker.slot === 'Snack' && food.category === 'Snack').map((food) => <button key={food.id} onClick={() => add(food.id)}><span><strong>{food.name}</strong><small>{food.preparation}</small></span><Plus size={16} /></button>)}</div></section></div>}</section>;
}

function GroceryPage() {
  const [plans] = useLocalState<PlanItem[]>('lifeos-meal-plans', []);
  const [custom] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const [checked, setChecked] = useLocalState<string[]>('lifeos-grocery-checked', []);
  const [prices, setPrices] = useLocalState<GroceryPriceEntry[]>('lifeos-grocery-prices', []);
  const [view, setView] = useState<'list' | 'prices'>('list');
  const [form, setForm] = useState({ product: '', store: '', amount: '', currency: 'INR', quantity: '', url: '' });
  const [error, setError] = useState('');
  const ingredients = [...new Set(plans.flatMap((plan) => findFood(plan.foodId, custom)?.ingredients || []))].sort();
  const grouped = prices.reduce<Record<string, GroceryPriceEntry[]>>((all, entry) => { const key = [entry.product.trim().toLowerCase(), entry.quantity.trim().toLowerCase(), entry.currency].join('|'); (all[key] ||= []).push(entry); return all; }, {});
  const addPrice = () => {
    const amount = Number(form.amount);
    if (!form.product.trim() || !form.store.trim() || !Number.isFinite(amount) || amount <= 0) { setError('Enter a product, store, and positive price.'); return; }
    const entry: GroceryPriceEntry = { id: `price-${Date.now()}`, product: form.product.trim(), store: form.store.trim(), amount, currency: form.currency, quantity: form.quantity.trim(), url: form.url.trim(), recordedAt: new Date().toISOString() };
    setPrices((current) => [entry, ...current]); setForm({ ...form, amount: '', url: '' }); setError('');
  };
  return <section className="nutrition-module">
    <PageHeader eyebrow="Plan and compare" title="Groceries" description="Build a list from planned meals and keep a personal history of prices you find at stores." action={view === 'list' && ingredients.length ? <button className="portal-secondary" onClick={() => window.print()}><Download size={16} /> Print list</button> : undefined} />
    <div className="grocery-mode-tabs"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Shopping list</button><button className={view === 'prices' ? 'active' : ''} onClick={() => setView('prices')}>Price tracker · {prices.length}</button></div>
    {view === 'list' && (ingredients.length ? <div className="grocery-layout"><div className="portal-card grocery-list">{ingredients.map((ingredient) => <label key={ingredient}><input type="checkbox" checked={checked.includes(ingredient)} onChange={() => setChecked((current) => current.includes(ingredient) ? current.filter((v) => v !== ingredient) : [...current, ingredient])} /><span>{ingredient}</span><small>Quantity not specified</small></label>)}</div><aside className="portal-card"><span className="nutrition-eyebrow">Progress</span><h2>{checked.length} of {ingredients.length} collected</h2><p className="portal-body-copy">Check-off state syncs to your LifeOS account.</p><button className="portal-text-button" onClick={() => setChecked([])}>Clear checks</button></aside></div> : <EmptyState icon={ShoppingBasket} title="Your list is empty" body="Add meals to the weekly planner and their ingredients will appear here." action={<NavLink className="portal-primary" to="/app/diet/planner">Plan meals</NavLink>} />)}
    {view === 'prices' && <div className="grocery-price-layout">
      <article className="portal-card"><div className="portal-card-heading"><div><span className="nutrition-eyebrow">Personal price watch</span><h2>Record a store price</h2></div><ShoppingBasket size={18} /></div><div className="portal-form-grid">
        <label>Product<input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="e.g. oats, 1 kg" /></label>
        <label>Store<input value={form.store} onChange={(e) => setForm({ ...form, store: e.target.value })} placeholder="Store or retailer" /></label>
        <label>Price<input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
        <label>Currency<select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option value="INR">INR ₹</option><option value="USD">USD $</option><option value="EUR">EUR €</option><option value="GBP">GBP £</option></select></label>
        <label>Package size, optional<input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="1 kg, 6 pack…" /></label>
        <label>Product link, optional<input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></label>
      </div>{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}<button className="portal-primary" onClick={addPrice}>Save price</button><p className="body-source-note">Prices are entered by you and are not live retailer quotes. Compare only the same product, size, and currency.</p></article>
      <div className="grocery-price-history">
        {Object.entries(grouped).map(([key, entries]) => {
          const ordered = [...entries].sort((a, b) => a.amount - b.amount);
          return <article className="portal-card" key={key}>
            <div className="portal-card-heading">
              <div><span className="nutrition-eyebrow">{entries.length} recorded price{entries.length === 1 ? '' : 's'}</span><h2>{entries[0].product} · {entries[0].quantity || 'size unspecified'} · {entries[0].currency}</h2></div>
              <strong>{ordered[0].currency} {ordered[0].amount.toFixed(2)}<small> lowest saved</small></strong>
            </div>
            {entries.map((entry) => <div className="grocery-price-row" key={entry.id}>
              <span><strong>{entry.store}</strong><small>{entry.quantity || 'package size not stated'} · {new Date(entry.recordedAt).toLocaleDateString()}</small></span>
              <strong>{entry.currency} {entry.amount.toFixed(2)}</strong>
              {entry.url && <a href={entry.url} target="_blank" rel="noreferrer">Open</a>}
              <button aria-label={`Delete ${entry.store} price for ${entry.product}`} onClick={() => setPrices((current) => current.filter((item) => item.id !== entry.id))}><Trash2 size={14} /></button>
            </div>)}
          </article>;
        })}
        {!prices.length && <EmptyState icon={Database} title="No saved prices" body="Add store prices to compare your own observations over time." />}
      </div>
    </div>}
  </section>;
}
function CoveragePage() {
  const [coverage] = useLocalState<Record<string, string>>('lifeos-nutrition-coverage', {}); const days = Array.from({ length: 35 }, (_, index) => { const d = new Date(); d.setDate(d.getDate() - (34 - index)); return d.toISOString().slice(0, 10); }); const reviewed = days.filter((date) => coverage[date]).length;
  return <section className="nutrition-module"><PageHeader eyebrow="History" title="Coverage calendar" description="Coverage describes data quality, never food quality." /><div className="coverage-summary"><div><strong>{reviewed}</strong><span>reviewed days</span></div><div><strong>{days.filter((d) => coverage[d] === 'complete').length}</strong><span>likely complete</span></div><div><strong>{days.filter((d) => coverage[d] === 'partial').length}</strong><span>partial</span></div></div><div className="coverage-calendar">{days.map((date) => <NavLink to={`/app/diet/diary/${date}`} key={date} className={`coverage-date coverage-date--${coverage[date] || 'unknown'}`}><span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</span><strong>{new Date(`${date}T12:00:00`).getDate()}</strong><small>{coverage[date]?.replace('-', ' ') || 'Not reviewed'}</small></NavLink>)}</div></section>;
}

function TargetsPage({ mode }: { mode: 'profiles' | 'editor' | 'micronutrients' }) {
  const [targets, setTargets] = useLocalState('lifeos-nutrition-targets', { calories: 2100, protein: 130 }); const navigate = useNavigate();
  if (mode === 'micronutrients') return <section className="nutrition-module"><PageHeader eyebrow="Target profile" title="Micronutrient targets" description="No micronutrient targets are inferred from age, sex, condition or goals." /><EmptyState icon={Target} title="No reference standard selected" body="A future source-backed integration can add micronutrient reference ranges. Manual diary entries currently do not contain the data needed to use them." /></section>;
  return <section className="nutrition-module"><PageHeader eyebrow="Targets and profiles" title={mode === 'editor' ? 'Edit default profile' : 'Nutrition targets'} description="Targets provide context. They are not pass/fail rules or medical recommendations." action={mode === 'profiles' ? <button className="portal-primary" onClick={() => navigate('/app/diet/targets/default')}>Edit profile</button> : undefined} /><div className="target-profile-card"><div><span className="nutrition-eyebrow">Active profile</span><h2>Default context</h2><p>Manually configured · no clinical source</p></div><label>Energy context <span><input type="number" min="0" value={targets.calories} onChange={(e) => setTargets({ ...targets, calories: Math.max(0, Number(e.target.value)) })} /> kcal</span></label><label>Protein context <span><input type="number" min="0" value={targets.protein} onChange={(e) => setTargets({ ...targets, protein: Math.max(0, Number(e.target.value)) })} /> g</span></label><NavLink to="/app/diet/targets/default/micronutrients">Manage micronutrients <ChevronRight size={15} /></NavLink></div></section>;
}

const INSIGHT_META = {
  overview: ['Insights overview', 'Evidence-aware observations across your sufficiently logged nutrition records.'], macros: ['Energy and macro trends', 'Compare recorded energy and protein with historical target context.'], micronutrients: ['Micronutrient adequacy', 'Review nutrients only when structured food references make the calculation possible.'], nutrient: ['Nutrient contributors', 'See which recorded foods contribute to a selected nutrient.'], patterns: ['Meal patterns and adherence', 'Understand recurring meal timing and planning patterns without judging foods.'],
};
function InsightsPage({ section }: { section: keyof typeof INSIGHT_META }) {
  const { key } = useParams(); const meta = INSIGHT_META[section]; const title = section === 'nutrient' && key ? `${key[0].toUpperCase()}${key.slice(1)} contributors` : meta[0];
  return <section className="nutrition-module"><PageHeader eyebrow="Analysis" title={title} description={meta[1]} /><div className="insight-navigation"><NavLink to="/app/diet/insights/macros">Macros</NavLink><NavLink to="/app/diet/insights/micronutrients">Micronutrients</NavLink><NavLink to="/app/diet/insights/patterns">Meal patterns</NavLink></div>{section === 'macros' ? <div className="portal-card"><h2>Available series</h2><div className="pattern-table"><div><span>Energy</span><strong>From confirmed diary values</strong><em>Available</em></div><div><span>Protein</span><strong>From confirmed diary values</strong><em>Available</em></div><div><span>Carbohydrate</span><strong>Not captured</strong><em>Unknown</em></div><div><span>Fat</span><strong>Not captured</strong><em>Unknown</em></div></div></div> : <EmptyState icon={BarChart3} title={section === 'overview' || section === 'patterns' ? 'More reliable days are needed' : 'Structured nutrient data is unavailable'} body={section === 'overview' || section === 'patterns' ? 'Mark representative days likely complete before LifeOS draws pattern-level conclusions.' : 'Manual meal logs contain energy and protein only. Missing nutrients remain unknown rather than becoming zeros.'} />}</section>;
}

function ReportsPage({ mode }: { mode: 'center' | 'builder' | 'preview' }) {
  const navigate = useNavigate(); const [reports, setReports] = useLocalState<Array<{ id: string; name: string; period: string; sections: string[] }>>('lifeos-nutrition-reports', []); const [name, setName] = useState('Weekly nutrition review'); const [sections, setSections] = useState(['Energy and protein', 'Data completeness']); const { reportId } = useParams(); const report = reports.find((r) => r.id === reportId);
  if (mode === 'builder') { const create = () => { const next = { id: `report-${Date.now()}`, name: name.trim(), period: 'Last 7 days', sections }; setReports([...reports, next]); navigate(`/app/diet/reports/${next.id}`); }; return <section className="nutrition-module"><PageHeader eyebrow="Report builder" title="Build a nutrition report" description="Choose a period and include caveats alongside every analysis." /><div className="portal-form-card"><div className="portal-form-grid"><label className="span-two">Report name<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Period<select><option>Last 7 days</option><option>Last 30 days</option><option>Custom range</option></select></label><fieldset className="span-two"><legend>Sections</legend>{['Energy and protein', 'Data completeness', 'Meal patterns', 'Micronutrients'].map((item) => <label key={item}><input type="checkbox" checked={sections.includes(item)} onChange={() => setSections((current) => current.includes(item) ? current.filter((v) => v !== item) : [...current, item])} />{item}</label>)}</fieldset></div><div className="portal-form-actions"><button className="portal-primary" disabled={!name.trim() || !sections.length} onClick={create}>Create preview</button></div></div></section>; }
  if (mode === 'preview') return <section className="nutrition-module"><PageHeader eyebrow="Report preview" title={report?.name || 'Report unavailable'} description={report?.period || 'This report could not be found.'} action={report && <button className="portal-secondary" onClick={() => window.print()}><Download size={16} /> Print / PDF</button>} />{report ? <div className="report-preview">{report.sections.map((section) => <article className="portal-card" key={section}><h2>{section}</h2><p>Report data uses confirmed diary records in the selected period.</p><div className="portal-info"><Info size={15} /><span>Missing and partial days are not interpreted as zero intake.</span></div></article>)}</div> : <EmptyState title="Report not found" body="Return to the reports center and create a new report." />}</section>;
  return <section className="nutrition-module"><PageHeader eyebrow="Reports center" title="Nutrition reports" description="Create reviewable, export-safe summaries with limitations included." action={<button className="portal-primary" onClick={() => navigate('/app/diet/reports/new')}><Plus size={16} /> New report</button>} />{reports.length ? <div className="portal-list">{reports.map((r) => <button key={r.id} onClick={() => navigate(`/app/diet/reports/${r.id}`)}><FileBarChart size={18} /><span><strong>{r.name}</strong><small>{r.period} · {r.sections.length} sections</small></span><ChevronRight size={16} /></button>)}</div> : <EmptyState icon={FileBarChart} title="No reports created" body="Build a report when you want to review or share a period." />}</section>;
}

type BodyCheckIn = { date: string; weightKg: number | null; waistCm: number | null; bodyFatPct: number | null; steps: number | null };
type CoachMessage = { role: 'user' | 'assistant'; text: string; at: string };

type ScannedLabel = {
  productName: string; servingSize: string | null; basis: 'per_100g' | 'per_100ml' | 'per_serving' | 'unknown';
  nutrients: { caloriesKcal: number | null; proteinGrams: number | null; carbohydrateGrams: number | null; fatGrams: number | null; fiberGrams: number | null; sugarsGrams: number | null; sodiumMg: number | null };
  ingredients: string[]; allergens: string[]; confidence: string; assumptions: string[];
};
type ScannedProduct = { found: boolean; barcode: string; name?: string; brands?: string; quantity?: string; servingSize?: string; ingredients?: string; allergens?: string[]; nutritionGrade?: string | null; imageUrl?: string | null; nutrientsPer100g?: ScannedLabel['nutrients'] & { saltGrams?: number | null }; source?: string; sourceUrl?: string; license?: string };

function MealScannerPage() {
  const dispatch = useAppDispatch();
  const [, setSavedFoods] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mealType, setMealType] = useState<MealSlot>('lunch');
  const [mode, setMode] = useState<'meal' | 'barcode' | 'label'>('meal');
  const [image, setImage] = useState('');
  const [fileName, setFileName] = useState('');
  const [estimate, setEstimate] = useState<{ mealName: string; visibleItems: string[]; calories: number | null; proteinGrams: number | null; confidence: string; assumptions: string[] } | null>(null);
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [label, setLabel] = useState<ScannedLabel | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const cameraTimer = useRef<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const stopCamera = () => {
    if (cameraTimer.current !== null) window.clearInterval(cameraTimer.current);
    cameraTimer.current = null;
    cameraStream.current?.getTracks().forEach((track) => track.stop());
    cameraStream.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };
  useEffect(() => () => {
    if (cameraTimer.current !== null) window.clearInterval(cameraTimer.current);
    cameraStream.current?.getTracks().forEach((track) => track.stop());
  }, []);
  const prepareImage = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use a JPEG, PNG, or WebP photo.');
    const source = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Could not read this photo.')); reader.readAsDataURL(file); });
    const picture = await new Promise<HTMLImageElement>((resolve, reject) => { const next = new Image(); next.onload = () => resolve(next); next.onerror = () => reject(new Error('Could not decode this photo.')); next.src = source; });
    const scale = Math.min(1, 1600 / Math.max(picture.width, picture.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(picture.width * scale)); canvas.height = Math.max(1, Math.round(picture.height * scale));
    const context = canvas.getContext('2d'); if (!context) throw new Error('Photo processing is unavailable in this browser.');
    context.drawImage(picture, 0, 0, canvas.width, canvas.height);
    const output = canvas.toDataURL('image/jpeg', 0.78); if (output.length > 7_000_000) throw new Error('This photo is too large after compression. Choose a smaller image.');
    return output;
  };
  const scanMeal = async () => {
    if (!image) { setError('Choose a meal photo first.'); return; }
    setBusy(true); setError(''); setEstimate(null); setSaved(false);
    try { const response = await secureFetch(`${NUTRITION_API}/diet/scan-meal`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || payload.message || 'Meal scan failed'); setEstimate(payload); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Meal scan failed.'); }
    finally { setBusy(false); }
  };
  const scanLabel = async () => {
    if (!image) { setError('Choose a clear photo of the nutrition label first.'); return; }
    setBusy(true); setError(''); setLabel(null); setSaved(false);
    try { const response = await secureFetch(`${NUTRITION_API}/diet/scan-label`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || payload.message || 'Label scan failed'); setLabel(payload); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Label scan failed.'); }
    finally { setBusy(false); }
  };
  const lookupBarcode = async (code = barcode) => {
    const clean = code.replace(/\s+/g, '');
    if (!/^\d{8,14}$/.test(clean)) { setError('Enter a valid barcode with 8–14 digits.'); return; }
    stopCamera(); setBusy(true); setError(''); setProduct(null); setBarcode(clean); setSaved(false);
    try { const response = await secureFetch(`${NUTRITION_API}/diet/products/${encodeURIComponent(clean)}`); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || payload.message || 'Product lookup failed'); setProduct(payload); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Product lookup failed.'); }
    finally { setBusy(false); }
  };
  const startBarcodeCamera = async () => {
    const Detector = (window as unknown as { BarcodeDetector?: new (options?: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) { setError('Camera barcode reading is unavailable in this browser. Enter the barcode digits instead.'); return; }
    try {
      setError(''); setCameraOn(true);
      cameraStream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (!videoRef.current) throw new Error('Camera preview is unavailable.');
      videoRef.current.srcObject = cameraStream.current;
      await videoRef.current.play();
      const detector = new Detector({ formats: ['ean_8', 'ean_13', 'upc_a', 'upc_e', 'itf', 'code_128'] });
      cameraTimer.current = window.setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2 || busy) return;
        try { const [result] = await detector.detect(videoRef.current); if (result?.rawValue) void lookupBarcode(result.rawValue); }
        catch { /* Keep scanning; an undecodable frame is normal. */ }
      }, 450);
    } catch (cause) { stopCamera(); setError(cause instanceof Error ? cause.message : 'Camera access failed. Enter the barcode digits instead.'); }
  };
  const addFood = (name: string, calories: number | null, protein: number | null, fiber: number | null, basis: string, source: string, ingredients: string[]) => {
    if (calories === null && protein === null && fiber === null) { setError('There are no confirmed nutrition values to save yet.'); return; }
    const item: FoodItem = { id: `scanned-${Date.now()}`, name: name.trim() || 'Scanned food', category: 'Packaged food', preparation: 'Nutrition values saved from a label scan.', basis, calories, protein, fiber, source, completeness: fiber === null ? 'partial' : 'complete', ingredients, note: 'Check the package, serving size, and values before logging.' , custom: true };
    setSavedFoods((current) => [item, ...current]); setSaved(true); setError('');
  };
  const saveMeal = async () => {
    if (!estimate) return;
    setBusy(true); setError('');
    try { await dispatch(addDietLog({ date, mealType, items: estimate.mealName, calories: estimate.calories, protein: estimate.proteinGrams, notes: `User-confirmed AI photo estimate (${estimate.confidence} confidence). Visible items: ${estimate.visibleItems.join(', ')}. Assumptions: ${estimate.assumptions.join('; ')}` })).unwrap(); setSaved(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save meal to diary.'); }
    finally { setBusy(false); }
  };
  const productNutrients = product?.nutrientsPer100g;
  return <section className="nutrition-module"><PageHeader eyebrow="Food capture" title="Scan food & nutrition" description="Estimate a meal, look up a packaged food barcode, or read an international nutrition label. Review all scanned values before saving." />
    <div className="nutrition-scan-modes" role="tablist" aria-label="Food scanner type"><button className={mode === 'meal' ? 'active' : ''} onClick={() => { setMode('meal'); setError(''); }}><Camera size={15} /> Meal photo</button><button className={mode === 'barcode' ? 'active' : ''} onClick={() => { setMode('barcode'); stopCamera(); setError(''); }}><Search size={15} /> Barcode lookup</button><button className={mode === 'label' ? 'active' : ''} onClick={() => { setMode('label'); setError(''); }}><Apple size={15} /> Nutrition label</button></div>
    {mode === 'meal' && <div className="ai-tool-grid"><article className="portal-card ai-scan-card"><div className="ai-tool-heading"><Camera size={20} /><div><h2>Meal photo estimate</h2><p>Photos are sent to your configured backend AI provider for analysis.</p></div></div><label className="ai-photo-picker">{image ? <img src={image} alt="Selected meal preview" /> : <span><Camera size={24} />Choose or take a photo</span>}<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; setFileName(file.name); setEstimate(null); setLabel(null); setError(''); void prepareImage(file).then(setImage).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not prepare photo.')); }} /></label>{fileName && <small className="ai-photo-name">{fileName}</small>}<div className="ai-scan-fields"><label>Date<input type="date" max={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Meal<select value={mealType} onChange={(e) => setMealType(e.target.value as MealSlot)}><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select></label></div><button className="portal-primary" type="button" disabled={busy || !image} onClick={() => void scanMeal()}>{busy ? 'Working…' : 'Estimate meal'}</button>{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}</article>
      {estimate && <article className="portal-card ai-estimate-card"><div className="portal-card-heading"><div><span className="nutrition-eyebrow">{estimate.confidence} confidence · estimate only</span><h2>Review before logging</h2></div><span className="food-quality food-quality--partial">Confirm</span></div><label>Meal name<input value={estimate.mealName} onChange={(e) => setEstimate({ ...estimate, mealName: e.target.value })} /></label><div className="ai-estimate-macros"><label>Calories<input type="number" min="0" value={estimate.calories ?? ''} onChange={(e) => setEstimate({ ...estimate, calories: e.target.value === '' ? null : Number(e.target.value) })} /> kcal</label><label>Protein<input type="number" min="0" value={estimate.proteinGrams ?? ''} onChange={(e) => setEstimate({ ...estimate, proteinGrams: e.target.value === '' ? null : Number(e.target.value) })} /> g</label></div><h3>Visible items</h3><p>{estimate.visibleItems.length ? estimate.visibleItems.join(', ') : 'No ingredients identified'}</p>{!!estimate.assumptions.length && <div className="portal-info"><Info size={15} /><span>{estimate.assumptions.join(' · ')}</span></div>}<p className="ai-estimate-caveat">Photo estimates can be substantially wrong when portions, ingredients, or cooking fats are hidden. Correct the values first.</p><button className="portal-primary" type="button" disabled={busy || saved} onClick={() => void saveMeal()}>{saved ? 'Added to diary' : busy ? 'Saving…' : 'Confirm and add to diary'}</button>{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}</article>}</div>}
    {mode === 'barcode' && <div className="barcode-scan-layout"><article className="portal-card"><div className="ai-tool-heading"><Search size={20} /><div><h2>Packaged food lookup</h2><p>Read the package barcode or type its digits to check the Open Food Facts product database.</p></div></div><label className="barcode-input">Barcode<input inputMode="numeric" autoComplete="off" value={barcode} maxLength={14} placeholder="8–14 digit barcode" onChange={(event) => { setBarcode(event.target.value.replace(/\D/g, '')); setProduct(null); }} /></label><div className="barcode-actions"><button type="button" className="portal-primary" disabled={busy || barcode.length < 8} onClick={() => void lookupBarcode()}>{busy ? 'Looking up…' : 'Look up barcode'}</button><button type="button" className="portal-secondary" disabled={busy || cameraOn} onClick={() => void startBarcodeCamera()}>Scan with camera</button>{cameraOn && <button type="button" className="portal-secondary" onClick={stopCamera}>Stop camera</button>}</div>{cameraOn && <video className="barcode-camera-preview" ref={videoRef} muted playsInline />}{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}<p className="body-source-note">Product data is community-contributed and may be incomplete. Check the physical package before using values.</p></article>
      {product && <article className="portal-card barcode-product-result">{product.found ? <><div className="portal-card-heading"><div><span className="nutrition-eyebrow">Barcode {product.barcode} · per 100 g</span><h2>{product.name}</h2></div>{product.nutritionGrade && <strong className="product-grade">{product.nutritionGrade}</strong>}</div>{product.brands && <p>{product.brands}</p>}<div className="barcode-nutrient-grid">{[['Energy', productNutrients?.caloriesKcal, 'kcal'], ['Protein', productNutrients?.proteinGrams, 'g'], ['Carbohydrate', productNutrients?.carbohydrateGrams, 'g'], ['Fat', productNutrients?.fatGrams, 'g'], ['Fiber', productNutrients?.fiberGrams, 'g'], ['Sugars', productNutrients?.sugarsGrams, 'g']].map(([name, value, unit]) => <div key={String(name)}><span>{name}</span><strong>{value ?? '—'}{value !== null && value !== undefined ? ` ${unit}` : ''}</strong></div>)}</div><p>{product.ingredients || 'Ingredients not available in this database entry.'}</p>{!!product.allergens?.length && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>Listed allergens: {product.allergens.join(', ')}. This community record is not an allergy-safety guarantee.</span></div>}<div className="portal-info"><Database size={15} /><span>Source: <a href={product.sourceUrl} target="_blank" rel="noreferrer">Open Food Facts</a> · {product.license}</span></div><button type="button" className="portal-primary" disabled={saved || productNutrients?.caloriesKcal == null && productNutrients?.proteinGrams == null} onClick={() => addFood(product.name || 'Scanned product', productNutrients?.caloriesKcal ?? null, productNutrients?.proteinGrams ?? null, productNutrients?.fiberGrams ?? null, 'Per 100 g', `${product.source} barcode ${product.barcode}`, product.ingredients ? [product.ingredients] : [])}>{saved ? 'Saved to Foods' : 'Save to Foods'}</button></> : <><h2>Product not found</h2><p>We did not find barcode {product.barcode}. Try the nutrition-label scanner or add a custom food from the package.</p><a href="https://world.openfoodfacts.org/cgi/product.pl" target="_blank" rel="noreferrer">Contribute the product to Open Food Facts</a></>}</article>}</div>}
    {mode === 'label' && <div className="ai-tool-grid"><article className="portal-card ai-scan-card"><div className="ai-tool-heading"><Apple size={20} /><div><h2>International nutrition label reader</h2><p>Photograph the nutrition panel clearly. Keep the serving basis and package visible.</p></div></div><label className="ai-photo-picker">{image ? <img src={image} alt="Selected food label preview" /> : <span><Camera size={24} />Choose or take a label photo</span>}<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; setFileName(file.name); setLabel(null); setError(''); void prepareImage(file).then(setImage).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not prepare photo.')); }} /></label>{fileName && <small className="ai-photo-name">{fileName}</small>}<button className="portal-primary" type="button" disabled={busy || !image} onClick={() => void scanLabel()}>{busy ? 'Reading label…' : 'Read nutrition label'}</button>{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}</article>
      {label && <article className="portal-card ai-estimate-card"><div className="portal-card-heading"><div><span className="nutrition-eyebrow">{label.confidence} confidence · {label.basis.replace(/_/g, ' ')}</span><h2>Review transcription</h2></div></div><label>Product name<input value={label.productName} onChange={(event) => setLabel({ ...label, productName: event.target.value })} /></label><label>Serving size<input value={label.servingSize || ''} placeholder="Not stated" onChange={(event) => setLabel({ ...label, servingSize: event.target.value || null })} /></label><div className="barcode-nutrient-grid">{([['caloriesKcal', 'Energy (kcal)'], ['proteinGrams', 'Protein (g)'], ['carbohydrateGrams', 'Carbohydrate (g)'], ['fatGrams', 'Fat (g)'], ['fiberGrams', 'Fiber (g)'], ['sugarsGrams', 'Sugars (g)'], ['sodiumMg', 'Sodium (mg)']] as const).map(([key, title]) => <label key={key}>{title}<input type="number" min="0" step="0.1" value={label.nutrients[key] ?? ''} onChange={(event) => setLabel({ ...label, nutrients: { ...label.nutrients, [key]: event.target.value === '' ? null : Number(event.target.value) } })} /></label>)}</div><div className="portal-info"><Info size={15} /><span>Basis: {label.basis.replace(/_/g, ' ')}. {label.assumptions.join(' · ') || 'Verify every value, unit, and serving basis against the package.'}</span></div>{!!label.allergens.length && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>Listed allergens: {label.allergens.join(', ')}. Always read the original package if allergies matter.</span></div>}<button type="button" className="portal-primary" disabled={saved || label.nutrients.caloriesKcal === null && label.nutrients.proteinGrams === null} onClick={() => addFood(label.productName, label.nutrients.caloriesKcal, label.nutrients.proteinGrams, label.nutrients.fiberGrams, `${label.basis.replace(/_/g, ' ')}${label.servingSize ? ` · ${label.servingSize}` : ''}`, `User-confirmed AI label transcription (${label.confidence} confidence)`, label.ingredients)}>{saved ? 'Saved to Foods' : 'Confirm and save to Foods'}</button></article>}</div>}
    <div className="portal-info ai-privacy-note"><ShieldCheck size={16} /><span>Meal and label photos are sent to your configured backend AI provider only when you start a scan; LifeOS does not save the photo. Barcode lookups go to Open Food Facts. Scanned values are suggestions and need package-label verification.</span></div>
  </section>;
}
function FitnessCoachPage() {
  const [messages, setMessages] = useLocalState<CoachMessage[]>('lifeos-nutrition-action-coach-history', []);
  const [question, setQuestion] = useState(''); const [context, setContext] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const ask = async (event: React.FormEvent) => {
    event.preventDefault(); const prompt = question.trim(); if (!prompt || busy) return;
    setBusy(true); setError(''); setMessages((current) => [...current, { role: 'user' as const, text: prompt, at: new Date().toISOString() }].slice(-20)); setQuestion('');
    try { const response = await secureFetch(`${NUTRITION_API}/diet/fitness-assistant`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: prompt, context }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error || payload.message || 'Assistant request failed'); setMessages((current) => [...current, { role: 'assistant' as const, text: payload.answer, at: new Date().toISOString() }].slice(-20)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Assistant request failed.'); }
    finally { setBusy(false); }
  };
  return <section className="nutrition-module"><PageHeader eyebrow="Learning support" title="Fitness & nutrition assistant" description="Ask for general explanations about training or nutrition. Share only context you want sent to your configured AI provider." action={messages.length > 0 ? <button className="portal-secondary" type="button" onClick={() => setMessages([])}><Trash2 size={15} /> Clear chat</button> : undefined} /><div className="coach-workspace"><div className="coach-messages">{messages.length ? messages.map((message, index) => <article className={`coach-message coach-message--${message.role}`} key={`${message.at}-${index}`}><span>{message.role === 'user' ? 'You' : 'LifeOS assistant'}</span><p>{message.text}</p></article>) : <div className="nutrition-portal-empty"><span><MessageCircle size={22} /></span><div><h2>Start with a question</h2><p>Ask about workout structure, exercise concepts, protein basics, or how to read your logged trends.</p></div></div>}{busy && <article className="coach-message coach-message--assistant"><span>LifeOS assistant</span><p>Thinking…</p></article>}</div><form className="coach-form" onSubmit={(event) => void ask(event)}><label>Optional context to share<textarea rows={2} value={context} onChange={(e) => setContext(e.target.value)} placeholder="For example: home equipment, a movement you want to understand…" /></label><label>Your question<textarea rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What would you like to understand?" /></label><div className="portal-info"><ShieldCheck size={15} /><span>General education only. Not a diagnosis or substitute for a qualified professional. Chat is stored in this browser and synced to your LifeOS account.</span></div>{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}<button className="portal-primary" disabled={busy || !question.trim()} type="submit">{busy ? 'Sending…' : 'Ask assistant'} <ArrowRight size={15} /></button></form></div></section>;
}

function BodyCompositionPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [entries, setEntries] = useLocalState<BodyCheckIn[]>('lifeos-fitness-body-checkins', []);
  const [stepGoal, setStepGoal] = useLocalState<number>('lifeos-fitness-step-goal', 8000);
  const [form, setForm] = useState({ date: today, weight: '', waist: '', bodyFat: '', steps: '' });
  const [error, setError] = useState('');
  const save = () => {
    const weight = form.weight === '' ? null : Number(form.weight); const waist = form.waist === '' ? null : Number(form.waist); const bodyFat = form.bodyFat === '' ? null : Number(form.bodyFat); const steps = form.steps === '' ? null : Number(form.steps);
    if (weight !== null && (!Number.isFinite(weight) || weight < 20 || weight > 500)) { setError('Enter a body weight between 20 and 500 kg.'); return; }
    if (weight === null && waist === null && bodyFat === null && steps === null) { setError('Enter at least one measurement or step count.'); return; }
    if (waist !== null && (!Number.isFinite(waist) || waist < 20 || waist > 300)) { setError('Enter a waist measurement between 20 and 300 cm.'); return; }
    if (bodyFat !== null && (!Number.isFinite(bodyFat) || bodyFat < 1 || bodyFat > 75)) { setError('Enter a body-fat percentage between 1 and 75.'); return; }
    if (steps !== null && (!Number.isFinite(steps) || steps < 0 || steps > 200000)) { setError('Enter a step count between 0 and 200,000.'); return; }
    const next: BodyCheckIn = { date: form.date, weightKg: weight, waistCm: waist, bodyFatPct: bodyFat, steps: steps === null ? null : Math.round(steps) };
    setEntries((current) => [...current.filter((item) => item.date !== next.date), next].sort((a, b) => a.date.localeCompare(b.date)));
    setForm({ ...form, weight: '', waist: '', bodyFat: '', steps: '' }); setError('');
  };
  const current = entries.filter((item) => item.date <= today).sort((a, b) => a.date.localeCompare(b.date));
  const weightEntries = current.filter((item) => item.weightKg !== null);
  const latest = weightEntries[weightEntries.length - 1];
  const baseline = weightEntries.find((item) => item.date <= shiftDateByDays(today, -21));
  const possibleRecomp = !!baseline && !!latest && typeof baseline.weightKg === 'number' && typeof latest.weightKg === 'number' && baseline !== latest && baseline.waistCm !== null && latest.waistCm !== null
    && Math.abs((latest.weightKg - baseline.weightKg) / baseline.weightKg) <= 0.01
    && (latest.waistCm - baseline.waistCm) / baseline.waistCm <= -0.01;
  const recentSteps = current.filter((item) => item.steps !== null && item.date >= shiftDateByDays(today, -6));
  const avgSteps = recentSteps.length ? Math.round(recentSteps.reduce((sum, item) => sum + Number(item.steps), 0) / recentSteps.length) : null;
  return <section className="nutrition-module"><PageHeader eyebrow="Body and activity trends" title="Measurements & daily steps" description="Track consistent measurements and activity goals. The trend view describes patterns in your entries; it cannot measure muscle or body fat directly." />
    <div className="body-overview-grid"><article className="portal-card"><span className="nutrition-eyebrow">Latest check-in</span><strong className="body-big-number">{latest && typeof latest.weightKg === 'number' ? `${latest.weightKg.toFixed(1)} kg` : '—'}</strong><span>{latest ? `Logged ${latest.date}` : 'Add a check-in to begin'}</span></article><article className="portal-card"><span className="nutrition-eyebrow">Step goal</span><label className="body-goal-control"><input type="number" min="1000" max="50000" step="500" value={stepGoal} onChange={(e) => setStepGoal(Math.min(50000, Math.max(1000, Number(e.target.value))))} /> steps / day</label><span>{avgSteps === null ? 'No recent step entries' : `${avgSteps.toLocaleString()} average across ${recentSteps.length} logged days`}</span></article></div>
    {possibleRecomp && <div className="portal-info body-recomp-note"><Sparkles size={17} /><span><strong>Possible recomposition pattern:</strong> your logged weight is broadly stable while waist measurement decreased over at least three weeks. Tape placement and measurement variation matter; this is not proof of muscle gain or fat loss.</span></div>}
    <div className="body-checkin-layout"><article className="portal-card"><div className="portal-card-heading"><div><span className="nutrition-eyebrow">Manual check-in</span><h2>Log measurements</h2></div><Scale size={18} /></div><div className="body-form-grid"><label>Date<input type="date" max={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>Weight (kg)<input type="number" min="20" max="500" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required /></label><label>Waist (cm), optional<input type="number" min="20" max="300" step="0.1" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} /></label><label>Body-fat %, optional<input type="number" min="1" max="75" step="0.1" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} /></label><label>Steps, optional<input type="number" min="0" max="200000" step="1" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} /></label></div>{error && <div className="portal-info portal-info--warning"><AlertTriangle size={15} /><span>{error}</span></div>}<button type="button" className="portal-primary" onClick={save}><Check size={15} /> Save check-in</button><p className="body-source-note">Steps can be entered manually. Direct Apple Health and Google Fit sync requires a native integration and account credentials that are not configured in this web app.</p></article>
      <article className="portal-card"><div className="portal-card-heading"><div><span className="nutrition-eyebrow">Recorded history</span><h2>Recent measurements</h2></div><Footprints size={18} /></div><div className="body-entry-list">{current.slice().reverse().slice(0, 30).map((item) => <div key={item.date}><span><strong>{item.date}</strong><small>{item.waistCm ? `waist ${item.waistCm} cm` : item.bodyFatPct ? `${item.bodyFatPct}% body fat` : item.steps !== null ? `${Number(item.steps).toLocaleString()} steps` : 'check-in'}</small></span><strong>{item.weightKg !== null ? `${item.weightKg.toFixed(1)} kg` : item.steps !== null ? `${Number(item.steps).toLocaleString()} steps` : '—'}</strong><button type="button" aria-label={`Delete measurement for ${item.date}`} onClick={() => setEntries((all) => all.filter((entry) => entry.date !== item.date))}><Trash2 size={14} /></button></div>)}{!current.length && <p className="body-source-note">Your saved check-ins will appear here.</p>}</div></article></div>
  </section>;
}

function NutritionCheckInPage() {
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.personal.diet);
  const [entries] = useLocalState<BodyCheckIn[]>('lifeos-fitness-body-checkins', []);
  const [coverage] = useLocalState<Record<string, string>>('lifeos-nutrition-coverage', {});
  const [targets, setTargets] = useLocalState('lifeos-nutrition-targets', { calories: 2100, protein: 130 });
  const [lastAdjustment, setLastAdjustment] = useLocalState('lifeos-nutrition-last-adjustment', '');
  const [goal, setGoal] = useLocalState<'lose' | 'maintain' | 'gain'>('lifeos-nutrition-checkin-goal', 'maintain');
  const today = new Date().toISOString().slice(0, 10);
  useEffect(() => { void dispatch(fetchDiet(today)); }, [dispatch, today]);
  const recent = entries.filter((entry) => entry.date <= today);
  const weightEntries = recent.filter((entry) => entry.weightKg !== null);
  const average = (from: string, to: string) => { const selected = weightEntries.filter((item) => item.date >= from && item.date <= to); return selected.length >= 3 ? selected.reduce((sum, item) => sum + Number(item.weightKg), 0) / selected.length : null; };
  const currentWeight = average(shiftDateByDays(today, -6), today);
  const previousWeight = average(shiftDateByDays(today, -13), shiftDateByDays(today, -7));
  const recentDays = Array.from({ length: 7 }, (_, index) => shiftDateByDays(today, index - 6));
  const previousDays = Array.from({ length: 7 }, (_, index) => shiftDateByDays(today, index - 13));
  const completeDays = recentDays.filter((date) => coverage[date] === 'complete');
  const previousCompleteDays = previousDays.filter((date) => coverage[date] === 'complete');
  const caloriesByDay = new Map<string, number>();
  history.forEach((log) => { if (log.calories !== null) caloriesByDay.set(log.date, (caloriesByDay.get(log.date) || 0) + log.calories); });
  const loggedDayCalories = completeDays.map((date) => caloriesByDay.get(date)).filter((value): value is number => value !== undefined);
  const calorieAverage = loggedDayCalories.length >= 4 ? Math.round(loggedDayCalories.reduce((sum, value) => sum + value, 0) / loggedDayCalories.length) : null;
  const previousLoggedCalories = previousCompleteDays.map((date) => caloriesByDay.get(date)).filter((value): value is number => value !== undefined);
  const previousCalorieAverage = previousLoggedCalories.length >= 4 ? Math.round(previousLoggedCalories.reduce((sum, value) => sum + value, 0) / previousLoggedCalories.length) : null;
  const changePct = currentWeight !== null && previousWeight !== null ? ((currentWeight - previousWeight) / previousWeight) * 100 : null;
  let finding = 'Log at least three body-weight check-ins in both weeks and mark four or more recent nutrition days likely complete to review a trend.';
  if (changePct !== null) {
    const trending = goal === 'lose' ? changePct <= -0.25 : goal === 'gain' ? changePct >= 0.25 : Math.abs(changePct) < 0.25;
    finding = trending ? 'Your logged weight trend is moving in the direction you selected. Review the next weekly average before changing your target.' : 'The recent trend is outside the selected direction. If both weeks are logged consistently, a small target adjustment may be worth trying.';
  }
  const enoughData = changePct !== null && calorieAverage !== null && previousCalorieAverage !== null && completeDays.length >= 4 && previousCompleteDays.length >= 4;
  const change = enoughData && changePct !== null ? goal === 'lose' ? changePct > -0.25 ? -100 : changePct < -1 ? 100 : 0 : goal === 'gain' ? changePct < 0.1 ? 100 : changePct > 0.5 ? -100 : 0 : changePct > 0.25 ? -100 : changePct < -0.25 ? 100 : 0 : 0;
  const weekKey = weekDates(today)[0];
  const suggestedCalories = Math.min(4000, Math.max(1200, Math.round((targets.calories + change) / 50) * 50));
  const canApplySuggestion = enoughData && change !== 0 && suggestedCalories !== targets.calories && lastAdjustment !== weekKey;
  return <section className="nutrition-module"><PageHeader eyebrow="Weekly review" title="Nutrition check-in" description="Review your logged intake and weight trend together. When both weeks are complete, LifeOS suggests a small change for you to accept or ignore." />
    <article className="portal-card checkin-card"><div className="checkin-goal-row"><label>What are you tracking toward?<select value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}><option value="lose">Weight reduction</option><option value="maintain">Weight maintenance</option><option value="gain">Weight gain</option></select></label><span>Current manual target: <strong>{targets.calories.toLocaleString()} kcal</strong></span></div><div className="checkin-stat-grid"><div><small>Current 7-day weight average</small><strong>{currentWeight === null ? 'Not enough data' : `${currentWeight.toFixed(1)} kg`}</strong></div><div><small>Previous 7-day average</small><strong>{previousWeight === null ? 'Not enough data' : `${previousWeight.toFixed(1)} kg`}</strong></div><div><small>Weight change</small><strong>{changePct === null ? '—' : `${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%`}</strong></div><div><small>Recorded calorie average</small><strong>{calorieAverage === null ? 'Not enough complete days' : `${calorieAverage.toLocaleString()} kcal`}</strong></div></div><div className="checkin-guidance"><Sparkles size={19} /><div><span className="nutrition-eyebrow">Weekly adjustment</span><p>{finding}</p></div></div>{canApplySuggestion ? <div className="checkin-suggestion"><div><strong>Suggested target: {suggestedCalories.toLocaleString()} kcal/day</strong><p>{change > 0 ? 'Increase' : 'Decrease'} by 100 kcal/day based on two weeks of recorded weight and food data.</p></div><button className="portal-primary" onClick={() => { setTargets({ ...targets, calories: suggestedCalories }); setLastAdjustment(weekKey); }}>Apply suggestion</button></div> : !enoughData ? <div className="portal-info"><Info size={15} /><span>A suggestion appears after at least four complete diary days and three weigh-ins in each of both weeks. Incomplete logs stay unknown.</span></div> : <div className="portal-info"><Check size={15} /><span>{lastAdjustment === weekKey ? 'This week’s adjustment is saved. Review again next week.' : 'Your current weekly trend is within the selected range; no change suggested.'}</span></div>}<div className="portal-info"><Info size={15} /><span>Weight varies with hydration, digestion, and measurement timing. This conservative suggestion is optional, is not medical advice, and is limited to one change per week. Seek professional guidance for medical, pregnancy, or eating-disorder contexts.</span></div></article>
    <div className="portal-card checkin-data-card"><h2>Data used in this review</h2><p>{completeDays.length} of the last 7 days marked likely complete · {loggedDayCalories.length} days with calorie entries · {weightEntries.filter((entry) => entry.date >= shiftDateByDays(today, -13)).length} body-weight entries in the last 14 days.</p><NavLink className="portal-secondary" to="/app/diet/body">Log weight and steps <ArrowRight size={15} /></NavLink><NavLink className="portal-secondary" to="/app/diet/diary">Review nutrition diary <ArrowRight size={15} /></NavLink></div>
  </section>;
}

function downloadTextFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: unknown) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function ExportsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { history, loading } = useAppSelector((state) => state.personal.diet);
  const [customFoods] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  useEffect(() => { if (!history.length) void dispatch(fetchDiet(new Date().toISOString().slice(0, 10))); }, [dispatch, history.length]);
  const exportDiary = () => {
    const headings = ['date', 'meal_type', 'items', 'protein_g', 'energy_kcal', 'notes'];
    const rows = history.map((log) => [log.date, log.mealType, log.items, log.protein, log.calories, log.notes].map(csvCell).join(','));
    downloadTextFile(`lifeos-nutrition-diary-${new Date().toISOString().slice(0, 10)}.csv`, [headings.join(','), ...rows].join('\n'), 'text/csv;charset=utf-8');
  };
  const exportFoods = () => downloadTextFile(`lifeos-food-library-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), foods: [...FOOD_IDEAS, ...customFoods] }, null, 2), 'application/json');
  return <section className="nutrition-module"><PageHeader eyebrow="Export center" title="Export nutrition data" description="Prepare portable copies of your records. Exports preserve source and completeness fields." /><div className="export-grid"><article className="portal-card"><Download size={20} /><h2>Diary records</h2><p>Meal entries and confirmed values. Unknown nutrient cells remain blank.</p><span>CSV</span><button disabled={loading || !history.length} onClick={exportDiary}>{loading ? 'Loading…' : history.length ? `Export ${history.length} records` : 'No records to export'}</button></article><article className="portal-card"><Download size={20} /><h2>Food library</h2><p>Meal ideas, custom foods, nutrient completeness and provenance.</p><span>JSON</span><button onClick={exportFoods}>Export {FOOD_IDEAS.length + customFoods.length} foods</button></article><article className="portal-card"><Download size={20} /><h2>Weekly report</h2><p>Printable review with its evidence and caveats included.</p><span>PDF via print</span><button onClick={() => navigate('/app/diet/reports')}>Choose report</button></article></div><div className="portal-info"><ShieldCheck size={16} /><span>Files are generated locally in your browser. Nothing is uploaded to create these exports.</span></div></section>;
}

function SharingPage() { const [enabled, setEnabled] = useLocalState('lifeos-nutrition-sharing', false); return <section className="nutrition-module"><PageHeader eyebrow="Permissions" title="Sharing" description="Control whether nutrition reports can be shared outside your account." /><div className="settings-stack"><SettingToggle icon={HeartHandshake} title="Allow report sharing" body="Creates permission for future share links; it does not publish existing data." checked={enabled} onChange={setEnabled} /><div className="portal-card"><h2>People with access</h2><p className="portal-body-copy">No one else has access.</p></div></div></section>; }

const INTEGRATIONS = [{ id: 'food-database', name: 'Food reference database', body: 'Import verified nutrient references and version metadata.' }, { id: 'health-platform', name: 'Health platform', body: 'Read supported body and activity context with explicit permission.' }, { id: 'grocery-service', name: 'Grocery service', body: 'Send reviewed grocery items to an external list.' }];
function IntegrationsPage() { return <section className="nutrition-module"><PageHeader eyebrow="Connections" title="Integrations" description="No service receives nutrition data until you explicitly connect it." /><div className="integration-grid">{INTEGRATIONS.map((item) => <NavLink className="portal-card" key={item.id} to={`/app/diet/integrations/${item.id}`}><Link2 size={20} /><h2>{item.name}</h2><p>{item.body}</p><span>Not connected <ChevronRight size={14} /></span></NavLink>)}</div></section>; }
function IntegrationDetail() { const { id } = useParams(); const item = INTEGRATIONS.find((value) => value.id === id); return <section className="nutrition-module"><PageHeader eyebrow="Integration detail" title={item?.name || 'Integration'} description={item?.body || 'This integration is unavailable.'} /><div className="portal-card"><span className="status-pill">Not connected</span><h2>Sync is off</h2><p className="portal-body-copy">Connection credentials and provider capability are not configured in this project. No data has been sent.</p><button className="portal-primary" disabled>Connect unavailable</button></div></section>; }

function DataPage({ mode }: { mode: 'sources' | 'quality' | 'issue' }) {
  const navigate = useNavigate(); const [issues, setIssues] = useLocalState<Array<{ id: string; field: string; note: string }>>('lifeos-nutrition-data-issues', []); const [field, setField] = useState('Nutrition value'); const [note, setNote] = useState('');
  if (mode === 'issue') return <section className="nutrition-module"><PageHeader eyebrow="Data quality" title="Report a source issue" description="Record the affected field and what looks wrong. This does not silently replace the source value." /><div className="portal-form-card"><div className="portal-form-grid"><label>Issue type<select value={field} onChange={(e) => setField(e.target.value)}><option>Nutrition value</option><option>Serving basis</option><option>Source or version</option><option>Food identity</option></select></label><label className="span-two">Details<textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} /></label></div><div className="portal-form-actions"><button className="portal-primary" disabled={!note.trim()} onClick={() => { setIssues([...issues, { id: `${Date.now()}`, field, note }]); navigate('/app/diet/data-quality'); }}>Submit issue</button></div></div></section>;
  if (mode === 'quality') return <section className="nutrition-module"><PageHeader eyebrow="Completeness" title="Data quality" description="Quality refers to the record, not the food or the person." /><div className="coverage-summary"><div><strong>{FOOD_IDEAS.length}</strong><span>ideas awaiting references</span></div><div><strong>{issues.length}</strong><span>reported issues</span></div><div><strong>0</strong><span>silent substitutions</span></div></div><div className="portal-card"><h2>Known limitations</h2><div className="pattern-table"><div><span>Meal ideas</span><strong>No nutrient estimates</strong><em>Expected</em></div><div><span>Diary</span><strong>Energy and protein only</strong><em>Partial schema</em></div><div><span>Micronutrients</span><strong>Not captured</strong><em>Unknown</em></div></div></div></section>;
  return <section className="nutrition-module"><PageHeader eyebrow="Provenance" title="Data sources" description="See which sources contribute to nutrition calculations and where coverage is incomplete." /><div className="food-library-links"><NavLink to="/app/diet/data-sources" end>Sources</NavLink><NavLink to="/app/diet/data-quality">Data quality</NavLink><NavLink to="/app/diet/integrations">Integrations</NavLink></div><div className="source-grid"><article className="portal-card"><Database size={20} /><h2>Manual diary</h2><p>User-confirmed energy and protein values.</p><dl><div><dt>Method</dt><dd>Manual entry</dd></div><div><dt>Version</dt><dd>Current record</dd></div><div><dt>Coverage</dt><dd>Partial</dd></div></dl></article><article className="portal-card"><Apple size={20} /><h2>Meal ideas</h2><p>Planning inspiration with no imported nutrient reference.</p><dl><div><dt>Method</dt><dd>Curated idea</dd></div><div><dt>Nutrition</dt><dd>Unknown</dd></div><div><dt>Coverage</dt><dd>Reference needed</dd></div></dl></article></div><button className="portal-text-button" onClick={() => navigate('/app/diet/data-sources/report-issue')}>Report source issue <ArrowRight size={14} /></button></section>;
}

const SETTINGS_NAV = [['Notifications', 'notifications'], ['Units & display', 'preferences'], ['Privacy', 'privacy'], ['Safety', 'safety'], ['Audit history', 'audit'], ['Delete data', 'delete']];
function SettingsPage({ section }: { section: string }) {
  const [prefs, setPrefs] = useLocalState('lifeos-nutrition-preferences', { reminders: false, units: 'metric', compact: false, research: false }); const [confirm, setConfirm] = useState('');
  return <section className="nutrition-module"><PageHeader eyebrow="Nutrition settings" title={SETTINGS_NAV.find((item) => item[1] === section)?.[0] || 'Settings'} description="Settings apply to nutrition data and displays in this browser." /><div className="settings-layout"><nav>{SETTINGS_NAV.map(([label, path]) => <NavLink key={path} to={`/app/diet/settings/${path}`}>{label}<ChevronRight size={14} /></NavLink>)}</nav><div className="settings-stack">
    {section === 'notifications' && <><SettingToggle icon={Bell} title="Weekly review reminder" body="Keep reminders off until a notification service is connected." checked={prefs.reminders} onChange={(value) => setPrefs({ ...prefs, reminders: value })} /><div className="portal-info"><Info size={15} /><span>Browser notification delivery is not configured; this saves your preference only.</span></div></>}
    {section === 'preferences' && <><div className="portal-card setting-row"><SlidersHorizontal size={19} /><div><h2>Units</h2><p>Choose how editable food values are displayed.</p></div><select value={prefs.units} onChange={(e) => setPrefs({ ...prefs, units: e.target.value })}><option value="metric">Metric</option><option value="mixed">Mixed</option></select></div><SettingToggle icon={LayoutDashboard} title="Compact tables" body="Reduce table row spacing on larger screens." checked={prefs.compact} onChange={(value) => setPrefs({ ...prefs, compact: value })} /></>}
    {section === 'privacy' && <><div className="portal-card"><Lock size={20} /><h2>Local planning data</h2><p className="portal-body-copy">Custom foods, plans, groceries, reports and preferences are currently stored in this browser. Diary records use the LifeOS backend.</p></div><NavLink className="portal-secondary fit" to="/app/diet/sharing">Review sharing permissions</NavLink></>}
    {section === 'safety' && <><div className="portal-card safety-card"><ShieldCheck size={22} /><h2>Safety boundaries are active</h2><ul><li>No automatic calorie or nutrient prescription.</li><li>No moral labels for foods.</li><li>No fabricated reference values.</li><li>No inference of medical suitability, allergies or dietary restrictions.</li></ul></div><SettingToggle icon={Sparkles} title="Allow research participation" body="Preference only; no research upload exists in this app." checked={prefs.research} onChange={(value) => setPrefs({ ...prefs, research: value })} /></>}
    {section === 'audit' && <div className="portal-card"><h2>Local data history</h2><div className="pattern-table"><div><span>Custom foods</span><strong>Saved in browser storage</strong><em>Current</em></div><div><span>Plans and groceries</span><strong>Saved in browser storage</strong><em>Current</em></div><div><span>Diary</span><strong>Backend is authoritative</strong><em>Current</em></div></div></div>}
    {section === 'delete' && <div className="portal-card danger-zone"><AlertTriangle size={22} /><h2>Delete local nutrition planning data</h2><p>This clears custom foods, recipes, meal plans, reports and nutrition preferences from this browser. It does not delete backend diary entries.</p><label>Type DELETE to enable<input value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label><button disabled={confirm !== 'DELETE'} onClick={() => { ['lifeos-custom-foods', 'lifeos-recipes', 'lifeos-meal-plans', 'lifeos-nutrition-reports', 'lifeos-nutrition-preferences'].forEach((key) => localStorage.removeItem(key)); window.location.reload(); }}><Trash2 size={15} /> Delete local planning data</button></div>}
  </div></div></section>;
}

function SettingToggle({ icon: Icon, title, body, checked, onChange }: { icon: typeof Info; title: string; body: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="portal-card setting-toggle"><Icon size={19} /><span><strong>{title}</strong><small>{body}</small></span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><i /></label>; }
