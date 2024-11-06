import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const testEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: 'Team Meeting',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '1-1',
      title: '우분투 1',
      date: '2024-07-03',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-11',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2024-07-21',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2024-07-31',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  beforeEach(() => {
    vi.setSystemTime(new Date('2024-07-01'));
  });
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    expect(getFilteredEvents(testEvents, '이벤트 2', new Date(), 'month')).toEqual([
      {
        id: '2',
        title: '이벤트 2',
        date: '2024-07-11',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    expect(getFilteredEvents(testEvents, '', new Date(), 'week')).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: 'Team Meeting',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '1-1',
        title: '우분투 1',
        date: '2024-07-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    expect(getFilteredEvents(testEvents, '', new Date(), 'month')).toEqual(testEvents);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    expect(getFilteredEvents(testEvents, '이벤트', new Date(), 'week')).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: 'Team Meeting',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    // Hmm....
    expect(getFilteredEvents(testEvents, '', new Date(), 'month')).toEqual(testEvents);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    // 대문자
    expect(getFilteredEvents(testEvents, 'Team Meeting', new Date(), 'month')).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: 'Team Meeting',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);

    // 소문자
    expect(getFilteredEvents(testEvents, 'team meeting', new Date(), 'month')).toEqual([
      {
        id: '1',
        title: '이벤트 1',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: 'Team Meeting',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    vi.setSystemTime('2024-08-01');
    expect(getFilteredEvents(testEvents, '', new Date(), 'week')).toEqual([
      {
        id: '4',
        title: '이벤트 4',
        date: '2024-07-31',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    expect(getFilteredEvents([], '', new Date(), 'week')).toEqual([]);
  });
});
