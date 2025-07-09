import { Agent, Schedule } from '../types';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const calculateNextRunTime = (schedule?: Schedule, value?: string, day?: number): number | undefined => {
  if (!schedule || schedule === Schedule.MANUAL) return undefined;
  
  const now = new Date();
  let nextRun = new Date();

  switch (schedule) {
    case Schedule.ONCE:
        return value ? new Date(value).getTime() : undefined;

    case Schedule.HOURLY:
        nextRun.setMinutes(nextRun.getMinutes() + 60);
        return nextRun.getTime();
    
    case Schedule.DAILY:
        if (!value) return undefined;
        const [dailyHours, dailyMinutes] = value.split(':').map(Number);
        nextRun.setHours(dailyHours, dailyMinutes, 0, 0);
        if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun.getTime();

    case Schedule.WEEKLY:
        if (!value || day === undefined) return undefined;
        const [weeklyHours, weeklyMinutes] = value.split(':').map(Number);
        nextRun.setHours(weeklyHours, weeklyMinutes, 0, 0);
        const currentDay = now.getDay();
        const daysUntilNext = (day! - currentDay + 7) % 7;
        
        if (daysUntilNext === 0 && nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 7);
        } else {
            nextRun.setDate(nextRun.getDate() + daysUntilNext);
        }
        return nextRun.getTime();

    case Schedule.MONTHLY:
        if (!value || !day) return undefined;
        const [monthlyHours, monthlyMinutes] = value.split(':').map(Number);
        nextRun.setHours(monthlyHours, monthlyMinutes, 0, 0);
        nextRun.setDate(day);
        
        if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 1);
        }
        return nextRun.getTime();

    default:
        return undefined;
  }
};

export const formatSchedule = (agent: Agent): string => {
    switch (agent.schedule) {
        case Schedule.MANUAL:
            return 'Runs manually';
        case Schedule.ONCE:
            return `Runs once at ${agent.scheduleValue ? new Date(agent.scheduleValue).toLocaleString() : ''}`;
        case Schedule.HOURLY:
            return 'Runs hourly';
        case Schedule.DAILY:
            return `Runs daily at ${agent.scheduleValue || ''}`;
        case Schedule.WEEKLY:
            return `Runs weekly on ${WEEKDAYS[agent.scheduleDay || 0]} at ${agent.scheduleValue || ''}`;
        case Schedule.MONTHLY:
            return `Runs monthly on day ${agent.scheduleDay || 1} at ${agent.scheduleValue || ''}`;
        default:
            return 'No schedule set';
    }
};
