import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import Navigation from './components/Navigation';
import SignUpPage from './pages/SignUpPage'
import AdminPage from './pages/AdminPage'
import AttendancePage from './pages/AttendancePage';
import { CssBaseline } from '@mui/material';
import theme from './theme';

function App () {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
