import SignIn from './Components/Login.tsx';
import GlobalStyle from './GlobalStyles.tsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './Components/Navbar.tsx';
import { useState } from 'react';
import { UserProvider } from './Context/useAuth.tsx';
import Home from './Screens/Home.tsx';
import StudentsList from './Components/Admin/StudentsList.tsx';

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
        <Route path="/home" element={<Home setShowNavBar={setShowNavbar}/>} />
        <Route path="students" element= {<StudentsList />} />
      </Routes>
      </UserProvider>
    </Router>
    </>
  );
}

export default App
