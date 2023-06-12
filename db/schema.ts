import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { sql } from "./db.ts";

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
export type User = z.infer<typeof userSchema>;

sql`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
  )`;

export const followerSchema = z.object({
  id: z.string(),
  followerId: z.string(),
  followingId: z.string(),
});
export type Follower = z.infer<typeof followerSchema>;

sql`CREATE TABLE IF NOT EXISTS followers (
    id TEXT PRIMARY KEY,
    followerId TEXT NOT NULL REFERENCES users(id),
    followingId TEXT NOT NULL REFERENCES users(id),
)`;

export const whisperSchema = z.object({
  id: z.string(),
  userId: z.string(),
  text: z.string(),
  parentWhisperId: z.string().optional(),
});
export type Whisper = z.infer<typeof whisperSchema>;

sql`CREATE TABLE IF NOT EXISTS whispers (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    parentWhisperId TEXT REFERENCES whispers(id),
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

export const likeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  whisperId: z.string(),
});
export type Like = z.infer<typeof likeSchema>;

sql`CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(id),
    whisperId TEXT NOT NULL REFERENCES whispers(id),
)`;

export const bookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  whisperId: z.string(),
});
export type Bookmark = z.infer<typeof bookmarkSchema>;

sql`CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(id),
    whisperId TEXT NOT NULL REFERENCES whispers(id),
)`;
