import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { AIDifficulty } from './types';

// Standard Chess Piece Values in centipawns
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (from White's perspective)
// Pawns: encourage center control and advancing towards promotion
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

// Knights: strongly reward central outposts, penalize edges/corners
const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

// Bishops: encourage diagonals and active center
const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

// Rooks: open files and 7th rank
const ROOK_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0
];

// Queen: centralized but protected
const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

// King Middle Game: prioritize safety behind pawn shelter
const KING_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

const TABLE_MAP: Record<PieceSymbol, number[]> = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE,
  k: KING_TABLE
};

// Evaluate board position from White's perspective (+ for White, - for Black)
export function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw()) {
    return 0;
  }

  let totalEvaluation = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type];
      const table = TABLE_MAP[piece.type];

      // Index in piece-square table
      let index = r * 8 + c;
      if (piece.color === 'b') {
        // Invert row index for Black
        index = (7 - r) * 8 + c;
      }

      const positionalBonus = table ? table[index] : 0;
      const pieceScore = baseVal + positionalBonus;

      if (piece.color === 'w') {
        totalEvaluation += pieceScore;
      } else {
        totalEvaluation -= pieceScore;
      }
    }
  }

  return totalEvaluation;
}

// Order moves to optimize Alpha-Beta pruning (captures first, then checks)
function orderMoves(moves: string[], game: Chess): string[] {
  return moves.sort((a, b) => {
    // Check if move is a capture
    const isCaptureA = a.includes('x');
    const isCaptureB = b.includes('x');
    if (isCaptureA && !isCaptureB) return -1;
    if (!isCaptureA && isCaptureB) return 1;

    // Check if move gives check
    const isCheckA = a.includes('+');
    const isCheckB = b.includes('+');
    if (isCheckA && !isCheckB) return -1;
    if (!isCheckA && isCheckB) return 1;

    return 0;
  });
}

// Alpha-Beta Minimax search
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(game.moves(), game);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Pruning
    }
    return minEval;
  }
}

// Find best move based on selected AI difficulty
export function getBestMove(game: Chess, difficulty: AIDifficulty): string | null {
  const legalMoves = game.moves();
  if (legalMoves.length === 0) return null;

  // Easy mode: 50% random, 50% basic captures
  if (difficulty === 'easy') {
    const captures = legalMoves.filter((m) => m.includes('x'));
    if (captures.length > 0 && Math.random() < 0.65) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // Medium mode: Depth 2
  // Hard mode: Depth 3
  // Master mode: Depth 3 (or 4 when few pieces remain)
  const isAiWhite = game.turn() === 'w';
  let targetDepth = 2;
  if (difficulty === 'hard') targetDepth = 3;
  if (difficulty === 'master') {
    const pieceCount = game.board().flat().filter(Boolean).length;
    targetDepth = pieceCount <= 12 ? 4 : 3;
  }

  let bestMove: string = legalMoves[0];
  let bestEval = isAiWhite ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  const ordered = orderMoves(legalMoves, game);

  for (const move of ordered) {
    game.move(move);
    const score = minimax(game, targetDepth - 1, alpha, beta, !isAiWhite);
    game.undo();

    if (isAiWhite) {
      if (score > bestEval) {
        bestEval = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } else {
      if (score < bestEval) {
        bestEval = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
    }
  }

  return bestMove;
}
