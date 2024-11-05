import { Event } from '../../types';

// date 기반 테스트 데이터
export const eventsInSep: Event[] = [
  {
    id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
    title: '팀 회의',
    date: '2024-09-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 1,
  },
  {
    id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
    title: '점심 약속',
    date: '2024-09-08',
    startTime: '12:30',
    endTime: '13:30',
    description: '동료와 점심 식사',
    location: '회사 근처 식당',
    category: '개인',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 1,
  },
];

export const eventsInOct: Event[] = [
  {
    id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
    title: '프로젝트 마감',
    date: '2024-10-01',
    startTime: '09:00',
    endTime: '18:00',
    description: '분기별 프로젝트 마감',
    location: '사무실',
    category: '업무',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 1,
  },
  {
    id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
    title: '생일 파티',
    date: '2024-10-08',
    startTime: '19:00',
    endTime: '22:00',
    description: '친구 생일 축하',
    location: '친구 집',
    category: '개인',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 1,
  },
];

export const eventsInNov: Event[] = [
  {
    id: '80d85368-b4a4-47b3-b959-25171d49371f',
    title: '운동',
    date: '2024-11-22',
    startTime: '18:00',
    endTime: '19:00',
    description: '주간 운동',
    location: '헬스장',
    category: '개인',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 1,
  },
  {
    id: '80d84368-a4a4-47b3-b229-21231d49371f',
    title: '공부',
    date: '2024-11-22',
    startTime: '15:00',
    endTime: '19:30',
    description: 'vitest 공부',
    location: '내 방',
    category: '개인',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 1,
  },
];
