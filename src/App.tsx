import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import GameBoard from './components/GameBoard';
import LoginPage from './components/LoginPage';
import VotePage from './components/VotePage';
import { signOutUser } from './util/authUtils';

const App: React.FC = () => {
    const gameId = 'game1';
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/gameboard' element={<GameBoard {...{ gameId }} />} />
      <Route path='/votepage' element={<VotePage {...{ gameId }} />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

const Root: React.FC = () => {
  return (
    <BrowserRouter>
      <App />
      <button onClick={() => signOutUser()}>logout</button>
    </BrowserRouter>
  );
};

export default Root;
