import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useAppSelector } from '../lib/hooks';
import { selectDailyConsumption } from '../lib/selectors/data.selectors';
import { PickerValue } from '@mui/x-date-pickers/internals';
import AreaGradient from './AreaGradient';

interface Props {
    width?: number | string;
    startDate: PickerValue,
    endDate: PickerValue,
}

export default function DailyConsumption({ width = '100%', startDate, endDate }: Props) {
  const theme = useTheme();

  const dailyData = useAppSelector(selectDailyConsumption)
    .filter(({ date }) => new Date(date) < endDate! && new Date(date) >= startDate!);

  const colorPalette = [
    '#f4a6a6',
    theme.palette.secondary.main,
    theme.palette.primary.main,
  ];

  return (
    <Card variant="outlined" sx={{ width }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Daily Consumption
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Daily consumption split by solar, gas, and electric only homes.
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: dailyData.map(({ date }) => date),
              height: 24,
            },
          ]}
          yAxis={[{ width: 60 }]}
          series={[
            {
              id: 'solar',
              label: 'Solar',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: dailyData.map(({ value }) => value.solar?.consumption ?? 0),
            },
            {
              id: 'low-winter',
              label: 'Gas',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: dailyData.map(({ value }) => value.lowWinter?.consumption ?? 0),
            },
            {
              id: 'high-winter',
              label: 'Electric Only',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: dailyData.map(({ value }) => value.highWinter?.consumption ?? 0),
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-solar': {
              fill: "url('#solar')",
            },
            '& .MuiAreaElement-series-low-winter': {
              fill: "url('#low-winter')",
            },
            '& .MuiAreaElement-series-high-winter': {
              fill: "url('#high-winter')",
            },
          }}
          hideLegend
        >
          <AreaGradient color={'#f4a6a6'} id="solar" />
          <AreaGradient color={theme.palette.secondary.main} id="low-winter" />
          <AreaGradient color={theme.palette.primary.main} id="high-winter" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
