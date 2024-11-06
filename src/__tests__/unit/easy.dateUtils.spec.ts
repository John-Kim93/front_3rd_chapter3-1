import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';
import { makeAMonthEvents } from '../utils';

describe('getDaysInMonth', () => {
  const testYear = 2025;
  const testLeapYear = 2024;
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(testYear, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(testYear, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(testLeapYear, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(testYear, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    expect(getDaysInMonth(testYear, 13)).toBe(getDaysInMonth(testYear + 1, 1));
    expect(getDaysInMonth(testYear, 0)).toBe(getDaysInMonth(testYear - 1, 12));
    expect(getDaysInMonth(testYear, NaN)).toBeNaN();
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    expect(getWeekDates(new Date('2024-11-06'))).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    expect(getWeekDates(new Date('2024-11-03'))).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    expect(getWeekDates(new Date('2024-11-09'))).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    expect(getWeekDates(new Date('2024-12-31'))).toEqual([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    expect(getWeekDates(new Date('2025-01-01'))).toEqual([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    expect(getWeekDates(new Date('2024-02-29'))).toEqual([
      new Date('2024-02-25'),
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'),
    ]);
  });

  /*
   [ 제외 사유 ]
   연도를 넘어가는 테스트 시 반드시 테스트되는 내용임으로 제외하였습니다.
   */
  // it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {});
});

describe('getWeeksAtMonth : 2차원 배열 형태로 파라미터로 전달한 달의 주 정보를 반환한다.', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    expect(getWeeksAtMonth(new Date('2024-07-01'))).toEqual([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const OctoberDays = makeAMonthEvents({ month: 10, from: 1, to: 31 });
    expect(getEventsForDay(OctoberDays, 1)).toEqual([
      {
        id: '1',
        title: '기존 회의',
        date: `2024-10-01`,
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

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const OctoberDays = makeAMonthEvents({ month: 10, from: 1, to: 31 });

    const removeTen = OctoberDays.filter((event) => event.date !== '2024-10-10');
    expect(getEventsForDay(removeTen, 10)).toEqual([]);
    const removeTwenty = OctoberDays.filter((event) => event.date !== '2024-10-20');
    expect(getEventsForDay(removeTwenty, 20)).toEqual([]);
    const removeThirty = OctoberDays.filter((event) => event.date !== '2024-10-30');
    expect(getEventsForDay(removeThirty, 30)).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const OctoberDays = makeAMonthEvents({ month: 10, from: 1, to: 31 });
    expect(getEventsForDay(OctoberDays, 0)).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const OctoberDays = makeAMonthEvents({ month: 10, from: 1, to: 31 });
    expect(getEventsForDay(OctoberDays, 32)).toEqual([]);
  });
});

describe('formatWeek : 목요일을 중간 요일로 보고 목요일이 속한 주차를 반환한다.', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2024-10-10'))).toBe('2024년 10월 2주');
    expect(formatWeek(new Date('2024-10-17'))).toBe('2024년 10월 3주');
    expect(formatWeek(new Date('2024-10-24'))).toBe('2024년 10월 4주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    // 목요일이 다른 달인 경우
    expect(formatWeek(new Date('2024-09-30'))).toBe('2024년 10월 1주');

    // 목요일이 같은 달인 경우
    expect(formatWeek(new Date('2024-10-03'))).toBe('2024년 10월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    // 목요일이 같은 달인 경우
    expect(formatWeek(new Date('2024-10-29'))).toBe('2024년 10월 5주');

    // 목요일이 다른 달인 경우
    expect(formatWeek(new Date('2024-11-01'))).toBe('2024년 10월 5주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    // 목요일이 다른 해인 경우
    expect(formatWeek(new Date('2024-12-31'))).toBe('2025년 1월 1주');

    // 목요일이 같은 해인 경우
    expect(formatWeek(new Date('2025-01-01'))).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2024-02-29'))).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-28'))).toBe('2025년 2월 4주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    expect(formatMonth(new Date('2024-07-10'))).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-10'), rangeStart, rangeEnd)).toBeTruthy();
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-01'), rangeStart, rangeEnd)).toBeTruthy();
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-31'), rangeStart, rangeEnd)).toBeTruthy();
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    expect(isDateInRange(new Date('2024-06-30'), rangeStart, rangeEnd)).toBeFalsy();
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    expect(isDateInRange(new Date('2024-08-01'), rangeStart, rangeEnd)).toBeFalsy();
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const res: boolean[] = [...Array(31)];
    res.map((_, i) => {
      res[i] = isDateInRange(new Date(`2024-07-${i + 1}`), rangeEnd, rangeStart);
    });
    expect(res.every((isInRange) => !isInRange)).toBeTruthy();
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    expect(fillZero(5, 2)).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    expect(fillZero(10, 2)).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  /*
   * [제외 사유]
   * 마지막 테스트에서 한 번에 테스트하고 있음
   **/
  // test("100을 2자리로 변환하면 '100'을 반환한다", () => {
  //   expect(fillZero(100, 2)).toBe('100');
  // });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    expect(fillZero(0, 2)).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  // ??? 소수점은 예외처리를 해야하지 않나 싶습니다... 03.14를 다섯자리 숫자라고 하나요..?
  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    expect(fillZero(1)).toBe('01');
    expect(fillZero(10)).toBe('10');
    expect(fillZero(100)).toBe('100');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    // 사이즈 증가
    expect(fillZero(100, 1)).toBe('100');
    expect(fillZero(100, 2)).toBe('100');
    expect(fillZero(100, 3)).toBe('100');
    expect(fillZero(100, 4)).toBe('0100');
    expect(fillZero(100, 5)).toBe('00100');

    // 값이 감소
    expect(fillZero(10000, 3)).toBe('10000');
    expect(fillZero(1000, 3)).toBe('1000');
    expect(fillZero(100, 3)).toBe('100');
    expect(fillZero(10, 3)).toBe('010');
    expect(fillZero(1, 3)).toBe('001');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2024-10-01'));
  });
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    expect(formatDate(new Date())).toBe('2024-10-01');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    expect(formatDate(new Date(), 30)).toBe('2024-10-30');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    vi.setSystemTime(new Date('2024-09-01'));
    expect(formatDate(new Date(), 30)).toBe('2024-09-30');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    vi.setSystemTime(new Date('2024-09-01'));
    expect(formatDate(new Date(), 3)).toBe('2024-09-03');
  });
});
