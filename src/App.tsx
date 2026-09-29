'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import {
  GameMode,
  AIDifficulty,
  TimeControlId,
  TIME_CONTROLS,
  BoardTheme,
  BOARD_THEMES,
  MoveRecord,
  GameOverReason
} from './types';
import { chessAudio } from './audio';
import { getBestMove } from './chessAI';
import { ChessBoard } from './components/ChessBoard';
import { ChessPlayerCard } from './components/ChessClocks';
import { MoveHistory } from './components/MoveHistory';
import { ControlsBar } from './components/ControlsBar';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { MemoryGame } from './memory/MemoryGame';
import { CheckersGame } from './checkers/CheckersGame';
import { Crown, Sparkles, Layers } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'chess_master_settings_v1';
const STORAGE_KEY_ACTIVE_GAME = 'arena_active_game_v1';

export default function App() {
  // Master Game Selector: Chess vs Checkers vs Memory Game
  const [activeGameTab, setActiveGameTab] = useState<'chess' | 'checkers' | 'memory'>('chess');

  // Game Instance State
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [gameMode, setGameMode] = useState<GameMode>('vsAi');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [timeControl, setTimeControl] = useState<TimeControlId>('rapid10');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(BOARD_THEMES[0]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Turn and clocks state
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Moves & History
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Game Over
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  const [gameOverReason, setGameOverReason] = useState<GameOverReason | null>(null);

  // Rules Modal
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restore saved active tab & settings safely on client mount
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem(STORAGE_KEY_ACTIVE_GAME);
      if (savedTab === 'memory' || savedTab === 'chess' || savedTab === 'checkers') {
        setActiveGameTab(savedTab as 'chess' | 'checkers' | 'memory');
      }
    } catch {}
  }, []);

  // Load sound settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isMuted === 'boolean') {
          setIsMuted(parsed.isMuted);
          chessAudio.setMuted(parsed.isMuted);
        }
        if (parsed.boardThemeId) {
          const theme = BOARD_THEMES.find((t) => t.id === parsed.boardThemeId);
          if (theme) setBoardTheme(theme);
        }
      }
    } catch {}
  }, []);

  // Compute captured pieces from current board state
  const getCapturedPieces = useCallback(() => {
    const board = game.board();
    const currentCounts: Record<string, number> = {
      wp: 0, wn: 0, wb: 0, wr: 0, wq: 0,
      bp: 0, bn: 0, bb: 0, br: 0, bq: 0
    };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type !== 'k') {
          currentCounts[`${p.color}${p.type}`]++;
        }
      }
    }

    const initialCounts: Record<string, number> = {
      wp: 8, wn: 2, wb: 2, wr: 2, wq: 1,
      bp: 8, bn: 2, bb: 2, br: 2, bq: 1
    };

    const whiteCaptured: string[] = []; // Black pieces captured by white
    const blackCaptured: string[] = []; // White pieces captured by black

    const pieceOrder = ['q', 'r', 'b', 'n', 'p'];

    pieceOrder.forEach((type) => {
      const blackLost = initialCounts[`b${type}`] - currentCounts[`b${type}`];
      for (let i = 0; i < blackLost; i++) whiteCaptured.push(type);

      const whiteLost = initialCounts[`w${type}`] - currentCounts[`w${type}`];
      for (let i = 0; i < whiteLost; i++) blackCaptured.push(type);
    });

    const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const whitePoints = whiteCaptured.reduce((sum, p) => sum + pieceValues[p], 0);
    const blackPoints = blackCaptured.reduce((sum, p) => sum + pieceValues[p], 0);

    return {
      whiteCaptured,
      blackCaptured,
      whiteDiff: Math.max(0, whitePoints - blackPoints),
      blackDiff: Math.max(0, blackPoints - whitePoints)
    };
  }, [game]);

  const { whiteCaptured, blackCaptured, whiteDiff, blackDiff } = getCapturedPieces();

  // Reset Game
  const handleNewGame = useCallback(() => {
    const newG = new Chess();
    setGame(newG);
    setMoveHistory([]);
    setLastMove(null);
    setIsGameOver(false);
    setWinner(null);
    setGameOverReason(null);
    setIsAiThinking(false);

    const tc = TIME_CONTROLS[timeControl];
    setWhiteTime(tc.seconds);
    setBlackTime(tc.seconds);
  }, [timeControl]);

  // Check Game Ending conditions
  const checkGameStatus = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) {
      setIsGameOver(true);
      if (currentGame.isCheckmate()) {
        const winningColor = currentGame.turn() === 'w' ? 'b' : 'w';
        setWinner(winningColor);
        setGameOverReason('checkmate');
        chessAudio.playVictory();
      } else if (currentGame.isStalemate()) {
        setWinner('draw');
        setGameOverReason('stalemate');
      } else if (currentGame.isThreefoldRepetition()) {
        setWinner('draw');
        setGameOverReason('threefold_repetition');
      } else if (currentGame.isInsufficientMaterial()) {
        setWinner('draw');
        setGameOverReason('insufficient_material');
      } else {
        setWinner('draw');
        setGameOverReason('fifty_moves');
      }
      return true;
    }
    return false;
  }, []);

  // Make move handler
  const handleMakeMove = useCallback(
    (moveArgs: { from: string; to: string; promotion?: string }) => {
      try {
        const newGame = new Chess(game.fen());
        const moveResult = newGame.move({
          from: moveArgs.from,
          to: moveArgs.to,
          promotion: moveArgs.promotion || 'q'
        });

        if (!moveResult) return false;

        // Sound triggers
        if (newGame.inCheck()) {
          chessAudio.playCheck();
        } else if (moveResult.captured) {
          chessAudio.playCapture();
        } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
          chessAudio.playCastle();
        } else {
          chessAudio.playMove();
        }

        // Add increment to clock if applicable
        const tc = TIME_CONTROLS[timeControl];
        if (tc.increment > 0) {
          if (moveResult.color === 'w') {
            setWhiteTime((t) => t + tc.increment);
          } else {
            setBlackTime((t) => t + tc.increment);
          }
        }

        // Add to history
        const newRecord: MoveRecord = {
          san: moveResult.san,
          from: moveResult.from,
          to: moveResult.to,
          color: moveResult.color,
          piece: moveResult.piece,
          captured: moveResult.captured,
          promotion: moveResult.promotion,
          fen: newGame.fen()
        };

        setGame(newGame);
        setMoveHistory((prev) => [...prev, newRecord]);
        setLastMove({ from: moveResult.from, to: moveResult.to });

        // Check if game ended with this move
        checkGameStatus(newGame);
        return true;
      } catch {
        return false;
      }
    },
    [game, timeControl, checkGameStatus]
  );

  // AI Turn Trigger
  useEffect(() => {
    if (
      gameMode === 'vsAi' &&
      game.turn() === 'b' &&
      !isGameOver &&
      !isAiThinking
    ) {
      setIsAiThinking(true);

      const timer = setTimeout(() => {
        const bestSan = getBestMove(game, aiDifficulty);
        if (bestSan) {
          const newGame = new Chess(game.fen());
          const moveResult = newGame.move(bestSan);
          if (moveResult) {
            if (newGame.inCheck()) {
              chessAudio.playCheck();
            } else if (moveResult.captured) {
              chessAudio.playCapture();
            } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
              chessAudio.playCastle();
            } else {
              chessAudio.playMove();
            }

            const tc = TIME_CONTROLS[timeControl];
            if (tc.increment > 0) {
              setBlackTime((t) => t + tc.increment);
            }

            const newRecord: MoveRecord = {
              san: moveResult.san,
              from: moveResult.from,
              to: moveResult.to,
              color: moveResult.color,
              piece: moveResult.piece,
              captured: moveResult.captured,
              promotion: moveResult.promotion,
              fen: newGame.fen()
            };

            setGame(newGame);
            setMoveHistory((prev) => [...prev, newRecord]);
            setLastMove({ from: moveResult.from, to: moveResult.to });
            checkGameStatus(newGame);
          }
        }
        setIsAiThinking(false);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [game, gameMode, aiDifficulty, isGameOver, isAiThinking, timeControl, checkGameStatus]);

  // Chess Clocks Interval Effect
  useEffect(() => {
    const hasTimer = TIME_CONTROLS[timeControl].seconds > 0;
    if (!hasTimer || isGameOver || moveHistory.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const activeColor = game.turn();
      if (activeColor === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsGameOver(true);
            setWinner('b');
            setGameOverReason('timeout');
            chessAudio.playVictory();
            return 0;
          }
          if (prev === 20 || prev === 10) chessAudio.playClockLow();
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsGameOver(true);
            setWinner('w');
            setGameOverReason('timeout');
            chessAudio.playVictory();
            return 0;
          }
          if (prev === 20 || prev === 10) chessAudio.playClockLow();
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game, isGameOver, moveHistory.length, timeControl]);

  // Undo Move handler
  const handleUndoMove = () => {
    if (moveHistory.length === 0 || isAiThinking) return;

    const newGame = new Chess();
    let targetSteps = moveHistory.length - 1;

    // Against AI, undo both the AI move and player's move so it's White's turn again
    if (gameMode === 'vsAi' && moveHistory.length >= 2) {
      targetSteps = moveHistory.length - 2;
    }

    const trimmedHistory = moveHistory.slice(0, targetSteps);
    trimmedHistory.forEach((rec) => {
      newGame.move(rec.san);
    });

    setGame(newGame);
    setMoveHistory(trimmedHistory);

    if (trimmedHistory.length > 0) {
      const last = trimmedHistory[trimmedHistory.length - 1];
      setLastMove({ from: last.from, to: last.to });
    } else {
      setLastMove(null);
    }

    setIsGameOver(false);
    setWinner(null);
    setGameOverReason(null);
    chessAudio.playMove();
  };

  // Resign handler
  const handleResign = () => {
    if (isGameOver) return;
    const currentTurn = game.turn();
    setIsGameOver(true);
    setWinner(currentTurn === 'w' ? 'b' : 'w');
    setGameOverReason('resignation');
    chessAudio.playVictory();
  };

  // Toggle Sound
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    chessAudio.setMuted(next);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ isMuted: next }));
    } catch {}
  };

  // Theme change
  const handleSelectTheme = (theme: BoardTheme) => {
    setBoardTheme(theme);
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ isMuted, boardThemeId: theme.id })
      );
    } catch {}
  };

  const hasTimer = TIME_CONTROLS[timeControl].seconds > 0;
  const isPlayerTurn = gameMode === 'passAndPlay' || game.turn() === 'w';

  const handleSelectGameTab = (tab: 'chess' | 'checkers' | 'memory') => {
    setActiveGameTab(tab);
    chessAudio.playClick();
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_GAME, tab);
    } catch {}
  };

  return (
    <div className="min-h-screen w-full bg-chess-room text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header with Game Hub Switcher */}
      <header className="w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xl sm:text-2xl">
              {activeGameTab === 'chess' ? '♟️' : activeGameTab === 'checkers' ? '⚪' : '🃏'}
            </span>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-chess uppercase">
                {activeGameTab === 'chess'
                  ? 'Mestre do Xadrez'
                  : activeGameTab === 'checkers'
                    ? 'Jogo de Damas'
                    : 'Jogo da Memória'}
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {activeGameTab === 'chess' ? 'FIDE' : activeGameTab === 'checkers' ? 'OFICIAL 8X8' : 'ARCADE'}
              </span>
            </div>
          </div>

          {/* Center Tabs: Xadrez vs Damas vs Jogo da Memória */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSelectGameTab('chess')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeGameTab === 'chess'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>♟️</span>
              <span>Xadrez</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectGameTab('checkers')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeGameTab === 'checkers'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>⚪</span>
              <span>Damas</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectGameTab('memory')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeGameTab === 'memory'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🃏</span>
              <span>Memória</span>
            </button>
          </div>

          {/* Right Header Action */}
          <div className="flex items-center gap-2 shrink-0">
            {activeGameTab === 'chess' && (
              <button
                type="button"
                onClick={() => {
                  chessAudio.playClick();
                  setIsRulesOpen(true);
                }}
                className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
              >
                Regras do Xadrez
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Arena */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-start">
        {activeGameTab === 'checkers' ? (
          /* CHECKERS GAME ARENA */
          <CheckersGame />
        ) : activeGameTab === 'memory' ? (
          /* MEMORY GAME ARENA */
          <MemoryGame />
        ) : (
          /* CHESS GAME ARENA */
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
            {/* Left Column: Black Clock, Board, White Clock */}
            <section aria-label="Tabuleiro e Relógios de Xadrez" className="w-full max-w-[540px] space-y-2.5">
              {/* Top Player (Black by default, or White if flipped) */}
              <ChessPlayerCard
                color={isFlipped ? 'w' : 'b'}
                timeSeconds={isFlipped ? whiteTime : blackTime}
                isActiveTurn={game.turn() === (isFlipped ? 'w' : 'b') && !isGameOver}
                gameMode={gameMode}
                aiDifficulty={aiDifficulty}
                capturedPieces={isFlipped ? whiteCaptured : blackCaptured}
                materialDifference={isFlipped ? whiteDiff : blackDiff}
                hasTimer={hasTimer}
              />

              {/* Chess Board Component */}
              <ChessBoard
                game={game}
                boardTheme={boardTheme}
                isFlipped={isFlipped}
                onMakeMove={handleMakeMove}
                isInteractive={!isGameOver && isPlayerTurn && !isAiThinking}
                lastMove={lastMove}
              />

              {/* Bottom Player (White by default, or Black if flipped) */}
              <ChessPlayerCard
                color={isFlipped ? 'b' : 'w'}
                timeSeconds={isFlipped ? blackTime : whiteTime}
                isActiveTurn={game.turn() === (isFlipped ? 'b' : 'w') && !isGameOver}
                gameMode={gameMode}
                aiDifficulty={aiDifficulty}
                capturedPieces={isFlipped ? blackCaptured : whiteCaptured}
                materialDifference={isFlipped ? blackDiff : whiteDiff}
                hasTimer={hasTimer}
              />
            </section>

            {/* Right Column: Controls, Move History & Settings */}
            <section aria-label="Controles e Histórico da Partida" className="w-full max-w-[540px] lg:max-w-md space-y-4">
              {/* Controls Bar */}
              <ControlsBar
                gameMode={gameMode}
                onSelectGameMode={(m) => {
                  setGameMode(m);
                  handleNewGame();
                }}
                aiDifficulty={aiDifficulty}
                onSelectAIDifficulty={setAiDifficulty}
                timeControl={timeControl}
                onSelectTimeControl={(tc) => {
                  setTimeControl(tc);
                  const cfg = TIME_CONTROLS[tc];
                  setWhiteTime(cfg.seconds);
                  setBlackTime(cfg.seconds);
                }}
                boardTheme={boardTheme}
                onSelectBoardTheme={handleSelectTheme}
                onNewGame={handleNewGame}
                onUndoMove={handleUndoMove}
                canUndo={moveHistory.length > 0}
                onFlipBoard={() => setIsFlipped((f) => !f)}
                onResign={handleResign}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onOpenRules={() => setIsRulesOpen(true)}
                isGameOver={isGameOver}
              />

              {/* Move History Component */}
              <MoveHistory
                history={moveHistory}
                pgn={game.pgn()}
                fen={game.fen()}
              />
            </section>
          </div>
        )}
      </main>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        onNewGame={handleNewGame}
        winner={winner}
        reason={gameOverReason}
        totalMoves={moveHistory.length}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
