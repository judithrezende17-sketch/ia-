export type GameMode = 'vsAi' | 'passAndPlay';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export type PlayerColor = 'w' | 'b';

export type TimeControlId = 'blitz3' | 'rapid10' | 'classical15' | 'unlimited';

export interface TimeControlConfig {
  id: TimeControlId;
  label: string;
  seconds: number;
  increment: number;
}

export const TIME_CONTROLS: Record<TimeControlId, TimeControlConfig> = {
  blitz3: { id: 'blitz3', label: 'Blitz 3m', seconds: 180, increment: 2 },
  rapid10: { id: 'rapid10', label: 'Rápido 10m', seconds: 600, increment: 0 },
  classical15: { id: 'classical15', label: 'Clássico 15m', seconds: 900, increment: 10 },
  unlimited: { id: 'unlimited', label: 'Sem Tempo', seconds: 0, increment: 0 }
};

export interface BoardTheme {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  highlightSelected: string;
  highlightMove: string;
  highlightLastMove: string;
  highlightCheck: string;
  borderColor: string;
  accentColor: string;
}

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'emerald',
    name: 'Torneio Verde',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
    highlightSelected: 'rgba(247, 247, 105, 0.65)',
    highlightMove: 'rgba(20, 85, 30, 0.45)',
    highlightLastMove: 'rgba(247, 247, 105, 0.45)',
    highlightCheck: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.4) 65%, transparent 85%)',
    borderColor: '#4e6a35',
    accentColor: '#10b981'
  },
  {
    id: 'walnut',
    name: 'Madeira Nobre',
    lightSquare: '#ebd0a2',
    darkSquare: '#9c663e',
    highlightSelected: 'rgba(251, 191, 36, 0.65)',
    highlightMove: 'rgba(120, 53, 15, 0.45)',
    highlightLastMove: 'rgba(251, 191, 36, 0.45)',
    highlightCheck: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.4) 65%, transparent 85%)',
    borderColor: '#6b3f1f',
    accentColor: '#f59e0b'
  },
  {
    id: 'slate',
    name: 'Obsidiana & Prata',
    lightSquare: '#e2e8f0',
    darkSquare: '#64748b',
    highlightSelected: 'rgba(56, 189, 248, 0.65)',
    highlightMove: 'rgba(15, 23, 42, 0.45)',
    highlightLastMove: 'rgba(56, 189, 248, 0.45)',
    highlightCheck: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.4) 65%, transparent 85%)',
    borderColor: '#334155',
    accentColor: '#38bdf8'
  },
  {
    id: 'crimson',
    name: 'Rubi & Marfim',
    lightSquare: '#f3e8ee',
    darkSquare: '#9f1239',
    highlightSelected: 'rgba(244, 63, 94, 0.65)',
    highlightMove: 'rgba(76, 5, 25, 0.45)',
    highlightLastMove: 'rgba(251, 113, 133, 0.45)',
    highlightCheck: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.9) 0%, rgba(244, 63, 94, 0.5) 65%, transparent 85%)',
    borderColor: '#700926',
    accentColor: '#f43f5e'
  },
  {
    id: 'midnight',
    name: 'Azul Meia-Noite',
    lightSquare: '#dbeafe',
    darkSquare: '#1e3a8a',
    highlightSelected: 'rgba(147, 197, 253, 0.65)',
    highlightMove: 'rgba(30, 58, 138, 0.5)',
    highlightLastMove: 'rgba(96, 165, 250, 0.45)',
    highlightCheck: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.4) 65%, transparent 85%)',
    borderColor: '#172554',
    accentColor: '#3b82f6'
  }
];

export interface MoveRecord {
  san: string;
  from: string;
  to: string;
  color: 'w' | 'b';
  piece: string;
  captured?: string;
  promotion?: string;
  fen: string;
}

export interface CapturedPieces {
  w: string[]; // Pieces captured by White (black pieces)
  b: string[]; // Pieces captured by Black (white pieces)
}

export type GameOverReason =
  | 'checkmate'
  | 'stalemate'
  | 'insufficient_material'
  | 'threefold_repetition'
  | 'fifty_moves'
  | 'timeout'
  | 'resignation';
