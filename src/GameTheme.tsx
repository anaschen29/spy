import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const GameThemeContext = createContext({ isDarkMode: true, toggleMode: () => {} });
export const useGameTheme = () => useContext(GameThemeContext);

export default function GameTheme({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { main: isDarkMode ? '#70dbc7' : '#157568', contrastText: '#09221f' },
      secondary: { main: isDarkMode ? '#a7b7cd' : '#4c607b' },
      error: { main: isDarkMode ? '#ff9992' : '#b43e39' },
      background: { default: isDarkMode ? '#0c1524' : '#f6f4ed', paper: isDarkMode ? '#142135' : '#fffef9' },
      text: { primary: isDarkMode ? '#f4f0e6' : '#17263a', secondary: isDarkMode ? '#a7b5c8' : '#526278' },
      divider: isDarkMode ? '#2b3b50' : '#d9dfdf'
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontWeight: 750, letterSpacing: '-0.045em' },
      h2: { fontWeight: 750, letterSpacing: '-0.04em' },
      h4: { fontWeight: 700, letterSpacing: '-0.03em' },
      h5: { fontWeight: 700, letterSpacing: '-0.025em' },
      h6: { fontWeight: 650 },
      button: { textTransform: 'none', fontWeight: 650 },
      overline: { fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.68rem' }
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 48, paddingInline: 20, borderRadius: 12 }, containedPrimary: { color: isDarkMode ? '#09221f' : '#ffffff' } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 48, minHeight: 48 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12, minHeight: 56 } } },
      MuiDialog: { styleOverrides: { paper: { border: '1px solid', borderColor: isDarkMode ? '#2b3b50' : '#d9dfdf' } } },
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
