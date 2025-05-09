import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // API endpoint for searching by phone or name
  app.get("/api/search/phoneOrName", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const query = req.query.query as string;
    if (!query) {
      return res.status(400).json({ error: "يجب توفير استعلام البحث" });
    }
    
    try {
      // Here you would implement the actual search logic
      // This is a mock implementation
      const results = await storage.searchByPhoneOrName(query);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء البحث" });
    }
  });

  // API endpoint for searching by social media email
  app.get("/api/search/email", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const query = req.query.query as string;
    if (!query) {
      return res.status(400).json({ error: "يجب توفير استعلام البحث" });
    }
    
    try {
      // Here you would implement the actual search logic
      // This is a mock implementation
      const results = await storage.searchByEmail(query);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء البحث" });
    }
  });

  // API endpoint for searching student by name
  app.get("/api/student/searchByName", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const name = req.query.name as string;
    if (!name) {
      return res.status(400).json({ error: "يجب توفير اسم الطالب" });
    }

    try {
      const results = await storage.searchByStudentName(name);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء البحث" });
    }
  });

  // API endpoint for searching student by ID
  app.get("/api/student/searchById", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const studentId = req.query.studentId as string;
    if (!studentId) {
      return res.status(400).json({ error: "يجب توفير الرقم الدراسي" });
    }

    try {
      const results = await storage.searchByStudentId(studentId);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء البحث" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}