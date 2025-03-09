import { eq, sql, or, ilike } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "@shared/schema";
import { InsertUser, User } from "@shared/schema";
import session from "express-session";
import PgSession from "connect-pg-simple";

const client = postgres(
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432",
);
const db = drizzle(client);

// Mock student data for demonstration
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
    name: "أحمد محمد",
    studentId: "12345678",
    email: "ahmed@example.com",
    socialEmail: "ahmed@gmail.com",
    department: "علوم الحاسب",
    level: "الرابع"
  },
  {
    id: 3,
    name: "محمد علي",
    studentId: "90123456",
    phone: "0509876543",
    email: "mohammed@example.com",
    socialEmail: "mohammed@outlook.com",
    department: "هندسة البرمجيات",
    level: "الثالث"
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

  // Search methods for students
  async searchByStudentName(name: string): Promise<any[]> {
    return mockStudents.filter(student =>
      student.name.includes(name)
    );
  }

  async searchByStudentId(studentId: string): Promise<any[]> {
    return mockStudents.filter(student =>
      student.studentId === studentId
    );
  }
}

export const storage = new Storage();