
import express from "express";
import { createServer, type Server } from "http";

// Add your routes here
export async function registerRoutes(app: express.Express): Promise<Server> {
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
