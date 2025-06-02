import SignIn from './Components/Login.tsx';
import GlobalStyle from './GlobalStyles.tsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './Components/Dashboard.tsx';
import Navbar from './Components/Navbar.tsx';
import Register from './Components/Register.tsx';
import { useState } from 'react';
import { UserProvider } from './Context/useAuth.tsx';

function App() {
  const [showNavbar, setShowNavbar] = useState(true);
  return (
    <>
    <GlobalStyle />
    <Router>
      <UserProvider>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SignIn setShowNavBar={setShowNavbar}/>} />
        <Route path="/home" element={<Dashboard setShowNavBar={setShowNavbar}/>} />
        <Route path="/register" element={<Register setShowNavBar={setShowNavbar}/>} />
      </Routes>
      </UserProvider>
    </Router>
    </>
  );
}

export default App
