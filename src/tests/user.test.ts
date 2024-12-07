import request from 'supertest';
import { app } from '@/server';
import { prismaMock } from './setup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config/jwt.config';

describe('User Endpoints', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: bcrypt.hashSync('Test123!@#', 10),
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const authToken = jwt.sign(
    { userId: mockUser.id, email: mockUser.email },
    jwtConfig.secret,
    { expiresIn: '1h' }
  );

  describe('PUT /api/users/profile', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
    });

    it('should update profile', async () => {
      prismaMock.user.update.mockResolvedValueOnce({
        ...mockUser,
        firstName: 'John',
        lastName: 'Doe'
      } as any);

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe('John');
      expect(res.body.lastName).toBe('Doe');
    });

    it('should reject unauthorized request', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .send({
          firstName: 'John'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users/change-password', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
    });

    it('should change password', async () => {
      const res = await request(app)
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'Test123!@#',
          newPassword: 'NewTest123!@#'
        });

      expect(res.status).toBe(200);
    });

    it('should reject wrong old password', async () => {
      const res = await request(app)
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'NewTest123!@#'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/forgot-password', () => {
    it('should initiate password reset', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(mockUser as any);

      const res = await request(app)
        .post('/api/users/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(res.status).toBe(200);
    });
  });
});
