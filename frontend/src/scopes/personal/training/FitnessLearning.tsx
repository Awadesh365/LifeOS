import { useMemo, useState } from 'react';
import { BookOpen, Check, Search, Sparkles } from 'lucide-react';
import { FITNESS_LESSONS, FITNESS_LESSON_CATEGORIES } from './fitnessLessons';
import '../training/training.css';

const STORAGE_KEY = 'lifeos-fitness-lessons-completed';
const loadCompleted = () => {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []; }
  catch { return []; }
};

export default function FitnessLearning() {
  const [completed, setCompleted] = useState<string[]>(loadCompleted);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const daily = FITNESS_LESSONS[Math.floor(Date.now() / 86_400_000) % FITNESS_LESSONS.length];
  const filtered = useMemo(() => FITNESS_LESSONS.filter((lesson) => (category === 'All' || lesson.category === category)
    && (!search || `${lesson.title} ${lesson.lesson} ${lesson.action} ${lesson.category}`.toLowerCase().includes(search.toLowerCase()))), [category, search]);
  const visible = filtered.slice(page * 12, page * 12 + 12);
  const toggleComplete = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };
  const changeCategory = (value: string) => { setCategory(value); setPage(0); };
  return <section className="fitness-learning">
    <div className="fitness-learning-hero"><div><span className="training-eyebrow">Daily knowledge boosters</span><h1>Learn the why behind your plan</h1><p>Short, original lessons on training, nutrition, recovery, activity, and reading evidence.</p></div><div className="fitness-learning-progress"><strong>{completed.length}<small> / {FITNESS_LESSONS.length}</small></strong><span>lessons completed</span></div></div>
    {daily && <article className="fitness-daily-lesson"><span><Sparkles size={17} /> TODAY&apos;S BOOSTER · {daily.category.toUpperCase()}</span><h2>{daily.title}</h2><p>{daily.lesson}</p><div><strong>Try this:</strong> {daily.action}</div><button type="button" onClick={() => toggleComplete(daily.id)}>{completed.includes(daily.id) ? <><Check size={15} /> Completed</> : <><BookOpen size={15} /> Mark complete</>}</button></article>}
    <div className="fitness-learning-toolbar"><label><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search all lessons…" /></label><span>{filtered.length} lessons</span></div>
    <div className="fitness-learning-categories"><button className={category === 'All' ? 'selected' : ''} onClick={() => changeCategory('All')}>All topics</button>{FITNESS_LESSON_CATEGORIES.map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => changeCategory(item)}>{item}</button>)}</div>
    <div className="fitness-lesson-grid">{visible.map((lesson) => <article className={completed.includes(lesson.id) ? 'completed' : ''} key={lesson.id}><span>{lesson.category}</span><h2>{lesson.title}</h2><p>{lesson.lesson}</p><div><strong>Try this</strong><p>{lesson.action}</p></div><button type="button" onClick={() => toggleComplete(lesson.id)}>{completed.includes(lesson.id) ? <><Check size={14} /> Done</> : 'Mark complete'}</button></article>)}</div>
    {!filtered.length && <div className="library-empty"><Search size={22} /><h2>No lesson matches</h2><p>Try a different phrase or topic.</p></div>}
    {filtered.length > 12 && <div className="fitness-learning-pages"><button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page + 1} of {Math.ceil(filtered.length / 12)}</span><button type="button" disabled={(page + 1) * 12 >= filtered.length} onClick={() => setPage((value) => value + 1)}>Next</button></div>}
    <p className="fitness-learning-note">General education, not medical advice. Get individualized guidance for injuries, health conditions, pregnancy, medication questions, or eating-disorder concerns.</p>
  </section>;
}
