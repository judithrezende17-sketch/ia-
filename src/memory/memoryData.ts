export type MemoryDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export type MemoryGameMode = 'classic' | 'timeAttack' | 'twoPlayer';

export type MemoryThemeId = 'chess' | 'animals' | 'cosmos' | 'food' | 'tech';

export interface ThemeItem {
  id: string;
  name: string;
  emoji: string;
  accentColor: string;
  bgColor: string;
}

export interface MemoryThemeConfig {
  id: MemoryThemeId;
  label: string;
  description: string;
  icon: string;
  cardBackGradient: string;
  items: ThemeItem[];
}

export const MEMORY_DIFFICULTIES: Record<
  MemoryDifficulty,
  { label: string; pairs: number; timeLimit?: number; gridCols: string }
> = {
  easy: {
    label: 'Fácil (12 cartas)',
    pairs: 6,
    timeLimit: 50,
    gridCols: 'grid-cols-3 sm:grid-cols-4 max-w-lg'
  },
  medium: {
    label: 'Médio (16 cartas)',
    pairs: 8,
    timeLimit: 70,
    gridCols: 'grid-cols-4 max-w-xl'
  },
  hard: {
    label: 'Difícil (20 cartas)',
    pairs: 10,
    timeLimit: 90,
    gridCols: 'grid-cols-4 sm:grid-cols-5 max-w-2xl'
  },
  master: {
    label: 'Mestre (24 cartas)',
    pairs: 12,
    timeLimit: 110,
    gridCols: 'grid-cols-4 sm:grid-cols-6 max-w-3xl'
  }
};

