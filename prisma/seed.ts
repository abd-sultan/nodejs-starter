import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage de la base de données
  await prisma.userPermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Création des rôles
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Administrator role with full access'
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
      description: 'Regular user role'
    }
  });

  // Création des permissions
  const permissions = await Promise.all([
    prisma.permission.create({
      data: { name: 'CREATE_USER', description: 'Can create users' }
    }),
    prisma.permission.create({
      data: { name: 'UPDATE_USER', description: 'Can update users' }
    }),
    prisma.permission.create({
      data: { name: 'DELETE_USER', description: 'Can delete users' }
    }),
    prisma.permission.create({
      data: { name: 'MANAGE_ROLES', description: 'Can manage roles' }
    }),
    prisma.permission.create({
      data: { name: 'MANAGE_PERMISSIONS', description: 'Can manage permissions' }
    })
  ]);

  // Association des permissions au rôle admin
  await Promise.all(
    permissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      })
    )
  );

  // Création de l'utilisateur admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!@#', 10),
      isActive: true,
      isEmailVerified: true,
      firstName: 'Admin',
      lastName: 'User',
      roles: {
        create: {
          roleId: adminRole.id
        }
      }
    }
  });

  // Création d'utilisateurs de test
  const testUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        password: await bcrypt.hash('Test123!@#', 10),
        isActive: true,
        isEmailVerified: true,
        firstName: 'User',
        lastName: 'One',
        roles: {
          create: {
            roleId: userRole.id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        password: await bcrypt.hash('Test123!@#', 10),
        isActive: true,
        isEmailVerified: false,
        firstName: 'User',
        lastName: 'Two',
        roles: {
          create: {
            roleId: userRole.id
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        phoneNumber: '+33612345678',
        password: await bcrypt.hash('Test123!@#', 10),
        isActive: true,
        isPhoneVerified: true,
        firstName: 'User',
        lastName: 'Three',
        roles: {
          create: {
            roleId: userRole.id
          }
        }
      }
    })
  ]);

  console.log({
    adminUser,
    testUsers,
    roles: { adminRole, userRole },
    permissions
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });