import { Request, Response } from 'express';

// Temporary stub controller for post routes
// Provides placeholder implementations that return 501 status

export class PostController {
  async getPosts(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async getById(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async create(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async update(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async delete(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async getComments(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async createComment(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async updateService(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async updateListing(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async vote(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }

  async getPollResults(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'Not implemented' });
  }
}

