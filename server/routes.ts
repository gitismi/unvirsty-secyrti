
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import geoip from "geoip-lite";

// Add your routes here
export async function registerRoutes(app: express.Express): Promise<Server> {
  // إضافة middleware لضمان تعيين نوع المحتوى بشكل صحيح لجميع طلبات API
  app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  app.get("/api/location", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(String(ip).split(",")[0].trim());
    res.json({ ip, location: geo });
  });

  // إضافة نقطة نهاية لسجل الدخول
  app.get("/api/login-history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const loginHistory = await storage.getUserLoginHistory(req.user!.id);
      res.json(loginHistory);
    } catch (error) {
      console.error("خطأ في استرداد سجل الدخول:", error);
      res.status(500).json({ error: "حدث خطأ أثناء استرداد سجل الدخول" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
