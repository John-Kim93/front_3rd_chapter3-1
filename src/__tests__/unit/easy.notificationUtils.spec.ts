import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents : 알람 시간도래 = startTime - notificationTime', () => {
  const alarmEvents: Event[] = [
    {
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
    },
    {
      id: '2',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '10:00',
      endTime: '12:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '11:00',
      endTime: '13:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '4',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '11:05',
      endTime: '13:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    expect(getUpcomingEvents(alarmEvents, new Date('2024-10-15T10:50'), [])).toEqual([
      {
        id: '3',
        title: '기존 회의',
        date: '2024-10-15',
        startTime: '11:00',
        endTime: '13:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    expect(getUpcomingEvents(alarmEvents, new Date('2024-10-15T10:55'), ['3'])).toEqual([
      {
        id: '4',
        title: '기존 회의',
        date: '2024-10-15',
        startTime: '11:05',
        endTime: '13:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  // 테스트하기 모호한 문장 수정
  // it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {});
  // it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {});
  it('알림 시간이 도래한 이벤트가 없는 경우 빈 배열을 반환한다.', () => {
    expect(getUpcomingEvents(alarmEvents, new Date('2024-10-16T22:00'), [])).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const alarmEvent: Event = {
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
    expect(createNotificationMessage(alarmEvent)).toBe(`10분 후 기존 회의 일정이 시작됩니다.`);
  });
});
