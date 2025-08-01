import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingpage';
import UserSignup from './components/usersignup';
import UserLogin from './components/userlogin';
import GoogleSuccess from './components/googlesuccess';
import AdminLogin from './components/adminlogin';
import Admin from './components/adminpage';
import Chat from './components/chat';
import Indexing from './components/indexing';
import Delete from './components/delete-retriever';
import View from './components/view-chat-history';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/userlogin" element={<UserLogin/>} />
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/auth/google/success" element={<GoogleSuccess/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/index-docs" element={<Indexing/>}/>
        <Route path="/delete-retriever" element={<Delete/>}/>
        <Route path="/view-history" element={<View/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;