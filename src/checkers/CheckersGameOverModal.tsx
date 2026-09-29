'use client';

import React from 'react';
import { Trophy, RefreshCw, Crown, Swords } from 'lucide-react';
import { PieceColor } from './checkersTypes';

interface CheckersGameOverModalProps {
  isOpen: boolean;
  winner: PieceColor | 'draw' | null;
  reason: string;
  totalMoves: number;
  whitePiecesLeft: number;
  blackPiecesLeft: number;
  onPlayAgain: () => void;
}

export const CheckersGameOverModal: React.FC<CheckersGameOverModalProps> = ({
  isOpen,
  winner,
  reason,
  totalMoves,
  whitePiecesLeft,
  blackPiecesLeft,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  const isWhiteWin = winner === 'w';
  const isBlackWin = winner === 'b';
  const isDraw = winner === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 text-center text-neutral-100 space-y-4">
        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center shadow-lg shadow-amber-500/10">
          {isDraw ? (
            <Swords className="w-8 h-8 text-amber-400" />
          ) : (
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-chess text-amber-300">
            {isWhiteWin
              ? 'Vitória das Brancas!'
              : isBlackWin
                ? 'Vitória das Pretas!'
                : 'Partida Empatada!'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">{reason}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-neutral-800/80 border border-neutral-800 text-xs">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-mono">Lances</div>
            <div className="font-bold text-neutral-200 font-mono mt-0.5">{totalMoves}</div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-mono">Brancas</div>
            <div className="font-bold text-amber-300 font-mono mt-0.5">{whitePiecesLeft} peças</div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-mono">Pretas</div>
            <div className="font-bold text-neutral-300 font-mono mt-0.5">{blackPiecesLeft} peças</div>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider font-chess transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Jogar Novamente</span>
        </button>
      </div>
    </div>
  );
};
