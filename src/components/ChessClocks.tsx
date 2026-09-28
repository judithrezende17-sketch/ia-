import React from 'react';
import { Color } from 'chess.js';
import { GameMode, AIDifficulty, CapturedPieces } from '../types';
import { ChessPiece } from './ChessPiece';
import { Bot, User, Clock } from 'lucide-react';

interface ChessClocksProps {
  color: Color;
  timeSeconds: number;
  isActiveTurn: boolean;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  capturedPieces: string[];
  materialDifference: number; // positive means this player has material advantage
  hasTimer: boolean;
}

export const ChessPlayerCard: React.FC<ChessClocksProps> = ({
  color,
  timeSeconds,
  isActiveTurn,
  gameMode,
  aiDifficulty,
  capturedPieces,
  materialDifference,
  hasTimer
}) => {
  const isWhite = color === 'w';

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeLow = hasTimer && timeSeconds <= 20;

  // AI label helper
  const diffLabels: Record<AIDifficulty, string> = {
    easy: 'IA Iniciante',
    medium: 'IA Médio (1500)',
    hard: 'IA Difícil (1800)',
    master: 'IA Mestre (2200)'
  };

  const isAi = gameMode === 'vsAi' && !isWhite;
  const playerName = isAi ? diffLabels[aiDifficulty] : isWhite ? 'Brancas' : 'Pretas';

  return (
    <div
      className={`w-full max-w-[540px] mx-auto p-2.5 sm:p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
        isActiveTurn
          ? 'bg-neutral-900 border-amber-400/60 shadow-lg shadow-amber-500/10'
          : 'bg-neutral-950/80 border-neutral-800'
      }`}
    >
      {/* Left: Avatar, Name & Captured Pieces */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        {/* Avatar Badge */}
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
            isWhite
              ? 'bg-white text-slate-900 border-neutral-300'
              : 'bg-neutral-900 text-white border-neutral-700'
          }`}
        >
          {isAi ? <Bot className="w-5 h-5 text-sky-400" /> : <User className="w-5 h-5" />}
        </div>

        {/* Name and Captured pieces list */}
        <div className="truncate">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {playerName}
            </span>
            {isActiveTurn && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            )}
          </div>

          {/* Captured Pieces Tray */}
          <div className="flex items-center gap-0.5 mt-0.5 min-h-[18px]">
            {capturedPieces.map((p, idx) => (
              <div key={idx} className="w-4 h-4 shrink-0 opacity-80">
                <ChessPiece type={p.toLowerCase() as any} color={isWhite ? 'b' : 'w'} />
              </div>
            ))}
            {materialDifference > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 font-mono ml-1">
                +{materialDifference}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Digital Chess Clock */}
      {hasTimer && (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm sm:text-base tabular-nums shrink-0 transition-colors ${
            isTimeLow
              ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
              : isActiveTurn
              ? 'bg-neutral-800 border-amber-500/50 text-amber-300'
              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>{formatTime(timeSeconds)}</span>
        </div>
      )}
    </div>
  );
};
