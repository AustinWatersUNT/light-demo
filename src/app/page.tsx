'use client'
import { useAppSelector } from "../lib/hooks";
import { selectDailyConsumption, selectLoadingData } from "../lib/selectors/data.selectors";
import LoadingContainer from "../components/LoadingContainer";
import { Button, FormControlLabel, Stack, Switch, Typography, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MetricCard from "../components/MetricCard";
import { useState } from "react";
import { subDays } from 'date-fns'
import { PickerValue } from "@mui/x-date-pickers/internals";
import { PRICE_PER_kWh } from "../constants/app";
import DailyConsumption from "../components/DailyConsumption";
import DailyInsights from "../components/DailyInsights";

const MIN_DATE = new Date('2023-06-02');
const MAX_DATE = new Date('2025-04-22');

export default function Home() {
  const theme = useTheme();

  const [startDate, setStartDate] = useState<PickerValue>(subDays(MAX_DATE, 30));
  const [endDate, setEndDate] = useState<PickerValue>(MAX_DATE);
  const [showAvg, setShowAvg] = useState(true);

  const loading = useAppSelector(selectLoadingData);
  const dailyData = useAppSelector(selectDailyConsumption)
    .filter(({ date }) => new Date(date) < endDate! && new Date(date) >= startDate!);

  function onAllTime() {
    setStartDate(MIN_DATE);
    setEndDate(MAX_DATE);
  }

  function onLast30Days() {
    setStartDate(subDays(MAX_DATE, 30));
    setEndDate(MAX_DATE);
  }

  return (
    <LoadingContainer loading={loading}>
      <Stack padding={3} gap={2}>
        <Stack direction="row" gap={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
            onChange={(newValue) => setEndDate(newValue)}
          />
          <Button variant="contained" onClick={onLast30Days}>Last 30 Days</Button>
          <Button variant="contained" onClick={onAllTime}>All Time</Button>
          <FormControlLabel
              control={
                <Switch color="secondary" checked={showAvg} onChange={(event) => setShowAvg(event.target.checked)} />
              }
              label={showAvg ? 'Show Average' : 'Show Total'}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <MetricCard 
            id="daily-consumption"
            title="Daily Consumption"
            suffix="kWh"
            width="33%"
            showAvg={showAvg}
            data={dailyData.map(({ value }) => value.total.consumption)}
          />
          <MetricCard 
            id="daily-generation"
            title="Daily Generation"
            suffix="kWh"
            color={theme.palette.success.main}
            width="33%"
            showAvg={showAvg}
            data={dailyData.map(({ value }) => value.total.generation)}

          />
          <MetricCard 
            id="daily-consumption-cost"
            title="Daily Consumption Cost"
            prefix="$"
            width="33%"
            color={theme.palette.error.main}
            showAvg={showAvg}
            data={dailyData.map(({ value }) => parseInt((value.total.consumption * PRICE_PER_kWh).toFixed(2)))}
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <DailyConsumption width="60%" startDate={startDate} endDate={endDate} />
          <DailyInsights width="40%" startDate={startDate} endDate={endDate} />
        </Stack>
      </Stack>
    </LoadingContainer>
  );
}