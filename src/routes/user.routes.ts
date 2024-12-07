import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { authenticateJwt } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/permission.middleware';
import {
  updateProfileSchema,
  changePasswordSchema,
  passwordResetSchema
} from '@/validation/schemas';
import { validate } from '@/middlewares/validation.middleware';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put('/profile', authenticateJwt, validate(updateProfileSchema), UserController.updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Changer le mot de passe
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe changé
 */
router.post('/change-password', authenticateJwt, validate(changePasswordSchema), UserController.changePassword);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Demander réinitialisation du mot de passe
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Instructions envoyées par email
 */
router.post('/forgot-password', UserController.forgotPassword);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 */
router.post('/reset-password', validate(passwordResetSchema), UserController.resetPassword);

/**
 * @swagger
 * /users/{id}/status:
 *   put:
 *     summary: Activer/désactiver un compte
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Statut du compte mis à jour
 */
router.put('/:id/status',
  authenticateJwt,
  hasPermission('MANAGE_USERS'),
  UserController.toggleAccountStatus
);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Supprimer son compte (soft delete)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé
 */
router.delete('/delete', authenticateJwt, UserController.softDeleteAccount);

export default router;