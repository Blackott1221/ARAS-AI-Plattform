import { Router, Request, Response } from "express";

const router = Router();

router.post("/api/chat/message", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }
    const aiResponse = `Echo: ${message}`;
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
