import React from 'react';

type SheepFoxesProps = {
  type: string;
  amount: number;
};

const SheepFoxes: React.FC<SheepFoxesProps> = ({ type, amount }) => {
  const render = [];
  for (let i = 0; i < amount; i++) {
    render.push(<img src={`/${type}.png`} alt={type} width={100} height={100} key={`${type}-${i}`} className='game-image' />);
  }
  return <div>{render}</div>;
};

export default SheepFoxes;
