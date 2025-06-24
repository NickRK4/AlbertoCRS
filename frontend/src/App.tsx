import SignIn from './Components/Login.tsx';
import GlobalStyle from './GlobalStyles.tsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './Components/Navbar.tsx';
import { UserProvider } from './Context/useAuth.tsx';
import Home from './Screens/Home.tsx';
import Students from './Screens/Students.tsx';

function App() {
  return (
    <>
    <GlobalStyle />
    <Router>
      <UserProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/students" element= {<Students/>} />
      </Routes>
      </UserProvider>
    </Router>
    </>
  );
}

export default App
