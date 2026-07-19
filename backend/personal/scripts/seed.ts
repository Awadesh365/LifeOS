import { models, sequelize } from '../models/index.js';

const habits = [
  { id: 'wake', name: 'Wake up at 5:30 AM', icon: '🌅', category: 'routine' },
  { id: 'gym', name: 'GYM (1.5 hrs)', icon: '💪', category: 'health' },
  { id: 'ai', name: 'AI Learning (1 hr)', icon: '🤖', category: 'learning' },
  { id: 'stack', name: 'Strong Stack Learning (2 hrs)', icon: '📚', category: 'learning' },
  { id: 'apply', name: 'Apply to 5 Jobs', icon: '📝', category: 'career' },
  { id: 'nophone', name: 'No Phone in Bed', icon: '📵', category: 'discipline' },
  { id: 'sleep', name: 'Quality Sleep by 10 PM', icon: '😴', category: 'health' },
  { id: 'deepwork', name: 'Deep Work (no distractions)', icon: '🎯', category: 'discipline' },
];

const weekdayRoutine = [
  { id: 'wd_0', type: 'weekday', time: '5:30', task: 'Wake Up', icon: '🌅', duration: '', note: null, orderIndex: 0 },
  { id: 'wd_1', type: 'weekday', time: '6:00 - 7:30', task: 'GYM', icon: '💪', duration: '~1.5 hrs', note: null, orderIndex: 1 },
  { id: 'wd_2', type: 'weekday', time: '8:00 - 9:00', task: 'AI Competitive Advantage Daily Ritual', icon: '🤖', duration: '1 hr', note: null, orderIndex: 2 },
  { id: 'wd_3', type: 'weekday', time: '9:00 - 9:30', task: 'Breakfast', icon: '🍳', duration: '30 min', note: null, orderIndex: 3 },
  { id: 'wd_4', type: 'weekday', time: '10:00 - 19:00', task: 'Work (includes lunch)', icon: '💼', duration: '9 hrs', note: null, orderIndex: 4 },
  { id: 'wd_5', type: 'weekday', time: '19:00 - 19:30', task: 'Dinner', icon: '🍽️', duration: '30 min', note: null, orderIndex: 5 },
  { id: 'wd_6', type: 'weekday', time: '20:00 - 22:00', task: 'Strong Stack Concepts & Learning', icon: '📚', duration: '2 hrs', note: null, orderIndex: 6 },
  { id: 'wd_7', type: 'weekday', time: '22:00 - 5:30', task: 'Quality Sleep', icon: '😴', duration: '7.5 hrs', note: 'No laptop/phone on bed · Complete Dark · WiFi off', orderIndex: 7 },
];

const weekendRoutine = [
  { id: 'we_0', type: 'weekend', time: '5:30', task: 'Wake Up', icon: '🌅', duration: '', note: null, orderIndex: 0 },
  { id: 'we_1', type: 'weekend', time: '6:00 - 7:30', task: 'GYM (Saturday) / Morning Walk (Sunday)', icon: '💪', duration: '~1.5 hrs', note: null, orderIndex: 1 },
  { id: 'we_2', type: 'weekend', time: '8:00 onwards', task: 'AI Competitive Advantage Work', icon: '🤖', duration: 'Full Day', note: 'Learning, applying, monetisation, influence', orderIndex: 2 },
];

const learningSections = [
  { id: 'foundation', title: 'Foundation Sprint', orderIndex: 0 },
  { id: 'interview_phase', title: 'Interview Specific Phase', orderIndex: 1 },
  { id: 'fde_prep', title: 'Forward Deployed Engineer Prep', orderIndex: 2 },
  { id: 'final_polish', title: 'Final Polish + Mock Readiness', orderIndex: 3 },
];

