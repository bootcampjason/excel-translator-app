// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#217346',        // Excel green
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',         // Red for delete/cancel
      contrastText: '#fff',
    },
    googleLight: {
      main: '#F2F2F2'
    },
    white: {
      main: '#fff',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#217346',
          '&:hover': {
            backgroundColor: '#1e5e3d',  // Darker green on hover
          },
        },
        outlinedError: {
          borderColor: '#d32f2f',
          color: '#d32f2f',
          '&:hover': {
            backgroundColor: '#fcebea',  // Light red background
            borderColor: '#b71c1c',
            color: '#b71c1c',
          },
        },
        outlinedWhite: {
          borderColor: '#fff',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#278752',
          },
        },
      },
    },
  },
});

export default theme;
