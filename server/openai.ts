import { Router, Request, Response } from 'express';
import { db } from './db';
import { chatMessages, chatSessions } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/api/chat/ai-response', async (req: any, res: Response) => {
  try {
    const { sessionId, userMessage } = req.body;
    const userId = req.userId;

    // 1. USER MESSAGE SPEICHERN
    await db.insert(chatMessages).values({
      sessionId,
      userId,
      message: userMessage,
      isAi: false,
    });

    // 2. CHAT HISTORY HOLEN (letzten 10 Messages)
    const history = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .limit(10);

    // 3. OPENAI AUFRUFEN mit History
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: history.map(m => ({
          role: m.isAi ? 'assistant' : 'user',
          content: m.message,
        })),
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // 4. AI RESPONSE SPEICHERN
    await db.insert(chatMessages).values({
      sessionId,
      userId,
      message: aiMessage,
      isAi: true,
    });

    res.json({ success: true, aiResponse: aiMessage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
