import { createTheme } from '@mui/material/styles';

// Paleta de cores para o tema claro
const lightPalette = {
  primary: { main: '#264653' },
  secondary: { main: '#e76f51' },
  background: { default: '#f8f9fa', paper: '#ffffff' },
  success: { main: '#2a9d8f' },
  warning: { main: '#e9c46a' },
};

// Paleta de cores para o tema escuro
const darkPalette = {
  primary: { main: '#4cc9f0' }, // Um azul ciano claro e vibrante
  secondary: { main: '#f4a261' }, // Um laranja mais claro para contraste
  background: { default: '#121212', paper: '#1e1e1e' }, // Fundos padrão para modo escuro
  success: { main: '#2a9d8f' },
  warning: { main: '#e9c46a' },
  text: { primary: '#ffffff', secondary: '#b0b0b0' }, // Cores de texto para fundo escuro
};

// Função que cria e retorna o tema completo
export const getTheme = (mode) => createTheme({
  palette: {
    mode, // Informa ao MUI se o modo é 'light' ou 'dark'
    ...(mode === 'light' ? lightPalette : darkPalette), // Usa a paleta correta
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        }
      }
    }
  }
});