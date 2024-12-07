import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';

export class UserController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      const user = await UserService.updateProfile(userId, req.body);
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      const { oldPassword, newPassword } = req.body;
      await UserService.changePassword(userId, oldPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const resetToken = await UserService.initiatePasswordReset(email);
      console.log("🚀 ~ UserController ~ forgotPassword ~ resetToken:", resetToken)
      // Envoyer l'email avec le token
      res.json({ message: 'Password reset instructions sent to email' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await UserService.resetPassword(token, newPassword);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async toggleAccountStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await UserService.toggleAccountStatus(id, isActive);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async softDeleteAccount(req: Request, res: Response) {
    try {
      const usr: any = req.user;
      const userId = usr?.id;
      await UserService.softDeleteAccount(userId);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}