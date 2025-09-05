
import Login from './pages/login'
import Register from './pages/register'

import './App.css'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
    </Routes>
    </>
  )
}

export default App

