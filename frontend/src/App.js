import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './component/home/HomePage';
import Header from './component/header/Header';
import Chat from './component/chat/Chat';
import DoctorChat from './component/chat/DoctorChat';
import UserExpertChat from './component/chat/UserExpertChat';
import ExpertList from './component/chat/ExpertList';
import Appointment from './component/appointment/Appointment';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import ForgotPassword from './component/auth/ForgotPassword';
import Analytic from './component/analytic/Analytic';
import Diary from './component/diary/Diary';
import Therapy from './component/therapy/Therapy';
import ChoseChat from './component/chat/ChoseChat';
import ChoseApp from './component/appointment/ChoseApp';
import AdminPage from './component/admin/AdminPage';
import Profile from './component/profile/Profile';

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
    window.location.href = '/';
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // ❌ Không hiển thị Header ở login, register & forgot-password
  const hideHeader =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password';

  return (
    <div className="App">
      {!hideHeader && <Header user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chose-chat" element={<ChoseChat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/choseapp" element={<ChoseApp />} />
        <Route path="/experts" element={<ExpertList />} />
        <Route path="/doctor-chat" element={<DoctorChat />} />
        <Route path="/doctor-chat/:expertId" element={<UserExpertChat />} />
        <Route path="/expert-chat" element={<UserExpertChat />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/analytic" element={<Analytic />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPage user={user} />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;
