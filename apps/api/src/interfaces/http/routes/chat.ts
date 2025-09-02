import { Router, Request } from 'express';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { CreateChatSessionSchema, CreateChatMessageSchema } from '@neighborhood-hub/types';
import { prisma } from '../../../infrastructure/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { config } from '../../../infrastructure/config';
import crypto from 'crypto';

const router: Router = Router();

// POST /chat/sessions - Create a new chat session
router.post('/sessions', requireAuth, validate(CreateChatSessionSchema), async (req: Request, res, next) => {
  try {
    const userReq = req as AuthenticatedRequest;
    const session = await prisma.chatSession.create({
      data: {
        communityId: userReq.body.communityId,
        userId: userReq.user.sub,
        status: 'active',
        lastActivityAt: new Date(),
      },
    });

    res.status(201).json({ data: session });
  } catch (error) {
    next(error);
  }
});

// POST /chat/messages - Send a message and forward to n8n
router.post('/messages', requireAuth, validate(CreateChatMessageSchema), async (req: Request, res, next) => {
  try {
    const userReq = req as AuthenticatedRequest;
    const { sessionId, content } = userReq.body;

    // Verify session exists and user has access
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      res.status(404).json({
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chat session not found',
        },
      });
      return;
    }

    // Check if user is member of the community
    const membership = userReq.user.memberships.find(m => m.communityId === session.communityId);
    if (!membership) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You are not a member of this community',
        },
      });
      return;
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content,
      },
    });

    // Update session activity
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });

    // Forward to n8n webhook
    const webhookData = {
      sessionId,
      content,
      communityId: session.communityId,
      userId: userReq.user.sub,
    };

    const signature = crypto
      .createHmac('sha256', config.n8n.signingSecret)
      .update(JSON.stringify(webhookData))
      .digest('hex');

    try {
      const n8nResponse = await fetch(`${config.n8n.baseUrl}${config.n8n.webhookPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-Signature': signature,
        },
        body: JSON.stringify(webhookData),
      });

      if (!n8nResponse.ok) {
        console.error('n8n webhook failed:', n8nResponse.status, n8nResponse.statusText);
      }
    } catch (error) {
      console.error('Failed to forward to n8n:', error);
    }

    res.status(201).json({ data: userMessage });
  } catch (error) {
    next(error);
  }
});

// GET /chat/sessions/:id/messages - Get chat messages
router.get('/sessions/:id/messages', requireAuth, async (req: Request, res, next) => {
  try {
    const userReq = req as AuthenticatedRequest;
    const { id } = req.params;

    // Verify session exists and user has access
    const session = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Chat session not found',
        },
      });
      return;
    }

    // Check if user is member of the community
    const membership = userReq.user.memberships.find(m => m.communityId === session.communityId);
    if (!membership) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You are not a member of this community',
        },
      });
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ data: messages });
  } catch (error) {
    next(error);
  }
});

export { router as chatRoutes };
