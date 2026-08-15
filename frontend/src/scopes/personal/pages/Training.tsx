import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, BookOpen, Check, ChevronLeft,
  ChevronRight, Clock3, Dumbbell, History, Info, Pause, Play, Search,
  Settings2, ShieldAlert, Sparkles, Target, TimerReset, TrendingUp, Trophy, X,
} from 'lucide-react';
import Header from '../components/Header';
import { trainingApi } from '../training/api';
import type {
  Exercise, PerformedSet, ProgramExercise, ProgressionDecision, TodayTraining,
  TrainingProfile, TrainingProgram, TrainingReview, TrainingView,
} from '../training/types';
import '../training/training.css';

interface TrainingProps { isMobile?: boolean; }

const todayIso = () => new Date().toISOString().slice(0, 10);
const dateShift = (date: string, days: number) => {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};
const formatDate = (date: string) => new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const titleCase = (value: string) => value.split('_').join(' ').replace(/\b\w/g, (character: string) => character.toUpperCase());

const emptyToday: TodayTraining = { program: null, workout: null, activeSession: null, previousByExercise: {} };

export default function Training({ isMobile = false }: TrainingProps) {
  const [view, setView] = useState<TrainingView>('today');
  const [date, setDate] = useState(todayIso());
  const [today, setToday] = useState<TodayTraining>(emptyToday);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [review, setReview] = useState<TrainingReview | null>(null);
  const [profile, setProfile] = useState<TrainingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const range = useMemo(() => ({ from: dateShift(date, -27), to: date }), [date]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [todayData, programData, exerciseData, reviewData, profileData] = await Promise.all([
        trainingApi.getToday(date), trainingApi.listPrograms(), trainingApi.listExercises(),
        trainingApi.getReview(range.from, range.to), trainingApi.getProfile(),
      ]);
      setToday(todayData);
      setPrograms(programData);
      setExercises(exerciseData);
      setReview(reviewData);
      setProfile(profileData);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Training data could not be loaded');
    } finally { setLoading(false); }
  }, [date, range.from, range.to]);

  useEffect(() => { void loadData(); }, [loadData]);

  const openExercise = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    try { setSelectedExercise(await trainingApi.getExercise(exercise.id)); } catch { /* list data remains useful */ }
  };

  return (
    <>
      <Header title="Training" subtitle="Plan deliberately. Execute simply. Progress when the evidence supports it." />
      <main className={`training-page ${isMobile ? 'training-page--mobile' : ''}`}>
        <div className="training-commandbar">
          <div className="training-tabs" role="tablist" aria-label="Training views">
            <Tab active={view === 'today'} onClick={() => setView('today')} icon={<Dumbbell size={16} />} label="Today" />
            <Tab active={view === 'program'} onClick={() => setView('program')} icon={<Target size={16} />} label="Program" />
            <Tab active={view === 'exercises'} onClick={() => setView('exercises')} icon={<BookOpen size={16} />} label="Exercises" />
            <Tab active={view === 'progress'} onClick={() => setView('progress')} icon={<BarChart3 size={16} />} label="Progress" />
          </div>
          <div className="training-command-actions">
            <div className="training-date-nav">
              <button type="button" onClick={() => setDate(dateShift(date, -1))} aria-label="Previous day"><ChevronLeft size={17} /></button>
              <label><input type="date" value={date} max={todayIso()} onChange={(event) => setDate(event.target.value)} /><span>{date === todayIso() ? 'Today' : formatDate(date)}</span></label>
              <button type="button" disabled={date === todayIso()} onClick={() => setDate(dateShift(date, 1))} aria-label="Next day"><ChevronRight size={17} /></button>
            </div>
            <button className="training-settings-button" type="button" onClick={() => setShowSettings(true)} aria-label="Training profile settings"><Settings2 size={17} /></button>
          </div>
        </div>

        {error && <div className="training-banner training-banner--error"><AlertTriangle size={17} /><span><strong>Training API unavailable.</strong> {error}</span><button type="button" onClick={() => void loadData()}>Retry</button></div>}
        {loading && <div className="training-loading"><span /> Loading training context…</div>}

        {view === 'today' && <TodayView data={today} date={date} profile={profile} onRefresh={loadData} onOpenExercise={openExercise} />}
        {view === 'program' && <ProgramView programs={programs} onActivate={async (id) => { await trainingApi.activateProgram(id); await loadData(); }} onOpenExercise={openExercise} />}
        {view === 'exercises' && <ExerciseLibrary exercises={exercises} onOpenExercise={openExercise} />}
        {view === 'progress' && <ProgressView review={review} />}
      </main>
      {selectedExercise && <ExerciseDetail exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
      {showSettings && <TrainingSettings profile={profile} onClose={() => setShowSettings(false)} onSave={async (next) => { await trainingApi.updateProfile(next); setShowSettings(false); await loadData(); }} />}
    </>
  );
}

