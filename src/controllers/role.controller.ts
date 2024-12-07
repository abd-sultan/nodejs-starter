import { Request, Response } from 'express';
import { RoleService } from '@/services/role.service';

export class RoleController {
  static async createRole(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const role = await RoleService.create(name, description);
      res.status(201).json(role);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await RoleService.update(id, req.body);
      res.json(role);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RoleService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async addPermissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;
      const role = await RoleService.addPermissionsToRole(id, permissionIds);
      res.json(role);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async removePermissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;
      await RoleService.removePermissionsFromRole(id, permissionIds);
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