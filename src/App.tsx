import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import GameBoard from './components/GameBoard';
import LoginPage from './components/LoginPage';
import VotePage from './components/VotePage';
import './reset/reset.min.css'
import './reset/reset.scss'

const App: React.FC = () => {
    const gameId = 'game1';
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/login' element={<LoginPage />} />

      <Route path='/board' element={<GameBoard {...{ gameId }} />} />
      <Route path='/vote' element={<VotePage {...{ gameId }} />} />
    </Routes>
  );
};

const Root: React.FC = () => {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
};

export default Root;
