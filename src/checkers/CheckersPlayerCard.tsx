'use client';

import React from 'react';
import { Crown, Bot, User, Clock } from 'lucide-react';
import { CheckersTheme, PieceColor } from './checkersTypes';

interface CheckersPlayerCardProps {
  color: PieceColor;
  name: string;
  isAi: boolean;
  aiDifficulty?: string;
  theme: CheckersTheme;
  isCurrentTurn: boolean;
  timeLeft: number;
  timeLimit: number;
  pieceCount: number;
  kingCount: number;
  capturedCount: number;
}

export const CheckersPlayerCard: React.FC<CheckersPlayerCardProps> = ({
  color,
  name,
  isAi,
  aiDifficulty,
  theme,
  isCurrentTurn,
  timeLeft,
  timeLimit,
  pieceCount,
  kingCount,
  capturedCount,
}) => {
  const isWhite = color === 'w';

  // Format MM:SS
  const formatTime = (seconds: number) => {
    if (timeLimit === 0) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLowTime = timeLimit > 0 && timeLeft <= 30 && timeLeft > 0;

  return (
    <div
      className={`w-full max-w-[min(88vw,520px)] p-2.5 sm:p-3 rounded-xl transition-all duration-200 border flex items-center justify-between gap-3 ${
        isCurrentTurn
          ? 'bg-neutral-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
          : 'bg-neutral-900/70 border-neutral-800 text-neutral-400'
      }`}
    >
      {/* Player info & Avatar */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border shadow-sm shrink-0 ${
            isWhite ? theme.whitePiece.bg : theme.blackPiece.bg
          } ${isWhite ? theme.whitePiece.border : theme.blackPiece.border}`}
        >
          {isAi ? (
            <Bot className={`w-5 h-5 ${isWhite ? 'text-amber-800' : 'text-amber-400'}`} />
          ) : (
            <User className={`w-5 h-5 ${isWhite ? 'text-amber-800' : 'text-amber-400'}`} />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-xs sm:text-sm text-neutral-100 truncate">
              {name}
            </span>
            {isAi && aiDifficulty && (
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                [{aiDifficulty}]
              </span>
            )}
          </div>

          {/* Piece Counter and Kings */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
            <span>{pieceCount} peças</span>
            {kingCount > 0 && (
              <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                <Crown className="w-3 h-3" />
                {kingCount} {kingCount === 1 ? 'dama' : 'damas'}
              </span>
            )}
            {capturedCount > 0 && (
              <span className="text-emerald-400 font-mono">+{capturedCount}</span>
            )}
          </div>
        </div>
      </div>

      {/* Clock Timer */}
      {timeLimit > 0 && (
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold text-sm sm:text-base border transition-colors shrink-0 ${
            isLowTime
              ? 'bg-red-950/80 text-red-400 border-red-700 animate-pulse'
              : isCurrentTurn
                ? 'bg-neutral-950 text-amber-400 border-amber-500/40'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      )}
    </div>
  );
};
