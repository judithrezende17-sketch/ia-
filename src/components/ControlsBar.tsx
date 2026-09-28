import React from 'react';
import {
  GameMode,
  AIDifficulty,
  TimeControlId,
  TIME_CONTROLS,
  BoardTheme,
  BOARD_THEMES
} from '../types';
import {
  RotateCcw,
  Undo2,
  Volume2,
  VolumeX,
  HelpCircle,
  Flag,
  Palette,
  Bot,
  Users,
  Repeat
} from 'lucide-react';
import { chessAudio } from '../audio';

interface ControlsBarProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  aiDifficulty: AIDifficulty;
  onSelectAIDifficulty: (diff: AIDifficulty) => void;
  timeControl: TimeControlId;
  onSelectTimeControl: (tc: TimeControlId) => void;
  boardTheme: BoardTheme;
  onSelectBoardTheme: (theme: BoardTheme) => void;
  onNewGame: () => void;
  onUndoMove: () => void;
  canUndo: boolean;
  onFlipBoard: () => void;
  onResign: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
  isGameOver: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  gameMode,
  onSelectGameMode,
  aiDifficulty,
  onSelectAIDifficulty,
  timeControl,
  onSelectTimeControl,
  boardTheme,
  onSelectBoardTheme,
  onNewGame,
  onUndoMove,
  canUndo,
  onFlipBoard,
  onResign,
  isMuted,
  onToggleMute,
  onOpenRules,
  isGameOver
}) => {
  const difficulties: { id: AIDifficulty; label: string }[] = [
    { id: 'easy', label: 'Iniciante' },
    { id: 'medium', label: 'Médio' },
    { id: 'hard', label: 'Difícil' },
    { id: 'master', label: 'Mestre' }
  ];

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3 sm:p-4 space-y-3.5 shadow-xl">
      {/* Row 1: Mode Switcher & Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Game Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onSelectGameMode('vsAi');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              gameMode === 'vsAi'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs Computador</span>
          </button>

          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onSelectGameMode('passAndPlay');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              gameMode === 'passAndPlay'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Jogadores</span>
          </button>
        </div>

        {/* Action Buttons: Undo, Flip, Resign, Mute, Rules, New Game */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onUndoMove();
            }}
            disabled={!canUndo || isGameOver}
            title="Desfazer Lance"
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onFlipBoard();
            }}
            title="Girar Tabuleiro"
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onResign();
            }}
            disabled={isGameOver}
            title="Abandonar Partida"
            className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-900/60 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 hover:text-rose-300 transition-colors"
          >
            <Flag className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Ativar Sons' : 'Silenciar'}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onOpenRules();
            }}
            title="Regras do Xadrez"
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              chessAudio.playClick();
              onNewGame();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      {/* Row 2: Settings (AI Difficulty & Time Controls) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800 text-xs">
        {/* If vs AI: show difficulty levels */}
        {gameMode === 'vsAi' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-400 font-medium">Nível da IA:</span>
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => {
                  chessAudio.playClick();
                  onSelectAIDifficulty(diff.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  aiDifficulty === diff.id
                    ? 'bg-neutral-700 text-white ring-2 ring-amber-400 shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        )}

        {/* Time Control Options */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-neutral-400 font-medium">Tempo:</span>
          {(Object.keys(TIME_CONTROLS) as TimeControlId[]).map((tcKey) => {
            const tc = TIME_CONTROLS[tcKey];
            const isSelected = timeControl === tcKey;
            return (
              <button
                key={tcKey}
                type="button"
                onClick={() => {
                  chessAudio.playClick();
                  onSelectTimeControl(tcKey);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-neutral-700 text-white ring-2 ring-amber-400 shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {tc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Board Theme Customizer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800 text-xs">
        <span className="text-neutral-400 font-medium flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Tema do Tabuleiro:</span>
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {BOARD_THEMES.map((theme) => {
            const isSelected = boardTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  chessAudio.playClick();
                  onSelectBoardTheme(theme);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-neutral-700 text-white ring-2 ring-amber-400 shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-sm overflow-hidden flex shrink-0 border border-white/20">
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.lightSquare }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.darkSquare }} />
                </div>
                <span className="whitespace-nowrap">{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
