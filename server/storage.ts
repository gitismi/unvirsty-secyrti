import { eq, sql, or, ilike } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, students } from "@shared/schema";
import { InsertUser, User } from "@shared/schema";
import session from "express-session";
import PgSession from "connect-pg-simple";

const client = postgres(
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432",
);
const db = drizzle(client);

class Storage {
  sessionStore: PgSession.PGStore;

  constructor() {
    const pgSession = PgSession(session);
    this.sessionStore = new pgSession({
      conObject: {
        connectionString:
          process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432",
      },
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByIdentifier(identifier: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, identifier));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning({ id: users.id, username: users.username, email: users.email, phone: users.phone, name: users.name });
    return user as User;
  }

  async updateUserLastLogin(id: number, lastLogin: string): Promise<void> {
    await db.update(users).set({ lastLogin }).where(eq(users.id, id));
  }

  // Search methods for students using actual database queries
  async searchByStudentName(name: string): Promise<any[]> {
    const results = await db
      .select()
      .from(students)
      .where(ilike(students.name, `%${name}%`));
    return results;
  }

  async searchByStudentId(studentId: string): Promise<any[]> {
    const results = await db
      .select()
      .from(students)
      .where(eq(students.studentId, studentId));
    return results;
  }
}

export const storage = new Storage();