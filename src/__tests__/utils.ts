import { Event } from '../types';
import { fillZero } from '../utils/dateUtils';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

export const makeAMonthEvents = ({
  month,
  from,
  to,
}: {
  month: number;
  from: number;
  to: number;
}): Event[] => {
  let result = [];
  for (let i = from; i < to + 1; i++) {
    const day = i < 10 ? `0${i}` : i;
    const event: Event = {
      id: `${i}`,
      title: '기존 회의',
      date: `2024-${month}-${day}`,
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    result.push(event);
  }
  return result;
};
