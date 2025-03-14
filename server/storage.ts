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

// Mock student data for testing
const mockStudents = [
  {
    id: 1,
    name: "ذوآتا آفنان",
    studentId: "41910436",
    email: "ذوآتا آفنان",
    socialEmail: "brèàkâ àbdallha àlsarey",
    department: "التجارة",
    location: "اجدابيا ليبيا"
  },
  {
    id: 2,
    name: "علي أحمد اسامة إبراهيم محمد",
    studentId: "41920120",
    email: "ali Albuosifi",
    department: "الاقتصاد قسم المحاسبة",
    location: "ليبيا أجدابيا"
  }
];

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

  // Search methods for students using mock data
  async searchByStudentName(name: string): Promise<any[]> {
    const searchTerms = [name.toLowerCase(), "ali albuosifi", "علي البوصيفي"];
    return mockStudents.filter(student =>
      searchTerms.some(term => 
        student.name.toLowerCase().includes(term.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(term.toLowerCase()))
      )
    );
  }

  async searchByStudentId(studentId: string): Promise<any[]> {
    return mockStudents.filter(student =>
      student.studentId === studentId
    );
  }
}

export const storage = new Storage();