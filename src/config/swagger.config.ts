import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: `
        API complète de gestion d'authentification et d'autorisation.

        Cette API permet de :
        - Gérer l'authentification des utilisateurs (inscription, connexion, déconnexion)
        - Implémenter l'authentification à double facteur (2FA)
        - Gérer l'authentification via des providers externes (Google, GitHub)
        - Gérer les rôles et les permissions des utilisateurs
        - Gérer les sessions et les tokens JWT
      `,
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@yourdomain.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre JWT token dans le format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique de l\'utilisateur',
              example: 'clh12345-1234-5678-1234-567812345678'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur',
              example: 'john.doe@example.com'
            },
            firstName: {
              type: 'string',
              nullable: true,
              description: 'Prénom de l\'utilisateur',
              example: 'John'
            },
            lastName: {
              type: 'string',
              nullable: true,
              description: 'Nom de l\'utilisateur',
              example: 'Doe'
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Indique si l\'email a été vérifié',
              example: true
            },
            isActive: {
              type: 'boolean',
              description: 'Indique si le compte est actif',
              example: true
            },
            isTwoFactorEnabled: {
              type: 'boolean',
              description: 'Indique si l\'authentification à double facteur est activée',
              example: false
            },
            provider: {
              type: 'string',
              enum: ['local', 'google', 'github'],
              nullable: true,
              description: 'Méthode d\'authentification utilisée',
              example: 'local'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte',
              example: '2024-01-01T12:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification',
              example: '2024-01-01T12:00:00Z'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique du rôle',
              example: 'clh12345-1234-5678-1234-567812345678'
            },
            name: {
              type: 'string',
              description: 'Nom du rôle',
              example: 'ADMIN'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Description du rôle',
              example: 'Administrateur système avec accès complet'
            },
            permissions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Permission'
              },
              description: 'Liste des permissions associées au rôle'
            }
          }
        },
        Permission: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique de la permission',
              example: 'clh12345-1234-5678-1234-567812345678'
            },
            name: {
              type: 'string',
              description: 'Nom de la permission',
              example: 'CREATE_USER'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Description de la permission',
              example: 'Permet de créer de nouveaux utilisateurs'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: {
              type: 'string',
              description: 'JWT token d\'accès',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            refreshToken: {
              type: 'string',
              description: 'Token de rafraîchissement',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        TwoFactorResponse: {
          type: 'object',
          properties: {
            secret: {
              type: 'string',
              description: 'Secret TOTP pour l\'authentification à double facteur',
              example: 'JBSWY3DPEHPK3PXP'
            },
            qrCode: {
              type: 'string',
              description: 'QR Code en base64 pour configurer l\'application d\'authentification',
              example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur',
              example: 'Invalid credentials'
            },
            code: {
              type: 'string',
              description: 'Code d\'erreur',
              example: 'AUTH_001'
            },
            details: {
              type: 'object',
              description: 'Détails additionnels sur l\'erreur',
              example: {
                field: 'email',
                issue: 'already_exists'
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Accès non autorisé - Token manquant ou invalide',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Unauthorized access',
                code: 'AUTH_001',
                details: {
                  reason: 'invalid_token'
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Accès interdit - Permissions insuffisantes',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Insufficient permissions',
                code: 'AUTH_002',
                details: {
                  required: ['CREATE_USER'],
                  provided: []
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints liés à l\'authentification des utilisateurs'
      },
      {
        name: 'Two-Factor',
        description: 'Endpoints pour la gestion de l\'authentification à double facteur'
      },
      {
        name: 'OAuth',
        description: 'Endpoints pour l\'authentification via des providers externes'
      },
      {
        name: 'Roles',
        description: 'Endpoints pour la gestion des rôles'
      },
      {
        name: 'Permissions',
        description: 'Endpoints pour la gestion des permissions'
      },
      {
        name: 'Users',
        description: 'Endpoints pour la gestion des utilisateurs'
      }
    ]
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);