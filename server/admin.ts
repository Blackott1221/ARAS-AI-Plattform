import { Router, Request, Response } from 'express';
import { db } from './db';
import { users, chatSessions, chatMessages } from '../shared/schema';

const router = Router();

// 🔐 ADMIN CHECK - Nur du darfst hier rein!
const adminCheck = (req: any, res: Response, next: Function) => {
  const adminToken = req.headers.authorization?.replace('Bearer ', '');
  if (adminToken !== 'admin-secret-2025') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// 📊 ALLE USERS ANSCHAUEN
router.get('/api/admin/users', adminCheck, async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ 
      totalUsers: allUsers.length,
      users: allUsers.map(u => ({
        id: u.id,
        email: u.email,
        username: u.username,
        plan: u.subscriptionPlan,
        messagesUsed: u.aiMessagesUsed,
        createdAt: u.createdAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 ALLE CHATS ANSCHAUEN
router.get('/api/admin/chats', adminCheck, async (req: Request, res: Response) => {
  try {
    const allChats = await db.select().from(chatSessions);
    res.json({ 
      totalChats: allChats.length,
      chats: allChats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 📊 ALLE MESSAGES ANSCHAUEN
router.get('/api/admin/messages', adminCheck, async (req: Request, res: Response) => {
  try {
    const allMessages = await db.select().from(chatMessages);
    res.json({ 
      totalMessages: allMessages.length,
      messages: allMessages
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
