import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';

import {Amplify, Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

import Navigation from './components/Navigation';
import SignUpPage from './pages/SignUpPage';
import AdminPage from './pages/AdminPage';
import AttendancePage from './pages/AttendancePage';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };

    const listener = ({ payload: { event } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          checkUser();
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.error('Sign in failure');
          break;
        default:
          break;
      }
    };

    Hub.listen('auth', listener);
    checkUser();

    return () => {
      Hub.remove('auth', listener);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation user={user} />
        <Routes>
          <Route path="/" element={<SignUpPage user={user} />} />
          <Route path="/admin" element={<AdminPage user={user} />} />
          <Route path="/attendance" element={<AttendancePage user={user} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
