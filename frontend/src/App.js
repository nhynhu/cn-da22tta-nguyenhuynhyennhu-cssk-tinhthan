import React from 'react';
import HomePage from './component/home/HomePage';
import Header from './component/header/Header';
import Chat from './component/chat/Chat';
import { Routes, Route } from 'react-router-dom';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import Analytic from './component/analytic/Analytic';
import Diary from './component/diary/Diary';
import Therapy from './component/therapy/Therapy';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/analytic" element={<Analytic />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;