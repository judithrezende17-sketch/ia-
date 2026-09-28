'use client';

import React from 'react';
import { PlayingCard, ThemeId, THEMES } from '@/lib/gameData';
import { GameIcon } from './GameIcon';
import { Check } from 'lucide-react';

interface MemoryCardProps {
  card: PlayingCard;
  themeId: ThemeId;
  index: number;
  isDisabled: boolean;
  onFlip: (index: number) => void;
}

export function MemoryCard({ card, themeId, index, isDisabled, onFlip }: MemoryCardProps) {
  const isRevealed = card.isFlipped || card.isMatched;
  const currentTheme = THEMES[themeId];

  const handleClick = () => {
    if (isDisabled || isRevealed) return;
    onFlip(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && !isRevealed) {
      e.preventDefault();
      onFlip(index);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled || isRevealed}
      tabIndex={isRevealed ? -1 : 0}
      aria-label={
        isRevealed
          ? `${card.name}${card.isMatched ? ', par encontrado' : ', carta aberta'}`
          : `Carta ${index + 1}, clique para virar`
      }
      className={`group relative w-full aspect-[4/5] sm:aspect-square rounded-2xl perspective-1000 outline-none select-none transition-transform focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        card.isMatched
          ? 'cursor-default'
          : isDisabled
          ? 'cursor-not-allowed'
          : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      <div
        className={`relative w-full h-full duration-300 transform-style-3d transition-transform ease-out ${
          isRevealed ? 'rotate-y-180' : ''
        } ${card.isHinted ? 'ring-4 ring-amber-400/80 shadow-lg shadow-amber-500/20' : ''}`}
      >
        {/* CARD BACK (Face Down) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden bg-gradient-to-br ${currentTheme.cardBackPattern} border border-white/10 shadow-md flex flex-col items-center justify-center p-3 overflow-hidden group-hover:border-white/20 transition-colors`}
        >
          {/* Subtle textured grid overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
          
          {/* Card Back Center Emblem */}
          <div className="relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center shadow-inner group-hover:bg-white/10 transition-colors">
            <span className="text-xl sm:text-2xl font-serif font-black tracking-widest text-slate-300/80 group-hover:text-amber-300 transition-colors">
              ?
            </span>
          </div>

          <span className="relative z-10 mt-2 text-[10px] sm:text-xs font-medium tracking-wider text-slate-400/80 uppercase">
            Memória
          </span>
        </div>

        {/* CARD FRONT (Face Up / Matched) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-between p-3 sm:p-4 border transition-all ${
            card.isMatched
              ? 'bg-slate-900/95 border-emerald-500/50 shadow-md shadow-emerald-950/40'
              : 'bg-slate-900 border-white/20 shadow-xl'
          }`}
        >
          {/* Top Status Indicator */}
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
            {card.isMatched ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-xs">
                <Check className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs">Par!</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">#{index + 1}</span>
            )}
          </div>

          {/* Center Graphic */}
          <div
            className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-transform ${
              card.bgColor
            } ${card.isMatched ? 'scale-105' : ''}`}
          >
            <GameIcon
              name={card.iconName}
              className={`w-8 h-8 sm:w-11 sm:h-11 ${card.accentColor} transition-transform drop-shadow-sm`}
            />
          </div>

          {/* Bottom Card Item Label */}
          <div className="w-full text-center">
            <p className="text-xs sm:text-sm font-medium text-slate-200 truncate px-1">
              {card.name}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
