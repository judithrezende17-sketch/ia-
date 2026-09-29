'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  ArrowLeftRight,
  Volume2,
  VolumeX,
  HelpCircle,
  Settings2,
  Play,
  Swords,
  User,
  Bot
} from 'lucide-react';
import {
  AIDifficulty,
  CHECKERS_THEMES,
  CheckersTheme,
  GameMode,
  RulesMode,
  TIME_CONTROLS,
  TimeControlId
} from './checkersTypes';

interface CheckersControlsProps {
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  rulesMode: RulesMode;
  timeControl: TimeControlId;
  boardTheme: CheckersTheme;
  isMuted: boolean;
  canUndo: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  onFlipBoard: () => void;
  onToggleMute: () => void;
  onOpenRules: () => void;
  onSelectGameMode: (mode: GameMode) => void;
  onSelectAiDifficulty: (diff: AIDifficulty) => void;
  onSelectRulesMode: (rules: RulesMode) => void;
  onSelectTimeControl: (tc: TimeControlId) => void;
  onSelectTheme: (theme: CheckersTheme) => void;
}

export const CheckersControls: React.FC<CheckersControlsProps> = ({
  gameMode,
  aiDifficulty,
  rulesMode,
  timeControl,
  boardTheme,
  isMuted,
  canUndo,
  onNewGame,
  onUndo,
  onFlipBoard,
  onToggleMute,
  onOpenRules,
  onSelectGameMode,
  onSelectAiDifficulty,
  onSelectRulesMode,
  onSelectTimeControl,
  onSelectTheme,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-full max-w-[min(88vw,520px)] space-y-2 select-none">
      {/* Primary Action Buttons */}
      <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-1">
          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            title="Iniciar Nova Partida"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Novo Jogo</span>
          </button>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              canUndo
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                : 'bg-neutral-950/40 text-neutral-600 border-neutral-800/40 cursor-not-allowed'
            }`}
            title="Desfazer Jogada"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desfazer</span>
          </button>

          <button
            onClick={onFlipBoard}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
            title="Inverter Tabuleiro"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
            title={isMuted ? 'Ativar Som' : 'Desativar Som'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showSettings
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
            }`}
            title="Opções de Partida"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenRules}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
            title="Regras do Jogo de Damas"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Settings Panel */}
      {showSettings && (
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mode Selector */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Modo de Jogo</div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSelectGameMode('vsAi')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  gameMode === 'vsAi'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Vs Computador</span>
              </button>
              <button
                onClick={() => onSelectGameMode('pvp')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  gameMode === 'pvp'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>2 Jogadores Local</span>
              </button>
            </div>
          </div>

          {/* AI Difficulty if vsAi */}
          {gameMode === 'vsAi' && (
            <div>
              <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Nível da IA</div>
              <div className="grid grid-cols-4 gap-1">
                {(['easy', 'medium', 'hard', 'master'] as AIDifficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => onSelectAiDifficulty(diff)}
                    className={`py-1 text-center rounded-md text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                      aiDifficulty === diff
                        ? 'bg-amber-500 text-neutral-950 border-amber-400'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                    }`}
                  >
                    {diff === 'easy'
                      ? 'Fácil'
                      : diff === 'medium'
                        ? 'Médio'
                        : diff === 'hard'
                          ? 'Difícil'
                          : 'Mestre'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rules Mode Selector */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">
              Regras do Tabuleiro
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSelectRulesMode('brazilian')}
                className={`p-2 rounded-lg text-left border transition-colors cursor-pointer ${
                  rulesMode === 'brazilian'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-bold">Regra Brasileira (Oficial)</div>
                <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                  Dama voadora longa, captura para trás e Lei da Maioria
                </div>
              </button>
              <button
                onClick={() => onSelectRulesMode('classic')}
                className={`p-2 rounded-lg text-left border transition-colors cursor-pointer ${
                  rulesMode === 'classic'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-bold">Regra Clássica</div>
                <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                  Dama move 1 casa, peças comuns só capturam para frente
                </div>
              </button>
            </div>
          </div>

          {/* Time Control */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Tempo de Partida</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
              {TIME_CONTROLS.map(tc => (
                <button
                  key={tc.id}
                  onClick={() => onSelectTimeControl(tc.id)}
                  className={`py-1 text-center rounded-md text-[10px] font-semibold border transition-colors cursor-pointer truncate ${
                    timeControl === tc.id
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">
              Tema do Tabuleiro
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CHECKERS_THEMES.map(th => (
                <button
                  key={th.id}
                  onClick={() => onSelectTheme(th)}
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    boardTheme.id === th.id
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded overflow-hidden grid grid-cols-2 grid-rows-2 shrink-0 border border-neutral-600">
                    <div className={th.lightSquare} />
                    <div className={th.darkSquare} />
                    <div className={th.darkSquare} />
                    <div className={th.lightSquare} />
                  </div>
                  <span className="text-[11px] font-medium truncate">{th.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
