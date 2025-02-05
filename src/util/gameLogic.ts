// Game logic for generating random rounds
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

// Prepare the round for the next update
export const prepareNextRound = (roundType: any, roundCount: number, usedSheep: number[], usedFoxes: number[]) => {
  const newRound = getRandomRound([1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4], usedSheep, usedFoxes);
  if (!newRound) return null;

  return {
    roundType: newRound,
    roundCount: roundCount + 1,
    usedSheep: newRound.type === 'sheep' ? [...usedSheep, newRound.amount] : usedSheep,
    usedFoxes: newRound.type === 'fox' ? [...usedFoxes, newRound.amount] : usedFoxes,
  };
};
