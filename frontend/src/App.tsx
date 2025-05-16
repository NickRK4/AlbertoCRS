import SignIn from './Components/Login.tsx';
import GlobalStyle from './GlobalStyles.tsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App() {
  return (
    <>
    <GlobalStyle />
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />    
      </Routes>
    </Router>
    </>
  )
}

export default App
