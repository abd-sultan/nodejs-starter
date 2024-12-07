import request from 'supertest';
import { app } from '@/server';
import { prismaMock } from './setup';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  const hashedPassword = bcrypt.hashSync('Test123!@#', 10);
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: hashedPassword,
    isActive: true,
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    provider: 'local',
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [{
      role: {
        id: '1',
        name: 'USER',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }]
  };

  describe('POST /api/auth/register', () => {
    it('should register user with email', async () => {
      prismaMock.user.create.mockResolvedValueOnce(mockUser as any);
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.role.findUnique.mockResolvedValueOnce({ id: '1', name: 'USER' } as any);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('userId');
    });

    it('should register user with phone', async () => {
      const phoneUser = { ...mockUser, email: null, phoneNumber: '+33612345678' };
      prismaMock.user.create.mockResolvedValueOnce(phoneUser as any);
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.role.findUnique.mockResolvedValueOnce({ id: '1', name: 'USER' } as any);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '+33612345678',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('userId');
    });

    it('should not register with existing email', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(mockUser as any);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
    });

    it('should login successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 2FA response when enabled', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        isTwoFactorEnabled: true
      } as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('requiresTwoFactor', true);
      expect(res.body).toHaveProperty('userId');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/verify', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        verificationCode: '123456',
        verificationExpires: new Date(Date.now() + 600000)
      } as any);
    });

    it('should verify OTP successfully', async () => {
      const res = await request(app)
        .post('/api/auth/verify')
        .send({
          userId: '1',
          code: '123456'
        });

      expect(res.status).toBe(200);
    });

    it('should reject expired OTP', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        verificationCode: '123456',
        verificationExpires: new Date(Date.now() - 600000)
      } as any);

      const res = await request(app)
        .post('/api/auth/verify')
        .send({
          userId: '1',
          code: '123456'
        });

      expect(res.status).toBe(400);
    });
  });
});