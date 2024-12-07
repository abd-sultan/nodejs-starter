import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';
import { AuthService } from '@/services/auth.service';

export class TwoFactorService {
  static async generateSecret(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isTwoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled');
    }

    const secret = speakeasy.generateSecret({
      name: `YourApp:${user.email}`
    });

    // Stocker le secret temporairement
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        isTwoFactorEnabled: false
      }
    });

    // Générer le QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl
    };
  }

  static async verifyAndEnable(userId: string, token: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.twoFactorSecret) {
      throw new Error('Invalid user or 2FA not initialized');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: true
      }
    });

    return true;
  }

  static async verify(userId: string, token: string) {
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

    if (!user || !user.twoFactorSecret || !user.isTwoFactorEnabled) {
      throw new Error('Two-factor authentication is not enabled');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    const roles = user.roles.map(ur => ur.role.name);
    return AuthService.generateTokens({
      userId: user.id,
      email: user.email,
      roles
    });
  }

  static async disable(userId: string, token: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.twoFactorSecret || !user.isTwoFactorEnabled) {
      throw new Error('Two-factor authentication is not enabled');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    return true;
  }
}