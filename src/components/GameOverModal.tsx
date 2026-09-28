import React from 'react';
import { GameOverReason } from '../types';
import { Trophy, RotateCcw, Award, CheckCircle2, ShieldAlert } from 'lucide-react';
import { chessAudio } from '../audio';

interface GameOverModalProps {
  isOpen: boolean;
  onNewGame: () => void;
  winner: 'w' | 'b' | 'draw' | null;
  reason: GameOverReason | null;
  totalMoves: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onNewGame,
  winner,
  reason,
  totalMoves
}) => {
  if (!isOpen) return null;

  let title = 'Fim de Jogo';
  let subtitle = '';
  const isDraw = winner === 'draw';

  if (winner === 'w') {
    title = 'Vitória das Brancas! 🏆';
  } else if (winner === 'b') {
    title = 'Vitória das Pretas! 🏆';
  } else {
    title = 'Empate! 🤝';
  }

  switch (reason) {
    case 'checkmate':
      subtitle = 'Vitória incontestável por Xeque-Mate no Rei adversário.';
      break;
    case 'stalemate':
      subtitle = 'Empate por afogamento: o rei não tem lances legais e não está em xeque.';
      break;
    case 'insufficient_material':
      subtitle = 'Empate por material insuficiente para dar xeque-mate.';
      break;
    case 'threefold_repetition':
      subtitle = 'Empate por repetição tripla da mesma posição no tabuleiro.';
      break;
    case 'fifty_moves':
      subtitle = 'Empate pela regra de 50 lances sem captura ou avanço de peão.';
      break;
    case 'timeout':
      subtitle = 'O tempo no relógio se esgotou completamente.';
      break;
    case 'resignation':
      subtitle = 'Partida encerrada por abandono do adversário.';
      break;
    default:
      subtitle = 'Partida concluída.';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5">
        
        {/* Emblem */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
          {isDraw ? (
            <ShieldAlert className="w-10 h-10 text-amber-400" />
          ) : (
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
          )}
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-chess">
            {title}
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed px-2">
            {subtitle}
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs text-left grid grid-cols-2 gap-2">
          <div>
            <span className="text-neutral-500 block">Total de Lances</span>
            <span className="text-base font-bold font-mono text-white">{totalMoves} lances</span>
          </div>

          <div>
            <span className="text-neutral-500 block">Resultado</span>
            <span className="text-base font-bold text-amber-400">
              {isDraw ? '1/2 - 1/2' : winner === 'w' ? '1 - 0' : '0 - 1'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            chessAudio.playClick();
            onNewGame();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all shadow-lg shadow-amber-400/20 font-chess uppercase tracking-wider"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Partida</span>
        </button>
      </div>
    </div>
  );
};
