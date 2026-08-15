import { models } from '../../models/index.js';
import { todayIsoDate } from '../../utils/date.js';

export async function getDashboardSummary() {
  const today = todayIsoDate();

  const [
    habitsTotal,
    todayLogs,
    learningTotal,
    learningCompleted,
    goalsTotal,
    milestonesTotal,
    completedMilestones,
    dreamsTotal,
    jobsTotal,
  ] = await Promise.all([
    models.Habit.count(),
    models.HabitLog.findAll({ where: { date: today }, raw: true }),
    models.LearningItem.count(),
    models.LearningItem.count({ where: { status: 'completed' } }),
    models.Goal.count(),
    models.Milestone.count(),
    models.Milestone.count({ where: { done: true } }),
    models.Dream.count(),
    models.Job.count(),
  ]);

  return {
    habits: {
      total: habitsTotal,
      completedToday: todayLogs.filter((log: any) => log.done).length,
    },
    learning: {
      total: learningTotal,
      completed: learningCompleted,
    },
    goals: {
      total: goalsTotal,
      milestones: milestonesTotal,
      completedMilestones,
    },
    dreams: dreamsTotal,
    jobs: jobsTotal,
  };
}
