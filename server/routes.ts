import express from "express";
import { Server } from "http";

// Add your routes here
export async function registerRoutes(app: express.Express): Promise<Server> {
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok" });
  });

  return new Server(app);
}