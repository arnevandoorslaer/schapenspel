import React, { useState, useEffect } from 'react';
import { prepareNextRound } from '../util/gameLogic';
import SheepFoxes from './SheepFoxes';
import RoundInfo from './RoundInfo';
import './GameBoard.css';
import UserList from './UserList';
import { initializeGameState, subscribeToGameState, fetchGameState, updateGameState, resetGameState } from '../util/gameUtils';

const GameBoard: React.FC<{ gameId: string }> = ({ gameId }) => {
  const maxRounds = 12;

  const [roundCount, setRoundCount] = useState(0);
  const [roundType, setRoundType] = useState<any>(null);
  const [usedSheep, setUsedSheep] = useState<number[]>([]);
  const [usedFoxes, setUsedFoxes] = useState<number[]>([]);

  useEffect(() => {
    const initializeGame = async () => {
      await initializeGameState(gameId);
      const initialState = await fetchGameState(gameId);
      if (initialState) {
        setRoundCount(initialState.roundCount);
        setUsedSheep(initialState.usedSheep);
        setUsedFoxes(initialState.usedFoxes);
        setRoundType(initialState.roundType);
      }
      const unsubscribe = subscribeToGameState(gameId, (gameData) => {
        setRoundCount(gameData.roundCount);
        setUsedSheep(gameData.usedSheep);
        setUsedFoxes(gameData.usedFoxes);
        setRoundType(gameData.roundType);
      });
      return unsubscribe;
    };

    initializeGame();
  }, [gameId]);

  const startNewRound = async () => {
    if (roundCount >= maxRounds) return;

    const nextRound = prepareNextRound(roundType, roundCount, usedSheep, usedFoxes);
    if (nextRound) {
      await updateGameState(gameId, nextRound);
    }
  };

  const resetGame = async () => {
    await resetGameState(gameId);
  };

  return (
    <div className='game-container'>
      <UserList />
      <header className='game-header'>
        <h1 className='game-title'>Schapenspel</h1>
        <RoundInfo roundCount={roundCount} roundType={roundType} maxRounds={maxRounds} />
      </header>
      <div className='game-images'>{roundType && roundCount > 0 && <SheepFoxes type={roundType.type} amount={roundType.amount} />}</div>
      <div className='controls'>
        <button onClick={startNewRound} disabled={roundCount >= maxRounds} className='new-round-btn'>
          {roundCount >= maxRounds ? 'Game Over' : 'New Round'}
        </button>
        <button onClick={resetGame} className='reset-btn'>
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
