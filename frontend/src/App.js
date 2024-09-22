import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import AdminPage from './pages/AdminPage'
import AttendancePage from './pages/AttendancePage';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignUpPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </Router>
  )
}

export default App
