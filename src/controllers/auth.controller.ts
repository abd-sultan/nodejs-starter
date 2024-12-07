import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { LoginDTO, RegisterDTO } from '@/types/auth.types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = req.body as RegisterDTO;
      const result = await AuthService.register(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = req.body as LoginDTO;
      const result = await AuthService.login(data);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
      }

      const tokens = await AuthService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
      }

      await AuthService.logout(userId);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}