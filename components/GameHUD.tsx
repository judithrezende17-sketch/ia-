'use client';

import React from 'react';
import {
  Difficulty,
  DIFFICULTIES,
  GameMode,
  ThemeId,
  THEMES,
  PlayerStats
} from '@/lib/gameData';
import {
  Clock,
  Zap,
  Eye,
  Lightbulb,
  Pause,
  Play,
  Flame,
  Users
} from 'lucide-react';

interface GameHUDProps {
  mode: GameMode;
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  themeId: ThemeId;
  onChangeTheme: (t: ThemeId) => void;
  moves: number;
  matchedPairsCount: number;
  totalPairs: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  onTogglePause: () => void;
  isPaused: boolean;
  comboStreak: number;
  score: number;
  // 2 player props
  activePlayer: 1 | 2;
  player1Stats: PlayerStats;
  player2Stats: PlayerStats;
  // power ups
  hintsRemaining: number;
  onUseHint: () => void;
  canPeek: boolean;
  onUsePeek: () => void;
  disabledControls: boolean;
}

export function GameHUD({
  mode,
  difficulty,
  onChangeDifficulty,
  themeId,
  onChangeTheme,
  moves,
  matchedPairsCount,
  totalPairs,
  timerSeconds,
  onTogglePause,
  isPaused,
  comboStreak,
  score,
  activePlayer,
  player1Stats,
  player2Stats,
  hintsRemaining,
  onUseHint,
  canPeek,
  onUsePeek,
  disabledControls
}: GameHUDProps) {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeAttack = mode === 'timeAttack';
  const isTimeLow = isTimeAttack && timerSeconds <= 15;

  return (
    <div className="w-full space-y-4">
      {/* Top Filter & Settings Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-white/10 shadow-sm">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">
            Nível:
          </span>
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => {
            const diff = DIFFICULTIES[key];
            const isActive = difficulty === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeDifficulty(key)}
                disabled={disabledControls}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-950 font-semibold shadow-sm scale-105'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {diff.label}
              </button>
            );
          })}
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">
            Tema:
          </span>
          {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
            const t = THEMES[tId];
            const isActive = themeId === tId;
            return (
              <button
                key={tId}
                type="button"
                onClick={() => onChangeTheme(tId)}
                disabled={disabledControls}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{t.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Status HUD Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Time */}
        <div className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
          isTimeLow
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
            : 'bg-slate-900/70 border-white/10 text-slate-200'
        }`}>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">
              {isTimeAttack ? 'Tempo Restante' : 'Tempo de Jogo'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {formatTime(timerSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onTogglePause}
              disabled={disabledControls}
              title={isPaused ? 'Continuar jogo' : 'Pausar'}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <Clock className={`w-5 h-5 ${isTimeLow ? 'text-rose-400' : 'text-slate-400'}`} />
          </div>
        </div>

        {/* Metric 2: Moves & Score */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-slate-200">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">
              {mode === 'twoPlayer' ? 'Jogadas Totais' : 'Jogadas'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {moves}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-amber-400 block">Pontos</span>
            <span className="text-sm font-semibold font-mono tabular-nums text-slate-300">
              {score}
            </span>
          </div>
        </div>

        {/* Metric 3: Pairs Progress */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-slate-200">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">
              Pares Concluídos
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {matchedPairsCount} <span className="text-sm font-normal text-slate-400">/ {totalPairs}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-400 tabular-nums">
              {Math.round((matchedPairsCount / totalPairs) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 4: Combo or 2-Player Turn */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-slate-200">
          {mode === 'twoPlayer' ? (
            <div className="w-full flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Vez Atual</span>
                <span className={`text-base font-bold flex items-center gap-1.5 ${
                  activePlayer === 1 ? 'text-sky-400' : 'text-amber-400'
                }`}>
                  <Users className="w-4 h-4" />
                  Jogador {activePlayer}
                </span>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <div className="text-sky-400 font-mono">J1: {player1Stats.matches} pts</div>
                <div className="text-amber-400 font-mono">J2: {player2Stats.matches} pts</div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Sequência Combo</span>
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400 flex items-center gap-1">
                  {comboStreak > 1 && <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />}
                  {comboStreak > 1 ? `x${comboStreak}` : '—'}
                </span>
              </div>
              <div className="text-xs text-right text-slate-400">
                {comboStreak >= 3 ? (
                  <span className="text-amber-400 font-bold block">Incrível!</span>
                ) : comboStreak === 2 ? (
                  <span className="text-yellow-300 font-semibold block">Em chamas!</span>
                ) : (
                  <span>Acerte em série</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Power-up Helper Bar */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          {/* Hint Button */}
          <button
            type="button"
            onClick={onUseHint}
            disabled={hintsRemaining <= 0 || disabledControls}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              hintsRemaining > 0 && !disabledControls
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/50 hover:text-white active:scale-95'
                : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Revelar Par ({hintsRemaining})</span>
          </button>

          {/* Peek Button */}
          <button
            type="button"
            onClick={onUsePeek}
            disabled={!canPeek || disabledControls}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              canPeek && !disabledControls
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600/50 hover:text-white active:scale-95'
                : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Espiar Tabuleiro ({canPeek ? '1 uso' : 'Usado'})</span>
          </button>
        </div>

        {/* Minimal helpful note */}
        <div className="text-xs text-slate-400 hidden md:block">
          Use o teclado (Tab + Enter) ou clique nas cartas
        </div>
      </div>
    </div>
  );
}
