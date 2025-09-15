import { createTheme } from '@mui/material/styles';

// Paleta de cores para o tema claro
const lightPalette = {
  primary: { main: '#6d28d9', light: '#8b5cf6', dark: '#5b21b6' },
  secondary: { main: '#db2777', light: '#f472b6', dark: '#be185d' },
  background: { 
    default: '#f3f4f6', // Um cinza bem claro
    paper: 'rgba(255, 255, 255, 0.9)' // Papel com um pouco de transparência
  },
  text: { primary: '#1f2937', secondary: '#4b5563' },
  success: { main: '#10b981' },
  warning: { main: '#f59e0b' },
};

// Paleta de cores para o tema escuro
const darkPalette = {
  primary: { main: '#a78bfa', light: '#c4b5fd', dark: '#8b5cf6' },
  secondary: { main: '#f472b6', light: '#f9a8d4', dark: '#db2777' },
  background: { 
    default: '#111827', // Azul escuro profundo
    paper: 'rgba(31, 41, 55, 0.85)' // Papel escuro com transparência
  },
  text: { primary: '#f9fafb', secondary: '#d1d5db' },
  success: { main: '#34d399' },
  warning: { main: '#fbbf24' },
};

// Função que cria e retorna o tema completo
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: mode === 'light' ? lightPalette.text.primary : darkPalette.text.primary },
    h5: { fontWeight: 600, color: mode === 'light' ? lightPalette.text.primary : darkPalette.text.primary },
    h6: { fontWeight: 600, color: mode === 'light' ? lightPalette.text.primary : darkPalette.text.primary },
  },
  shape: {
    borderRadius: 12, // Bordas mais arredondadas
  },
  components: {
    // Estilo base para o efeito de vidro
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
           // Para o drawer, a cor de fundo vem da paleta
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(31, 41, 55, 0.7)',
          borderRight: 'none',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(31, 41, 55, 0.7)',
          boxShadow: 'none',
          color: mode === 'light' ? lightPalette.text.primary : darkPalette.text.primary,
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'transform 0.15s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: 'none',
          }
        },
        containedPrimary: {
          color: '#fff', // Garante que o texto seja branco no botão primário
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 16px',
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? lightPalette.primary.main : darkPalette.primary.main,
            color: '#fff',
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
            '&:hover': {
                backgroundColor: mode === 'light' ? lightPalette.primary.dark : darkPalette.primary.dark,
            }
          }
        }
      }
    }
  }
});