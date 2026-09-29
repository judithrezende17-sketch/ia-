'use client';

import React from 'react';
import { BoardState, CheckersMove, CheckersTheme, PieceColor, Square } from './checkersTypes';
import { CheckersPiece } from './CheckersPiece';
import { isPlayableSquare, squareToNotation } from './checkersEngine';

interface CheckersBoardProps {
  board: BoardState;
  theme: CheckersTheme;
  isFlipped: boolean;
  selectedSquare: Square | null;
  validMoves: CheckersMove[];
  lastMove: { from: Square; to: Square } | null;
  mandatoryPieces: Square[];
  currentTurn: PieceColor;
  isAiThinking: boolean;
  onSquareClick: (sq: Square) => void;
}

export const CheckersBoard: React.FC<CheckersBoardProps> = ({
  board,
  theme,
  isFlipped,
  selectedSquare,
  validMoves,
  lastMove,
  mandatoryPieces,
  currentTurn,
  isAiThinking,
  onSquareClick,
}) => {
  // Destination squares for current selected piece
  const destinationMoves = selectedSquare
    ? validMoves.filter(
        m => m.from.row === selectedSquare.row && m.from.col === selectedSquare.col
      )
    : [];

  const rowIndices = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const colIndices = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="relative w-full max-w-[min(88vw,520px)] aspect-square p-2.5 sm:p-3 rounded-2xl bg-neutral-900 shadow-2xl border-4 border-neutral-800 flex flex-col justify-center items-center select-none">
      {/* 8x8 Grid */}
      <div className={`w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden shadow-inner border ${theme.border}`}>
        {rowIndices.map((r, visualRow) =>
          colIndices.map((c, visualCol) => {
            const sq: Square = { row: r, col: c };
            const isDark = isPlayableSquare(r, c);
            const piece = board[r][c];

            const isSelected =
              selectedSquare !== null &&
              selectedSquare.row === r &&
              selectedSquare.col === c;

            const matchingMove = destinationMoves.find(
              m => m.to.row === r && m.to.col === c
            );
            const isValidDestination = Boolean(matchingMove);
            const isCaptureDestination = matchingMove
              ? matchingMove.capturedSquares.length > 0
              : false;

            const isLastMoveSquare =
              lastMove !== null &&
              ((lastMove.from.row === r && lastMove.from.col === c) ||
                (lastMove.to.row === r && lastMove.to.col === c));

            const isMandatoryPiece = mandatoryPieces.some(
              m => m.row === r && m.col === c
            );

            // Coordinates labels (top/left or bottom/right)
            const showColCoord = visualRow === 7;
            const showRowCoord = visualCol === 0;
            const colLabel = String.fromCharCode('a'.charCodeAt(0) + c);
            const rowLabel = 8 - r;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onSquareClick(sq)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                  isDark ? theme.darkSquare : theme.lightSquare
                } ${
                  isSelected
                    ? 'ring-inset ring-4 ring-amber-400/90'
                    : isLastMoveSquare
                      ? 'after:absolute after:inset-0 after:bg-amber-400/25 after:pointer-events-none'
                      : ''
                }`}
                title={squareToNotation(sq)}
              >
                {/* Coordinates */}
                {showRowCoord && (
                  <span
                    className={`absolute top-0.5 left-1 text-[9px] font-mono font-bold leading-none pointer-events-none ${
                      isDark ? 'text-amber-200/50' : 'text-neutral-600/60'
                    }`}
                  >
                    {rowLabel}
                  </span>
                )}
                {showColCoord && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[9px] font-mono font-bold leading-none pointer-events-none ${
                      isDark ? 'text-amber-200/50' : 'text-neutral-600/60'
                    }`}
                  >
                    {colLabel}
                  </span>
                )}

                {/* Piece Rendering */}
                {piece && (
                  <CheckersPiece
                    piece={piece}
                    theme={theme}
                    isSelected={isSelected}
                    isMustCapture={isMandatoryPiece && piece.color === currentTurn}
                  />
                )}

                {/* Destination Indicators */}
                {isValidDestination && !piece && (
                  <div
                    className={`absolute rounded-full transition-transform ${
                      isCaptureDestination
                        ? 'w-6 h-6 sm:w-8 sm:h-8 border-2 border-red-500 bg-red-500/20 animate-ping duration-1000'
                        : 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-400/80 shadow-md ring-2 ring-amber-300/40'
                    }`}
                  />
                )}

                {/* Capture overlay if target occupied */}
                {isValidDestination && piece && (
                  <div className="absolute inset-0 ring-4 ring-red-500/80 bg-red-600/20 rounded-lg pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI Thinking Overlay Banner */}
      {isAiThinking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-neutral-900/95 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold shadow-xl flex items-center gap-2 backdrop-blur-sm animate-pulse z-20">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Computador calculando jogada...</span>
        </div>
      )}
    </div>
  );
};