function Tab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button type="button" className={active ? 'active' : ''} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function TodayView({ data, date, profile, onRefresh, onOpenExercise }: {
  data: TodayTraining; date: string; profile: TrainingProfile | null; onRefresh: () => Promise<void>; onOpenExercise: (exercise: Exercise) => void;
}) {
  const [starting, setStarting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const workout = data.workout;
  const session = data.activeSession;

  useEffect(() => {
    if (!workout || !session) return;
    const next = workout.exercises.findIndex((item) => session.sets.filter((set) => set.programExerciseId === item.id && set.setType === 'working').length < item.targetSets);
    setActiveIndex(next < 0 ? workout.exercises.length - 1 : next);
  }, [session, workout]);

  if (!workout) return (
    <section className="training-empty-state"><span><Target size={27} /></span><div><h1>No active training program</h1><p>Activate a program before LifeOS decides what belongs in today’s session.</p></div></section>
  );

  const start = async () => {
    setStarting(true);
    try { await trainingApi.startSession(workout.id, date); await onRefresh(); } finally { setStarting(false); }
  };

  if (!session) return (
    <section className="workout-preview-layout">
      <article className="workout-hero-card">
        <span className="training-eyebrow">{data.program?.name} · {formatDate(date)}</span>
        <h1>{workout.name}</h1>
        <p>{workout.description}</p>
        <div className="workout-hero-stats">
          <div><Dumbbell size={17} /><span><strong>{workout.exercises.length}</strong> exercises</span></div>
          <div><Clock3 size={17} /><span><strong>~{profile?.minutesPerSession || 60}</strong> minutes</span></div>
          <div><Target size={17} /><span><strong>{workout.exercises.reduce((sum, item) => sum + item.targetSets, 0)}</strong> working sets</span></div>
        </div>
        <button className="training-primary-action" type="button" onClick={start} disabled={starting}><Play size={18} fill="currentColor" /> {starting ? 'Starting…' : 'Start workout'}</button>
      </article>
      <article className="workout-plan-card">
        <div className="training-section-heading"><div><span className="training-eyebrow">Today’s plan</span><h2>Comparable movements, clear intent</h2></div><span>{workout.exercises.length} movements</span></div>
        <div className="workout-plan-list">
          {workout.exercises.map((item, index) => <button type="button" key={item.id} onClick={() => onOpenExercise(item.exercise)}><i>{index + 1}</i><div><strong>{item.exercise.name}</strong><span>{item.targetSets} × {item.repMin}–{item.repMax} · {item.targetRir} RIR</span></div><em>{Math.floor(item.restSeconds / 60)}:{String(item.restSeconds % 60).padStart(2, '0')} rest</em><ArrowRight size={16} /></button>)}
        </div>
      </article>
    </section>
  );

  const active = workout.exercises[activeIndex];
  const completedExercises = workout.exercises.filter((item) => session.sets.filter((set) => set.programExerciseId === item.id && set.setType === 'working').length >= item.targetSets).length;

  return <WorkoutExecution
    workoutName={workout.name} exercises={workout.exercises} active={active} activeIndex={activeIndex}
    sessionId={session.id} sets={session.sets || []} previous={data.previousByExercise[active.exerciseId] || []}
    completedExercises={completedExercises} profile={profile} onSelect={setActiveIndex} onRefresh={onRefresh}
    onOpenExercise={onOpenExercise}
  />;
}

function WorkoutExecution({ workoutName, exercises, active, activeIndex, sessionId, sets, previous, completedExercises, profile, onSelect, onRefresh, onOpenExercise }: {
  workoutName: string; exercises: ProgramExercise[]; active: ProgramExercise; activeIndex: number; sessionId: string; sets: PerformedSet[];
  previous: Array<PerformedSet & { session?: { date: string } }>; completedExercises: number; profile: TrainingProfile | null;
  onSelect: (index: number) => void; onRefresh: () => Promise<void>; onOpenExercise: (exercise: Exercise) => void;
}) {
  const activeSets = sets.filter((set) => set.programExerciseId === active.id);
  const last = activeSets[activeSets.length - 1] || previous[0];
  const [load, setLoad] = useState(last?.actualLoad || 0);
  const [reps, setReps] = useState(active.repMin);
  const [rir, setRir] = useState<number | ''>(active.targetRir);
  const [technique, setTechnique] = useState('good');
  const [painOpen, setPainOpen] = useState(false);
  const [painScore, setPainScore] = useState(0);
  const [painLocation, setPainLocation] = useState('');
  const [safetyMessage, setSafetyMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [restElapsed, setRestElapsed] = useState(0);
  const [resting, setResting] = useState(activeSets.length > 0);
  const [progression, setProgression] = useState<ProgressionDecision | null>(null);
  const [displayExercise, setDisplayExercise] = useState(active.exercise);
  const [swapOpen, setSwapOpen] = useState(false);

  useEffect(() => {
    const matchingSets = sets.filter((set) => set.programExerciseId === active.id);
    const newest = matchingSets[matchingSets.length - 1] || previous[0];
    setLoad(newest?.actualLoad || 0); setReps(active.repMin); setRir(active.targetRir); setTechnique('good'); setPainScore(0); setPainLocation(''); setRestElapsed(0); setResting(false); setDisplayExercise(active.exercise); setSwapOpen(false);
    trainingApi.getExercise(active.exerciseId).then((exercise) => setDisplayExercise(exercise)).catch(() => undefined);
  }, [active, previous, sets]);

  useEffect(() => {
    trainingApi.getProgression(displayExercise.id, active.id).then(setProgression).catch(() => setProgression(null));
  }, [active.id, displayExercise.id]);

  useEffect(() => {
    if (!resting) return;
    const timer = window.setInterval(() => setRestElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [resting]);

  const completeSet = async () => {
    setSaving(true);
    try {
      const result = await trainingApi.logSet(sessionId, {
        programExerciseId: active.id, exerciseId: displayExercise.id, actualLoad: load, actualReps: reps,
        actualRir: rir === '' ? null : rir, restSeconds: restElapsed || null,
        techniqueQuality: technique, painScore, painLocation: painLocation || null,
      });
      if (result.safety) setSafetyMessage(result.safety.message);
      setPainOpen(false); setRestElapsed(0); setResting(true); await onRefresh();
    } finally { setSaving(false); }
  };

  const finish = async () => { await trainingApi.completeSession(sessionId, {}); await onRefresh(); };
  const previousLabel = previous.length ? previous.map((set) => `${set.actualLoad}${profile?.loadUnit || 'kg'} × ${set.actualReps}`).join(', ') : 'No comparable exposure yet';

  return (
    <section className="execution-layout">
      <aside className="execution-queue">
        <div className="queue-head"><span className="training-eyebrow">In progress</span><h2>{workoutName}</h2><p>{completedExercises} / {exercises.length} exercises complete</p><div><i style={{ width: `${(completedExercises / exercises.length) * 100}%` }} /></div></div>
        <nav>{exercises.map((item, index) => {
          const count = sets.filter((set) => set.programExerciseId === item.id && set.setType === 'working').length;
          const complete = count >= item.targetSets;
          return <button type="button" key={item.id} className={index === activeIndex ? 'active' : ''} onClick={() => onSelect(index)}><span>{complete ? <Check size={14} /> : index + 1}</span><div><strong>{item.exercise.name}</strong><small>{count}/{item.targetSets} sets · {item.repMin}–{item.repMax} reps</small></div></button>;
        })}</nav>
      </aside>

      <article className="set-logger-card">
        <div className="set-logger-title"><div><span className="training-eyebrow">Exercise {activeIndex + 1} of {exercises.length}{displayExercise.id !== active.exercise.id ? ' · substituted' : ''}</span><h1>{displayExercise.name}</h1><p>Target: {active.targetSets} × {active.repMin}–{active.repMax} @ {active.targetRir} RIR</p></div><div className="exercise-tools"><button type="button" onClick={() => onOpenExercise(displayExercise)}><Info size={17} /> Technique</button><button type="button" onClick={() => setSwapOpen((value) => !value)}><ArrowRight size={17} /> Swap</button></div></div>
        {swapOpen && <div className="swap-panel"><span>Intent-preserving alternatives</span><button type="button" className={displayExercise.id === active.exercise.id ? 'selected' : ''} onClick={() => { setDisplayExercise(active.exercise); setSwapOpen(false); }}><strong>{active.exercise.name}</strong><small>Original prescription</small><Check size={15} /></button>{displayExercise.alternatives?.map((item) => <button type="button" key={item.id} onClick={() => { setDisplayExercise(item.alternative); setSwapOpen(false); }}><strong>{item.alternative.name}</strong><small>{item.rationale}</small><ArrowRight size={15} /></button>)}{!displayExercise.alternatives?.length && displayExercise.id === active.exercise.id && <p>No approved alternatives are linked yet. LifeOS will not invent one during the session.</p>}</div>}
        <div className="previous-performance"><History size={16} /><span><strong>Previous</strong>{previousLabel}</span></div>

        <div className="set-table">
          <div className="set-table-head"><span>Set</span><span>{profile?.loadUnit || 'kg'}</span><span>Reps</span><span>RIR</span><span>Status</span></div>
          {activeSets.map((set) => <div className="set-table-row complete" key={set.id}><strong><Check size={14} /></strong><span>{set.actualLoad}</span><span>{set.actualReps}</span><span>{set.actualRir ?? '—'}</span><em>{set.painScore ? 'Pain flagged' : set.techniqueQuality}</em></div>)}
          {activeSets.length < active.targetSets && <div className="set-table-row input"><strong>{activeSets.length + 1}</strong><label><input type="number" min="0" step={profile?.smallestIncrement || 2.5} value={load} onChange={(event) => setLoad(Number(event.target.value))} /><span>{profile?.loadUnit || 'kg'}</span></label><input type="number" min="0" max="200" value={reps} onChange={(event) => setReps(Number(event.target.value))} /><select value={rir} onChange={(event) => setRir(event.target.value === '' ? '' : Number(event.target.value))}><option value="">—</option>{[0, 1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value}</option>)}</select><select value={technique} onChange={(event) => setTechnique(event.target.value)}><option value="good">Good</option><option value="acceptable">Acceptable</option><option value="poor">Broke down</option></select></div>}
        </div>

        <div className="coaching-cue"><Sparkles size={17} /><div><span>One cue</span><strong>{displayExercise.coachingCue}</strong></div></div>

        <div className={`rest-timer ${restElapsed >= active.restSeconds ? 'ready' : ''}`}><div><TimerReset size={19} /><span><small>Rest</small><strong>{formatTime(restElapsed)} <i>/ {formatTime(active.restSeconds)}</i></strong></span></div><button type="button" onClick={() => setResting((value) => !value)}>{resting ? <Pause size={16} /> : <Play size={16} />}{restElapsed >= active.restSeconds ? 'Ready when you are' : resting ? 'Pause' : 'Resume'}</button></div>

        {progression && <div className={`progression-callout progression-callout--${progression.action}`}><TrendingUp size={17} /><div><span>Next-load decision · {progression.confidence} confidence</span><strong>{progression.explanation}</strong></div>{progression.recommendedLoad !== null && <em>{progression.recommendedLoad} {profile?.loadUnit || 'kg'}</em>}</div>}
        {safetyMessage && <div className="safety-alert"><ShieldAlert size={19} /><div><strong>Safety response</strong><p>{safetyMessage}</p></div><button type="button" onClick={() => setSafetyMessage('')}><X size={16} /></button></div>}

        {activeSets.length < active.targetSets ? <div className="logger-actions"><button type="button" className="pain-button" onClick={() => setPainOpen((value) => !value)}><AlertTriangle size={16} /> Pain or discomfort</button><button className="complete-set-button" type="button" onClick={completeSet} disabled={saving || reps < 0 || load < 0}>{saving ? 'Saving set…' : 'Complete set'} <Check size={17} /></button></div> : <div className="exercise-complete"><Check size={18} /><span><strong>Prescription complete</strong>Move to the next exercise when ready.</span><button type="button" onClick={() => onSelect(Math.min(exercises.length - 1, activeIndex + 1))}>Next exercise <ArrowRight size={16} /></button></div>}

        {painOpen && <div className="pain-panel"><div><AlertTriangle size={18} /><span><strong>Record, don’t diagnose</strong>Stop the set for sharp, sudden, or worsening pain.</span></div><label>Discomfort <input type="range" min="0" max="10" value={painScore} onChange={(event) => setPainScore(Number(event.target.value))} /><strong>{painScore}/10</strong></label><label>Location <input placeholder="e.g. front of right shoulder" value={painLocation} onChange={(event) => setPainLocation(event.target.value)} /></label></div>}

        <button className="finish-workout-button" type="button" onClick={finish}>Finish workout</button>
      </article>
    </section>
  );
}

function ProgramView({ programs, onActivate, onOpenExercise }: { programs: TrainingProgram[]; onActivate: (id: string) => Promise<void>; onOpenExercise: (exercise: Exercise) => void }) {
  const [selectedId, setSelectedId] = useState(programs.find((program) => program.isActive)?.id || programs[0]?.id || '');
  useEffect(() => { if (!selectedId && programs[0]) setSelectedId(programs[0].id); }, [programs, selectedId]);
  const program = programs.find((item) => item.id === selectedId) || programs[0];
  if (!program) return <section className="training-empty-state"><span><Target size={27} /></span><div><h1>No programs available</h1><p>Seed or create a coherent training program first.</p></div></section>;
  return <section className="program-layout">
    <aside className="program-sidebar"><span className="training-eyebrow">Programs</span><h2>Training blocks</h2>{programs.map((item) => <button type="button" className={item.id === program.id ? 'active' : ''} key={item.id} onClick={() => setSelectedId(item.id)}><span>{item.isActive ? <Check size={14} /> : <Target size={14} />}</span><div><strong>{item.name}</strong><small>{item.durationWeeks} weeks · {item.daysPerWeek} days/week</small></div></button>)}</aside>
    <article className="program-detail"><div className="program-detail-hero"><div><span className="training-eyebrow">{program.isActive ? 'Current program' : 'Program template'}</span><h1>{program.name}</h1><p>{program.description}</p><div><span>{titleCase(program.goal)}</span><span>{titleCase(program.experience)}</span><span>{program.durationWeeks} weeks</span></div></div>{!program.isActive && <button type="button" onClick={() => onActivate(program.id)}>Use this program <ArrowRight size={16} /></button>}</div>
      <div className="program-week"><div className="training-section-heading"><div><span className="training-eyebrow">Weekly structure</span><h2>Repeat movements long enough to measure them</h2></div></div>{program.workouts.sort((a, b) => a.dayIndex - b.dayIndex).map((workout) => <section key={workout.id} className="program-day"><header><div><span>{String.fromCharCode(65 + workout.dayIndex)}</span><div><h3>{workout.name}</h3><p>{workout.description}</p></div></div><em>{workout.exercises.reduce((sum, exercise) => sum + exercise.targetSets, 0)} sets</em></header><div>{workout.exercises.sort((a, b) => a.orderIndex - b.orderIndex).map((item) => <button type="button" key={item.id} onClick={() => onOpenExercise(item.exercise)}><strong>{item.exercise.name}</strong><span>{item.targetSets} × {item.repMin}–{item.repMax}</span><span>{item.targetRir} RIR</span><span>{Math.round(item.restSeconds / 60)} min rest</span><ArrowRight size={15} /></button>)}</div></section>)}</div>
    </article>
  </section>;
}

function ExerciseLibrary({ exercises, onOpenExercise }: { exercises: Exercise[]; onOpenExercise: (exercise: Exercise) => void }) {
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('all');
  const [equipment, setEquipment] = useState('all');
  const muscles = [...new Set(exercises.flatMap((exercise) => exercise.primaryMuscles))].sort();
  const equipmentOptions = [...new Set(exercises.flatMap((exercise) => exercise.equipment))].sort();
  const filtered = exercises.filter((exercise) => (!search || `${exercise.name} ${exercise.movementPattern}`.toLowerCase().includes(search.toLowerCase())) && (muscle === 'all' || exercise.primaryMuscles.includes(muscle)) && (equipment === 'all' || exercise.equipment.includes(equipment)));
  return <section className="exercise-library"><div className="library-hero"><div><span className="training-eyebrow">Evidence-aware reference</span><h1>Exercise library</h1><p>Browse by training intent, comfort, equipment, and progressability—not an invented universal “best exercise” score.</p></div><strong>{exercises.length}<span>curated movements</span></strong></div>
    <div className="library-filters"><label><Search size={17} /><input placeholder="Search exercise or movement…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select value={muscle} onChange={(event) => setMuscle(event.target.value)}><option value="all">All muscles</option>{muscles.map((item) => <option value={item} key={item}>{titleCase(item)}</option>)}</select><select value={equipment} onChange={(event) => setEquipment(event.target.value)}><option value="all">All equipment</option>{equipmentOptions.map((item) => <option value={item} key={item}>{titleCase(item)}</option>)}</select></div>
    <div className="exercise-grid">{filtered.map((exercise) => <button type="button" className="exercise-card" key={exercise.id} onClick={() => onOpenExercise(exercise)}><div className="exercise-card-icon"><Dumbbell size={20} /></div><div className="exercise-card-tags"><span>{titleCase(exercise.classification)}</span><span>{titleCase(exercise.movementPattern)}</span></div><h2>{exercise.name}</h2><p>{exercise.primaryMuscles.map(titleCase).join(' · ')}</p><div className="exercise-card-equipment">{exercise.equipment.slice(0, 3).map((item) => <span key={item}>{titleCase(item)}</span>)}</div><blockquote>“{exercise.coachingCue}”</blockquote><footer><span><Activity size={14} /> {titleCase(exercise.evidenceConfidence)}</span><ArrowRight size={16} /></footer></button>)}</div>
    {!filtered.length && <div className="library-empty"><Search size={22} /><h2>No matching movement</h2><p>Try removing one filter. The library does not generate unsupported exercises.</p></div>}
  </section>;
}

function ProgressView({ review }: { review: TrainingReview | null }) {
  if (!review) return <section className="training-empty-state"><span><BarChart3 size={27} /></span><div><h1>No review data yet</h1><p>Complete comparable sessions before drawing conclusions.</p></div></section>;
  const adherence = review.sessionsPlanned ? Math.round((review.sessionsCompleted / review.sessionsPlanned) * 100) : 0;
  const maxSets = Math.max(1, ...Object.values(review.muscleSets));
  return <section className="progress-view"><div className="progress-hero"><div><span className="training-eyebrow">28-day review · {formatDate(review.from)}–{formatDate(review.to)}</span><h1>Training progress, with context</h1><p>Performance and adherence come before decorative volume totals. Associations are not treated as causes.</p></div><div className="adherence-ring" style={{ '--progress': `${adherence * 3.6}deg` } as React.CSSProperties}><span><strong>{adherence}%</strong><small>adherence</small></span></div></div>
    <div className="progress-metrics"><MetricCard icon={<Check size={18} />} label="Sessions completed" value={`${review.sessionsCompleted}`} context={`of ${review.sessionsPlanned} planned`} /><MetricCard icon={<Dumbbell size={18} />} label="Working sets" value={`${review.workingSets}`} context="warm-ups excluded" /><MetricCard icon={<Trophy size={18} />} label="Best e1RM" value={review.bestPerformance ? `${review.bestPerformance.estimatedOneRepMax} kg` : '—'} context={review.bestPerformance?.exercise || 'not enough data'} /><MetricCard icon={<ShieldAlert size={18} />} label="Pain flags" value={`${review.painFlags}`} context={review.painFlags ? 'review before progressing' : 'none recorded'} /></div>
    <div className="progress-grid"><article className="muscle-exposure-card"><div className="training-section-heading"><div><span className="training-eyebrow">Direct hard sets</span><h2>Muscle exposure</h2></div><span>Not “effective-set” fractions</span></div><div className="muscle-bars">{Object.entries(review.muscleSets).sort((a, b) => b[1] - a[1]).map(([muscle, count]) => <div key={muscle}><label><span>{titleCase(muscle)}</span><strong>{count} sets</strong></label><div><i style={{ width: `${(count / maxSets) * 100}%` }} /></div></div>)}{!Object.keys(review.muscleSets).length && <p>No completed working sets in this period.</p>}</div></article>
      <article className="decision-card"><span className="decision-icon"><TrendingUp size={20} /></span><span className="training-eyebrow">What the data supports</span><h2>{review.sessionsCompleted < 2 ? 'Build consistency before optimizing the program.' : adherence < 70 ? 'Fix schedule fit before adding volume.' : 'Keep comparable movements and follow progression decisions.'}</h2><p>{review.sessionsCompleted < 2 ? 'One session cannot establish a trend.' : adherence < 70 ? 'A complex progression model cannot compensate for missed sessions.' : 'There is enough execution data to review exercise-level changes, while still avoiding causal claims about recovery.'}</p></article>
    </div>
    <div className="association-note"><Info size={17} /><span><strong>Cross-domain associations are intentionally paused.</strong> Sleep and nutrition need sufficient paired observations and explicit consent before LifeOS analyzes them.</span></div>
  </section>;
}

function MetricCard({ icon, label, value, context }: { icon: React.ReactNode; label: string; value: string; context: string }) {
  return <article><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{context}</p></div></article>;
}

function ExerciseDetail({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return <div className="exercise-drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="exercise-drawer" role="dialog" aria-modal="true" aria-label={`${exercise.name} details`}><header><div><span className="training-eyebrow">{titleCase(exercise.movementPattern)} · {titleCase(exercise.classification)}</span><h1>{exercise.name}</h1><p>{exercise.primaryMuscles.map(titleCase).join(' · ')}</p></div><button type="button" onClick={onClose} aria-label="Close exercise details"><X size={20} /></button></header>
    <section className="detail-cue"><Sparkles size={18} /><div><span>Primary coaching cue</span><strong>{exercise.coachingCue}</strong></div></section>
    <section><h2>Set up</h2><ol>{exercise.setupSteps?.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol></section>
    <section><h2>Execute</h2><ol>{exercise.executionSteps?.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol></section>
    {!!exercise.commonFaults?.length && <section><h2>Fault → correction</h2>{exercise.commonFaults.map((fault) => <div className="fault-row" key={fault.fault}><AlertTriangle size={16} /><div><strong>{fault.fault}</strong><p>{fault.cue}</p></div></div>)}</section>}
    <section className="evidence-card"><div><BookOpen size={17} /><span><strong>Evidence context</strong><em>{titleCase(exercise.evidenceConfidence)}</em></span></div><p>{exercise.evidenceSummary}</p></section>
    {!!exercise.alternatives?.length && <section><h2>Intent-preserving alternatives</h2>{exercise.alternatives.map((item) => <div className="alternative-row" key={item.id}><span><Dumbbell size={16} /></span><div><strong>{item.alternative.name}</strong><p>{item.rationale}</p></div><em>{titleCase(item.relationship)}</em></div>)}</section>}
    <section className="drawer-safety"><ShieldAlert size={17} /><p>LifeOS does not diagnose pain. Stop for sharp or sudden pain, instability, neurological symptoms, chest pressure, dizziness, or unusual breathlessness.</p></section>
  </aside></div>;
}

function TrainingSettings({ profile, onClose, onSave }: { profile: TrainingProfile | null; onClose: () => void; onSave: (profile: Partial<TrainingProfile>) => Promise<void> }) {
  const equipmentOptions = ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bench', 'rack', 'band'];
  const [form, setForm] = useState<Partial<TrainingProfile>>(profile || {
    goal: 'mixed', experience: 'beginner', daysPerWeek: 3, minutesPerSession: 60,
    loadUnit: 'kg', smallestIncrement: 2.5, availableEquipment: [], limitations: [], excludedExerciseIds: [],
  });
  const [saving, setSaving] = useState(false);
  const toggleEquipment = (item: string) => setForm((current) => {
    const selected = current.availableEquipment || [];
    return { ...current, availableEquipment: selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item] };
  });
  const save = async () => { setSaving(true); try { await onSave(form); } finally { setSaving(false); } };
  return <div className="training-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="training-settings-modal" role="dialog" aria-modal="true" aria-label="Training profile settings"><header><div><span className="training-eyebrow">Personalization constraints</span><h1>Training profile</h1><p>LifeOS uses only inputs that change a defined training decision.</p></div><button type="button" onClick={onClose} aria-label="Close training settings"><X size={20} /></button></header>
    <div className="training-settings-grid"><label>Primary goal<select value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}><option value="general_fitness">General fitness</option><option value="hypertrophy">Hypertrophy</option><option value="strength">Strength</option><option value="mixed">Mixed</option></select></label><label>Experience<select value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>Days per week<input type="number" min="1" max="7" value={form.daysPerWeek} onChange={(event) => setForm({ ...form, daysPerWeek: Number(event.target.value) })} /></label><label>Minutes per session<input type="number" min="15" max="240" value={form.minutesPerSession} onChange={(event) => setForm({ ...form, minutesPerSession: Number(event.target.value) })} /></label><label>Load unit<select value={form.loadUnit} onChange={(event) => setForm({ ...form, loadUnit: event.target.value as 'kg' | 'lb' })}><option value="kg">Kilograms</option><option value="lb">Pounds</option></select></label><label>Smallest load increment<input type="number" min="0.25" step="0.25" value={form.smallestIncrement} onChange={(event) => setForm({ ...form, smallestIncrement: Number(event.target.value) })} /></label></div>
    <div className="equipment-selector"><span>Available equipment</span><div>{equipmentOptions.map((item) => <button type="button" className={form.availableEquipment?.includes(item) ? 'selected' : ''} key={item} onClick={() => toggleEquipment(item)}>{form.availableEquipment?.includes(item) && <Check size={13} />}{titleCase(item)}</button>)}</div></div>
    <div className="settings-safety-note"><ShieldAlert size={17} /><p>Limitations and medical constraints should only be added when they change a feature. LifeOS does not turn them into a diagnosis or rehabilitation plan.</p></div>
    <footer><button type="button" onClick={onClose}>Cancel</button><button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save training context'} <Check size={16} /></button></footer>
  </section></div>;
}
