import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'

// Pages
import Home from './pages/home'

// Sub pages
import Announcement from './pages/announcement'
import Events from './pages/events'
import Academics from './pages/academics'
import Sports from './pages/sports'
import Entertainments from './pages/entertainments'

// Sign In and Sign Out
import SignUpPage from './pages/SignUpPage' 
import SignInPage from './pages/SignInPage' 

function App() {

  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
          <Route path="/" element={<Home />} />

          {/* Sub pages */}
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/events" element={<Events />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/entertainments" element={<Entertainments />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
