import prisma from '@/lib/prisma';
import { AuthService } from '@/services/auth.service';
import { Profile } from 'passport';

export class OAuthService {
  static async handleOAuthUser(profile: Profile, provider: string) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error('Email not provided by OAuth provider');
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { providerId: profile.id, provider }
        ]
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      // Créer un nouvel utilisateur
      user = await prisma.user.create({
        data: {
          email,
          provider,
          providerId: profile.id,
          firstName: profile.name?.givenName || profile.displayName,
          lastName: profile.name?.familyName,
          isEmailVerified: true,
          roles: {
            create: {
              role: {
                connect: {
                  name: 'USER'
                }
              }
            }
          }
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });
    } else if (user.provider !== provider) {
      // Mettre à jour les informations si l'utilisateur existe avec un autre provider
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider,
          providerId: profile.id,
          isEmailVerified: true
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    const roles = user.roles.map(ur => ur.role.name);
    const tokens = AuthService.generateTokens({
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
}