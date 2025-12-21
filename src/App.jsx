import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/home'


function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    </>
  )
}

export default App
