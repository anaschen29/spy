import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const GameThemeContext = createContext({ isDarkMode: false, toggleMode: () => {} });
export const useGameTheme = () => useContext(GameThemeContext);

export default function GameTheme({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { main: isDarkMode ? '#aebaff' : '#3534d5', contrastText: isDarkMode ? '#1b1c30' : '#ffffff' },
      secondary: { main: isDarkMode ? '#f1cb63' : '#725711' },
      error: { main: isDarkMode ? '#ff9a87' : '#b63724' },
      background: { default: isDarkMode ? '#1c1d29' : '#fff6e3', paper: isDarkMode ? '#292b3b' : '#fffdf6' },
      text: { primary: isDarkMode ? '#fff4dc' : '#242337', secondary: isDarkMode ? '#bfbdcf' : '#666171' },
      divider: isDarkMode ? '#6e6b81' : '#c7bfad'
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
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 48, paddingInline: 20, borderRadius: 8 }, containedPrimary: { color: isDarkMode ? '#1b1c30' : '#ffffff', border: '2px solid', borderColor: isDarkMode ? '#aebaff' : '#242337', boxShadow: `3px 3px 0 ${isDarkMode ? '#0f101b' : '#242337'}`, '&:hover': { boxShadow: `1px 1px 0 ${isDarkMode ? '#0f101b' : '#242337'}`, transform: 'translate(2px, 2px)' } } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 48, minHeight: 48 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 8, minHeight: 56 } } },
      MuiDialog: { styleOverrides: { paper: { border: '2px solid', borderColor: isDarkMode ? '#6e6b81' : '#242337' } } },
      MuiDialogTitle: { styleOverrides: { root: { padding: '24px 24px 16px', fontWeight: 700 } } },
      MuiDialogActions: { styleOverrides: { root: { padding: '16px 24px', gap: 8 } } },
      MuiMenuItem: { styleOverrides: { root: { minHeight: 48 } } },
      MuiCssBaseline: { styleOverrides: { body: { minHeight: '100dvh' } } }
    }
  }), [isDarkMode]);

  return (
    <GameThemeContext.Provider value={{ isDarkMode, toggleMode: () => setIsDarkMode(value => !value) }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </GameThemeContext.Provider>
  );
}
