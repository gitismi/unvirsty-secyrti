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

function formatUserDetails(user: SelectUser, action: string): string {
  const now = new Date().toLocaleString('ar-SA');
  return `🔐 نشاط مستخدم جديد
نوع النشاط: ${action}
الاسم: ${user.name || 'غير محدد'}
اسم المستخدم: ${user.username}
البريد الإلكتروني: ${user.email || 'غير محدد'}
رقم الهاتف: ${user.phone || 'غير محدد'}
الوقت: ${now}`;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev_secret_key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByIdentifier(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        const now = new Date().toISOString();
        await storage.updateUserLastLogin(user.id, now);
        await sendTelegramNotification(formatUserDetails(user, 'تسجيل دخول'));
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByIdentifier(req.body.username);
    if (existingUser) {
      return res.status(400).send("المستخدم موجود مسبقاً");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    await sendTelegramNotification(formatUserDetails(user, 'تسجيل مستخدم جديد'));

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", async (req, res, next) => {
    const user = req.user as SelectUser;
    if (user) {
      await sendTelegramNotification(formatUserDetails(user, 'تسجيل خروج'));
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