import { Request, Response } from 'express';
import { PermissionService } from '@/services/permission.service';

export class PermissionController {
  static async createPermission(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const permission = await PermissionService.create(name, description);
      res.status(201).json(permission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async updatePermission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const permission = await PermissionService.update(id, req.body);
      res.json(permission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async deletePermission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PermissionService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}