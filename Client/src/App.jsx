import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import LandingPage from './Pages/LandingPage'
import Home from './Pages/Home'


function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/home' element={<Home />}/>
    </Routes>
  )
}

export default App
