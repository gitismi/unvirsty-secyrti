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

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  studentId: text("studentId").notNull(),
  email: text("email"),
  socialEmail: text("socialEmail"),
  department: text("department"),
  location: text("location")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  phone: true,
  email: true,
  name: true
});

export const insertStudentSchema = createInsertSchema(students);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;