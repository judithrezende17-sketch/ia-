'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AIDifficulty,
  BoardState,
  CHECKERS_THEMES,
  CheckersMove,
  CheckersMoveRecord,
  CheckersTheme,
  GameMode,
  PieceColor,
  RulesMode,
  Square,
  TIME_CONTROLS,
  TimeControlId
} from './checkersTypes';
import {
  applyMove,
  createInitialBoard,
  getBoardStats,
  getLegalMoves
} from './checkersEngine';
import { getBestCheckersMove } from './checkersAI';
import { CheckersBoard } from './CheckersBoard';
import { CheckersPlayerCard } from './CheckersPlayerCard';
import { CheckersControls } from './CheckersControls';
import { CheckersRulesModal } from './CheckersRulesModal';
import { CheckersGameOverModal } from './CheckersGameOverModal';
import { chessAudio } from '../audio';

const STORAGE_KEY_CHECKERS = 'arena_checkers_settings_v1';

export const CheckersGame: React.FC = () => {
  // Game Configuration State
  const [gameMode, setGameMode] = useState<GameMode>('vsAi');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [rulesMode, setRulesMode] = useState<RulesMode>('brazilian');
  const [timeControl, setTimeControl] = useState<TimeControlId>('rapid10');
  const [boardTheme, setBoardTheme] = useState<CheckersTheme>(CHECKERS_THEMES[0]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Core Game State
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // History & Undo State
  const [boardHistory, setBoardHistory] = useState<BoardState[]>([]);
  const [moveHistory, setMoveHistory] = useState<CheckersMoveRecord[]>([]);

  // Timers State
  const getInitialSeconds = useCallback((tcId: TimeControlId) => {
    const found = TIME_CONTROLS.find(t => t.id === tcId);
    return found ? found.seconds : 600;
  }, []);

  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);

  // Game Over State
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<PieceColor | 'draw' | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string>('');

  // Synchronize audio mute
  useEffect(() => {
    chessAudio.setMuted(isMuted);
  }, [isMuted]);

  // Load saved settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gameMode) setGameMode(parsed.gameMode);
        if (parsed.aiDifficulty) setAiDifficulty(parsed.aiDifficulty);
        if (parsed.rulesMode) setRulesMode(parsed.rulesMode);
        if (parsed.timeControl) {
          setTimeControl(parsed.timeControl);
          const secs = getInitialSeconds(parsed.timeControl);
          setWhiteTime(secs);
          setBlackTime(secs);
        }
        if (parsed.themeId) {
          const theme = CHECKERS_THEMES.find(t => t.id === parsed.themeId);
          if (theme) setBoardTheme(theme);
        }
        if (typeof parsed.isMuted === 'boolean') setIsMuted(parsed.isMuted);
      }
    } catch {}
  }, [getInitialSeconds]);

  // Save settings on changes
  const saveSettings = useCallback(
    (key: string, value: unknown) => {
      if (typeof window === 'undefined') return;
      try {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKERS) || '{}');
        current[key] = value;
        localStorage.setItem(STORAGE_KEY_CHECKERS, JSON.stringify(current));
      } catch {}
    },
    []
  );

  // All legal moves for current turn
  const validMoves = React.useMemo(() => {
    if (isGameOver) return [];
    return getLegalMoves(board, currentTurn, rulesMode);
  }, [board, currentTurn, rulesMode, isGameOver]);

  // Pieces that have mandatory captures
  const mandatoryPieces = React.useMemo(() => {
    const captureMoves = validMoves.filter(m => m.capturedSquares.length > 0);
    const uniqueMap = new Map<string, Square>();
    for (const m of captureMoves) {
      const key = `${m.from.row}-${m.from.col}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, m.from);
      }
    }
    return Array.from(uniqueMap.values());
  }, [validMoves]);

  // Board Stats (Count pieces & captures)
  const boardStats = React.useMemo(() => getBoardStats(board), [board]);
  const whiteCaptured = 12 - boardStats.blackTotal;
  const blackCaptured = 12 - boardStats.whiteTotal;

  // New Game reset
  const handleNewGame = useCallback(() => {
    const initial = createInitialBoard();
    setBoard(initial);
    setCurrentTurn('w');
    setSelectedSquare(null);
    setLastMove(null);
    setBoardHistory([]);
    setMoveHistory([]);
    setIsGameOver(false);
    setWinner(null);
    setGameOverReason('');
    setIsAiThinking(false);

    const initialSecs = getInitialSeconds(timeControl);
    setWhiteTime(initialSecs);
    setBlackTime(initialSecs);

    chessAudio.playGameStart();
  }, [timeControl, getInitialSeconds]);

  // Turn Clock countdown interval
  useEffect(() => {
    if (isGameOver || timeControl === 'none') return;

    const timer = setInterval(() => {
      if (currentTurn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameOver(true);
            setWinner('b');
            setGameOverReason('Tempo das Brancas esgotado.');
            chessAudio.playDefeat();
            return 0;
          }
          if (prev === 30 || prev === 10) chessAudio.playWarning();
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameOver(true);
            setWinner('w');
            setGameOverReason('Tempo das Pretas esgotado.');
            chessAudio.playVictory();
            return 0;
          }
          if (prev === 30 || prev === 10) chessAudio.playWarning();
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTurn, isGameOver, timeControl]);

  // Execute a verified legal move
  const executeMove = useCallback(
    (move: CheckersMove) => {
      const nextBoard = applyMove(board, move);
      const isCapture = move.capturedSquares.length > 0;
      const promoted = move.becomesKing;

      // Audio feedback
      if (promoted) {
        chessAudio.playPromote();
      } else if (isCapture) {
        chessAudio.playCapture();
      } else {
        chessAudio.playMove();
      }

      // Record board history for Undo
      setBoardHistory(prev => [...prev, board]);

      // Record move history
      const moveCount = Math.floor(moveHistory.length) + 1;
      setMoveHistory(prev => {
        const lastRec = prev[prev.length - 1];
        if (currentTurn === 'w' || !lastRec || lastRec.black) {
          return [
            ...prev,
            {
              id: `move_${Date.now()}`,
              moveNumber: moveCount,
              white: move.notation,
              whiteCaptures: move.capturedSquares.length,
            },
          ];
        } else {
          return [
            ...prev.slice(0, -1),
            {
              ...lastRec,
              black: move.notation,
              blackCaptures: move.capturedSquares.length,
            },
          ];
        }
      });

      // Update Board and Last Move
      setBoard(nextBoard);
      setLastMove({ from: move.from, to: move.to });
      setSelectedSquare(null);

      // Check next player's status
      const nextTurn: PieceColor = currentTurn === 'w' ? 'b' : 'w';
      const nextLegalMoves = getLegalMoves(nextBoard, nextTurn, rulesMode);
      const stats = getBoardStats(nextBoard);

      const nextPlayerPieces =
        nextTurn === 'w' ? stats.whiteTotal : stats.blackTotal;

      if (nextPlayerPieces === 0) {
        // All enemy pieces captured
        setIsGameOver(true);
        setWinner(currentTurn);
        setGameOverReason(
          currentTurn === 'w'
            ? 'Todas as peças pretas foram capturadas.'
            : 'Todas as peças brancas foram capturadas.'
        );
        if (currentTurn === 'w') chessAudio.playVictory();
        else chessAudio.playDefeat();
        return;
      }

      if (nextLegalMoves.length === 0) {
        // Blocked / No legal moves available
        setIsGameOver(true);
        setWinner(currentTurn);
        setGameOverReason(
          nextTurn === 'w'
            ? 'Brancas estão bloqueadas e sem lances legais.'
            : 'Pretas estão bloqueadas e sem lances legais.'
        );
        if (currentTurn === 'w') chessAudio.playVictory();
        else chessAudio.playDefeat();
        return;
      }

      // Switch Turn
      setCurrentTurn(nextTurn);
    },
    [board, currentTurn, rulesMode, moveHistory]
  );

  // Trigger AI move when it is black's turn in vsAi mode
  useEffect(() => {
    if (gameMode !== 'vsAi' || currentTurn !== 'b' || isGameOver) return;

    setIsAiThinking(true);

    const thinkingTime =
      aiDifficulty === 'easy'
        ? 350
        : aiDifficulty === 'medium'
          ? 500
          : aiDifficulty === 'hard'
            ? 700
            : 850;

    const timer = setTimeout(() => {
      const bestMove = getBestCheckersMove(board, 'b', aiDifficulty, rulesMode);
      setIsAiThinking(false);

      if (bestMove) {
        executeMove(bestMove);
      } else {
        // AI has no moves
        setIsGameOver(true);
        setWinner('w');
        setGameOverReason('Computador não possui lances legais (bloqueado).');
        chessAudio.playVictory();
      }
    }, thinkingTime);

    return () => clearTimeout(timer);
  }, [currentTurn, gameMode, isGameOver, board, aiDifficulty, rulesMode, executeMove]);

  // Square Click Handler
  const handleSquareClick = (sq: Square) => {
    if (isGameOver || isAiThinking) return;

    // In vsAi, prevent human from clicking on AI's turn
    if (gameMode === 'vsAi' && currentTurn === 'b') return;

    const clickedPiece = board[sq.row][sq.col];

    // If clicking own piece
    if (clickedPiece && clickedPiece.color === currentTurn) {
      // If mandatory captures exist, only pieces with capture moves can be selected!
      if (mandatoryPieces.length > 0) {
        const hasCapture = mandatoryPieces.some(
          m => m.row === sq.row && m.col === sq.col
        );
        if (!hasCapture) {
          chessAudio.playInvalid();
          return;
        }
      }

      setSelectedSquare(sq);
      chessAudio.playClick();
      return;
    }

    // If a piece is already selected, check if clicked square is a valid destination
    if (selectedSquare) {
      const matchingMove = validMoves.find(
        m =>
          m.from.row === selectedSquare.row &&
          m.from.col === selectedSquare.col &&
          m.to.row === sq.row &&
          m.to.col === sq.col
      );

      if (matchingMove) {
        executeMove(matchingMove);
      } else {
        // Clicked invalid empty square
        setSelectedSquare(null);
      }
    }
  };

  // Undo Move handler
  const handleUndo = () => {
    if (boardHistory.length === 0 || isAiThinking || isGameOver) return;

    if (gameMode === 'vsAi') {
      // Undo 2 states (player and AI)
      if (boardHistory.length >= 2) {
        const targetBoard = boardHistory[boardHistory.length - 2];
        setBoard(targetBoard);
        setBoardHistory(prev => prev.slice(0, -2));
        setMoveHistory(prev => prev.slice(0, -1));
        setCurrentTurn('w');
        setSelectedSquare(null);
        setLastMove(null);
        chessAudio.playClick();
      } else {
        handleNewGame();
      }
    } else {
      // 2 Players Local: undo 1 move
      const targetBoard = boardHistory[boardHistory.length - 1];
      setBoard(targetBoard);
      setBoardHistory(prev => prev.slice(0, -1));
      setCurrentTurn(prev => (prev === 'w' ? 'b' : 'w'));
      setSelectedSquare(null);
      setLastMove(null);
      chessAudio.playClick();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3 pb-8">
      {/* Top Player Card (Black / Computer) */}
      <CheckersPlayerCard
        color="b"
        name={gameMode === 'vsAi' ? 'Computador' : 'Jogador 2 (Pretas)'}
        isAi={gameMode === 'vsAi'}
        aiDifficulty={aiDifficulty}
        theme={boardTheme}
        isCurrentTurn={currentTurn === 'b' && !isGameOver}
        timeLeft={blackTime}
        timeLimit={getInitialSeconds(timeControl)}
        pieceCount={boardStats.blackTotal}
        kingCount={boardStats.blackKings}
        capturedCount={blackCaptured}
      />

      {/* Checkers 8x8 Board */}
      <CheckersBoard
        board={board}
        theme={boardTheme}
        isFlipped={isFlipped}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        lastMove={lastMove}
        mandatoryPieces={mandatoryPieces}
        currentTurn={currentTurn}
        isAiThinking={isAiThinking}
        onSquareClick={handleSquareClick}
      />

      {/* Bottom Player Card (White / Player 1) */}
      <CheckersPlayerCard
        color="w"
        name={gameMode === 'vsAi' ? 'Você (Brancas)' : 'Jogador 1 (Brancas)'}
        isAi={false}
        theme={boardTheme}
        isCurrentTurn={currentTurn === 'w' && !isGameOver}
        timeLeft={whiteTime}
        timeLimit={getInitialSeconds(timeControl)}
        pieceCount={boardStats.whiteTotal}
        kingCount={boardStats.whiteKings}
        capturedCount={whiteCaptured}
      />

      {/* Controls & Options Bar */}
      <CheckersControls
        gameMode={gameMode}
        aiDifficulty={aiDifficulty}
        rulesMode={rulesMode}
        timeControl={timeControl}
        boardTheme={boardTheme}
        isMuted={isMuted}
        canUndo={boardHistory.length > 0 && !isGameOver && !isAiThinking}
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        onFlipBoard={() => setIsFlipped(prev => !prev)}
        onToggleMute={() => {
          setIsMuted(prev => !prev);
          saveSettings('isMuted', !isMuted);
        }}
        onOpenRules={() => setIsRulesOpen(true)}
        onSelectGameMode={mode => {
          setGameMode(mode);
          saveSettings('gameMode', mode);
          handleNewGame();
        }}
        onSelectAiDifficulty={diff => {
          setAiDifficulty(diff);
          saveSettings('aiDifficulty', diff);
        }}
        onSelectRulesMode={rules => {
          setRulesMode(rules);
          saveSettings('rulesMode', rules);
          handleNewGame();
        }}
        onSelectTimeControl={tc => {
          setTimeControl(tc);
          saveSettings('timeControl', tc);
          const secs = getInitialSeconds(tc);
          setWhiteTime(secs);
          setBlackTime(secs);
        }}
        onSelectTheme={th => {
          setBoardTheme(th);
          saveSettings('themeId', th.id);
        }}
      />

      {/* Rules Modal */}
      <CheckersRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Game Over Modal */}
      <CheckersGameOverModal
        isOpen={isGameOver}
        winner={winner}
        reason={gameOverReason}
        totalMoves={moveHistory.length}
        whitePiecesLeft={boardStats.whiteTotal}
        blackPiecesLeft={boardStats.blackTotal}
        onPlayAgain={handleNewGame}
      />
    </div>
  );
};
