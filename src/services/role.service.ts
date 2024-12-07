import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export class RoleService {
  static async create(name: string, description?: string) {
    const existingRole = await prisma.role.findUnique({
      where: { name }
    });

    if (existingRole) {
      throw new Error('Role already exists');
    }

    return prisma.role.create({
      data: { name, description }
    });
  }

  static async update(id: string, data: Partial<Role>) {
    const role = await prisma.role.findUnique({
      where: { id }
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (data.name) {
      const existingRole = await prisma.role.findFirst({
        where: {
          name: data.name,
          NOT: { id }
        }
      });

      if (existingRole) {
        throw new Error('Role name already exists');
      }
    }

    return prisma.role.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        users: true
      }
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (role.name === 'ADMIN' || role.name === 'USER') {
      throw new Error('Cannot delete system roles');
    }

    if (role.users.length > 0) {
      throw new Error('Cannot delete role with assigned users');
    }

    return prisma.role.delete({
      where: { id }
    });
  }

  static async addPermissionsToRole(roleId: string, permissionIds: string[]) {
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await prisma.permission.findMany({
      where: {
        id: {
          in: permissionIds
        }
      }
    });

    if (permissions.length !== permissionIds.length) {
      throw new Error('Some permissions were not found');
    }

    const permissionRoles = permissionIds.map(permissionId => ({
      roleId,
      permissionId
    }));

    await prisma.rolePermission.createMany({
      data: permissionRoles,
      skipDuplicates: true
    });

    return prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  static async removePermissionsFromRole(roleId: string, permissionIds: string[]) {
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: {
          in: permissionIds
        }
      }
    });

    return true;
  }
}