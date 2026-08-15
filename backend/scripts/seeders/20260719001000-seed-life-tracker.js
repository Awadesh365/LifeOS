'use strict';

const quoteIdentifier = (value) => `"${String(value).replace(/"/g, '""')}"`;

const upsertRows = async (queryInterface, tableName, rows, updateColumns) => {
  if (rows.length === 0) return;

  const columns = Object.keys(rows[0]);
  const replacements = [];
  const tuples = rows.map((row) => {
    columns.forEach((column) => replacements.push(row[column]));
    return `(${columns.map(() => '?').join(', ')})`;
  });

  const conflictAction = updateColumns.length === 0
    ? 'DO NOTHING'
    : `DO UPDATE SET ${updateColumns
      .map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`)
      .join(', ')}`;

  await queryInterface.sequelize.query(
    `INSERT INTO ${quoteIdentifier(tableName)} (${columns.map(quoteIdentifier).join(', ')})
     VALUES ${tuples.join(', ')}
     ON CONFLICT ("id") ${conflictAction};`,
    { replacements }
  );
};

module.exports = {
  async up(queryInterface) {
    await upsertRows(queryInterface, 'habits', [
      { id: 'wake', name: 'Wake up at 5:30 AM', icon: '🌅', category: 'routine' },
      { id: 'gym', name: 'GYM (1.5 hrs)', icon: '💪', category: 'health' },
      { id: 'ai', name: 'AI Learning (1 hr)', icon: '🤖', category: 'learning' },
      { id: 'stack', name: 'Strong Stack Learning (2 hrs)', icon: '📚', category: 'learning' },
      { id: 'apply', name: 'Apply to 5 Jobs', icon: '📝', category: 'career' },
      { id: 'nophone', name: 'No Phone in Bed', icon: '📵', category: 'discipline' },
      { id: 'sleep', name: 'Quality Sleep by 10 PM', icon: '😴', category: 'health' },
      { id: 'deepwork', name: 'Deep Work (no distractions)', icon: '🎯', category: 'discipline' }
    ], ['name', 'icon', 'category']);

    await upsertRows(queryInterface, 'routines', [
      { id: 'wd_0', type: 'weekday', time: '5:30', task: 'Wake Up', icon: '🌅', duration: '', note: null, order_index: 0 },
      { id: 'wd_1', type: 'weekday', time: '6:00 - 7:30', task: 'GYM', icon: '💪', duration: '~1.5 hrs', note: null, order_index: 1 },
      { id: 'wd_2', type: 'weekday', time: '8:00 - 9:00', task: 'AI Competitive Advantage Daily Ritual', icon: '🤖', duration: '1 hr', note: null, order_index: 2 },
      { id: 'we_0', type: 'weekend', time: '5:30', task: 'Wake Up', icon: '🌅', duration: '', note: null, order_index: 0 },
      { id: 'we_1', type: 'weekend', time: '6:00 - 7:30', task: 'GYM (Saturday) / Morning Walk (Sunday)', icon: '💪', duration: '~1.5 hrs', note: null, order_index: 1 }
    ], ['type', 'time', 'task', 'icon', 'duration', 'note', 'order_index']);

    await upsertRows(queryInterface, 'learning_sections', [
      { id: 'foundation', title: 'Foundation Sprint', order_index: 0 },
      { id: 'interview_phase', title: 'Interview Specific Phase', order_index: 1 },
      { id: 'fde_prep', title: 'Forward Deployed Engineer Prep', order_index: 2 }
    ], ['title', 'order_index']);

    await upsertRows(queryInterface, 'learning_items', [
      { id: 'builder', section_id: 'foundation', topic: 'Builder Phase', date: '22 June Onwards', info: 'Daily in the Morning. Personal Project Backend + Frontend Foundation', source: '', status: 'not_started', order_index: 0 },
      { id: 'devops', section_id: 'foundation', topic: 'DevOps', date: '22 July', info: 'DevOps (CI/CD)', source: '', status: 'not_started', order_index: 1 },
      { id: 'js_int', section_id: 'interview_phase', topic: 'JS', date: '1 Aug - 2 Aug', info: '8 Videos/Day', source: '', status: 'not_started', order_index: 0 },
      { id: 'dsa', section_id: 'fde_prep', topic: 'DSA', date: '', info: '', source: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', status: 'not_started', order_index: 0 }
    ], ['section_id', 'topic', 'date', 'info', 'source', 'status', 'order_index']);

    await upsertRows(queryInterface, 'goals', [
      { id: 'salary', title: 'Salary ₹1 Lakh+/month', category: 'career', icon: '💰', target: 100000, current: 30000, unit: '₹/month' },
      { id: 'job_switch', title: 'Switch to Better Company', category: 'career', icon: '🚀', target: 1, current: 0, unit: '' }
    ], ['title', 'category', 'icon', 'target', 'current', 'unit']);

    await upsertRows(queryInterface, 'milestones', [
      { id: 'ms_salary_0', goal_id: 'salary', label: '₹30K (Current)', value: 30000, done: true, order_index: 0 },
      { id: 'ms_salary_1', goal_id: 'salary', label: '₹50K', value: 50000, done: false, order_index: 1 },
      { id: 'ms_job_switch_0', goal_id: 'job_switch', label: 'Update Resume', value: 0.2, done: false, order_index: 0 }
    ], ['goal_id', 'label', 'value', 'done', 'order_index']);

    await upsertRows(queryInterface, 'dreams', [
      { id: 'd1', text: 'Earn ₹1 Lakh+/month', icon: '💰', priority: 'now', order_index: 0 },
      { id: 'd2', text: 'Buy Land in Dehradun', icon: '🏔️', priority: 'mid', order_index: 1 }
    ], ['text', 'icon', 'priority', 'order_index']);

    await upsertRows(queryInterface, 'emergency_funds', [
      { id: 'fd1', bank_name: 'Primary Bank FD', amount: 20000, target_amount: 100000, type: 'fd', notes: 'FD #1 already created' }
    ], ['bank_name', 'amount', 'target_amount', 'type', 'notes']);
  },

  async down() {
    return Promise.resolve();
  }
};
