export interface Player {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  score: number;
}

export interface GameState {
  roundCount: number;
  roundType: {
    type: string;
    amount: number;
  } | null;
  usedSheep: number[];
  usedFoxes: number[];
  playersVotes: {
    [userId: string]: {
      currentVote: number | null;
      usedVotes: number[];
    };
  };
  players: {
    [userId: string]: Player;
  };
  roundWinner: {
    userId: string;
    vote: number;
  } | null;
  isRoundComplete: boolean;
}
