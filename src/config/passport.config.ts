import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { oauthConfig } from '@/config/oauth.config';
import { OAuthService } from '@/services/oauth.service';

// Configuration Google Strategy
passport.use('google', new GoogleStrategy(
  oauthConfig.google,
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log("🚀 ~ refreshToken:", refreshToken)
    console.log("🚀 ~ accessToken:", accessToken)
    try {
      const result = await OAuthService.handleOAuthUser(profile, 'google');
      return done(null, result);
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Configuration GitHub Strategy
passport.use('github', new GitHubStrategy(
  oauthConfig.github,
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log("🚀 ~ refreshToken:", refreshToken)
    console.log("🚀 ~ accessToken:", accessToken)
    try {
      const result = await OAuthService.handleOAuthUser(profile, 'github');
      return done(null, result);
    } catch (error) {
      return done(error as Error);
    }
  }
));