import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import Navigation from './components/Navigation';
import SignUpPage from './pages/SignUpPage';
import AdminPage from './pages/AdminPage';
import AttendancePage from './pages/AttendancePage';
import { AuthProvider } from './contexts/AuthContext';

Amplify.configure(awsconfig);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;