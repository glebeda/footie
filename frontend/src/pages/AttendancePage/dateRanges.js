const BASE_SEASON_START_YEAR = 2023;
const SEASON_START_MONTH_INDEX = 7; // August
const ALL_TIME_START_DATE = '2022-01-01';

export const getCurrentSeasonStartYear = (currentDate = new Date()) => {
  const year = currentDate.getFullYear();
  return currentDate.getMonth() >= SEASON_START_MONTH_INDEX ? year : year - 1;
};

export const formatSeasonLabel = (seasonStartYear) => {
  const seasonEndYearShort = String((seasonStartYear + 1) % 100).padStart(2, '0');
  return `${seasonStartYear}-${seasonEndYearShort}`;
};

export const buildSeasonDateRanges = (currentDate = new Date()) => {
  const currentSeasonStartYear = getCurrentSeasonStartYear(currentDate);
  const dateRanges = {};

  for (let year = currentSeasonStartYear; year >= BASE_SEASON_START_YEAR; year -= 1) {
    dateRanges[formatSeasonLabel(year)] = {
      startDate: `${year}-08-01`,
      endDate: `${year + 1}-07-31`,
    };
  }

  dateRanges['All Time'] = {
    startDate: ALL_TIME_START_DATE,
    endDate: `${currentSeasonStartYear + 1}-07-31`,
  };

  return dateRanges;
};
