import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export class UserService {
  static async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data
    });
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.password) {
      throw new Error('Invalid operation');
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  static async initiatePasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Retourner silencieusement pour éviter la divulgation d'informations
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    return resetToken;
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });
  }

  static async toggleAccountStatus(userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });
  }

  static async softDeleteAccount(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isActive: false
      }
    });
  }
}