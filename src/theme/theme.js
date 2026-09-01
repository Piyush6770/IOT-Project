import { createTheme } from '@mui/material/styles';

export const getCustomTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#C6F26C', // Lime-green
        light: '#E2FF9E',
        dark: '#2FBFA0', // Teal-green
        contrastText: '#0D0D12',
      },
      secondary: {
        main: '#9B7BFF', // Purple-indigo accent
        light: '#C4B0FF',
        dark: '#5B4CFF',
        contrastText: '#FFFFFF',
      },
      charcoal: {
        main: '#121218',
        card: isDark ? '#17171F' : '#FFFFFF',
        border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      },
      warning: {
        main: '#FFB020',
        light: '#FFD166',
        dark: '#D97706',
      },
      error: {
        main: '#FF5B6E', // Warm Coral/Red
        light: '#FF8BA0',
        dark: '#E11D48',
      },
      success: {
        main: '#2FBFA0', // Teal-green
        light: '#C6F26C',
        dark: '#10B981',
      },
      info: {
        main: '#4D9CFF', // Sky blue
        light: '#82B7FF',
        dark: '#2563EB',
      },
      background: {
        default: isDark ? '#09090D' : '#EAE8F4', // Page backdrop floating environment
        paper: isDark ? '#17171F' : '#FFFFFF', // Card surface
        frame: isDark ? '#121218' : '#F8F7FC', // Device container frame
        glass: isDark ? 'rgba(23, 23, 31, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      },
      text: {
        primary: isDark ? '#F5F5F7' : '#121218',
        secondary: isDark ? '#9A9AA5' : '#646473',
        disabled: isDark ? '#5C5C6B' : '#9494A3',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontWeight: 800,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      subtitle1: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: 999, // Pill shape
      },
    },
    shape: {
      borderRadius: 20, // Generous corner radius everywhere
    },
    shadows: [
      'none',
      isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
      isDark ? '0 8px 30px rgba(0, 0, 0, 0.5)' : '0 8px 30px rgba(0, 0, 0, 0.06)',
      isDark ? '0 16px 40px rgba(0, 0, 0, 0.6)' : '0 16px 40px rgba(0, 0, 0, 0.08)',
      ...Array(21).fill(isDark ? '0 24px 60px rgba(0, 0, 0, 0.7)' : '0 24px 60px rgba(0, 0, 0, 0.1)'),
    ],
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#17171F' : '#FFFFFF',
            borderRadius: 20,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: isDark
              ? '0 12px 32px rgba(0, 0, 0, 0.45)'
              : '0 12px 32px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999, // Full pill shape
            padding: '10px 24px',
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(198, 242, 108, 0.25)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #C6F26C 0%, #2FBFA0 100%)',
            color: '#0D0D12',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999, // Pill shape
            fontWeight: 700,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
          },
          head: {
            fontWeight: 700,
            color: isDark ? '#9A9AA5' : '#646473',
            backgroundColor: isDark ? 'rgba(18, 18, 24, 0.8)' : 'rgba(240, 240, 248, 0.8)',
          },
        },
      },
    },
  });
};
