import { act, renderHook } from '@testing-library/react';

import { eventsInNov, eventsInOct, eventsInSep } from './easy.useSearch.testData.ts';
import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

describe('useSearch 훅을 테스트합니다.', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2024-10-01'));
  });
  /*
   [ 제외 사유 ]
   test_002(view가 month 또는 week일 때 테스트)와
   test_003(검색어 변경에 따른 필터링 결과 변경 테스트)에서
   충분히 테스트 되는 내용이라 판단하여 제외하였습니다.
   */
  // it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', async () => {});

  /*
   [ 제외 사유 ]
   useSearch에서 searchTerm이 있는 경우 제목, 설명, 위치에서만 검색을 실행하고 있습니다.
   이 테스트는 다소 광범위하여 "test_001" 테스트로 대체합니다.
   */
  // it('검색어에 맞는 이벤트만 필터링해야 한다', async () => {});

  // test_001
  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', async () => {
    const meetingEvent: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-10-20',
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
    };

    const projectEvent: Event = {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      title: '프로젝트 마감',
      date: '2024-10-25',
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
    };

    const searchTermTestData = [meetingEvent, projectEvent];
    const { result: searchResult } = renderHook(() =>
      useSearch(searchTermTestData, new Date(), 'month')
    );
    const { setSearchTerm } = searchResult.current;

    // title 검색 테스트
    act(() => {
      setSearchTerm('팀 회의');
    });
    expect(searchResult.current.filteredEvents).toEqual([meetingEvent]);
    act(() => {
      setSearchTerm('프로젝트 마감');
    });
    expect(searchResult.current.filteredEvents).toEqual([projectEvent]);

    // description 검색 테스트
    act(() => {
      setSearchTerm('주간 팀 미팅');
    });
    expect(searchResult.current.filteredEvents).toEqual([meetingEvent]);
    act(() => {
      setSearchTerm('분기별 프로젝트 마감');
    });
    expect(searchResult.current.filteredEvents).toEqual([projectEvent]);

    // location 검색 테스트
    act(() => {
      setSearchTerm('회의실 A');
    });
    expect(searchResult.current.filteredEvents).toEqual([meetingEvent]);
    act(() => {
      setSearchTerm('사무실');
    });
    expect(searchResult.current.filteredEvents).toEqual([projectEvent]);
  });

  // test_002
  it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
    const events = [...eventsInSep, ...eventsInOct, ...eventsInNov];

    // 9월(September) 테스트
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-09-01'));
    const searchSepResult = renderHook(() => useSearch(events, new Date(), 'month'));
    expect(searchSepResult.result.current.filteredEvents).toEqual(eventsInSep);

    const searchSepWeekResult = renderHook(() => useSearch(events, new Date(), 'week'));
    expect(searchSepWeekResult.result.current.filteredEvents).toEqual([
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
    ]);

    // 10월(October) 테스트
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-10-07'));
    const searchOctResult = renderHook(() => useSearch(events, new Date(), 'month'));
    expect(searchOctResult.result.current.filteredEvents).toEqual(eventsInOct);

    const searchOctWeekResult = renderHook(() => useSearch(events, new Date(), 'week'));
    expect(searchOctWeekResult.result.current.filteredEvents).toEqual([
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
    ]);
  });

  // test_002
  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const meetingEvent: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-10-01',
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
    };

    const lunchEvent: Event = {
      id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
      title: '점심 약속',
      date: '2024-10-08',
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
    };

    const events = [meetingEvent, lunchEvent];
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    // 초기 상태 : 빈 문자열 검색
    expect(result.current.filteredEvents).toEqual(events);

    // "회의" 검색
    act(() => {
      result.current.setSearchTerm('회의');
    });
    expect(result.current.filteredEvents).toEqual([meetingEvent]);

    // "점심" 검색
    act(() => {
      result.current.setSearchTerm('점심');
    });
    expect(result.current.filteredEvents).toEqual([lunchEvent]);
  });
});
