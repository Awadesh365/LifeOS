import { useState } from 'react';
import {
  AlertTriangle, Apple, ArrowRight, BarChart3, Bell, BookOpen, CalendarDays,
  Check, ChevronRight, ClipboardList, Database, Download, FileBarChart, Filter,
  HeartHandshake, Info, LayoutDashboard, Leaf, Link2, Lock, Plus, Search,
  Settings2, ShieldCheck, ShoppingBasket, SlidersHorizontal, Sparkles, Target,
  Trash2, UtensilsCrossed, X,
} from 'lucide-react';
import { NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Diet from '../pages/Diet';
import '../nutrition-portal.css';

type NutritionValue = number | null;

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

const NAV_GROUPS = [
  { label: 'Track', items: [['Overview', '', LayoutDashboard], ['Diary', 'diary', BookOpen], ['Coverage', 'history', CalendarDays]] },
  { label: 'Library', items: [['Foods', 'foods', Apple], ['Meals', 'meals', UtensilsCrossed], ['Recipes', 'recipes', ClipboardList]] },
  { label: 'Plan', items: [['Planner', 'planner', CalendarDays], ['Groceries', 'grocery', ShoppingBasket]] },
  { label: 'Understand', items: [['Insights', 'insights', Sparkles], ['Reports', 'reports', FileBarChart], ['Exports', 'exports', Download]] },
  { label: 'Manage', items: [['Targets', 'targets', Target], ['Data', 'data-sources', Database], ['Integrations', 'integrations', Link2], ['Settings', 'settings/preferences', Settings2]] },
] as const;

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) as T : initial; }
    catch { return initial; }
  });
  const persist = (next: T | ((current: T) => T)) => setValue((current) => {
    const result = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
    localStorage.setItem(key, JSON.stringify(result));
    return result;
  });
  return [value, persist] as const;
}

export default function NutritionPortal({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <Header title="Nutrition" subtitle="Track, plan and understand your food without false precision." />
      <div className="nutrition-portal">
        <aside className="nutrition-rail" aria-label="Nutrition navigation">
          <div className="nutrition-rail-brand"><span><Leaf size={17} /></span><div><strong>Nutrition</strong><small>Strategy & planning</small></div></div>
          {NAV_GROUPS.map((group) => <div className="nutrition-nav-group" key={group.label}><span>{group.label}</span>{group.items.map(([label, path, Icon]) => <NavLink key={path || 'overview'} to={`/app/diet${path ? `/${path}` : ''}`} end={!path}><Icon size={16} /><span>{label}</span></NavLink>)}</div>)}
        </aside>
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
  const [customFoods] = useLocalState<FoodItem[]>('lifeos-custom-foods', []);
  const [savedMeals, setSavedMeals] = useLocalState<string[]>('lifeos-saved-meals', []);
  const food = findFood(foodId, customFoods);
  if (!food) return <EmptyState icon={Apple} title="Food not found" body="This item may have been removed from your custom library." action={<button className="portal-secondary" onClick={() => navigate('/app/diet/foods')}>Back to foods</button>} />;
  const saved = savedMeals.includes(food.id);
  return <section className="nutrition-module"><PageHeader eyebrow={`${food.category} · ${food.basis}`} title={food.name} description={food.preparation} action={<button type="button" className="portal-primary" onClick={() => setSavedMeals((current) => saved ? current.filter((id) => id !== food.id) : [...current, food.id])}>{saved ? <Check size={16} /> : <Plus size={16} />}{saved ? 'Saved as meal' : 'Save meal'}</button>} />
    <div className="food-detail-grid"><article className="portal-card"><div className="portal-card-heading"><h2>Nutrition reference</h2><QualityBadge value={food.completeness} /></div><div className="nutrition-reference-grid"><div><span>Energy</span><strong>{food.calories ?? 'Unknown'}{food.calories !== null && ' kcal'}</strong></div><div><span>Protein</span><strong>{food.protein ?? 'Unknown'}{food.protein !== null && ' g'}</strong></div><div><span>Fiber</span><strong>{food.fiber ?? 'Unknown'}{food.fiber !== null && ' g'}</strong></div></div><div className="portal-info"><Info size={16} /><span>{food.calories === null ? 'This is a meal idea, not a nutrition reference. Enter actual ingredients and verified package or database values before analysis.' : `Values use the stated basis: ${food.basis}.`}</span></div></article>
    <article className="portal-card"><h2>Ingredients</h2><div className="ingredient-list">{food.ingredients.map((ingredient) => <span key={ingredient}><Check size={13} />{ingredient}</span>)}</div><p className="portal-body-copy">{food.note}</p></article>
    <article className="portal-card source-panel"><span className="nutrition-eyebrow">Provenance</span><h2>{food.source}</h2><dl><div><dt>Basis</dt><dd>{food.basis}</dd></div><div><dt>Completeness</dt><dd>{food.completeness}</dd></div><div><dt>Preparation</dt><dd>{food.preparation}</dd></div></dl><button className="portal-text-button" type="button" onClick={() => navigate('/app/diet/data-sources/report-issue')}>Report a data issue <ArrowRight size={14} /></button></article></div>
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
  const { recipeId } = useParams(); const navigate = useNavigate(); const [recipes] = useLocalState<FoodItem[]>('lifeos-recipes', []); const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return <EmptyState icon={ClipboardList} title="Recipe not found" body="Create a recipe to start calculating from real ingredients." action={<button className="portal-primary" onClick={() => navigate('/app/diet/recipes/new/edit')}>New recipe</button>} />;
  return <section className="nutrition-module"><PageHeader eyebrow={recipe.basis} title={recipe.name} description="User-created recipe" action={<button className="portal-primary" onClick={() => navigate(`/app/diet/recipes/${recipe.id}/edit`)}>Edit recipe</button>} /><div className="food-detail-grid"><article className="portal-card"><h2>Ingredients</h2><div className="ingredient-list">{recipe.ingredients.map((item) => <span key={item}><Check size={13} />{item}</span>)}</div></article><article className="portal-card"><h2>Nutrition per serving</h2><EmptyState icon={Database} title="Calculation unavailable" body="Ingredient quantities exist, but verified nutrient references have not been linked." /></article></div></section>;
}

function weekDates(baseDate?: string) { const now = baseDate ? new Date(`${baseDate}T12:00:00`) : new Date(); const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7)); return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d.toISOString().slice(0, 10); }); }

