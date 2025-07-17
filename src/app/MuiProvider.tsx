'use client'
import { ThemeProvider } from '@emotion/react';
import { createTheme, StyledEngineProvider, Theme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function MuiProvider({
  children
}: {
  children: React.ReactNode
}) {
  const theme = createTheme({
    palette: {
      primary: { main: '#aed7d9' },
      secondary: { main: '#f0d28f' },
      error: { main: '#c28f8f' },
      success: { main: '#aed9ae' }
    }
  })

  return (
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {children}
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
  );
}

