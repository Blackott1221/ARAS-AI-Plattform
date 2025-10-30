import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import chatApiRouter from "./chat-api.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: false
}));

app.use(express.json());

// 🔐 GLOBAL AUTH MIDDLEWARE
app.use((req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aras-unicorn-2025-production-secret') as any;
      req.userId = decoded.userId;
      req.email = decoded.email;
    } catch (e) {
      // Token invalid
    }
  }
  next();
});

app.use(authRouter);
app.use("/", chatApiRouter);
app.use("/", adminRouter);

app.listen(PORT, () => {
  console.log(`[express] serving on port ${PORT}`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/register`);
  console.log(`📊 Admin: http://localhost:${PORT}/api/admin/users`);
});