function PlannerPage() {
  const { date: routeDate } = useParams(); const validRouteDate = routeDate && /^\d{4}-\d{2}-\d{2}$/.test(routeDate) ? routeDate : undefined; const [plans, setPlans] = useLocalState<PlanItem[]>('lifeos-meal-plans', []); const [picker, setPicker] = useState<{ date: string; slot: string } | null>(null); const [custom] = useLocalState<FoodItem[]>('lifeos-custom-foods', []); const foods = [...FOOD_IDEAS, ...custom]; const days = weekDates(validRouteDate); const slots = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const add = (foodId: string) => { if (!picker) return; setPlans((current) => [...current, { id: `plan-${Date.now()}`, ...picker, foodId }]); setPicker(null); };
  return <section className="nutrition-module"><PageHeader eyebrow="Weekly planner" title="Plan what to eat" description="Planned meals remain separate from actual diary entries until you confirm what you ate." action={<NavLink className="portal-secondary" to="/app/diet/grocery"><ShoppingBasket size={16} /> Grocery list</NavLink>} /><div className="planner-scroll"><div className="planner-grid"><div className="planner-corner">Meal</div>{days.map((date) => <div className="planner-day" key={date}><span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</span><strong>{new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))}</strong></div>)}{slots.map((slot) => <div className="planner-row" key={slot}><strong>{slot}</strong>{days.map((date) => { const item = plans.find((plan) => plan.date === date && plan.slot === slot); const food = findFood(item?.foodId, custom); return <div className="planner-cell" key={`${date}-${slot}`}>{food ? <div className="planned-meal"><span>{food.name}</span><button aria-label={`Remove ${food.name}`} onClick={() => setPlans((current) => current.filter((plan) => plan.id !== item?.id))}><X size={13} /></button></div> : <button type="button" onClick={() => setPicker({ date, slot })}><Plus size={14} /> Add</button>}</div>; })}</div>)}</div></div>{picker && <div className="portal-dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setPicker(null)}><section className="portal-dialog" role="dialog" aria-modal="true" aria-label="Choose a meal"><div className="portal-dialog-head"><div><span className="nutrition-eyebrow">{picker.slot} · {picker.date}</span><h2>Choose something to eat</h2></div><button onClick={() => setPicker(null)} aria-label="Close"><X size={18} /></button></div><div className="meal-picker-list">{foods.filter((food) => food.category === picker.slot || picker.slot === 'Snack' && food.category === 'Snack').map((food) => <button key={food.id} onClick={() => add(food.id)}><span><strong>{food.name}</strong><small>{food.preparation}</small></span><Plus size={16} /></button>)}</div></section></div>}</section>;
}

function GroceryPage() {
  const [plans] = useLocalState<PlanItem[]>('lifeos-meal-plans', []); const [custom] = useLocalState<FoodItem[]>('lifeos-custom-foods', []); const [checked, setChecked] = useLocalState<string[]>('lifeos-grocery-checked', []); const ingredients = [...new Set(plans.flatMap((plan) => findFood(plan.foodId, custom)?.ingredients || []))].sort();
  return <section className="nutrition-module"><PageHeader eyebrow="From your plan" title="Grocery list" description="Ingredients are gathered from planned meals. Quantities stay unspecified when recipes do not provide them." action={ingredients.length ? <button className="portal-secondary" onClick={() => window.print()}><Download size={16} /> Print</button> : undefined} />{ingredients.length ? <div className="grocery-layout"><div className="portal-card grocery-list">{ingredients.map((ingredient) => <label key={ingredient}><input type="checkbox" checked={checked.includes(ingredient)} onChange={() => setChecked((current) => current.includes(ingredient) ? current.filter((v) => v !== ingredient) : [...current, ingredient])} /><span>{ingredient}</span><small>Quantity not specified</small></label>)}</div><aside className="portal-card"><span className="nutrition-eyebrow">Progress</span><h2>{checked.length} of {ingredients.length} collected</h2><p className="portal-body-copy">Check-off state is personal to this device.</p><button className="portal-text-button" onClick={() => setChecked([])}>Clear checks</button></aside></div> : <EmptyState icon={ShoppingBasket} title="Your list is empty" body="Add meals to the weekly planner and their ingredients will appear here." action={<NavLink className="portal-primary" to="/app/diet/planner">Plan meals</NavLink>} />}</section>;
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

function ExportsPage() { return <section className="nutrition-module"><PageHeader eyebrow="Export center" title="Export nutrition data" description="Prepare portable copies of your records. Exports preserve source and completeness fields." /><div className="export-grid">{[['Diary records', 'CSV', 'Meal entries and confirmed values'], ['Food library', 'JSON', 'Custom foods and provenance'], ['Weekly report', 'PDF', 'Printable review with caveats']].map(([name, format, desc]) => <article className="portal-card" key={name}><Download size={20} /><h2>{name}</h2><p>{desc}</p><span>{format}</span><button disabled title="Server-side export is not configured">Export unavailable</button></article>)}</div><div className="portal-info"><Info size={16} /><span>Export generation requires a backend endpoint. No download is simulated.</span></div></section>; }

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
