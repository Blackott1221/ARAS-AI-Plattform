import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aras-unicorn-2025-enterprise';

// 📝 REGISTER
router.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort erforderlich!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein!' });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email bereits registriert!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password: hashedPassword,
        username: username || email.split('@')[0],
        subscriptionPlan: 'starter',
        subscriptionStatus: 'trial_pending',
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        aiMessagesUsed: 0,
        voiceCallsUsed: 0,
      })
      .returning();

    const token = jwt.sign(
      { userId: newUser[0].id, email: newUser[0].email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        username: newUser[0].username,
        subscriptionPlan: newUser[0].subscriptionPlan,
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration fehlgeschlagen', details: error.message });
  }
});

// 🔑 LOGIN
router.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort erforderlich!' });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Falsche Email oder Passwort!' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Falsche Email oder Passwort!' });
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        subscriptionPlan: user[0].subscriptionPlan,
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login fehlgeschlagen', details: error.message });
  }
});

// 👤 ME
router.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Nicht eingeloggt!' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'User nicht gefunden!' });
    }

    const { password, ...safeUser } = user[0];

    res.json({
      success: true,
      user: safeUser
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Token ungültig!' });
  }
});

export default router;

// Middleware für Token Extract
export const extractUserId = (req: any, res: any, next: Function) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aras-unicorn-2025-production-secret') as any;
    req.userId = decoded.userId;
  } catch (e) {}
  next();
};
