import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { areaElementClasses, SparkLineChart } from '@mui/x-charts';
import React from 'react';
import { PRIMARY_COLOR } from '../constants/app';
import AreaGradient from './AreaGradient';

interface Props {
    id: string;
    title: string;
    data: number[];
    showAvg?: boolean;
    prefix?: string;
    suffix?: string;
    color?: string;
    width?: string | number;
}

function MetricCard({ id, title, showAvg, prefix = '', suffix = '', data, color = PRIMARY_COLOR, width }: Props) {
    const sum = data.reduce((curr, acc) => acc + curr, 0);
    const value = showAvg ? Math.round(data.reduce((curr, acc) => acc + curr, 0) / data.length) : sum;

    return (
        <Card variant="outlined" sx={{ width }}>
          <CardContent>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              {showAvg ? 'Average' : 'Total'} {title}
            </Typography>
            <Stack
              sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
            >
              <Stack sx={{ justifyContent: 'space-between' }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h4" component="p">
                    {`${prefix} ${value} ${suffix}`}
                  </Typography>
                </Stack>
              </Stack>
              <Box sx={{ width: '100%', height: 75 }}>
                <SparkLineChart
                  color={color}
                  data={data}
                  area
                  showHighlight
                  showTooltip
                  valueFormatter={(v) => `${prefix} ${v} ${suffix}`}
                  sx={{
                    [`& .${areaElementClasses.root}`]: {
                      fill: `url(#area-gradient-${id})`,
                    },
                  }}
                >
                  <AreaGradient color={color} id={`area-gradient-${id}`} />
                </SparkLineChart>
              </Box>
            </Stack>
          </CardContent>
        </Card>
    )
}

export default MetricCard;
