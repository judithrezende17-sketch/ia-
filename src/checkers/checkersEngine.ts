import { BoardState, CheckersMove, Piece, PieceColor, PieceType, RulesMode, Square } from './checkersTypes';

export const BOARD_SIZE = 8;

export function squareToNotation(sq: Square): string {
  const colLetter = String.fromCharCode('a'.charCodeAt(0) + sq.col);
  const rowNumber = 8 - sq.row;
  return `${colLetter}${rowNumber}`;
}

export function isPlayableSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

export function createInitialBoard(): BoardState {
  const board: BoardState = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  let idCounter = 1;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isPlayableSquare(row, col)) {
        if (row < 3) {
          // Black pieces on top 3 rows
          board[row][col] = {
            id: `b_${idCounter++}`,
            color: 'b',
            type: 'man',
          };
        } else if (row > 4) {
          // White pieces on bottom 3 rows
          board[row][col] = {
            id: `w_${idCounter++}`,
            color: 'w',
            type: 'man',
          };
        }
      }
    }
  }

  return board;
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

export function isInside(r: number, c: number): boolean {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

const DIAGONALS: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

// Helper to check if a square is already in captured array
function isSquareInList(sq: Square, list: Square[]): boolean {
  return list.some(item => item.row === sq.row && item.col === sq.col);
}

// Generate all legal moves for a given player turn
export function getLegalMoves(
  board: BoardState,
  playerTurn: PieceColor,
  rules: RulesMode = 'brazilian'
): CheckersMove[] {
  const allCaptures: CheckersMove[] = [];
  const allSimpleMoves: CheckersMove[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === playerTurn) {
        const fromSq: Square = { row: r, col: c };

        // 1. Check captures starting from this piece
        const captures = findCaptureChains(board, fromSq, piece, rules);
        allCaptures.push(...captures);

        // 2. Simple moves (only relevant if no captures exist across the entire board)
        const simple = findSimpleMoves(board, fromSq, piece, rules);
        allSimpleMoves.push(...simple);
      }
    }
  }

  // If any captures exist, captures are strictly mandatory!
  if (allCaptures.length > 0) {
    if (rules === 'brazilian') {
      // Lei da Maioria: Only moves with the maximum number of captures are legal!
      const maxCaptures = Math.max(...allCaptures.map(m => m.capturedSquares.length));
      return allCaptures.filter(m => m.capturedSquares.length === maxCaptures);
    }
    return allCaptures;
  }

  return allSimpleMoves;
}

// Simple non-capturing moves
function findSimpleMoves(
  board: BoardState,
  from: Square,
  piece: Piece,
  rules: RulesMode
): CheckersMove[] {
  const moves: CheckersMove[] = [];

  if (piece.type === 'king' && rules === 'brazilian') {
    // Flying King in Brazilian rules: moves any number of empty squares in 4 diagonal directions
    for (const [dr, dc] of DIAGONALS) {
      let step = 1;
      while (true) {
        const nr = from.row + dr * step;
        const nc = from.col + dc * step;
        if (!isInside(nr, nc)) break;
        if (board[nr][nc] !== null) break;

        const toSq: Square = { row: nr, col: nc };
        moves.push({
          from,
          to: toSq,
          path: [from, toSq],
          capturedSquares: [],
          capturedPieces: [],
          becomesKing: false,
          notation: `${squareToNotation(from)}-${squareToNotation(toSq)}`,
        });
        step++;
      }
    }
    return moves;
  }

  // Classic King or Regular Man
  const forwardDir = piece.color === 'w' ? -1 : 1;
  const directions: [number, number][] =
    piece.type === 'king'
      ? DIAGONALS
      : [
          [forwardDir, -1],
          [forwardDir, 1],
        ];

  for (const [dr, dc] of directions) {
    const nr = from.row + dr;
    const nc = from.col + dc;

    if (isInside(nr, nc) && board[nr][nc] === null) {
      const toSq: Square = { row: nr, col: nc };
      const becomesKing =
        piece.type === 'man' &&
        ((piece.color === 'w' && nr === 0) || (piece.color === 'b' && nr === BOARD_SIZE - 1));

      moves.push({
        from,
        to: toSq,
        path: [from, toSq],
        capturedSquares: [],
        capturedPieces: [],
        becomesKing,
        notation: `${squareToNotation(from)}-${squareToNotation(toSq)}`,
      });
    }
  }

  return moves;
}

