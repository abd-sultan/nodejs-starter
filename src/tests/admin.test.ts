import request from 'supertest';
import { app } from '@/server';
import { prismaMock } from './setup';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config/jwt.config';

describe('Admin Endpoints', () => {
  const adminUser = {
    id: '1',
    email: 'admin@example.com',
    roles: [{
      role: {
        id: '1',
        name: 'ADMIN'
      }
    }]
  };

  const adminToken = jwt.sign(
    { userId: adminUser.id, email: adminUser.email, roles: ['ADMIN'] },
    jwtConfig.secret,
    { expiresIn: '1h' }
  );

  describe('POST /api/admin/roles', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue(adminUser as any);
    });

    it('should create role', async () => {
      prismaMock.role.create.mockResolvedValueOnce({
        id: '2',
        name: 'MANAGER',
        description: 'Manager role',
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      const res = await request(app)
        .post('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'MANAGER',
          description: 'Manager role'
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('MANAGER');
    });

    it('should reject non-admin users', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...adminUser,
        roles: [{ role: { name: 'USER' } }]
      } as any);

      const res = await request(app)
        .post('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'MANAGER'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/admin/permissions', () => {
    it('should create permission', async () => {
      prismaMock.permission.create.mockResolvedValueOnce({
        id: '1',
        name: 'CREATE_USER',
        description: 'Can create users',
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      const res = await request(app)
        .post('/api/admin/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'CREATE_USER',
          description: 'Can create users'
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('CREATE_USER');
    });
  });
});