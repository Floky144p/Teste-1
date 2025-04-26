import { 
  games, type Game, type InsertGame, 
  gameHistory, type GameHistory, type InsertGameHistory,
  stats, type Stats, type InsertStats,
  users, type User, type InsertUser 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  getGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  getGamesByStore(store: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
  
  // Game history operations
  getGameHistory(title: string, store: string): Promise<GameHistory | undefined>;
  createGameHistory(history: InsertGameHistory): Promise<GameHistory>;
  
  // Stats operations
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: Partial<InsertStats>): Promise<Stats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private gameHistories: Map<string, GameHistory>;
  private siteStats: Stats | undefined;
  
  private userId: number;
  private gameId: number;
  private historyId: number;
  
  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.gameHistories = new Map();
    
    this.userId = 1;
    this.gameId = 1;
    this.historyId = 1;
    
    // Initialize with sample stats
    this.siteStats = {
      id: 1,
      totalGamesHunted: 237,
      totalValueSaved: 12490,
      aaaGamesHunted: 22,
      averageAlertTimeMinutes: 24,
      lastUpdated: new Date()
    };
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game methods
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort((a, b) => {
      // Sort by end time (ascending)
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    });
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getGamesByStore(store: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.store === store
    );
  }
  
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const now = new Date();
    const game: Game = { 
      ...insertGame, 
      id, 
      createdAt: now
    };
    this.games.set(id, game);
    return game;
  }
  
  async updateGame(id: number, updateData: Partial<InsertGame>): Promise<Game | undefined> {
    const existingGame = this.games.get(id);
    if (!existingGame) return undefined;
    
    const updatedGame: Game = { ...existingGame, ...updateData };
    this.games.set(id, updatedGame);
    return updatedGame;
  }
  
  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
  
  // Game history methods
  async getGameHistory(title: string, store: string): Promise<GameHistory | undefined> {
    const key = `${title}-${store}`;
    return this.gameHistories.get(key);
  }
  
  async createGameHistory(insertHistory: InsertGameHistory): Promise<GameHistory> {
    const id = this.historyId++;
    const history: GameHistory = { ...insertHistory, id };
    const key = `${history.title}-${history.store}`;
    this.gameHistories.set(key, history);
    return history;
  }
  
  // Stats methods
  async getStats(): Promise<Stats | undefined> {
    return this.siteStats;
  }
  
  async updateStats(updateData: Partial<InsertStats>): Promise<Stats | undefined> {
    if (!this.siteStats) return undefined;
    
    this.siteStats = { 
      ...this.siteStats, 
      ...updateData, 
      lastUpdated: new Date() 
    };
    return this.siteStats;
  }
}

export const storage = new MemStorage();
