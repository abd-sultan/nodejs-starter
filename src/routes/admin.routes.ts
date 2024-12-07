import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { PermissionController } from '@/controllers/permission.controller';
import { authenticateJwt } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/permission.middleware';
import { roleSchema, permissionSchema } from '@/validation/schemas';
import { validate } from '@/middlewares/validation.middleware';

const router = Router();

// Routes pour les rôles
/**
 * @swagger
 * /admin/roles:
 *   post:
 *     summary: Créer un nouveau rôle
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "MANAGER"
 *             description: "Role pour les managers"
 *     responses:
 *       201:
 *         description: Rôle créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *
 *   get:
 *     summary: Liste des rôles
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *
 * /admin/roles/{id}:
 *   put:
 *     summary: Modifier un rôle
 *     tags: [Roles]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rôle modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *
 *   delete:
 *     summary: Supprimer un rôle
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Rôle supprimé
 *
 * /admin/roles/{id}/permissions:
 *   post:
 *     summary: Ajouter des permissions à un rôle
 *     tags: [Roles]
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
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions ajoutées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *
 *   delete:
 *     summary: Retirer des permissions d'un rôle
 *     tags: [Roles]
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
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       204:
 *         description: Permissions retirées
 */
router.post('/roles',
  authenticateJwt,
  hasPermission('CREATE_ROLE'),
  validate(roleSchema),
  RoleController.createRole
);

router.put('/roles/:id',
  authenticateJwt,
  hasPermission('UPDATE_ROLE'),
  RoleController.updateRole
);

router.delete('/roles/:id',
  authenticateJwt,
  hasPermission('DELETE_ROLE'),
  RoleController.deleteRole
);

router.post('/roles/:id/permissions',
  authenticateJwt,
  hasPermission('MANAGE_ROLE_PERMISSIONS'),
  validate(permissionSchema),
  RoleController.addPermissions
);

router.delete('/roles/:id/permissions',
  authenticateJwt,
  hasPermission('MANAGE_ROLE_PERMISSIONS'),
  RoleController.removePermissions
);

// Routes pour les permissions
/**
 * @swagger
 * /admin/permissions:
 *   post:
 *     summary: Créer une permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "CREATE_USER"
 *             description: "Permet de créer des utilisateurs"
 *     responses:
 *       201:
 *         description: Permission créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *
 *   get:
 *     summary: Liste des permissions
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *
 * /admin/permissions/{id}:
 *   get:
 *     summary: Détails d'une permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *
 *   put:
 *     summary: Modifier une permission
 *     tags: [Permissions]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission modifiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *
 *   delete:
 *     summary: Supprimer une permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Permission supprimée
 */
router.post('/permissions',
  authenticateJwt,
  hasPermission('CREATE_PERMISSION'),
  PermissionController.createPermission
);

router.put('/permissions/:id',
  authenticateJwt,
  hasPermission('UPDATE_PERMISSION'),
  PermissionController.updatePermission
);

router.delete('/permissions/:id',
  authenticateJwt,
  hasPermission('DELETE_PERMISSION'),
  PermissionController.deletePermission
);

export default router;