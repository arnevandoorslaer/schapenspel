import { db, doc, getDoc, onSnapshot, setDoc, updateDoc } from '../firebase';

// Initialize the game state in Firestore if it doesn't exist
export const initializeGameState = async (gameId: string) => {
  const gameRef = doc(db, 'games', gameId);
  const docSnap = await getDoc(gameRef);

  if (!docSnap.exists()) {
    await setDoc(gameRef, {
      roundCount: 0,
      usedSheep: [],
      usedFoxes: [],
      roundType: null,
      playersVotes: {},
      players: {},
      roundWinner: null,
      isRoundComplete: false,
    });
  }
};

// Generate a random round with unused sheep/foxes
export const getRandomRound = (sheep: number[], foxes: number[], usedSheep: number[], usedFoxes: number[]) => {
  const unusedSheep = sheep.filter((s) => !usedSheep.includes(s));
  const unusedFoxes = foxes.filter((f) => !usedFoxes.includes(f));

  if (unusedSheep.length === 0 && unusedFoxes.length === 0) {
    return null;
  }

  const isSheep = unusedSheep.length > 0 && (Math.random() < 0.5 || unusedFoxes.length === 0);
  const amount = isSheep ? unusedSheep[Math.floor(Math.random() * unusedSheep.length)] : unusedFoxes[Math.floor(Math.random() * unusedFoxes.length)];

  return { type: isSheep ? 'sheep' : 'fox', amount };
};

export const fetchGameState = async (gameId: string) => {
  const gameRef = doc(db, 'games', gameId);
  const docSnap = await getDoc(gameRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Subscribe to game state changes
export const subscribeToGameState = (gameId: string, callback: (data: any) => void) => {
  const gameRef = doc(db, 'games', gameId);
  return onSnapshot(gameRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

// Update the game state in Firebase
export const updateGameState = async (gameId: string, newState: any) => {
  const gameRef = doc(db, 'games', gameId);
  await updateDoc(gameRef, newState);
};

// Reset the game state
export const resetGameState = async (gameId: string) => {
  const gameRef = doc(db, 'games', gameId);
  await setDoc(gameRef, {
    roundCount: 0,
    usedSheep: [],
    usedFoxes: [],
    roundType: null,
    playersVotes: {},
    isRoundComplete: false,
  });
};