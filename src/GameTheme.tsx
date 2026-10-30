import { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#aebaff', contrastText: '#1b1c30' },
      secondary: { main: '#f1cb63' },
      error: { main: '#ff9186' },
      background: { default: '#20191f', paper: '#2c2530' },
      text: { primary: '#fff4dc', secondary: '#c9bdc7' },
      divider: '#786575'
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontWeight: 850, letterSpacing: '-0.04em' },
      h2: { fontWeight: 850, letterSpacing: '-0.04em' },
      h4: { fontWeight: 700, letterSpacing: '-0.03em' },
      h5: { fontWeight: 700, letterSpacing: '-0.025em' },
      h6: { fontWeight: 750 },
      button: { textTransform: 'none', fontWeight: 750 },
      overline: { fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.68rem' }
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 48, paddingInline: 20, borderRadius: 8 }, containedPrimary: { color: '#1b1c30', border: '2px solid', borderColor: '#aebaff', boxShadow: `3px 3px 0 #100b10`, '&:hover': { boxShadow: `1px 1px 0 #100b10`, transform: 'translate(2px, 2px)' } } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 48, minHeight: 48 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 8, minHeight: 56 } } },
      MuiDialog: { styleOverrides: { paper: { border: '2px solid', borderColor: '#786575' } } },
      MuiDialogTitle: { styleOverrides: { root: { padding: '24px 24px 16px', fontWeight: 700 } } },
      MuiDialogActions: { styleOverrides: { root: { padding: '16px 24px', gap: 8 } } },
      MuiMenuItem: { styleOverrides: { root: { minHeight: 48 } } },
      MuiCssBaseline: { styleOverrides: { body: { minHeight: '100dvh' } } }
    }
 });

export default function GameTheme({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
