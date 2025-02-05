import React from 'react';

type RoundInfoProps = {
  roundCount: number;
  roundType: any;
  maxRounds: number;
};

const RoundInfo: React.FC<RoundInfoProps> = ({ roundCount, roundType, maxRounds }) => {
  return (
    <h2 className='round-info'>
      {roundCount > 0 ? (
        `Round ${roundCount}/${maxRounds}: ${roundType ? roundType.amount : 0} ${roundType ? (roundType.type === 'sheep' ? 'Sheep' : 'Foxes') : ''}`
      ) : (
        <span className='game-start'>Game Start!</span>
      )}
    </h2>
  );
};

export default RoundInfo;
