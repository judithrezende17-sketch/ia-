import React, { useState } from 'react';
import { Chess, Square, PieceSymbol, Color, Move } from 'chess.js';
import { BoardTheme } from '../types';
import { ChessPiece } from './ChessPiece';
import { PromotionModal } from './PromotionModal';
import { chessAudio } from '../audio';

interface ChessBoardProps {
  game: Chess;
  boardTheme: BoardTheme;
  isFlipped: boolean;
  onMakeMove: (move: { from: string; to: string; promotion?: string }) => boolean;
  isInteractive: boolean;
  lastMove: { from: string; to: string } | null;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  boardTheme,
  isFlipped,
  onMakeMove,
  isInteractive,
  lastMove
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Files a-h, Ranks 1-8
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Apply board orientation
  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // Find King square if currently in check
  let checkSquare: Square | null = null;
  if (game.inCheck()) {
    const turn = game.turn();
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          checkSquare = `${files[c]}${8 - r}` as Square;
          break;
        }
      }
      if (checkSquare) break;
    }
  }

  // Handle Square Selection or Move
  const handleSquareClick = (square: Square) => {
    if (!isInteractive) return;

    const pieceOnSquare = game.get(square);

    // If already selected a piece, check if target square is a legal move
    if (selectedSquare) {
      const move = legalMoves.find((m) => m.to === square);

      if (move) {
        // Check if promotion is needed (pawn moving to 8th or 1st rank)
        const piece = game.get(selectedSquare);
        if (
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && square[1] === '8') || (piece.color === 'b' && square[1] === '1'))
        ) {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }

        // Execute standard move
        const success = onMakeMove({ from: selectedSquare, to: square });
        if (success) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }
      }

      // If clicked on own piece of same turn, reselect that piece
      if (pieceOnSquare && pieceOnSquare.color === game.turn()) {
        chessAudio.playClick();
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves);
        return;
      }

      // Deselect if clicked elsewhere
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Select piece if it belongs to current player
    if (pieceOnSquare && pieceOnSquare.color === game.turn()) {
      chessAudio.playClick();
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves);
    }
  };

  // Handle Promotion Selection
  const handlePromotionSelect = (promotedPiece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      onMakeMove({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promotedPiece
      });
      setPendingPromotion(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Drag and Drop support
  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (!isInteractive) return;
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMoves(moves);
    e.dataTransfer.setData('text/plain', square);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (!isInteractive || !selectedSquare) return;

    const move = legalMoves.find((m) => m.to === targetSquare);
    if (move) {
      const piece = game.get(selectedSquare);
      if (
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && targetSquare[1] === '8') || (piece.color === 'b' && targetSquare[1] === '1'))
      ) {
        setPendingPromotion({ from: selectedSquare, to: targetSquare });
        return;
      }

      onMakeMove({ from: selectedSquare, to: targetSquare });
    }

    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <div className="relative w-full max-w-[540px] aspect-square mx-auto select-none">
      {/* Board Outer Border Frame */}
      <div
        className="w-full h-full rounded-2xl p-2 sm:p-3 shadow-2xl border-4 transition-colors duration-300 flex flex-col justify-between"
        style={{
          backgroundColor: boardTheme.borderColor,
          borderColor: 'rgba(255, 255, 255, 0.12)'
        }}
      >
        <div className="relative w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden shadow-inner">
          {displayRanks.map((rank, rankIdx) =>
            displayFiles.map((file, fileIdx) => {
              const square = `${file}${rank}` as Square;
              const piece = game.get(square);

              // Standard alternating chessboard squares
              const isDark = (file.charCodeAt(0) - 97 + parseInt(rank, 10)) % 2 === 0;
              const squareBg = isDark ? boardTheme.darkSquare : boardTheme.lightSquare;

              const isSelected = selectedSquare === square;
              const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
              const isChecked = checkSquare === square;

              // Check if square is a legal destination
              const legalMove = legalMoves.find((m) => m.to === square);
              const isCapture = legalMove && (legalMove.captured || (piece && piece.color !== game.turn()));

              // Show coordinates in corners
              const showRankCoord = fileIdx === 0;
              const showFileCoord = rankIdx === 7;
              const coordColor = isDark ? boardTheme.lightSquare : boardTheme.darkSquare;

              return (
                <div
                  key={square}
                  onClick={() => handleSquareClick(square)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                  style={{ backgroundColor: squareBg }}
                  className="relative flex items-center justify-center cursor-pointer transition-colors duration-150"
                >
                  {/* Last Move Highlight */}
                  {isLastMove && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: boardTheme.highlightLastMove }}
                    />
                  )}

                  {/* Selected Square Highlight */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 pointer-events-none ring-4 ring-inset ring-amber-400"
                      style={{ backgroundColor: boardTheme.highlightSelected }}
                    />
                  )}

                  {/* King in Check Red Glow */}
                  {isChecked && (
                    <div
                      className="absolute inset-0 pointer-events-none animate-pulse"
                      style={{ background: boardTheme.highlightCheck }}
                    />
                  )}

                  {/* Legal Move Indicators */}
                  {legalMove && !isCapture && (
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full pointer-events-none z-10 opacity-80"
                      style={{ backgroundColor: boardTheme.highlightMove }}
                    />
                  )}

                  {legalMove && isCapture && (
                    <div
                      className="absolute inset-0.5 rounded-full border-4 pointer-events-none z-10"
                      style={{ borderColor: boardTheme.highlightMove }}
                    />
                  )}

                  {/* Chess Piece Graphic */}
                  {piece && (
                    <div
                      draggable={isInteractive && piece.color === game.turn()}
                      onDragStart={(e) => handleDragStart(e, square)}
                      className={`relative z-20 w-[84%] h-[84%] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                        isInteractive && piece.color === game.turn() ? 'cursor-grab active:cursor-grabbing' : ''
                      }`}
                    >
                      <ChessPiece type={piece.type} color={piece.color} />
                    </div>
                  )}

                  {/* Rank Coordinate (1-8) along left border */}
                  {showRankCoord && (
                    <span
                      className="absolute top-0.5 left-1 coord-text opacity-70"
                      style={{ color: coordColor }}
                    >
                      {rank}
                    </span>
                  )}

                  {/* File Coordinate (a-h) along bottom border */}
                  {showFileCoord && (
                    <span
                      className="absolute bottom-0.5 right-1 coord-text opacity-70"
                      style={{ color: coordColor }}
                    >
                      {file}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pawn Promotion Modal */}
      <PromotionModal
        isOpen={Boolean(pendingPromotion)}
        color={game.turn()}
        onSelect={handlePromotionSelect}
      />
    </div>
  );
};
