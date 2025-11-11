import React from 'react';
import HomePage from './component/home/HomePage';
import Header from './component/header/Header';
import Chat from './component/chat/Chat';
import { Routes, Route } from 'react-router-dom';
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
      </Routes>
    </div>
  );
}

export default App;