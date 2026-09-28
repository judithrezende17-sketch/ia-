export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameMode = 'classic' | 'timeAttack' | 'twoPlayer';

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  pairs: number;
  cols: number;
  rows: number;
  timeLimit?: number; // in seconds for time attack
  description: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    pairs: 6,
    cols: 4,
    rows: 3,
    timeLimit: 45,
    description: '12 cartas (6 pares) · Ideal para relaxar'
  },
  medium: {
    id: 'medium',
    label: 'Médio',
    pairs: 8,
    cols: 4,
    rows: 4,
    timeLimit: 60,
    description: '16 cartas (8 pares) · O desafio clássico'
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    pairs: 10,
    cols: 5,
    rows: 4,
    timeLimit: 75,
    description: '20 cartas (10 pares) · Teste sua concentração'
  },
  expert: {
    id: 'expert',
    label: 'Mestre',
    pairs: 12,
    cols: 6,
    rows: 4,
    timeLimit: 90,
    description: '24 cartas (12 pares) · Memória fotográfica'
  }
};

export type ThemeId = 'nature' | 'space' | 'magic' | 'food' | 'tech';

export interface ThemeCardItem {
  id: string;
  name: string;
  iconName: string;
  accentColor: string;
  bgColor: string;
}

export interface GameTheme {
  id: ThemeId;
  label: string;
  description: string;
  accentHex: string;
  cardBackPattern: string;
  items: ThemeCardItem[];
}

