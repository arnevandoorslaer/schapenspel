import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { getCurrentUser } from '../util/authUtils';
import './VotePage.css';

const VotePage: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [gameState, setGameState] = useState<any>(null);
  const user = getCurrentUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      if (docSnap.exists()) {
        setGameState(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [gameId, user]);

  const checkAllPlayersVoted = async () => {
    const gameRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(gameRef);
    const currentGameState = docSnap.data();

    if (!currentGameState) return false;

    // Get all players who have votes recorded for this round
    const playersWithVotes = Object.values(currentGameState.playersVotes || {}).filter((playerVotes: any) => playerVotes.currentVote !== null);

    console.log(playersWithVotes);

    // Get all logged-in players from the users collection
    const usersRef = doc(db, 'users'); // Assuming you keep a list of active users
    const usersSnap = await getDoc(usersRef);
    const activeUsers = usersSnap.data()?.activeUsers || [];

    // Check if all active players have voted
    return playersWithVotes.length === activeUsers.length;
  };

  const startNextRound = async () => {
    const gameRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(gameRef);
    const currentGameState = docSnap.data();

    if (!currentGameState) return;

    // Find the winner of the current round
    let highestVote = -1;
    let winner = null;

    Object.entries(currentGameState.playersVotes || {}).forEach(([userId, data]: [string, any]) => {
      if (data.currentVote > highestVote) {
        highestVote = data.currentVote;
        winner = userId;
      }
    });

    // Reset current votes while keeping used votes
    const updatedPlayersVotes = Object.fromEntries(
      Object.entries(currentGameState.playersVotes || {}).map(([userId, data]: [string, any]) => [
        userId,
        {
          ...data,
          currentVote: null,
          usedVotes: data.usedVotes || [], // Preserve used votes
        },
      ]),
    );

    // Update game state for next round
    await updateDoc(gameRef, {
      roundCount: (currentGameState.roundCount || 0) + 1,
      playersVotes: updatedPlayersVotes,
      lastRoundWinner: winner,
      lastWinningVote: highestVote,
    });
  };

  const handleVote = async (number: number) => {
    try {
      if (!user || !gameState) return;

      // Initialize the player's votes if they don't exist
      const currentPlayerVotes = gameState.playersVotes?.[user.uid] || {
        currentVote: null,
        usedVotes: [],
      };

      console.log(currentPlayerVotes)

      // Check if number was already used
      if (currentPlayerVotes.usedVotes?.includes(number)) {
        setError('You cannot use the same number twice!');
        return;
      }

      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
        [`playersVotes.${user.uid}`]: {
          currentVote: number,
          usedVotes: [...(currentPlayerVotes.usedVotes || []), number],
        },
      });

      // Check if all players have voted and start next round if they have
      const allVoted = await checkAllPlayersVoted();
      if (allVoted) {
        await startNextRound();
      }
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

  return (
    <div className='vote-container'>
      <h1>Vote Page</h1>

      <div className='round-info'>
        <h2>Round {gameState.roundCount || 1}</h2>
        {error && <p className='error'>{error}</p>}
        {gameState.lastRoundWinner && (
          <p className='winner-info'>
            Last round winner: {gameState.lastRoundWinner} with vote {gameState.lastWinningVote}
          </p>
        )}
      </div>

      <div className='vote-buttons'>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
          const isUsed = currentPlayerVotes.usedVotes?.includes(num);
          const hasVotedThisRound = currentPlayerVotes.currentVote !== null;

          return (
            <button key={num} onClick={() => handleVote(num)} disabled={isUsed || hasVotedThisRound} className={`vote-btn ${isUsed || hasVotedThisRound ? 'disabled' : ''}`}>
              {num}
            </button>
          );
        })}
      </div>

      {currentPlayerVotes.currentVote && <p>Your vote: {currentPlayerVotes.currentVote}</p>}
    </div>
  );
};

export default VotePage;
