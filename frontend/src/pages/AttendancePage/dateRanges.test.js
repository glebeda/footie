import { buildSeasonDateRanges, getCurrentSeasonStartYear } from './dateRanges';

describe('AttendancePage date ranges', () => {
  it('derives the current season correctly before August', () => {
    const currentSeasonStartYear = getCurrentSeasonStartYear(new Date('2026-02-06T12:00:00Z'));
    expect(currentSeasonStartYear).toBe(2025);
  });

  it('includes the current season and all-time range based on current date', () => {
    const dateRanges = buildSeasonDateRanges(new Date('2026-02-06T12:00:00Z'));

    expect(Object.keys(dateRanges)).toEqual([
      '2025-26',
      '2024-25',
      '2023-24',
      'All Time',
    ]);

    expect(dateRanges['All Time']).toEqual({
      startDate: '2022-01-01',
      endDate: '2026-07-31',
    });
  });
});
