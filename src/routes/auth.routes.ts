import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '@/controllers/auth.controller';
import { authenticateJwt } from '@/middlewares/auth.middleware';
import { TwoFactorController } from '@/controllers/two-factor.controller';
import { validate } from '@/middlewares/validation.middleware';
import { registerSchema, loginSchema } from '@/validation/schemas';
import { OTPService } from '@/services/otp.service';

const router = Router();

// Routes d'authentification existantes
/**
* @swagger
* /auth/register:
*   post:
*     summary: Inscription d'un nouvel utilisateur
*     description: |
*       Permet de créer un nouveau compte utilisateur.
*       Le mot de passe doit respecter les critères suivants :
*       - Au moins 8 caractères
*       - Au moins une lettre majuscule
*       - Au moins une lettre minuscule
*       - Au moins un chiffre
*       - Au moins un caractère spécial
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 format: email
*                 example: john.doe@example.com
*               password:
*                 type: string
*                 format: password
*                 example: "P@ssw0rd123"
*               firstName:
*                 type: string
*                 example: John
*               lastName:
*                 type: string
*                 example: Doe
*           examples:
*             default:
*               value:
*                 email: john.doe@example.com
*                 password: "P@ssw0rd123"
*                 firstName: John
*                 lastName: Doe
*             minimal:
*               value:
*                 email: john.doe@example.com
*                 password: "P@ssw0rd123"
*     responses:
*       201:
*         description: Utilisateur créé avec succès
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/AuthResponse'
*             example:
*               user:
*                 id: clh12345-1234-5678-1234-567812345678
*                 email: john.doe@example.com
*                 firstName: John
*                 lastName: Doe
*                 isEmailVerified: false
*                 isActive: true
*                 isTwoFactorEnabled: false
*                 provider: local
*               accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*       400:
*         description: Données d'entrée invalides
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Error'
*             examples:
*               emailExists:
*                 value:
*                   message: Email already exists
*                   code: AUTH_003
*                   details:
*                     field: email
*                     issue: already_exists
*               invalidPassword:
*                 value:
*                   message: Password does not meet requirements
*                   code: AUTH_004
*                   details:
*                     field: password
*                     requirements:
*                       minLength: 8
*                       uppercase: true
*                       lowercase: true
*                       numbers: true
*                       special: true
*/
router.post('/register', validate(registerSchema), AuthController.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *           example:
 *             email: john.doe@example.com
 *             password: "P@ssw0rd123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/AuthResponse'
 *                 - type: object
 *                   properties:
 *                     requiresTwoFactor:
 *                       type: boolean
 *                     userId:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *
 */
router.post('/login', validate(loginSchema), AuthController.login);
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/refresh-token', AuthController.refreshToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/logout', authenticateJwt, AuthController.logout);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Vérifier le code OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Compte vérifié
 *
 * /auth/resend-otp:
 *   post:
 *     summary: Renvoyer le code OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code renvoyé
 */
router.post('/verify', async (req, res) => {
  try {
    await OTPService.verifyOTP(req.body.userId, req.body.code);
    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    await OTPService.generateAndSendOTP(req.body.userId);
    res.json({ message: 'Verification code sent' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Routes OAuth Google
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initier l'authentification Google
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirection vers Google
 *
 * /auth/google/callback:
 *   get:
 *     summary: Callback Google OAuth
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { user, accessToken, refreshToken } = req.user as any;
    console.log("🚀 ~ user:", user)
    res.redirect(`/auth-success?access_token=${accessToken}&refresh_token=${refreshToken}`);
  }
);

// Routes OAuth GitHub
/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initier l'authentification GitHub
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirection vers GitHub
 *
 * /auth/github/callback:
 *   get:
 *     summary: Callback GitHub OAuth
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const { user, accessToken, refreshToken } = req.user as any;
    console.log("🚀 ~ user:", user)
    res.redirect(`/auth-success?access_token=${accessToken}&refresh_token=${refreshToken}`);
  }
);

// Routes 2FA
/**
 * @swagger
 * /auth/2fa/generate:
 *   post:
 *     summary: Générer un secret 2FA
 *     tags: [Two-Factor]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Secret 2FA généré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TwoFactorResponse'
 *
 * /auth/2fa/verify:
 *   post:
 *     summary: Vérifier un code 2FA
 *     tags: [Two-Factor]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Code vérifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 * /auth/2fa/disable:
 *   post:
 *     summary: Désactiver 2FA
 *     tags: [Two-Factor]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA désactivé
 */
router.get('/2fa/generate',
  authenticateJwt,
  TwoFactorController.generate
);

router.post('/2fa/verify',
  authenticateJwt,
  TwoFactorController.verify
);

router.post('/2fa/enable',
  authenticateJwt,
  TwoFactorController.enable
);

router.post('/2fa/disable',
  authenticateJwt,
  TwoFactorController.disable
);


export default router;