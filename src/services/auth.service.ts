import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { jwtConfig } from '@/config/jwt.config';
import { AuthTokens, TokenPayload, LoginDTO } from '@/types/auth.types';
import { OTPService } from './otp.service';

export class AuthService {
  static generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });

    return { accessToken, refreshToken };
  }

  static async register(data: {
    email?: string;
    phoneNumber?: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    if (!data.email && !data.phoneNumber) {
      throw new Error('Email or phone number is required');
    }

    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email }
      });
      if (existingEmail) throw new Error('Email already exists');
    }

    if (data.phoneNumber) {
      const existingPhone = await prisma.user.findUnique({
        where: { phoneNumber: data.phoneNumber }
      });
      if (existingPhone) throw new Error('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        provider: 'local'
      }
    });

    await OTPService.generateAndSendOTP(user.id);

    return { userId: user.id };
  }

  static async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    // Si 2FA est activé, retourner un token temporaire
    if (user.isTwoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id
      };
    }

    const roles = user.roles.map(ur => ur.role.name);
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      roles
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    return { user, ...tokens };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, jwtConfig.refreshSecret) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const roles = user.roles.map(ur => ur.role.name);
      const tokens = this.generateTokens({ userId: user.id, email: user.email, roles });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken }
      });

      return tokens;
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });

    return true;
  }
}