import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game store enum
export const GameStoreEnum = z.enum(["steam", "epic"]);
export type GameStore = z.infer<typeof GameStoreEnum>;

// Game schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  originalPrice: text("original_price").notNull(),
  store: text("store").notNull(), // "steam" or "epic"
  storeUrl: text("store_url").notNull(),
  endTime: timestamp("end_time").notNull(),
  isHot: boolean("is_hot").default(false),
  categories: text("categories").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Create a game history to avoid duplicates
export const gameHistory = pgTable("game_history", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  store: text("store").notNull(),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
});

export const insertGameHistorySchema = createInsertSchema(gameHistory).omit({
  id: true,
});

export type InsertGameHistory = z.infer<typeof insertGameHistorySchema>;
export type GameHistory = typeof gameHistory.$inferSelect;

// Stats schema for tracking hunt statistics
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalGamesHunted: integer("total_games_hunted").default(0).notNull(),
  totalValueSaved: integer("total_value_saved").default(0).notNull(),
  aaaGamesHunted: integer("aaa_games_hunted").default(0).notNull(),
  averageAlertTimeMinutes: integer("average_alert_time_minutes").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
});

export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;
