import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingpage';
import UserSignup from './components/usersignup';
import UserLogin from './components/userlogin';
import GoogleSuccess from './components/googlesuccess';
import AdminLogin from './components/adminlogin';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/userlogin" element={<UserLogin/>} />
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/auth/google/success" element={<GoogleSuccess/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;