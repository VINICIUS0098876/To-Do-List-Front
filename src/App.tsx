
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'

import './App.css'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/home" element={<Home />} />
    </Routes>
    </>
  )
}

export default App

