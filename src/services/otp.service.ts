import prisma from '@/lib/prisma';
import crypto from 'crypto';

export class OTPService {
  private static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private static async sendEmailOTP(email: string, code: string) {
    // Intégrer avec un service d'envoi d'email
    console.log(`Send email OTP ${code} to ${email}`);
  }

  private static async sendSMSOTP(phoneNumber: string, code: string) {
    // Intégrer avec un service SMS (Twilio, etc.)
    console.log(`Send SMS OTP ${code} to ${phoneNumber}`);
  }

  static async generateAndSendOTP(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('User not found');

    const code = this.generateOTP();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode: code,
        verificationExpires: expires
      }
    });

    if (user.email) {
      await this.sendEmailOTP(user.email, code);
    } else if (user.phoneNumber) {
      await this.sendSMSOTP(user.phoneNumber, code);
    }

    return true;
  }

  static async verifyOTP(userId: string, code: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.verificationCode || !user.verificationExpires) {
      throw new Error('Invalid verification attempt');
    }

    if (new Date() > user.verificationExpires) {
      throw new Error('Verification code expired');
    }

    if (user.verificationCode !== code) {
      throw new Error('Invalid verification code');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        isEmailVerified: user.email ? true : false,
        isPhoneVerified: user.phoneNumber ? true : false,
        verificationCode: null,
        verificationExpires: null
      }
    });

    return true;
  }
}