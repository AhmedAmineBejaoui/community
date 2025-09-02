import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  CreatePostSchema,
  UpdatePostSchema,
  CreateCommentSchema,
  VoteSchema,
  ServiceUpdateSchema,
  ListingUpdateSchema,
} from '@neighborhood-hub/types';
import { PostController } from '../controllers/PostController';

const router: Router = Router();
const postController = new PostController();

// Get posts with filters
router.get('/', postController.getPosts);

// Get post by ID
router.get('/:id', postController.getById);

// Create post
router.post('/', requireAuth, validate(CreatePostSchema), postController.create);

// Update post
router.patch('/:id', requireAuth, validate(UpdatePostSchema), postController.update);

// Delete post
router.delete('/:id', requireAuth, postController.delete);

// Comments
router.get('/:id/comments', postController.getComments);
router.post('/:id/comments', requireAuth, validate(CreateCommentSchema), postController.createComment);

// Service updates
router.patch('/:id/service', requireAuth, validate(ServiceUpdateSchema), postController.updateService);

// Listing updates
router.patch('/:id/listing', requireAuth, validate(ListingUpdateSchema), postController.updateListing);

// Poll voting
router.post('/:id/vote', requireAuth, validate(VoteSchema), postController.vote);
router.get('/:id/results', postController.getPollResults);

export { router as postRoutes };