export const THEMES: Record<ThemeId, GameTheme> = {
  nature: {
    id: 'nature',
    label: 'Animais & Floresta',
    description: 'Criaturas fascinantes e elementos da natureza viva',
    accentHex: '#10b981',
    cardBackPattern: 'from-emerald-950 via-emerald-900 to-teal-950',
    items: [
      { id: 'cat', name: 'Gato Curioso', iconName: 'Cat', accentColor: 'text-amber-400', bgColor: 'bg-amber-500/10' },
      { id: 'dog', name: 'Cão Leal', iconName: 'Dog', accentColor: 'text-orange-400', bgColor: 'bg-orange-500/10' },
      { id: 'bird', name: 'Pássaro Cantante', iconName: 'Bird', accentColor: 'text-sky-400', bgColor: 'bg-sky-500/10' },
      { id: 'fish', name: 'Peixe Dourado', iconName: 'Fish', accentColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
      { id: 'rabbit', name: 'Coelho Saltitante', iconName: 'Rabbit', accentColor: 'text-rose-400', bgColor: 'bg-rose-500/10' },
      { id: 'squirrel', name: 'Esquilo Florestal', iconName: 'Squirrel', accentColor: 'text-amber-500', bgColor: 'bg-amber-600/10' },
      { id: 'snail', name: 'Caracol Místico', iconName: 'Snail', accentColor: 'text-lime-400', bgColor: 'bg-lime-500/10' },
      { id: 'bug', name: 'Joaninha Valente', iconName: 'Bug', accentColor: 'text-red-400', bgColor: 'bg-red-500/10' },
      { id: 'trees', name: 'Floresta Antiga', iconName: 'Trees', accentColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
      { id: 'feather', name: 'Pena Rara', iconName: 'Feather', accentColor: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
      { id: 'leaf', name: 'Folha Dourada', iconName: 'Leaf', accentColor: 'text-teal-400', bgColor: 'bg-teal-500/10' },
      { id: 'flame', name: 'Espírito do Fogo', iconName: 'Flame', accentColor: 'text-orange-500', bgColor: 'bg-orange-600/10' }
    ]
  },
  space: {
    id: 'space',
    label: 'Cosmos & Estrelas',
    description: 'Naves, constelações e segredos do universo infinito',
    accentHex: '#6366f1',
    cardBackPattern: 'from-indigo-950 via-slate-900 to-purple-950',
    items: [
      { id: 'rocket', name: 'Foguete Orbital', iconName: 'Rocket', accentColor: 'text-rose-400', bgColor: 'bg-rose-500/10' },
      { id: 'globe', name: 'Planeta Terra', iconName: 'Globe', accentColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
      { id: 'moon', name: 'Lua Prateada', iconName: 'Moon', accentColor: 'text-amber-200', bgColor: 'bg-amber-200/10' },
      { id: 'sun', name: 'Sol Ardente', iconName: 'Sun', accentColor: 'text-amber-400', bgColor: 'bg-amber-400/10' },
      { id: 'telescope', name: 'Telescópio Espacial', iconName: 'Telescope', accentColor: 'text-sky-300', bgColor: 'bg-sky-400/10' },
      { id: 'orbit', name: 'Órbita Gravitacional', iconName: 'Orbit', accentColor: 'text-violet-400', bgColor: 'bg-violet-400/10' },
      { id: 'satellite', name: 'Satélite Científico', iconName: 'Satellite', accentColor: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
      { id: 'sparkles', name: 'Nebulosa Cintilante', iconName: 'Sparkles', accentColor: 'text-fuchsia-300', bgColor: 'bg-fuchsia-400/10' },
      { id: 'zap', name: 'Raio Cósmico', iconName: 'Zap', accentColor: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
      { id: 'compass', name: 'Bússola Estelar', iconName: 'Compass', accentColor: 'text-teal-300', bgColor: 'bg-teal-400/10' },
      { id: 'shield', name: 'Escudo Protetor', iconName: 'Shield', accentColor: 'text-blue-400', bgColor: 'bg-blue-400/10' },
      { id: 'radio', name: 'Sinal Interstelar', iconName: 'Radio', accentColor: 'text-indigo-400', bgColor: 'bg-indigo-400/10' }
    ]
  },
  magic: {
    id: 'magic',
    label: 'Magia & Tesouros',
    description: 'Artefatos lendários, feitiços e relíquias misteriosas',
    accentHex: '#ec4899',
    cardBackPattern: 'from-pink-950 via-purple-950 to-slate-950',
    items: [
      { id: 'crown', name: 'Coroa Imperial', iconName: 'Crown', accentColor: 'text-amber-400', bgColor: 'bg-amber-400/10' },
      { id: 'gem', name: 'Cristal Rúnico', iconName: 'Gem', accentColor: 'text-pink-400', bgColor: 'bg-pink-400/10' },
      { id: 'sword', name: 'Espada Lendária', iconName: 'Sword', accentColor: 'text-slate-200', bgColor: 'bg-slate-300/10' },
      { id: 'shield', name: 'Escudo Guardião', iconName: 'Shield', accentColor: 'text-blue-400', bgColor: 'bg-blue-400/10' },
      { id: 'scroll', name: 'Pergaminho Antigo', iconName: 'Scroll', accentColor: 'text-orange-300', bgColor: 'bg-orange-300/10' },
      { id: 'key', name: 'Chave Secreta', iconName: 'Key', accentColor: 'text-yellow-300', bgColor: 'bg-yellow-300/10' },
      { id: 'sparkles', name: 'Pó de Estrelas', iconName: 'Sparkles', accentColor: 'text-purple-300', bgColor: 'bg-purple-300/10' },
      { id: 'flame', name: 'Chama Eterna', iconName: 'Flame', accentColor: 'text-red-400', bgColor: 'bg-red-400/10' },
      { id: 'anchor', name: 'Âncora Mágica', iconName: 'Anchor', accentColor: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
      { id: 'compass', name: 'Astrolábio', iconName: 'Compass', accentColor: 'text-emerald-300', bgColor: 'bg-emerald-300/10' },
      { id: 'feather', name: 'Pena de Fênix', iconName: 'Feather', accentColor: 'text-rose-400', bgColor: 'bg-rose-400/10' },
      { id: 'trees', name: 'Árvore da Vida', iconName: 'Trees', accentColor: 'text-emerald-400', bgColor: 'bg-emerald-400/10' }
    ]
  },
  food: {
    id: 'food',
    label: 'Gastronomia Gourmet',
    description: 'Sabores refinados, guloseimas e delícias culinárias',
    accentHex: '#f59e0b',
    cardBackPattern: 'from-amber-950 via-orange-950 to-stone-950',
    items: [
      { id: 'coffee', name: 'Café Espresso', iconName: 'Coffee', accentColor: 'text-amber-500', bgColor: 'bg-amber-600/10' },
      { id: 'pizza', name: 'Pizza Napolitana', iconName: 'Pizza', accentColor: 'text-rose-500', bgColor: 'bg-rose-600/10' },
      { id: 'apple', name: 'Maçã Vermelha', iconName: 'Apple', accentColor: 'text-red-400', bgColor: 'bg-red-500/10' },
      { id: 'icecream', name: 'Sorvete Artesanal', iconName: 'IceCream', accentColor: 'text-pink-300', bgColor: 'bg-pink-400/10' },
      { id: 'utensils', name: 'Menu do Chef', iconName: 'UtensilsCrossed', accentColor: 'text-slate-300', bgColor: 'bg-slate-400/10' },
      { id: 'cookie', name: 'Cookie Crocante', iconName: 'Cookie', accentColor: 'text-yellow-600', bgColor: 'bg-yellow-700/10' },
      { id: 'egg', name: 'Ovo de Ouro', iconName: 'Egg', accentColor: 'text-amber-200', bgColor: 'bg-amber-300/10' },
      { id: 'cake', name: 'Bolo de Festa', iconName: 'Cake', accentColor: 'text-rose-400', bgColor: 'bg-rose-500/10' },
      { id: 'carrot', name: 'Cenoura Orgânica', iconName: 'Carrot', accentColor: 'text-orange-400', bgColor: 'bg-orange-500/10' },
      { id: 'wine', name: 'Vinho Nobre', iconName: 'Wine', accentColor: 'text-purple-400', bgColor: 'bg-purple-500/10' },
      { id: 'flame', name: 'Grelha a Fogo', iconName: 'Flame', accentColor: 'text-orange-500', bgColor: 'bg-orange-600/10' },
      { id: 'sparkles', name: 'Tempero Secreto', iconName: 'Sparkles', accentColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10' }
    ]
  },
  tech: {
    id: 'tech',
    label: 'Tecnologia & Games',
    description: 'Dispositivos inteligentes, consoles e circuitos modernos',
    accentHex: '#06b6d4',
    cardBackPattern: 'from-cyan-950 via-slate-900 to-sky-950',
    items: [
      { id: 'laptop', name: 'Notebook Pro', iconName: 'Laptop', accentColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
      { id: 'smartphone', name: 'Smartphone 5G', iconName: 'Smartphone', accentColor: 'text-blue-400', bgColor: 'bg-blue-500/10' },
      { id: 'gamepad', name: 'Controle Gamer', iconName: 'Gamepad2', accentColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
      { id: 'headphones', name: 'Fone Hi-Fi', iconName: 'Headphones', accentColor: 'text-purple-400', bgColor: 'bg-purple-500/10' },
      { id: 'camera', name: 'Câmera Mirrorless', iconName: 'Camera', accentColor: 'text-amber-400', bgColor: 'bg-amber-500/10' },
      { id: 'watch', name: 'Smartwatch', iconName: 'Watch', accentColor: 'text-rose-400', bgColor: 'bg-rose-500/10' },
      { id: 'cpu', name: 'Processador Quântico', iconName: 'Cpu', accentColor: 'text-teal-400', bgColor: 'bg-teal-500/10' },
      { id: 'harddrive', name: 'SSD Veloz', iconName: 'HardDrive', accentColor: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
      { id: 'wifi', name: 'Conexão Fibra', iconName: 'Wifi', accentColor: 'text-sky-300', bgColor: 'bg-sky-400/10' },
      { id: 'tv', name: 'Monitor 4K', iconName: 'Tv', accentColor: 'text-slate-300', bgColor: 'bg-slate-400/10' },
      { id: 'zap', name: 'Turbo Boost', iconName: 'Zap', accentColor: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
      { id: 'radio', name: 'Transmissor RF', iconName: 'Radio', accentColor: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10' }
    ]
  }
};

export interface PlayingCard {
  uniqueId: string;
  itemId: string;
  name: string;
  iconName: string;
  accentColor: string;
  bgColor: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted?: boolean;
}

export interface PlayerStats {
  score: number;
  matches: number;
  consecutiveCombos: number;
}

export interface HighScoreRecord {
  date: string;
  mode: GameMode;
  difficulty: Difficulty;
  theme: ThemeId;
  moves: number;
  timeSeconds: number;
  stars: number;
  accuracy: number;
}
