import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2ECC71', // Green
    },
    secondary: {
      main: '#E74C3C', // Dark Grey
    },
    background: {
      default: '#F5F5F5', // Light Grey
    },
    text: {
      primary: '#2C3E50', // Dark Grey
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // White background for input fields
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#95A5A6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#95A5A6', // Lighter grey on focus
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#2C3E50', // Dark grey for label when focused
          },
        },
      },
    },
  },
});

export default theme;
