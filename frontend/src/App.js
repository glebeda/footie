import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import AdminPage from './pages/AdminPage'
import PastGamesPage from './pages/PastGamesPage';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignUpPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/past-games' element={<PastGamesPage />} />
      </Routes>
    </Router>
  )
}

export default App
