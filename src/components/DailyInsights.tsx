import { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useAppSelector } from '../lib/hooks';
import { selectDailyConsumption } from '../lib/selectors/data.selectors';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { FormControlLabel, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PRICE_PER_kWh } from '../constants/app';

interface Props {
    width?: number | string;
    startDate: PickerValue,
    endDate: PickerValue,
}

export default function DailyInsights({ width = '100%', startDate, endDate }: Props) {
  const [showCost, setShowCost] = useState(false);

  const dailyData = useAppSelector(selectDailyConsumption)
    .filter(({ date }) => new Date(date) < endDate! && new Date(date) >= startDate!);

  const highestUsageDate = useMemo(() => {
    return [...dailyData].sort((a, b) =>
      a.value.total.consumption > b.value.total.consumption ? -1 : 1
    )?.[0]
  }, [dailyData]);

  const lowestUsageDate = useMemo(() => {
    return [...dailyData].sort((a, b) =>
      a.value.total.consumption > b.value.total.consumption ? 1 : -1
    )?.[0]
  }, [dailyData]);

  const highestGenerationDate = useMemo(() => {
    return [...dailyData].sort((a, b) =>
      a.value.total.generation > b.value.total.generation ? -1 : 1
    )?.[0]
  }, [dailyData]);

  const lowestGenerationDate = useMemo(() => {
    return [...dailyData].sort((a, b) =>
      a.value.total.generation > b.value.total.generation ? 1 : -1
    )?.[0]
  }, [dailyData]);

  return (
    <Card variant="outlined" sx={{ width }}>
      <CardContent>
        <Stack alignContent="center" justifyContent="space-between" direction="row" width="100%">
          <Typography component="h2" variant="subtitle2">
            Sessions
          </Typography>
          <FormControlLabel
              control={
                <Switch size="small" color="secondary" checked={showCost} onChange={(event) => setShowCost(event.target.checked)} />
              }
              label={<Typography sx={{ fontSize: 14}}>Show Cost</Typography>}
          />
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Metric</b></TableCell>
                <TableCell align="right"><b>{showCost ? 'Cost' : 'Usage'}</b></TableCell>
                <TableCell align="right"><b>Date</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Highest Consumption</TableCell>
                <TableCell align="right">{displayValue(highestUsageDate.value?.total?.consumption, showCost)}</TableCell>
                <TableCell align="right">{highestUsageDate.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lowest Consumption</TableCell>
                <TableCell align="right">{displayValue(lowestUsageDate.value?.total?.consumption, showCost)}</TableCell>
                <TableCell align="right">{lowestUsageDate.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Highest Generation</TableCell>
                <TableCell align="right">{displayValue(highestGenerationDate.value?.total?.generation, showCost)}</TableCell>
                <TableCell align="right">{highestGenerationDate.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lowest Generation</TableCell>
                <TableCell align="right">{displayValue(lowestGenerationDate.value?.total?.generation, showCost)}</TableCell>
                <TableCell align="right">{lowestGenerationDate.date}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

const displayValue = (value: number, showCost: boolean) =>
  showCost ? `$ ${(value * PRICE_PER_kWh).toFixed(2)}` : `${value} kWh`;
