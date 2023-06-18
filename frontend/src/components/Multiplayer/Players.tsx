import clsx from 'clsx';
import * as React from 'react';
import { FaCrown } from 'react-icons/fa';

import { useRoomContext } from '../../context/Room/RoomContext';


export default function Players() {
  const {
    room: {
      user: { id },
      players,
      isPlaying,
      winner,
    },
  } = useRoomContext();

  return (
    <div
      className={clsx(
        ' flex w-full max-w-[950px] flex-wrap items-center gap-x-8 gap-y-4 font-primary bg-background text-primary font-mono text-lg font-semibold'
      )}
    >
      {players.map((player) =>(
          <div
            key={player.id}
            className='flex flex-1 flex-col items-start gap-2 min-w-[250px]'
          >
            <div className='flex w-full items-center justify-between'>
              <span className='flex items-center space-x-1'>
                {winner === player.id && (
                  <FaCrown className='mr-1' />
                )}
                <span >{(player.id === id ? "You":(player.username))} </span>
                <span className='text-xs'>
                  (
                  {isPlaying
                    ? 'in game'
                    : player.isOwner
                    ? 'owner'
                    : 'waiting for owner'}
                  )
                </span>
              </span>
              <span>
                {player.status.wpm} wpm
              </span>
            </div>
            <progress className="progress progress-primary w-full bg-base-50" value={player.status.progress} max="100"></progress>
          </div>
        )
      )}
    </div>
  );
}
