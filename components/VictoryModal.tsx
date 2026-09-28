'use client';

import React from 'react';
import { GameMode, Difficulty, DIFFICULTIES } from '@/lib/gameData';
import { Trophy, Star, Clock, Zap, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onRestart: () => void;
  mode: GameMode;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
  stars: number;
  accuracy: number;
  maxCombo: number;
  score: number;
  // 2-player mode winner info
  player1Matches?: number;
  player2Matches?: number;
  isTimeOutLoss?: boolean;
}

export function VictoryModal({
  isOpen,
  onRestart,
  mode,
  difficulty,
  moves,
  timeSeconds,
  stars,
  accuracy,
  maxCombo,
  score,
  player1Matches = 0,
  player2Matches = 0,
  isTimeOutLoss = false
}: VictoryModalProps) {
  if (!isOpen) return null;

  const diffConfig = DIFFICULTIES[difficulty];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine winner for 2-player
  const isTwoPlayer = mode === 'twoPlayer';
  let winnerTitle = 'Parabéns! Vitória!';
  let winnerSubtitle = 'Você encontrou todos os pares e completou o desafio.';

  if (isTwoPlayer) {
    if (player1Matches > player2Matches) {
      winnerTitle = 'Jogador 1 Venceu!';
      winnerSubtitle = `Com ${player1Matches} pares encontrados contra ${player2Matches} do Jogador 2.`;
    } else if (player2Matches > player1Matches) {
      winnerTitle = 'Jogador 2 Venceu!';
      winnerSubtitle = `Com ${player2Matches} pares encontrados contra ${player1Matches} do Jogador 1.`;
    } else {
      winnerTitle = 'Empate Eletrizante!';
      winnerSubtitle = `Ambos os jogadores encontraram ${player1Matches} pares cada!`;
    }
  } else if (isTimeOutLoss) {
    winnerTitle = 'Tempo Esgotado!';
    winnerSubtitle = 'O cronômetro zerou antes de todos os pares serem desvendados.';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Top Trophy Icon Emblem */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
          {isTimeOutLoss ? (
            <Clock className="w-10 h-10 text-rose-400" />
          ) : (
            <Trophy className="w-10 h-10 text-amber-400 drop-shadow-md" />
          )}
        </div>

        {/* Headings */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {winnerTitle}
          </h2>
          <p className="text-sm text-slate-400">
            {winnerSubtitle}
          </p>
        </div>

        {/* Star Rating (Solo & Time Attack) */}
        {!isTwoPlayer && !isTimeOutLoss && (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-8 h-8 transition-transform ${
                  starIndex <= stars
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* Breakdown Performance Stats */}
        <div className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-left text-xs">
          <div>
            <span className="text-slate-400 block">Dificuldade</span>
            <span className="font-semibold text-white text-sm">{diffConfig.label}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Tempo Total</span>
            <span className="font-semibold font-mono text-white text-sm">{formatTime(timeSeconds)}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Total de Jogadas</span>
            <span className="font-semibold font-mono text-white text-sm">{moves}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Precisão</span>
            <span className="font-semibold font-mono text-emerald-400 text-sm">{accuracy}%</span>
          </div>

          <div>
            <span className="text-slate-400 block">Maior Combo</span>
            <span className="font-semibold font-mono text-amber-400 text-sm">
              {maxCombo > 1 ? `x${maxCombo}` : '1x'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Pontuação Final</span>
            <span className="font-semibold font-mono text-indigo-400 text-sm">{score} pts</span>
          </div>
        </div>

        {/* Single-line Play Again CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl transition-all shadow-md shadow-amber-400/20 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
