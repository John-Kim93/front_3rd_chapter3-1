import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = '2024-07-01';
    const time = '14:30';
    expect(parseDateTime(date, time)).toEqual(new Date('2024-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const invalidDate = '9999-99-99';
    const validTime = '14:30';
    expect(parseDateTime(invalidDate, validTime).toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const validDate = '2024-07-01';
    const invalidTime = '99:99';
    expect(parseDateTime(validDate, invalidTime).toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const invalidDate = '';
    const validTime = '14:30';
    expect(parseDateTime(invalidDate, validTime).toString()).toBe('Invalid Date');
  });

  // 추가
  it('시간 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const validDate = '2024-07-01';
    const invalidTime = '';
    expect(parseDateTime(validDate, invalidTime).toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange : 이벤트를 인자로 받아서 시작 시간 및 종료 시간을 가진 객체로 반환한다.', () => {
  it('이벤트의 날짜와 시작 및 종료 시간을 조합하여 객체로 변환한다', () => {
    const validEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    expect(convertEventToDateRange(validEvent)).toEqual({
      start: new Date('2024-10-15T09:00'),
      end: new Date('2024-10-15T10:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '9999-99-99',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const { start, end } = convertEventToDateRange(invalidEvent);
    expect(start.toString()).toBe('Invalid Date');
    expect(end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidEvent: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '99:99',
      endTime: '99:99',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const { start, end } = convertEventToDateRange(invalidEvent);
    expect(start.toString()).toBe('Invalid Date');
    expect(end.toString()).toBe('Invalid Date');
  });
});

describe('isOverlapping', () => {
  it('첫 번째 이벤트의 endTime과 두 번째 이벤트의 startTime이 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '15:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const event2: Event = {
      id: '2',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '12:00',
      endTime: '19:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    expect(isOverlapping(event1, event2)).toBeTruthy();
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '12:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const event2: Event = {
      id: '2',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '12:00',
      endTime: '19:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    expect(isOverlapping(event1, event2)).toBeFalsy();
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '12:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const event2: Event = {
      id: '2',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '12:00',
      endTime: '19:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const newEvent: Event = {
      id: '99',
      title: '뉴 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '19:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    expect(findOverlappingEvents(newEvent, [event1, event2])).toEqual([event1, event2]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '12:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const event2: Event = {
      id: '2',
      title: '기존 회의',
      date: '2024-10-01',
      startTime: '12:00',
      endTime: '19:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const newEvent: Event = {
      id: '99',
      title: '뉴 회의',
      date: '2024-10-01',
      startTime: '03:00',
      endTime: '04:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    expect(findOverlappingEvents(newEvent, [event1, event2])).toEqual([]);
  });
});
