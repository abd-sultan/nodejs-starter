# Node.js Authentication Starter

[English](#english) | [Français](#français)

# English

## Overview

A complete authentication and authorization starter for Node.js applications using Express, Prisma, and TypeScript. Features include local and OAuth authentication, 2FA, role-based access control, and comprehensive API documentation.

## Features

- Authentication
  - Email/Phone registration with OTP verification
  - Local login with email/phone
  - OAuth (Google, GitHub)
  - Two-factor authentication
  - JWT with refresh tokens
  - Password reset
- Authorization
  - Role-based access control
  - Permission-based access control
  - Account activation/deactivation
  - Soft delete
- Documentation
  - OpenAPI/Swagger documentation
  - Comprehensive test suite

## Prerequisites

- Node.js >= 16
- PostgreSQL
- Redis (optional, for rate limiting)

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/nodejs-auth-starter.git
cd nodejs-auth-starter

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run db:seed
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/auth_starter?schema=public"
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Generate API documentation
npm run docs
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Test Accounts

After seeding the database, you can use these accounts:

```
Admin:
- Email: admin@example.com
- Password: Admin123!@#

User:
- Email: user1@example.com
- Password: Test123!@#
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Custom middlewares
├── models/         # Prisma models
├── routes/         # API routes
├── services/       # Business logic
├── tests/          # Test files
├── types/          # TypeScript types
├── utils/          # Utility functions
└── validation/     # Request validation schemas
```

## Running in Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

---

# Français

## Aperçu

Un starter d'authentification et d'autorisation complet pour les applications Node.js utilisant Express, Prisma et TypeScript. Les fonctionnalités incluent l'authentification locale et OAuth, la 2FA, le contrôle d'accès basé sur les rôles et une documentation API complète.

## Fonctionnalités

- Authentification
  - Inscription par email/téléphone avec vérification OTP
  - Connexion locale avec email/téléphone
  - OAuth (Google, GitHub)
  - Authentification à deux facteurs
  - JWT avec tokens de rafraîchissement
  - Réinitialisation du mot de passe
- Autorisation
  - Contrôle d'accès basé sur les rôles
  - Contrôle d'accès basé sur les permissions
  - Activation/désactivation de compte
  - Suppression douce
- Documentation
  - Documentation OpenAPI/Swagger
  - Suite de tests complète

## Prérequis

- Node.js >= 16
- PostgreSQL
- Redis (optionnel, pour la limitation de taux)

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/yourusername/nodejs-auth-starter.git
cd nodejs-auth-starter

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Peupler la base de données
npm run db:seed
```

## Variables d'Environnement

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/auth_starter?schema=public"
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Exécuter les tests
npm test

# Exécuter les tests avec couverture
npm run test:coverage

# Générer la documentation API
npm run docs
```

## Documentation API

Une fois le serveur démarré, accédez à la documentation Swagger à :

```
http://localhost:3000/api-docs
```

## Comptes de Test

Après avoir peuplé la base de données, vous pouvez utiliser ces comptes :

```
Admin :
- Email : admin@example.com
- Mot de passe : Admin123!@#

Utilisateur :
- Email : user1@example.com
- Mot de passe : Test123!@#
```

## Structure du Projet

```
src/
├── config/         # Fichiers de configuration
├── controllers/    # Gestionnaires de requêtes
├── middlewares/    # Middlewares personnalisés
├── models/         # Modèles Prisma
├── routes/         # Routes API
├── services/       # Logique métier
├── tests/          # Fichiers de test
├── types/          # Types TypeScript
├── utils/          # Fonctions utilitaires
└── validation/     # Schémas de validation des requêtes
```

## Exécution en Production

```bash
# Construire le projet
npm run build

# Démarrer le serveur de production
npm start
```
