import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { config } from '../../../infrastructure/config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const router: Router = Router();

const s3Client = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
  ...(config.s3.endpoint
    ? { endpoint: config.s3.endpoint, forcePathStyle: true }
    : {}),
});

// POST /uploads/sign - Generate presigned URL for S3 upload
router.post('/sign', requireAuth, async (req, res, next) => {
  try {
    const { filename, contentType, communityId } = req.body;

    if (!filename || !contentType || !communityId) {
      res.status(400).json({
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'filename, contentType, and communityId are required',
        },
      });
      return;
    }

    // Check if user is member of the community
    const membership = (req as any).user.memberships.find((m: any) => m.communityId === communityId);
    if (!membership) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You are not a member of this community',
        },
      });
      return;
    }

    const key = `uploads/${communityId}/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({
      data: {
        url: presignedUrl,
        key,
        expiresAt: new Date(Date.now() + 3600 * 1000),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /uploads/:key - Generate presigned URL for S3 download
router.get('/:key', requireAuth, async (req, res, next) => {
  try {
    const { key } = req.params;
    const { communityId } = req.query;

    if (!communityId) {
      res.status(400).json({
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'communityId query parameter is required',
        },
      });
      return;
    }

    // Check if user is member of the community
    const membership = (req as any).user.memberships.find((m: any) => m.communityId === communityId);
    if (!membership) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You are not a member of this community',
        },
      });
      return;
    }

    const command = new GetObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({
      data: {
        url: presignedUrl,
        expiresAt: new Date(Date.now() + 3600 * 1000),
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as uploadRoutes };
