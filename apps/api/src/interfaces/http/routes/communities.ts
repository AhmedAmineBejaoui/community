import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { CreateCommunitySchema, ApproveMemberSchema } from '@neighborhood-hub/types';
import { CommunityController } from '../controllers/CommunityController';

const router: Router = Router();
const communityController = new CommunityController();

// Get community by slug
router.get('/:slug', communityController.getBySlug);

// Create community (admin only)
router.post('/', requireAuth, validate(CreateCommunitySchema), communityController.create);

// Get community members
router.get('/:id/members', communityController.getMembers);

// Approve member
router.post('/:id/members/approve', requireAuth, validate(ApproveMemberSchema), communityController.approveMember);

export { router as communityRoutes };
