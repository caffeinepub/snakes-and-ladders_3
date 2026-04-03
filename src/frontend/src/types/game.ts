export type PlayerColor = "red" | "blue" | "green" | "yellow";

export interface Player {
  id: number;
  name: string;
  color: PlayerColor;
  position: number; // 0 = not started, 1-100 = on board
}

export interface MoveLogEntry {
  playerName: string;
  playerColor: PlayerColor;
  diceValue: number;
  fromSquare: number;
  toSquare: number;
  event: "normal" | "snake" | "ladder" | "win";
  timestamp: number;
}

export type GamePhase = "setup" | "playing" | "won";

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isAnimating: boolean;
  winner: Player | null;
  moveLog: MoveLogEntry[];
}

export const PLAYER_COLORS: Record<PlayerColor, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
};

export const PLAYER_COLORS_DARK: Record<PlayerColor, string> = {
  red: "#991b1b",
  blue: "#1d4ed8",
  green: "#15803d",
  yellow: "#92400e",
};

export const PLAYER_COLOR_NAMES: Record<PlayerColor, string> = {
  red: "Crimson",
  blue: "Sapphire",
  green: "Emerald",
  yellow: "Topaz",
};

export const COLORS_ORDER: PlayerColor[] = ["red", "blue", "green", "yellow"];

// Snakes: head → tail (player moves DOWN)
export const SNAKES: Record<number, number> = {
  99: 54,
  70: 55,
  52: 42,
  25: 2,
  43: 18,
  61: 19,
  64: 60,
  87: 24,
  93: 68,
  95: 72,
};

// Ladders: bottom → top (player moves UP)
export const LADDERS: Record<number, number> = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91,
};
