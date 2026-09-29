import { AIDifficulty, BoardState, CheckersMove, PieceColor, RulesMode } from './checkersTypes';
import { applyMove, getLegalMoves } from './checkersEngine';

// Heuristic weights
const WEIGHT_MAN = 100;
const WEIGHT_KING = 320;
const WEIGHT_BACK_ROW = 28;
const WEIGHT_EDGE = 14;
const WEIGHT_CENTER = 12;

function evaluateBoard(board: BoardState, playerColor: PieceColor): number {
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let pieceVal = piece.type === 'king' ? WEIGHT_KING : WEIGHT_MAN;

      // Positional factors for normal men
      if (piece.type === 'man') {
        // Advancement bonus towards crowning
        const advancement = piece.color === 'w' ? (7 - r) * 5 : r * 5;
        pieceVal += advancement;

        // Back rank protection
        if ((piece.color === 'w' && r === 7) || (piece.color === 'b' && r === 0)) {
          pieceVal += WEIGHT_BACK_ROW;
        }

        // Safe edge pieces (cannot be jumped from the outside)
        if (c === 0 || c === 7) {
          pieceVal += WEIGHT_EDGE;
        }

        // Center control (d4, e4, d5, e5 and neighboring)
        if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
          pieceVal += WEIGHT_CENTER;
        }
      } else {
        // Kings value centralization and mobility
        if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
          pieceVal += WEIGHT_CENTER * 2;
        }
      }

      if (piece.color === playerColor) {
        score += pieceVal;
      } else {
        score -= pieceVal;
      }
    }
  }

  return score;
}

interface MinimaxResult {
  bestMove: CheckersMove | null;
  score: number;
}

function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiColor: PieceColor,
  rules: RulesMode
): MinimaxResult {
  const currentTurn: PieceColor = isMaximizing
    ? aiColor
    : aiColor === 'w'
      ? 'b'
      : 'w';

  const legalMoves = getLegalMoves(board, currentTurn, rules);

  // Terminal conditions: no legal moves (loss for current turn) or depth reached
  if (legalMoves.length === 0) {
    return {
      bestMove: null,
      score: isMaximizing ? -10000 + (10 - depth) : 10000 - (10 - depth),
    };
  }

  if (depth === 0) {
    return {
      bestMove: null,
      score: evaluateBoard(board, aiColor),
    };
  }

  // Sort moves: prioritize moves with captures to improve alpha-beta pruning efficiency
  legalMoves.sort((a, b) => b.capturedSquares.length - a.capturedSquares.length);

  let bestMove: CheckersMove | null = legalMoves[0];

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const nextBoard = applyMove(board, move);
      const result = minimax(nextBoard, depth - 1, alpha, beta, false, aiColor, rules);

      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }

      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return { bestMove, score: maxEval };
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const nextBoard = applyMove(board, move);
      const result = minimax(nextBoard, depth - 1, alpha, beta, true, aiColor, rules);

      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }

      beta = Math.min(beta, result.score);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return { bestMove, score: minEval };
  }
}

export function getBestCheckersMove(
  board: BoardState,
  aiColor: PieceColor,
  difficulty: AIDifficulty,
  rules: RulesMode
): CheckersMove | null {
  const legalMoves = getLegalMoves(board, aiColor, rules);
  if (legalMoves.length === 0) return null;
  if (legalMoves.length === 1) return legalMoves[0];

  // Easy: occasional random choice
  if (difficulty === 'easy') {
    if (Math.random() < 0.4) {
      const randomIndex = Math.floor(Math.random() * legalMoves.length);
      return legalMoves[randomIndex];
    }
    const result = minimax(board, 1, -Infinity, Infinity, true, aiColor, rules);
    return result.bestMove || legalMoves[0];
  }

  // Medium: depth 3
  if (difficulty === 'medium') {
    const result = minimax(board, 3, -Infinity, Infinity, true, aiColor, rules);
    return result.bestMove || legalMoves[0];
  }

  // Hard: depth 5
  if (difficulty === 'hard') {
    const result = minimax(board, 5, -Infinity, Infinity, true, aiColor, rules);
    return result.bestMove || legalMoves[0];
  }

  // Master: depth 6
  const result = minimax(board, 6, -Infinity, Infinity, true, aiColor, rules);
  return result.bestMove || legalMoves[0];
}
