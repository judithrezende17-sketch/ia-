export type PieceColor = 'w' | 'b'; // w = Brancas (Claras), b = Pretas (Escuras)
export type PieceType = 'man' | 'king'; // man = Peça Comum, king = Dama

export interface Square {
  row: number; // 0 to 7
  col: number; // 0 to 7
}

export interface Piece {
  id: string;
  color: PieceColor;
  type: PieceType;
}

export type BoardState = (Piece | null)[][];

export interface CaptureStep {
  from: Square;
  to: Square;
  capturedSquare: Square;
  capturedPiece: Piece;
}

export interface CheckersMove {
  from: Square;
  to: Square;
  path: Square[];
  capturedSquares: Square[];
  capturedPieces: Piece[];
  becomesKing: boolean;
  notation: string;
}

export type RulesMode = 'brazilian' | 'classic';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export type GameMode = 'vsAi' | 'pvp';

export type TimeControlId = 'none' | 'bullet1' | 'blitz3' | 'blitz5' | 'rapid10';

export interface TimeControl {
  id: TimeControlId;
  label: string;
  seconds: number;
}

export const TIME_CONTROLS: TimeControl[] = [
  { id: 'none', label: 'Sem Tempo', seconds: 0 },
  { id: 'bullet1', label: '1 min (Bullet)', seconds: 60 },
  { id: 'blitz3', label: '3 min (Blitz)', seconds: 180 },
  { id: 'blitz5', label: '5 min (Blitz)', seconds: 300 },
  { id: 'rapid10', label: '10 min (Rápido)', seconds: 600 },
];

export interface CheckersTheme {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  border: string;
  whitePiece: {
    bg: string;
    border: string;
    innerRing: string;
    crown: string;
  };
  blackPiece: {
    bg: string;
    border: string;
    innerRing: string;
    crown: string;
  };
}

export const CHECKERS_THEMES: CheckersTheme[] = [
  {
    id: 'luxury-wood',
    name: 'Madeira Nobre',
    lightSquare: 'bg-[#ebd3a8]',
    darkSquare: 'bg-[#8d532a]',
    border: 'border-[#593416]',
    whitePiece: {
      bg: 'bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200',
      border: 'border-amber-300/80 shadow-amber-950/40',
      innerRing: 'border-amber-300/60',
      crown: 'text-amber-700',
    },
    blackPiece: {
      bg: 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black',
      border: 'border-neutral-700/80 shadow-black/80',
      innerRing: 'border-neutral-700/60',
      crown: 'text-amber-400',
    },
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidiana Dark',
    lightSquare: 'bg-zinc-700',
    darkSquare: 'bg-zinc-900',
    border: 'border-zinc-800',
    whitePiece: {
      bg: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300',
      border: 'border-slate-300 shadow-slate-950/50',
      innerRing: 'border-slate-400/50',
      crown: 'text-slate-700',
    },
    blackPiece: {
      bg: 'bg-gradient-to-br from-red-950 via-neutral-950 to-black',
      border: 'border-red-900/60 shadow-black',
      innerRing: 'border-red-900/40',
      crown: 'text-red-400',
    },
  },
  {
    id: 'emerald-green',
    name: 'Esmeralda FIDE',
    lightSquare: 'bg-[#ffffdd]',
    darkSquare: 'bg-[#5b8c5a]',
    border: 'border-[#395c38]',
    whitePiece: {
      bg: 'bg-gradient-to-br from-emerald-50 via-amber-50 to-amber-100',
      border: 'border-emerald-200 shadow-emerald-950/40',
      innerRing: 'border-emerald-300/60',
      crown: 'text-emerald-700',
    },
    blackPiece: {
      bg: 'bg-gradient-to-br from-emerald-950 via-zinc-900 to-black',
      border: 'border-emerald-800/80 shadow-black',
      innerRing: 'border-emerald-800/50',
      crown: 'text-emerald-400',
    },
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    lightSquare: 'bg-slate-800',
    darkSquare: 'bg-cyan-950',
    border: 'border-cyan-800',
    whitePiece: {
      bg: 'bg-gradient-to-br from-cyan-200 via-cyan-100 to-sky-200',
      border: 'border-cyan-400 shadow-cyan-500/30',
      innerRing: 'border-cyan-400/70',
      crown: 'text-cyan-800',
    },
    blackPiece: {
      bg: 'bg-gradient-to-br from-fuchsia-950 via-purple-950 to-neutral-950',
      border: 'border-fuchsia-700 shadow-fuchsia-950/80',
      innerRing: 'border-fuchsia-700/60',
      crown: 'text-fuchsia-400',
    },
  },
];

export interface CheckersMoveRecord {
  id: string;
  moveNumber: number;
  white?: string;
  black?: string;
  whiteCaptures?: number;
  blackCaptures?: number;
}
