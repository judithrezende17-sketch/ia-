'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { CheckersTheme, Piece } from './checkersTypes';

interface CheckersPieceProps {
  piece: Piece;
  theme: CheckersTheme;
  isSelected?: boolean;
  isMustCapture?: boolean;
  sizeClass?: string;
}

export const CheckersPiece: React.FC<CheckersPieceProps> = ({
  piece,
  theme,
  isSelected = false,
  isMustCapture = false,
  sizeClass = 'w-11/12 h-11/12',
}) => {
  const isWhite = piece.color === 'w';
  const pieceTheme = isWhite ? theme.whitePiece : theme.blackPiece;
  const isKing = piece.type === 'king';

  return (
    <div
      className={`relative ${sizeClass} rounded-full flex items-center justify-center transition-all duration-200 select-none shadow-lg ${pieceTheme.bg} ${
        isSelected
          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black scale-105 shadow-amber-500/50'
          : isMustCapture
            ? 'ring-2 ring-amber-400/90 shadow-amber-400/30 animate-pulse'
            : 'hover:scale-[1.03] active:scale-95'
      }`}
      style={{
        boxShadow: isWhite
          ? '0 6px 12px -2px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 4px rgba(0,0,0,0.2)'
          : '0 6px 12px -2px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 4px rgba(0,0,0,0.9)',
      }}
    >
      {/* Outer concentric groove */}
      <div
        className={`w-4/5 h-4/5 rounded-full border-2 ${pieceTheme.innerRing} flex items-center justify-center`}
      >
        {/* Inner concentric disc */}
        <div
          className={`w-3/5 h-3/5 rounded-full border ${pieceTheme.innerRing} flex items-center justify-center transition-transform`}
        >
          {isKing && (
            <Crown
              className={`w-5 h-5 sm:w-6 sm:h-6 ${pieceTheme.crown} drop-shadow-md transition-all duration-300 animate-in zoom-in-50`}
              strokeWidth={2.6}
            />
          )}
        </div>
      </div>

      {/* Subtle King label for accessibility & clarity */}
      {isKing && (
        <span
          className={`absolute -bottom-1 text-[9px] font-black uppercase tracking-wider px-1 rounded ${
            isWhite ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-neutral-900 text-amber-300 border border-amber-600/50'
          } shadow-sm`}
        >
          Dama
        </span>
      )}
    </div>
  );
};
