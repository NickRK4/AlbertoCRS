import SignIn from './Components/Login.tsx';
import GlobalStyle from './GlobalStyles.tsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './Components/Dashboard.tsx';
import Navbar from './Components/Navbar.tsx';
import { useState } from 'react';

function App() {

  const [showNavbar, setShowNavbar] = useState(true);
  return (
    <>
    {showNavbar && <Navbar />}
    <GlobalStyle />
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn setShowNavBar={setShowNavbar}/>} />    
        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
