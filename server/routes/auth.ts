import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dein-super-geheimer-schluessel-2025';

// 📝 REGISTER - Neuer User anlegen
router.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort erforderlich!' });
    }

    // Prüfe ob User schon existiert
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email bereits registriert!' });
    }

    // Passwort verschlüsseln
    const hashedPassword = await bcrypt.hash(password, 10);

    // User erstellen
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      username: username || email.split('@')[0],
      plan: 'trial', // Jeder startet mit Trial
      createdAt: new Date().toISOString(),
    }).returning();

    // Token erstellen (Login-Ausweis)
    const token = jwt.sign(
      { userId: newUser[0].id, email: newUser[0].email },
      JWT_SECRET,
      { expiresIn: '7d' } // Token läuft nach 7 Tagen ab
    );

    res.json({
      success: true,
      token,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        username: newUser[0].username,
        plan: newUser[0].plan,
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration fehlgeschlagen' });
  }
});

// 🔑 LOGIN - Einloggen
router.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort erforderlich!' });
    }

    // User finden
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Falsche Email oder Passwort!' });
    }

    // Passwort prüfen
    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Falsche Email oder Passwort!' });
    }

    // Token erstellen
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        plan: user[0].plan,
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

// 👤 ME - Wer bin ich? (Token prüfen)
router.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Nicht eingeloggt!' });
    }

    // Token prüfen
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // User aus DB holen
    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'User nicht gefunden!' });
    }

    res.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        plan: user[0].plan,
      }
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Token ungültig!' });
  }
});

export default router;
