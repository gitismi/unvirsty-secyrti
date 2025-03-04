import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: any) {
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.join(__dirname, "../client"),
  });

  app.use(vite.middlewares);

  app.get("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;

      let template = fs.readFileSync(
        path.join(__dirname, "../client/index.html"),
        "utf-8"
      );

      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const publicDir = path.join(__dirname, "../public");

  app.use(express.static(publicDir));

  app.get("*", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}