import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { getCurrentUser, signOutUser } from '../util/authUtils';
import './VotePage.scss';
import { useNavigate } from 'react-router-dom';

const VotePage: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [gameState, setGameState] = useState<any>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const user = getCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      if (docSnap.exists()) {
        setGameState(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [gameId, user]);

   const handleLogout = () => {
    signOutUser();
    navigate('/login');
   };

  const checkAllPlayersVoted = async () => {
    const gameRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(gameRef);
    const currentGameState = docSnap.data();

    if (!currentGameState) return false;

    const playersWithVotes = Object.values(currentGameState.playersVotes || {}).filter((playerVotes: any) => playerVotes.currentVote !== null);
    const usersRef = doc(db, 'users');
    const usersSnap = await getDoc(usersRef);
    const activeUsers = usersSnap.data()?.activeUsers || [];

    return playersWithVotes.length === activeUsers.length;
  };

  const startNextRound = async () => {
    const gameRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(gameRef);
    const currentGameState = docSnap.data();

    if (!currentGameState) return;

    let highestVote = -1;
    let winner = null;

    Object.entries(currentGameState.playersVotes || {}).forEach(([userId, data]: [string, any]) => {
      if (data.currentVote > highestVote) {
        highestVote = data.currentVote;
        winner = userId;
      }
    });

    const updatedPlayersVotes = Object.fromEntries(
      Object.entries(currentGameState.playersVotes || {}).map(([userId, data]: [string, any]) => [
        userId,
        {
          ...data,
          currentVote: null,
          usedVotes: data.usedVotes || [],
        },
      ]),
    );

    await updateDoc(gameRef, {
      roundCount: (currentGameState.roundCount || 0) + 1,
      playersVotes: updatedPlayersVotes,
      lastRoundWinner: winner,
      lastWinningVote: highestVote,
    });
  };

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    setError(null);
  };

  const handleConfirmVote = async () => {
    try {
      if (!user || !gameState || !selectedNumber) return;

      const currentPlayerVotes = gameState.playersVotes?.[user.uid] || {
        currentVote: null,
        usedVotes: [],
      };

      if (currentPlayerVotes.usedVotes?.includes(selectedNumber)) {
        setError('You cannot use the same number twice!');
        setSelectedNumber(null);
        return;
      }

      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
        [`playersVotes.${user.uid}`]: {
          currentVote: selectedNumber,
          usedVotes: [...(currentPlayerVotes.usedVotes || []), selectedNumber],
        },
      });

      const allVoted = await checkAllPlayersVoted();
      if (allVoted) {
        await startNextRound();
      }

      setSelectedNumber(null);
    } catch (err) {
      setError('Failed to cast vote. Please try again.');
      console.error('Vote error:', err);
    }
  };

  if (!gameState || !user) return <div>Loading...</div>;

  const currentPlayerVotes = gameState.playersVotes?.[user.uid] || {
    currentVote: null,
    usedVotes: [],
  };

  const hasVotedThisRound = currentPlayerVotes.currentVote !== null;

  return (
    <div className='vote-container'>
      <div className='round-info'>
        <div className='player-header'>
          <h2>Welcome: {user.displayName}</h2>
          <button onClick={handleLogout} className='logout-button'>
            Logout
          </button>
        </div>
        <h3>Current round: {gameState.roundCount || 1}</h3>
        <h3>Your current score: {gameState.roundCount || 1}</h3>

        {error && <p className='error'>{error}</p>}
        {currentPlayerVotes.currentVote && <p>Your vote: {currentPlayerVotes.currentVote}</p>}
      </div>

      {!hasVotedThisRound && (
        <button className='confirm-button' disabled={!selectedNumber} onClick={handleConfirmVote}>
          {selectedNumber ? `Confirm Vote: ${selectedNumber}` : 'Select a number'}
        </button>
      )}

      <div className='vote-buttons'>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
          const isUsed = currentPlayerVotes.usedVotes?.includes(num);
          const isSelected = selectedNumber === num;

          return (
            <button
              key={num}
              onClick={() => handleNumberSelect(num)}
              disabled={isUsed || hasVotedThisRound}
              className={`vote-btn ${isUsed || hasVotedThisRound ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VotePage;
