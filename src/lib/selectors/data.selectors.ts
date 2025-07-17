import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { DataState } from "../reducers/data.slice";
import { getISOWeek, getYear, format, isAfter } from "date-fns";
import DataRow from "@/src/models/DataRow";

export const selectRawSolarIntervals = createSelector(
    (state: RootState) => state.data,
    (state: DataState) => state.solarIntervals
);

export const selectRawLowWinterInternals = createSelector(
    (state: RootState) => state.data,
    (state: DataState) => state.lowWinterIntervals
);

export const selectRawHighWinterIntervals = createSelector(
    (state: RootState) => state.data,
    (state: DataState) => state.highWinterIntervals
);

export const selectLoadingData = createSelector(
    selectRawSolarIntervals,
    selectRawLowWinterInternals,
    selectRawHighWinterIntervals,
    (solarIntervals, lowWinterIntervals, highWinterIntervals) =>
        !solarIntervals.length || !lowWinterIntervals.length || !highWinterIntervals.length
)

export const selectDailySolarIntervalsMap = createSelector(
    selectRawSolarIntervals,
    (solarIntervals: DataRow[]) => createDailyIntervalsMap(solarIntervals)
);

export const selectDailyLowWinterIntervalsMap = createSelector(
    selectRawLowWinterInternals,
    (lowWinterIntervals: DataRow[]) => createDailyIntervalsMap(lowWinterIntervals)
);

export const selectDailyHighWinterIntervalsMap = createSelector(
    selectRawHighWinterIntervals,
    (highWinterIntervals: DataRow[]) => createDailyIntervalsMap(highWinterIntervals)
);

export const selectWeeklySolarIntervalsMap = createSelector(
    selectRawSolarIntervals,
    (solarIntervals: DataRow[]) => createWeeklyIntervalsMap(solarIntervals)
);

export const selectYearlySolarIntervalsMap = createSelector(
    selectRawSolarIntervals,
    (solarIntervals: DataRow[]) => createYearlyIntervalsMap(solarIntervals)
);

export const selectDailyIntervalsMap = createSelector(
    selectDailySolarIntervalsMap,
    selectDailyLowWinterIntervalsMap,
    selectDailyHighWinterIntervalsMap,
    (solarIntervals, lowWinterIntervals, highWinterIntervals) => {
        const dailyConsumptionIntervals: Record<string, any> = { };

        Object.entries(solarIntervals).forEach(([day, value]) => {
            dailyConsumptionIntervals[day] = { 
                solar: value,
                total: value
            };
        });

        Object.entries(lowWinterIntervals).forEach(([day, value]) => {
            dailyConsumptionIntervals[day] = {
                ...(dailyConsumptionIntervals[day] ?? {}),
                lowWinter: value,
                total: {
                    consumption: (dailyConsumptionIntervals[day]?.total?.consumption ?? 0) + value.consumption,
                    generation: (dailyConsumptionIntervals[day]?.total?.generation ?? 0) + value.generation,
                }
            };
        });

        Object.entries(highWinterIntervals).forEach(([day, value]) => {
            dailyConsumptionIntervals[day] = {
                ...(dailyConsumptionIntervals[day] ?? {}),
                highWinter: value,
                total: {
                    consumption: (dailyConsumptionIntervals[day]?.total?.consumption ?? 0) + value.consumption,
                    generation: (dailyConsumptionIntervals[day]?.total?.generation ?? 0) + value.generation,
                }
            };
        });

        return dailyConsumptionIntervals;
    }
)

export const selectDailyConsumption = createSelector(
    selectDailyIntervalsMap,
    (dailyIntervalsMap) => {
        return Object.entries(dailyIntervalsMap)
            .sort((a, b) => isAfter(new Date(a[0]), new Date(b[0])) ? 1 : -11)
            .map(([date, value]) => ({ date, value }));
    }
)

const createDailyIntervalsMap = (rows: DataRow[]) =>
    createIntervalsMap(rows, (datetime: number) => format(datetime, 'MM/dd/yyyy'))

const createWeeklyIntervalsMap = (rows: DataRow[]) => 
    createIntervalsMap(rows, (datetime: number) => `${getYear(datetime)}-${getISOWeek(datetime)}`)

const createYearlyIntervalsMap = (rows: DataRow[]) => 
    createIntervalsMap(rows, (datetime: number) => `${getYear(datetime)}`)

function createIntervalsMap(rows: DataRow[], createKey: (datetime: number) => string) {
    return rows.reduce(
        (agg: Record<string, { consumption: number, generation: number }>, curr) => {
            const key = createKey(curr.datetime)

            if (isNaN(curr.generation) || isNaN(curr.consumption)) { return agg; }

            return {
                ...agg,
                [key]: {
                    consumption: (agg[key]?.consumption ?? 0) + curr.consumption,
                    generation: (agg[key]?.generation ?? 0) + curr.generation,
                }
            }
        }, {})
}