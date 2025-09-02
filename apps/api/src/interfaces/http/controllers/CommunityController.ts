import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { prisma } from '../../../infrastructure/prisma';

export class CommunityController {
  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      
      const community = await prisma.community.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
      });

      if (!community) {
        res.status(404).json({
          error: {
            code: 'COMMUNITY_NOT_FOUND',
            message: 'Community not found',
          },
        });
        return;
      }

      res.json({ data: community });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userReq = req as AuthenticatedRequest;
      // Check if user has admin rights
      const isAdmin = userReq.user.memberships.some(m => m.role === 'ADMIN');
      if (!isAdmin) {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Only administrators can create communities',
          },
        });
        return;
      }

      const community = await prisma.community.create({
        data: userReq.body,
      });

      res.status(201).json({ data: community });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const members = await prisma.membership.findMany({
        where: { communityId: id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              status: true,
            },
          },
        },
      });

      res.json({ data: members });
    } catch (error) {
      next(error);
    }
  }

  async approveMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const { userId, role } = userReq.body;

      // Check if user has admin rights in this community
      const userMembership = userReq.user.memberships.find(m => m.communityId === id);
      if (!userMembership || userMembership.role !== 'ADMIN') {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Only community administrators can approve members',
          },
        });
        return;
      }

      const membership = await prisma.membership.create({
        data: {
          userId,
          communityId: id,
          role,
        },
      });

      res.status(201).json({ data: membership });
    } catch (error) {
      next(error);
    }
  }
}
