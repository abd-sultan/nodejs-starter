import prisma from '@/lib/prisma';
import { Permission } from '@prisma/client';

export class PermissionService {
  static async create(name: string, description?: string) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name }
    });

    if (existingPermission) {
      throw new Error('Permission already exists');
    }

    return prisma.permission.create({
      data: { name, description }
    });
  }

  static async update(id: string, data: Partial<Permission>) {
    const permission = await prisma.permission.findUnique({
      where: { id }
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    if (data.name) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          name: data.name,
          NOT: { id }
        }
      });

      if (existingPermission) {
        throw new Error('Permission name already exists');
      }
    }

    return prisma.permission.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: true,
        users: true
      }
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    if (permission.roles.length > 0 || permission.users.length > 0) {
      throw new Error('Cannot delete permission that is in use');
    }

    return prisma.permission.delete({
      where: { id }
    });
  }
}