// Find all multi-capture chains (DFS)
function findCaptureChains(
  board: BoardState,
  from: Square,
  piece: Piece,
  rules: RulesMode
): CheckersMove[] {
  const results: CheckersMove[] = [];

  function dfs(
    currentPos: Square,
    currentPiece: Piece,
    capturedSqList: Square[],
    capturedPieceList: Piece[],
    path: Square[],
    currentBoard: BoardState
  ) {
    const singleJumps = findSingleJumps(currentBoard, currentPos, currentPiece, capturedSqList, rules);

    if (singleJumps.length === 0) {
      if (capturedSqList.length > 0) {
        // Complete capture chain
        const finalPos = path[path.length - 1];
        const notation = path.map(squareToNotation).join('x');
        const becomesKing =
          currentPiece.type === 'king' && piece.type === 'man';

        results.push({
          from,
          to: finalPos,
          path,
          capturedSquares: [...capturedSqList],
          capturedPieces: [...capturedPieceList],
          becomesKing,
          notation,
        });
      }
      return;
    }

    for (const jump of singleJumps) {
      // Simulate jump on board
      const nextBoard = cloneBoard(currentBoard);
      nextBoard[currentPos.row][currentPos.col] = null;
      // Note: In official draughts, captured piece is removed during or at the end of the move
      // To prevent jumping the same piece twice, we mark it captured
      nextBoard[jump.capturedSq.row][jump.capturedSq.col] = null;

      let nextPieceType = currentPiece.type;
      if (
        nextPieceType === 'man' &&
        ((currentPiece.color === 'w' && jump.to.row === 0) ||
          (currentPiece.color === 'b' && jump.to.row === BOARD_SIZE - 1))
      ) {
        nextPieceType = 'king';
      }

      const nextPiece: Piece = {
        ...currentPiece,
        type: nextPieceType,
      };

      nextBoard[jump.to.row][jump.to.col] = nextPiece;

      dfs(
        jump.to,
        nextPiece,
        [...capturedSqList, jump.capturedSq],
        [...capturedPieceList, jump.capturedPiece],
        [...path, jump.to],
        nextBoard
      );
    }
  }

  dfs(from, piece, [], [], [from], board);

  return results;
}

interface SingleJump {
  to: Square;
  capturedSq: Square;
  capturedPiece: Piece;
}

function findSingleJumps(
  board: BoardState,
  pos: Square,
  piece: Piece,
  alreadyCaptured: Square[],
  rules: RulesMode
): SingleJump[] {
  const jumps: SingleJump[] = [];

  if (piece.type === 'king' && rules === 'brazilian') {
    // Flying king capture: can jump along diagonal over enemy piece at any distance
    for (const [dr, dc] of DIAGONALS) {
      let step = 1;
      let foundEnemy: { sq: Square; piece: Piece } | null = null;

      while (true) {
        const nr = pos.row + dr * step;
        const nc = pos.col + dc * step;
        if (!isInside(nr, nc)) break;

        const cell = board[nr][nc];
        if (cell === null) {
          if (foundEnemy) {
            // Can land on any empty square after the enemy piece!
            jumps.push({
              to: { row: nr, col: nc },
              capturedSq: foundEnemy.sq,
              capturedPiece: foundEnemy.piece,
            });
          }
        } else if (cell.color === piece.color) {
          // Blocked by own piece
          break;
        } else {
          // Enemy piece
          if (foundEnemy) {
            // Cannot jump over two enemy pieces in a line
            break;
          }
          if (isSquareInList({ row: nr, col: nc }, alreadyCaptured)) {
            // Cannot capture the same piece twice
            break;
          }
          foundEnemy = { sq: { row: nr, col: nc }, piece: cell };
        }
        step++;
      }
    }
    return jumps;
  }

  // Regular Man (or Classic King)
  const forwardDir = piece.color === 'w' ? -1 : 1;
  const directions: [number, number][] =
    piece.type === 'king' || rules === 'brazilian'
      ? DIAGONALS // In Brazilian rules, regular men can capture backwards!
      : [
          [forwardDir, -1],
          [forwardDir, 1],
        ];

  for (const [dr, dc] of directions) {
    const enemyR = pos.row + dr;
    const enemyC = pos.col + dc;
    const landingR = pos.row + dr * 2;
    const landingC = pos.col + dc * 2;

    if (isInside(landingR, landingC) && isInside(enemyR, enemyC)) {
      const enemyCell = board[enemyR][enemyC];
      const landingCell = board[landingR][landingC];

      if (
        enemyCell !== null &&
        enemyCell.color !== piece.color &&
        landingCell === null &&
        !isSquareInList({ row: enemyR, col: enemyC }, alreadyCaptured)
      ) {
        jumps.push({
          to: { row: landingR, col: landingC },
          capturedSq: { row: enemyR, col: enemyC },
          capturedPiece: enemyCell,
        });
      }
    }
  }

  return jumps;
}

// Apply a move to a board and return the updated board
export function applyMove(board: BoardState, move: CheckersMove): BoardState {
  const newBoard = cloneBoard(board);
  const movingPiece = newBoard[move.from.row][move.from.col];

  if (!movingPiece) return newBoard;

  // Remove piece from start
  newBoard[move.from.row][move.from.col] = null;

  // Remove all captured pieces
  for (const cap of move.capturedSquares) {
    newBoard[cap.row][cap.col] = null;
  }

  // Determine if promoted to king
  const willBeKing =
    movingPiece.type === 'king' ||
    move.becomesKing ||
    (movingPiece.color === 'w' && move.to.row === 0) ||
    (movingPiece.color === 'b' && move.to.row === BOARD_SIZE - 1);

  newBoard[move.to.row][move.to.col] = {
    ...movingPiece,
    type: willBeKing ? 'king' : 'man',
  };

  return newBoard;
}

// Count remaining pieces and kings
export function getBoardStats(board: BoardState) {
  let whiteMen = 0;
  let whiteKings = 0;
  let blackMen = 0;
  let blackKings = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === 'w') {
          if (piece.type === 'king') whiteKings++;
          else whiteMen++;
        } else {
          if (piece.type === 'king') blackKings++;
          else blackMen++;
        }
      }
    }
  }

  return {
    whiteTotal: whiteMen + whiteKings,
    whiteMen,
    whiteKings,
    blackTotal: blackMen + blackKings,
    blackMen,
    blackKings,
  };
}