export const MEMORY_THEMES: Record<MemoryThemeId, MemoryThemeConfig> = {
  chess: {
    id: 'chess',
    label: 'Xadrez Real',
    description: 'Reis, damas, cavalos, torres e troféus dourados',
    icon: '♟️',
    cardBackGradient: 'from-amber-900 to-amber-950 border-amber-500/40',
    items: [
      { id: 'c-king', name: 'Rei Branco', emoji: '♔', accentColor: '#fbbf24', bgColor: '#451a03' },
      { id: 'c-queen', name: 'Dama Real', emoji: '♕', accentColor: '#f59e0b', bgColor: '#451a03' },
      { id: 'c-rook', name: 'Torre de Pedra', emoji: '♖', accentColor: '#e2e8f0', bgColor: '#1e293b' },
      { id: 'c-bishop', name: 'Bispo Sagrado', emoji: '♗', accentColor: '#93c5fd', bgColor: '#1e3a8a' },
      { id: 'c-knight', name: 'Cavalo Ágil', emoji: '♘', accentColor: '#34d399', bgColor: '#064e3b' },
      { id: 'c-pawn', name: 'Peão Valente', emoji: '♙', accentColor: '#cbd5e1', bgColor: '#334155' },
      { id: 'c-trophy', name: 'Troféu Ouro', emoji: '🏆', accentColor: '#facc15', bgColor: '#713f12' },
      { id: 'c-crown', name: 'Coroa Imperial', emoji: '👑', accentColor: '#fbbf24', bgColor: '#581c87' },
      { id: 'c-medal', name: 'Medalha de Honra', emoji: '🥇', accentColor: '#f59e0b', bgColor: '#78350f' },
      { id: 'c-clock', name: 'Relógio FIDE', emoji: '⏱️', accentColor: '#38bdf8', bgColor: '#0c4a6e' },
      { id: 'c-shield', name: 'Escudo Protetor', emoji: '🛡️', accentColor: '#a78bfa', bgColor: '#4c1d95' },
      { id: 'c-sword', name: 'Espada do Mestre', emoji: '⚔️', accentColor: '#f43f5e', bgColor: '#881337' }
    ]
  },
  animals: {
    id: 'animals',
    label: 'Animais Selvagens',
    description: 'Leões, raposas, pandas e criaturas da natureza',
    icon: '🦁',
    cardBackGradient: 'from-emerald-900 to-emerald-950 border-emerald-500/40',
    items: [
      { id: 'a-lion', name: 'Leão Majestoso', emoji: '🦁', accentColor: '#f59e0b', bgColor: '#78350f' },
      { id: 'a-fox', name: 'Raposa Astuta', emoji: '🦊', accentColor: '#ea580c', bgColor: '#7c2d12' },
      { id: 'a-panda', name: 'Panda Fofo', emoji: '🐼', accentColor: '#f8fafc', bgColor: '#1e293b' },
      { id: 'a-tiger', name: 'Tigre Valente', emoji: '🐯', accentColor: '#f97316', bgColor: '#7c2d12' },
      { id: 'a-koala', name: 'Coala Calmo', emoji: '🐨', accentColor: '#94a3b8', bgColor: '#334155' },
      { id: 'a-owl', name: 'Coruja Sábia', emoji: '🦉', accentColor: '#fbbf24', bgColor: '#451a03' },
      { id: 'a-frog', name: 'Sapo da Floresta', emoji: '🐸', accentColor: '#4ade80', bgColor: '#064e3b' },
      { id: 'a-monkey', name: 'Macaco Esperto', emoji: '🐵', accentColor: '#d97706', bgColor: '#78350f' },
      { id: 'a-rabbit', name: 'Coelho Veloz', emoji: '🐰', accentColor: '#f472b6', bgColor: '#831843' },
      { id: 'a-bear', name: 'Urso Pardo', emoji: '🐻', accentColor: '#b45309', bgColor: '#451a03' },
      { id: 'a-dolphin', name: 'Golfinho Azul', emoji: '🐬', accentColor: '#38bdf8', bgColor: '#075985' },
      { id: 'a-eagle', name: 'Águia Real', emoji: '🦅', accentColor: '#cbd5e1', bgColor: '#334155' }
    ]
  },
  cosmos: {
    id: 'cosmos',
    label: 'Cosmos & Galáxias',
    description: 'Foguetes, planetas, estrelas e nebulosas',
    icon: '🚀',
    cardBackGradient: 'from-indigo-900 to-indigo-950 border-indigo-500/40',
    items: [
      { id: 's-rocket', name: 'Foguete Orbital', emoji: '🚀', accentColor: '#f43f5e', bgColor: '#4c0519' },
      { id: 's-planet', name: 'Saturno dos Anéis', emoji: '🪐', accentColor: '#fbbf24', bgColor: '#78350f' },
      { id: 's-alien', name: 'Viajante Alien', emoji: '👽', accentColor: '#4ade80', bgColor: '#064e3b' },
      { id: 's-telescope', name: 'Telescópio Espacial', emoji: '🔭', accentColor: '#38bdf8', bgColor: '#0c4a6e' },
      { id: 's-star', name: 'Estrela Brilhante', emoji: '⭐', accentColor: '#facc15', bgColor: '#713f12' },
      { id: 's-moon', name: 'Lua Crescente', emoji: '🌙', accentColor: '#fef08a', bgColor: '#3b0764' },
      { id: 's-comet', name: 'Cometa Veloz', emoji: '☄️', accentColor: '#fb923c', bgColor: '#7c2d12' },
      { id: 's-satellite', name: 'Satélite Radar', emoji: '🛰️', accentColor: '#94a3b8', bgColor: '#1e293b' },
      { id: 's-sun', name: 'Sol Radiante', emoji: '☀️', accentColor: '#f59e0b', bgColor: '#78350f' },
      { id: 's-earth', name: 'Planeta Terra', emoji: '🌍', accentColor: '#60a5fa', bgColor: '#1e3a8a' },
      { id: 's-meteor', name: 'Meteoro Flamejante', emoji: '🔥', accentColor: '#ef4444', bgColor: '#7f1d1d' },
      { id: 's-galaxy', name: 'Nebulosa Mística', emoji: '🌌', accentColor: '#c084fc', bgColor: '#581c87' }
    ]
  },
  food: {
    id: 'food',
    label: 'Gastronomia',
    description: 'Pizzas, sushis, hambúrgueres e sobremesas',
    icon: '🍕',
    cardBackGradient: 'from-rose-900 to-rose-950 border-rose-500/40',
    items: [
      { id: 'f-pizza', name: 'Pizza Quentinha', emoji: '🍕', accentColor: '#ef4444', bgColor: '#7f1d1d' },
      { id: 'f-burger', name: 'Hambúrguer Gourmet', emoji: '🍔', accentColor: '#f59e0b', bgColor: '#78350f' },
      { id: 'f-sushi', name: 'Sushi de Salmão', emoji: '🍣', accentColor: '#f43f5e', bgColor: '#881337' },
      { id: 'f-taco', name: 'Taco Crocante', emoji: '🌮', accentColor: '#fbbf24', bgColor: '#713f12' },
      { id: 'f-donut', name: 'Donut Recheado', emoji: '🍩', accentColor: '#ec4899', bgColor: '#831843' },
      { id: 'f-icecream', name: 'Sorvete Cremoso', emoji: '🍦', accentColor: '#38bdf8', bgColor: '#0c4a6e' },
      { id: 'f-cookie', name: 'Cookie de Chocolate', emoji: '🍪', accentColor: '#d97706', bgColor: '#451a03' },
      { id: 'f-cake', name: 'Bolo de Festa', emoji: '🎂', accentColor: '#f472b6', bgColor: '#701a75' },
      { id: 'f-watermelon', name: 'Melancia Fresca', emoji: '🍉', accentColor: '#22c55e', bgColor: '#064e3b' },
      { id: 'f-strawberry', name: 'Morango Doce', emoji: '🍓', accentColor: '#f43f5e', bgColor: '#881337' },
      { id: 'f-croissant', name: 'Croissant Francês', emoji: '🥐', accentColor: '#eab308', bgColor: '#713f12' },
      { id: 'f-coffee', name: 'Café Expresso', emoji: '☕', accentColor: '#a16207', bgColor: '#451a03' }
    ]
  },
  tech: {
    id: 'tech',
    label: 'Gamer & Tech',
    description: 'Controles, fones, robôs e consoles',
    icon: '🎮',
    cardBackGradient: 'from-cyan-900 to-cyan-950 border-cyan-500/40',
    items: [
      { id: 't-gamepad', name: 'Controle Arcade', emoji: '🎮', accentColor: '#06b6d4', bgColor: '#164e63' },
      { id: 't-headset', name: 'Headset Pro', emoji: '🎧', accentColor: '#38bdf8', bgColor: '#0c4a6e' },
      { id: 't-joystick', name: 'Joystick Retro', emoji: '🕹️', accentColor: '#f43f5e', bgColor: '#881337' },
      { id: 't-robot', name: 'Robô Cibernético', emoji: '🤖', accentColor: '#a855f7', bgColor: '#581c87' },
      { id: 't-computer', name: 'PC Gamer', emoji: '💻', accentColor: '#3b82f6', bgColor: '#1e3a8a' },
      { id: 't-battery', name: 'Bateria Infinita', emoji: '🔋', accentColor: '#22c55e', bgColor: '#064e3b' },
      { id: 't-bulb', name: 'Ideia Brilhante', emoji: '💡', accentColor: '#facc15', bgColor: '#713f12' },
      { id: 't-chip', name: 'Microprocessador', emoji: '💾', accentColor: '#06b6d4', bgColor: '#083344' },
      { id: 't-dice', name: 'Dado da Sorte', emoji: '🎲', accentColor: '#ef4444', bgColor: '#7f1d1d' },
      { id: 't-vr', name: 'Óculos VR', emoji: '🥽', accentColor: '#8b5cf6', bgColor: '#4c1d95' },
      { id: 't-crystal', name: 'Cristal de Mana', emoji: '🔮', accentColor: '#ec4899', bgColor: '#701a75' },
      { id: 't-spark', name: 'Energia Elétrica', emoji: '⚡', accentColor: '#eab308', bgColor: '#713f12' }
    ]
  }
};

export interface MemoryPlayingCard {
  uniqueId: string;
  itemId: string;
  name: string;
  emoji: string;
  accentColor: string;
  bgColor: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted?: boolean;
}

export interface MemoryScoreRecord {
  date: string;
  mode: MemoryGameMode;
  difficulty: MemoryDifficulty;
  theme: MemoryThemeId;
  moves: number;
  timeSeconds: number;
  stars: number;
  accuracy: number;
}
