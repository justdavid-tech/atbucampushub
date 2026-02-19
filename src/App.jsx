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
import ConfessionsPage from './pages/confessions'

import ProductDetail from './pages/ProductDetail'
import AdminDashboard from './pages/admin/Dashboard'
import Marketplace from './pages/Marketplace'

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
          <Route path="/confessions" element={<ConfessionsPage />} />

          {/* Product and admin */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:categorySlug" element={<Marketplace />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />  
      </Routes>
    </AuthProvider>
  )
}

export default App
