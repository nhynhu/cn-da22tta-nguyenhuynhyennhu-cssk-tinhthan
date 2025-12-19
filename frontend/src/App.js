import React, { useState, useEffect } from 'react';
import HomePage from './component/home/HomePage';
import Header from './component/header/Header';
import Chat from './component/chat/Chat';
import DoctorChat from './component/chat/DoctorChat';
import UserExpertChat from './component/chat/UserExpertChat';
import ExpertList from './component/chat/ExpertList';
import Appointment from './component/appointment/Appointment';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import Analytic from './component/analytic/Analytic';
import Diary from './component/diary/Diary';
import Therapy from './component/therapy/Therapy';
import ChoseChat from './component/chat/ChoseChat';
import ChoseApp from './component/appointment/ChoseApp';
import AdminPage from './component/admin/AdminPage';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
    window.location.href = '/'; // Redirect to home
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chose-chat" element={<ChoseChat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/choseapp" element={<ChoseApp />} />
        <Route path="/experts" element={<ExpertList />} />
        <Route path="/doctor-chat" element={<DoctorChat />} />
        <Route path="/doctor-chat/:expertId" element={<UserExpertChat />} />
        <Route path="/expert-chat" element={<UserExpertChat />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/analytic" element={<Analytic />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
      </Routes>
    </div>
  );
}

export default App;