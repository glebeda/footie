import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import AdminPage from './pages/AdminPage'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignUpPage />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
