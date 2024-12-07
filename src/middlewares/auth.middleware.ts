import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtConfig } from '@/config/jwt.config';
import prisma from '@/lib/prisma';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret
};

passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
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

      if (!user || !user.isActive) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);

export const authenticateJwt = passport.authenticate('jwt', { session: false });