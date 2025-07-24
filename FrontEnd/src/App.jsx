import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSignup from './components/usersignup';
import UserLogin from './components/userlogin';
import GoogleSuccess from './components/googlesuccess';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/auth/google/success" element={<GoogleSuccess/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;