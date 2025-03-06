import session from "express-session";
import createMemoryStore from "memorystore";
import { User, InsertUser } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByIdentifier(identifier: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number, timestamp: string): Promise<void>;
  getUserLoginHistory(userId: number): Promise<Array<{userId:number, timestamp:string, ipAddress:string}>>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private loginLogs: Array<{userId:number, timestamp:string, ipAddress:string}>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.loginLogs = [];
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByIdentifier(identifier: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => 
        user.username === identifier ||
        user.email === identifier ||
        user.phone === identifier ||
        user.name === identifier
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, lastLogin: null };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: number, timestamp: string): Promise<void> {
    const user = await this.getUser(id);
    if (user) {
      user.lastLogin = timestamp;
      this.users.set(id, user);
      this.loginLogs.push({userId: id, timestamp: timestamp, ipAddress: "غير متاح"});
    }
  }

  async getUserLoginHistory(userId: number): Promise<Array<{userId:number, timestamp:string, ipAddress:string}>> {
    return this.loginLogs.filter(log => log.userId === userId);
  }
}

export const storage = new MemStorage();