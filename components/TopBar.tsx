'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, BarChart3, HelpCircle, Trophy } from 'lucide-react';
import { GameMode } from '@/lib/gameData';

interface TopBarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenStats: () => void;
  onOpenRules: () => void;
}

export function TopBar({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  onRestart,
  onOpenStats,
  onOpenRules
}: TopBarProps) {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Jogo da Memória
          </span>
        </div>

        {/* Zone 2: Navigation / Game Mode Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => onSelectMode('classic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentMode === 'classic'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Solo Clássico
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('timeAttack')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentMode === 'timeAttack'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Contra o Tempo
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('twoPlayer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentMode === 'twoPlayer'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            2 Jogadores
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenStats}
            title="Ver Recordes e Estatísticas"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Ver recordes"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            title="Como Jogar & Regras"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Regras do jogo"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Desativar Som'}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-sm whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      {/* Mobile Mode Selector Bar */}
      <div className="flex md:hidden items-center justify-around px-4 py-2 border-t border-white/5 bg-slate-900/60">
        <button
          type="button"
          onClick={() => onSelectMode('classic')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'classic'
              ? 'bg-amber-400 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Solo
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('timeAttack')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'timeAttack'
              ? 'bg-amber-400 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Contra Tempo
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('twoPlayer')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'twoPlayer'
              ? 'bg-amber-400 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2 Jogadores
        </button>
      </div>
    </header>
  );
}
