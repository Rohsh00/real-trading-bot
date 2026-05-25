import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#6366f1' : '#4f46e5', // Indigo
        dark: isDark ? '#4f46e5' : '#3730a3',
        light: isDark ? '#818cf8' : '#6366f1',
      },
      secondary: {
        main: isDark ? '#10b981' : '#059669', // Emerald
        dark: isDark ? '#059669' : '#065f46',
        light: isDark ? '#34d399' : '#10b981',
      },
      background: {
        default: isDark ? '#0b0f19' : '#f3f4f6',
        paper: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f3f4f6' : '#111827',
        secondary: isDark ? '#9ca3af' : '#4b5563',
        disabled: isDark ? '#6b7280' : '#9ca3af',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: [
        'Plus Jakarta Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 20px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark ? '0 4px 30px rgba(0, 0, 0, 0.3)' : '0 4px 30px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: isDark ? '#0b0f19' : '#ffffff',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            color: isDark ? '#9ca3af' : '#4b5563',
          },
          root: {
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  });
};
