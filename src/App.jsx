import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/Login'
import ProtectedRoute from './components/ProtectRoutes'
function App() {
  return (
 
    <Routes>
      <Route path='/'element={<AdminLogin/>} />
      <Route path='/dashboard'element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>

  )
}

export default App