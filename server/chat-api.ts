import { Router, Request, Response } from 'express';
import { db } from './db';
import { chatSessions, chatMessages, users } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// 🔐 Middleware - Auth Check
const requireAuth = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  (req as any).token = token;
  next();
};

// 💬 CREATE CHAT SESSION
router.post('/api/chat/sessions', requireAuth, async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const userId = (req as any).userId;

    const session = await db
      .insert(chatSessions)
      .values({
        userId,
        title: title || 'New Chat',
        isActive: true,
      })
      .returning();

    res.json({ success: true, session: session[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 📝 SAVE MESSAGE TO CHAT
router.post('/api/chat/send', requireAuth, async (req: Request, res: Response) => {
  try {
    const { sessionId, message, isAi } = req.body;
    const userId = (req as any).userId;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Missing message or sessionId' });
    }

    // Verify user owns this session
    const session = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
      .limit(1);

    if (session.length === 0) {
      return res.status(403).json({ error: 'Session not found' });
    }

    // Deduct credit if user message
    if (!isAi) {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user[0].aiMessagesUsed >= 100) {
        return res.status(402).json({ error: 'No credits left' });
      }

      await db
        .update(users)
        .set({ aiMessagesUsed: user[0].aiMessagesUsed + 1 })
        .where(eq(users.id, userId));
    }

    // Save message
    const savedMessage = await db
      .insert(chatMessages)
      .values({
        sessionId,
        userId,
        message,
        isAi,
      })
      .returning();

    res.json({ success: true, message: savedMessage[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 📖 GET CHAT HISTORY
router.get('/api/chat/sessions/:sessionId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).userId;

    // Verify ownership
    const session = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.id, parseInt(sessionId)), eq(chatSessions.userId, userId)))
      .limit(1);

    if (session.length === 0) {
      return res.status(403).json({ error: 'Session not found' });
    }

    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, parseInt(sessionId)));

    res.json({ success: true, session: session[0], messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 📋 LIST ALL SESSIONS FOR USER
router.get('/api/chat/sessions', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const sessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId));

    res.json({ success: true, sessions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