const learningItems = [
  { id: 'builder', sectionId: 'foundation', topic: 'Builder Phase', date: '22 June Onwards', info: 'Daily in the Morning. Personal Project Backend + Frontend Foundation', source: '', status: 'not_started', orderIndex: 0 },
  { id: 'devops', sectionId: 'foundation', topic: 'DevOps', date: '22 July', info: 'DevOps (CI/CD)', source: '', status: 'not_started', orderIndex: 1 },
  { id: 'backend_1p', sectionId: 'foundation', topic: 'Backend Learn From 1st Principle', date: '13 July - 16 July', info: 'Backend (Real Engineering)', source: '', status: 'not_started', orderIndex: 2 },
  { id: 'typescript', sectionId: 'foundation', topic: 'TypeScript', date: '18 Aug - 19 Aug', info: '2 Days', source: '', status: 'not_started', orderIndex: 3 },
  { id: 'js_int', sectionId: 'interview_phase', topic: 'JS', date: '1 Aug - 2 Aug', info: '8 Videos/Day', source: '', status: 'not_started', orderIndex: 0 },
  { id: 'react_int', sectionId: 'interview_phase', topic: 'React JS: Interview Questions', date: '17 Aug - 23 Aug', info: '60 Videos · 10 Videos Per day', source: '', status: 'not_started', orderIndex: 1 },
  { id: 'dsa', sectionId: 'fde_prep', topic: 'DSA', date: '', info: '', source: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', status: 'not_started', orderIndex: 0 },
  { id: 'review', sectionId: 'final_polish', topic: 'Review both projects, polish UI, docs', date: '', info: 'Clean, presentable GitHub + portfolio', source: '', status: 'not_started', orderIndex: 0 },
];

const goals = [
  { id: 'salary', title: 'Salary ₹1 Lakh+/month', category: 'career', icon: '💰', target: 100000, current: 30000, unit: '₹/month' },
  { id: 'job_switch', title: 'Switch to Better Company', category: 'career', icon: '🚀', target: 1, current: 0, unit: '' },
  { id: 'land', title: 'Buy Land (Dehradun)', category: 'wealth', icon: '🏔️', target: 2500000, current: 0, unit: '₹' },
  { id: 'fitness', title: 'Physical Transformation', category: 'health', icon: '💪', target: 1, current: 0.15, unit: '' },
];

const milestones = [
  { id: 'ms_salary_0', goalId: 'salary', label: '₹30K (Current)', value: 30000, done: true, orderIndex: 0 },
  { id: 'ms_salary_1', goalId: 'salary', label: '₹50K', value: 50000, done: false, orderIndex: 1 },
  { id: 'ms_job_switch_0', goalId: 'job_switch', label: 'Update Resume', value: 0.2, done: false, orderIndex: 0 },
  { id: 'ms_land_0', goalId: 'land', label: 'Start Saving', value: 100000, done: false, orderIndex: 0 },
  { id: 'ms_fitness_0', goalId: 'fitness', label: 'Start Gym', value: 0.15, done: true, orderIndex: 0 },
];

const dreams = [
  { id: 'd1', text: 'Earn ₹1 Lakh+/month', icon: '💰', priority: 'now', orderIndex: 0 },
  { id: 'd2', text: 'Buy Land in Dehradun', icon: '🏔️', priority: 'mid', orderIndex: 1 },
  { id: 'd3', text: 'Build my own 2BHK Home', icon: '🏠', priority: 'mid', orderIndex: 2 },
  { id: 'd4', text: 'Buy a Vehicle (Car)', icon: '🚗', priority: 'mid', orderIndex: 3 },
  { id: 'd5', text: 'Start my own Business', icon: '📈', priority: 'long', orderIndex: 4 },
];

const upsert = async (
  model: { bulkCreate: (rows: any[], options: { updateOnDuplicate: string[] }) => Promise<unknown> },
  rows: any[],
  updateOnDuplicate: string[],
) => {
  await model.bulkCreate(rows, { updateOnDuplicate });
};

const run = async () => {
  await sequelize.authenticate();

  await upsert(models.Habit, habits, ['name', 'icon', 'category']);
  await upsert(models.Routine, [...weekdayRoutine, ...weekendRoutine], ['type', 'time', 'task', 'icon', 'duration', 'note', 'orderIndex']);
  await upsert(models.LearningSection, learningSections, ['title', 'orderIndex']);
  await upsert(models.LearningItem, learningItems, ['sectionId', 'topic', 'date', 'info', 'source', 'status', 'orderIndex']);
  await upsert(models.Goal, goals, ['title', 'category', 'icon', 'target', 'current', 'unit']);
  await upsert(models.Milestone, milestones, ['goalId', 'label', 'value', 'done', 'orderIndex']);
  await upsert(models.Dream, dreams, ['text', 'icon', 'priority', 'orderIndex']);
  await upsert(models.EmergencyFund, [
    { id: 'fd1', bankName: 'Primary Bank FD', amount: 20000, targetAmount: 100000, type: 'fd', notes: 'FD #1 already created' },
  ], ['bankName', 'amount', 'targetAmount', 'type', 'notes']);
  await upsert(models.Debt, [
    { id: 'd_ankit', personName: 'Ankit', totalAmount: 400, paidAmount: 0, remainingAmount: 400, targetMonth: 'July 2026', status: 'active' },
    { id: 'd_abhishek_r', personName: 'Abhishek Rawat', totalAmount: 600, paidAmount: 0, remainingAmount: 600, targetMonth: 'July 2026', status: 'active' },
  ], ['personName', 'totalAmount', 'paidAmount', 'remainingAmount', 'targetMonth', 'status']);
  await upsert(models.Investment, [
    { id: 'inv_sip', name: 'Aditya Birla Liquid Fund', type: 'SIP', monthlyAmount: 1000, investedAmount: 1000, currentValue: 1020 },
  ], ['name', 'type', 'monthlyAmount', 'investedAmount', 'currentValue']);
  await upsert(models.Supplement, [
    { id: 'supp_creatine', name: 'Creatine', quantity: 250, unit: 'g', dailyUsage: 5, remainingDays: 50, notes: '250g pack' },
    { id: 'supp_whey', name: 'Whey Protein', quantity: 10, unit: 'days', dailyUsage: 1, remainingDays: 10, notes: '10 days remaining' },
  ], ['name', 'quantity', 'unit', 'dailyUsage', 'remainingDays', 'notes']);
  await upsert(models.FuturePlan, [
    { id: 'fp_home', planType: 'home', title: 'Build 2BHK Home', targetDate: '2028-12-31', status: 'planned', budget: 2500000 },
    { id: 'fp_marriage', planType: 'marriage', title: 'Get Married', targetDate: '2029-12-31', status: 'planned', budget: 500000 },
  ], ['planType', 'title', 'targetDate', 'status', 'budget']);

  await sequelize.close();
  console.log('Seed complete');
};

run().catch(async (err) => {
  console.error(err);
  await sequelize.close();
  process.exit(1);
});
