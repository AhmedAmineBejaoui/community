import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../../infrastructure/prisma';
import { config } from '../../../infrastructure/config';

const router: Router = Router();

// n8n -> API callback to append assistant reply into a chat session
// POST /integrations/n8n/chat/callback
router.post('/chat/callback', async (req: Request, res: Response) => {
  try {
    const signature = (req.headers['x-n8n-signature'] as string) || (req.headers['x-n8n-signature'.toLowerCase()] as string);
    const bodyString = JSON.stringify(req.body ?? {});

    if (config.n8n.signingSecret) {
      const expected = crypto.createHmac('sha256', config.n8n.signingSecret).update(bodyString).digest('hex');
      if (!signature || signature !== expected) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { sessionId, reply, error } = req.body as { sessionId?: string; reply?: string; error?: string };
    if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const content = reply || 'No reply provided.';

    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: error ? `${content} (error: ${error})` : content,
      },
    });

    await prisma.chatSession.update({ where: { id: sessionId }, data: { lastActivityAt: new Date() } });

    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Internal error' });
  }
});

export { router as integrationsRoutes };

