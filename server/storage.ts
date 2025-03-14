import { InsertUser, User } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Mock student data for testing
const mockStudents = [
  {
    id: 1,
    name: "علي أحمد اسامة إبراهيم محمد",
    studentId: "41920120",
    email: "ali Albuosifi",
    department: "الاقتصاد قسم المحاسبة",
    location: "ليبيا أجدابيا"
  },
  {
    id: 2,
    name: "ذوآتا آفنان",
    studentId: "41910436",
    email: "ذوآتا آفنان",
    socialEmail: "brèàkâ àbdallha àlsarey",
    department: "التجارة",
    location: "اجدابيا ليبيا"
  }
];

let users: User[] = [];
let nextId = 1;

class Storage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return users.find(u => u.id === id);
  }

  async getUserByIdentifier(identifier: string): Promise<User | undefined> {
    return users.find(u => u.username === identifier);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user = {
      id: nextId++,
      ...userData,
      lastLogin: new Date().toISOString()
    };
    users.push(user as User);
    return user as User;
  }

  async updateUserLastLogin(id: number, lastLogin: string): Promise<void> {
    const user = users.find(u => u.id === id);
    if (user) {
      user.lastLogin = lastLogin;
    }
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