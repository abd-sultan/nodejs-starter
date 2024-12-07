import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// Mock OAuth strategies
jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('passport-github2', () => ({
  Strategy: jest.fn().mockImplementation(() => ({}))
}));

import prisma from '@/lib/prisma';

beforeEach(() => {
  mockReset(prismaMock);
});

// Mock process.env
process.env.JWT_SECRET = 'e9a3e520d383785c070424520cd32986a6f5e8ff882a6b5ae23bd2d6367e084e';
process.env.JWT_REFRESH_SECRET = '7521707658d39807044392ff2c6a6cef3a350d3c2df03bdf4e6a7112f29c2f8d';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.GOOGLE_CLIENT_ID = 'mock_google_client_id';
process.env.GOOGLE_CLIENT_SECRET = 'mock_google_client_secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/api/auth/google/callback';
process.env.GITHUB_CLIENT_ID = 'mock_github_client_id';
process.env.GITHUB_CLIENT_SECRET = 'mock_github_client_secret';
process.env.GITHUB_CALLBACK_URL = 'http://localhost:3000/api/auth/github/callback';

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;