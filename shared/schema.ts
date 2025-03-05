import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  email: text("email"),
  name: text("name"),
  lastLogin: text("lastlogin")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  phone: true,
  email: true,
  name: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
