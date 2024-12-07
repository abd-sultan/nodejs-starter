import { Request, Response, NextFunction } from 'express';
import prisma from '@/lib/prisma';

export const hasPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usr: any = req.user;
      const userId = usr?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          permissions: {
            include: {
              permission: true
            }
          },
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
      }

      // Vérifier les permissions directes de l'utilisateur
      const directPermissions: any = user?.permissions.map(up => up.permission.name);

      // Vérifier les permissions héritées des rôles
      const rolePermissions: any = user?.roles.flatMap(ur =>
        ur.role.permissions.map(rp => rp.permission.name)
      );

      // Combiner toutes les permissions
      const allPermissions = new Set([...directPermissions, ...rolePermissions]);

      if (!allPermissions.has(requiredPermission)) {
        res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const hasRole = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usr: any = req.user;
      const userId = usr?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
      }

      const userRoles = user?.roles.map(ur => ur.role.name);

      if (!userRoles?.includes(requiredRole)) {
        res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};