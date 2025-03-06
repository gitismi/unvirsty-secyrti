import express from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import morgan from "morgan";

async function main() {
  // HTTP server
  const app = express();

  // Basic error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("tiny"));
  }

  // API routes
  const server = await registerRoutes(app);

  // Frontend
  await setupVite(app, server);

  // Fallback for unhandled routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  server.listen(5000, "0.0.0.0", () => {
    const date = new Date();
    const formattedTime = date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(" ", "");

    console.log(`${formattedTime} [express] serving on port 5000`);
  });
}

main().catch(err => {
  console.error("Application startup failed:", err);
  process.exit(1);
});