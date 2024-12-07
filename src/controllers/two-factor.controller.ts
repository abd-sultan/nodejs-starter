import { Request, Response } from 'express';
import { TwoFactorService } from '@/services/two-factor.service';

export class TwoFactorController {
  static async generate(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      const result = await TwoFactorService.generateSecret(userId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ message: 'Verification code is required' });
      }

      const result = await TwoFactorService.verify(userId, token);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async enable(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ message: 'Verification code is required' });
      }

      await TwoFactorService.verifyAndEnable(userId, token);
      res.json({ message: 'Two-factor authentication enabled successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async disable(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ message: 'Verification code is required' });
      }

      await TwoFactorService.disable(userId, token);
      res.json({ message: 'Two-factor authentication disabled successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}