export interface Location {
  name: string;
}

export interface Category {
  name: string;
  locations: Location[];
}

export interface GameSettings {
  numberOfPlayers: number;
  numberOfSpies: number;
  timer: number; // in minutes
  category: Category;
}

export interface Player {
  id: number;
  role: string;
  location: string;
  isSpy: boolean;
}

export interface GameState {
  settings: GameSettings;
  players: Player[];
  isGameStarted: boolean;
  currentTime: number;
} 