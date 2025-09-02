# 📚 Documentation Technique - Neighborhood Community Hub

## 📋 Table des matières

1. [Présentation générale](#présentation-générale)
2. [Architecture du système](#architecture-du-système)
3. [Structure du code](#structure-du-code)
4. [API & intégrations](#api--intégrations)
5. [Base de données & modèle de données](#base-de-données--modèle-de-données)
6. [Sécurité et performances](#sécurité-et-performances)
7. [Déploiement & infrastructure](#déploiement--infrastructure)
8. [Tests et qualité logicielle](#tests-et-qualité-logicielle)
9. [Maintenance & évolutivité](#maintenance--évolutivité)
10. [Annexes](#annexes)

---

## 🎯 Présentation générale

### Nom du projet
**Neighborhood Community Hub** - Plateforme communautaire de quartier moderne

### Objectifs principaux
- Créer une plateforme communautaire pour connecter les voisins
- Faciliter le partage d'informations locales et la coordination d'événements
- Intégrer un assistant IA pour répondre aux questions de la communauté
- Fournir une architecture modulaire et évolutive
- Offrir une expérience utilisateur moderne et responsive

### Problèmes résolus / Valeur ajoutée
- **Isolement social** : Connecte les voisins et favorise les interactions locales
- **Communication fragmentée** : Centralise les informations communautaires
- **Coordination complexe** : Simplifie l'organisation d'événements et de services
- **Support automatisé** : Assistant IA disponible 24/7 pour les questions courantes
- **Architecture robuste** : Solution scalable et maintenable pour les communautés

---

## 🏗️ Architecture du système

### Schéma global

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   données       │
│   BFF Pattern   │    │   Clean Arch    │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cache         │    │   Stockage      │    │   IA Chatbot    │
│   (Redis)       │    │   (S3/MinIO)    │    │   (n8n + OpenAI)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Description des composants et de leurs interactions

#### Frontend (Next.js BFF)
- **Rôle** : Interface utilisateur et Backend for Frontend
- **Responsabilités** : Rendu des pages, gestion d'état, authentification
- **Communication** : API REST vers le backend Express

#### Backend (Express API)
- **Rôle** : API REST avec architecture Clean/Hexagonale
- **Responsabilités** : Logique métier, gestion des données, intégrations
- **Communication** : Base de données MongoDB, cache Redis, services externes

#### Base de données (MongoDB)
- **Rôle** : Stockage persistant des données
- **Responsabilités** : Utilisateurs, communautés, posts, sessions de chat
- **Communication** : Via Prisma ORM

#### Cache (Redis)
- **Rôle** : Stockage temporaire et rate limiting
- **Responsabilités** : Sessions, cache des requêtes, limitation de débit
- **Communication** : Via client Redis

#### Stockage (S3/MinIO)
- **Rôle** : Stockage des fichiers et médias
- **Responsabilités** : Images, documents, uploads utilisateur
- **Communication** : Via AWS SDK avec URLs présignées

#### IA Chatbot (n8n + OpenAI)
- **Rôle** : Assistant communautaire intelligent
- **Responsabilités** : Réponses automatisées, support utilisateur
- **Communication** : Webhooks vers l'API, intégration OpenAI

### Technologies utilisées

#### Langages de programmation
- **TypeScript 5.2.2** : Langage principal avec typage statique
- **JavaScript** : Pour les configurations et scripts utilitaires

#### Frameworks et bibliothèques

##### Frontend
- **Next.js 14.0.3** : Framework React avec App Router
- **React 18.2.0** : Bibliothèque UI
- **Tailwind CSS 3.3.6** : Framework CSS utilitaire
- **TanStack Query 5.8.4** : Gestion d'état et cache côté client

##### Backend
- **Express.js 4.18.2** : Framework web Node.js
- **Socket.IO 4.7.4** : Communication temps réel
- **Pino 8.17.2** : Logging structuré
- **Helmet 7.1.0** : Sécurité des en-têtes HTTP

##### Base de données et ORM
- **MongoDB 7.0** : Base de données NoSQL
- **Prisma 5.7.0** : ORM moderne avec génération de client
- **MongoDB Memory Server 9.1.3** : Base de données en mémoire pour les tests

##### Cache et stockage
- **Redis 7.2** : Cache et sessions
- **MinIO** : Stockage S3-compatible (développement)
- **AWS SDK 2.1490.0** : Intégration S3

##### Authentification et sécurité
- **NextAuth.js 4.24.5** : Authentification complète
- **JWT** : Tokens d'authentification
- **bcryptjs 2.4.3** : Hachage des mots de passe
- **CORS** : Gestion des origines croisées

##### Validation et schémas
- **Zod 3.22.4** : Validation des données et génération de types
- **zod-to-openapi** : Génération automatique de documentation API

##### IA et intégrations
- **n8n** : Automatisation des workflows
- **OpenAI GPT-4o-mini** : Modèle de langage pour le chatbot

#### Outils de CI/CD et d'automatisation
- **Turborepo 1.10.16** : Gestion des monorepos
- **pnpm 9.6.0** : Gestionnaire de paquets
- **Husky 8.0.3** : Git hooks
- **Commitlint 18.4.3** : Validation des messages de commit
- **Lint-staged 15.1.0** : Linting des fichiers modifiés
- **ESLint** : Linting du code
- **Prettier** : Formatage du code

---

## 📁 Structure du code

### Organisation des dossiers et fichiers

```
neighborhood-hub/
├── 📁 apps/                          # Applications principales
│   ├── 📁 api/                       # API Express
│   │   ├── 📁 src/
│   │   │   ├── 📁 application/       # Cas d'usage
│   │   │   ├── 📁 domain/            # Entités et ports
│   │   │   ├── 📁 infrastructure/    # Implémentations concrètes
│   │   │   └── 📁 interfaces/        # Contrôleurs et middlewares
│   │   ├── 📄 Dockerfile             # Containerisation API
│   │   ├── 📄 package.json           # Dépendances API
│   │   └── 📄 tsconfig.json          # Configuration TypeScript API
│   └── 📁 web/                       # Application Next.js
│       ├── 📁 src/
│       │   ├── 📁 app/               # App Router Next.js
│       │   └── 📁 components/        # Composants React
│       ├── 📄 Dockerfile             # Containerisation Web
│       ├── 📄 package.json           # Dépendances Web
│       └── 📄 tsconfig.json          # Configuration TypeScript Web
├── 📁 packages/                       # Paquets partagés
│   ├── 📁 configs/                   # Configurations partagées
│   │   ├── 📁 eslint/                # Configuration ESLint
│   │   ├── 📁 prettier/              # Configuration Prettier
│   │   ├── 📁 prisma/                # Schéma de base de données
│   │   └── 📁 tsconfig/              # Configurations TypeScript
│   └── 📁 types/                     # Types et schémas partagés
│       ├── 📁 src/
│       │   ├── 📁 schemas/           # Schémas Zod
│       │   └── 📁 types/             # Types TypeScript
│       ├── 📄 package.json           # Dépendances types
│       └── 📄 tsconfig.json          # Configuration TypeScript types
├── 📁 .husky/                        # Git hooks
├── 📄 .editorconfig                  # Configuration éditeur
├── 📄 .gitignore                     # Fichiers ignorés Git
├── 📄 .lintstagedrc.js               # Configuration lint-staged
├── 📄 .nvmrc                         # Version Node.js
├── 📄 commitlint.config.js           # Configuration commitlint
├── 📄 docker-compose.yml             # Orchestration Docker
├── 📄 env.example                    # Variables d'environnement
├── 📄 n8n-workflow.json              # Workflow n8n
├── 📄 package.json                   # Configuration racine
├── 📄 pnpm-workspace.yaml            # Configuration workspace pnpm
├── 📄 README.md                      # Documentation utilisateur
├── 📄 RUN_INSTRUCTIONS.md            # Instructions d'exécution
├── 📄 turbo.json                     # Configuration Turborepo
└── 📄 DOCUMENTATION_TECHNIQUE.md     # Cette documentation
```

### Modules principaux et responsabilités

#### Module API (`apps/api/`)
- **Responsabilités** : Logique métier, gestion des données, intégrations
- **Architecture** : Clean Architecture avec séparation des couches
- **Technologies** : Express.js, Prisma, Redis, Socket.IO

#### Module Web (`apps/web/`)
- **Responsabilités** : Interface utilisateur, authentification, gestion d'état
- **Architecture** : Next.js App Router avec pattern BFF
- **Technologies** : React, NextAuth.js, TanStack Query, Tailwind CSS

#### Module Types (`packages/types/`)
- **Responsabilités** : Définitions de types et schémas de validation
- **Architecture** : Package partagé avec Zod et TypeScript
- **Technologies** : Zod, TypeScript

#### Module Configs (`packages/configs/`)
- **Responsabilités** : Configurations partagées (ESLint, Prettier, TypeScript)
- **Architecture** : Packages de configuration réutilisables
- **Technologies** : ESLint, Prettier, TypeScript

### Convention de nommage et bonnes pratiques

#### Fichiers et dossiers
- **kebab-case** : Pour les noms de fichiers et dossiers
- **PascalCase** : Pour les composants React et classes
- **camelCase** : Pour les variables et fonctions
- **UPPER_SNAKE_CASE** : Pour les constantes et variables d'environnement

#### Code
- **TypeScript strict** : Configuration stricte activée
- **ESLint + Prettier** : Linting et formatage automatique
- **Husky hooks** : Validation avant commit
- **Conventional Commits** : Format standardisé des messages

---

## 🔌 API & intégrations

### Endpoints disponibles

#### Endpoints publics
```
GET  /healthz                    # Vérification de santé
GET  /api/v1/communities/:slug   # Récupération d'une communauté
GET  /api/v1/posts              # Récupération des posts (avec auth optionnelle)
```

#### Endpoints protégés (requièrent JWT)
```
POST   /api/v1/posts            # Création d'un post
PATCH  /api/v1/posts/:id        # Modification d'un post
DELETE /api/v1/posts/:id        # Suppression d'un post
POST   /api/v1/chat/sessions    # Création d'une session de chat
POST   /api/v1/chat/messages    # Envoi d'un message de chat
POST   /api/v1/uploads/sign     # Obtention d'URL présignée S3
```

#### Endpoints d'intégration
```
POST /integrations/n8n/chat/callback  # Callback n8n pour le chatbot
```

### Authentification et sécurité

#### Méthodes d'authentification
- **NextAuth.js** : Gestion complète de l'authentification
- **JWT Strategy** : Tokens JSON Web pour l'API
- **Email Provider** : Authentification par email
- **Credentials Provider** : Authentification par identifiants

#### Sécurité
- **Helmet** : En-têtes de sécurité HTTP
- **CORS** : Gestion des origines croisées
- **Rate Limiting** : Limitation de débit avec Redis
- **Validation Zod** : Validation stricte des entrées
- **bcryptjs** : Hachage sécurisé des mots de passe

### Flux de données internes et externes

#### Flux interne
1. **Requête utilisateur** → Frontend Next.js
2. **Validation** → Schémas Zod
3. **Authentification** → NextAuth.js
4. **Logique métier** → Use Cases (Clean Architecture)
5. **Persistance** → Prisma ORM → MongoDB
6. **Cache** → Redis pour les sessions et requêtes fréquentes

#### Flux externe
1. **Upload de fichiers** → API → S3/MinIO
2. **Chat IA** → API → n8n → OpenAI → Callback API
3. **Email** → Resend API
4. **Stockage** → S3-compatible (MinIO dev, S3/Backblaze prod)

---

## 🗄️ Base de données & modèle de données

### Schéma relationnel (MongoDB avec Prisma)

#### Modèle User
```typescript
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  avatar    String?
  status    UserStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  memberships Membership[]
  posts      Post[]
}
```

#### Modèle Community
```typescript
model Community {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String      @unique
  description String?
  joinPolicy  JoinPolicy  @default(OPEN)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  memberships Membership[]
  posts       Post[]
}
```

#### Modèle Post
```typescript
model Post {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  content     String
  type        PostType
  communityId String   @db.ObjectId
  authorId    String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  community Community @relation(fields: [communityId], references: [id])
  author    User     @relation(fields: [authorId], references: [id])
}
```

#### Modèle Membership
```typescript
model Membership {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  communityId String   @db.ObjectId
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())
  
  // Relations
  user      User      @relation(fields: [userId], references: [id])
  community Community @relation(fields: [communityId], references: [id])
  
  @@unique([userId, communityId])
}
```

#### Modèle Chat
```typescript
model ChatSession {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  communityId String   @db.ObjectId
  createdAt   DateTime @default(now())
  
  // Relations
  messages ChatMessage[]
}

model ChatMessage {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionId String   @db.ObjectId
  content   String
  isUser    Boolean
  createdAt DateTime @default(now())
  
  // Relations
  session ChatSession @relation(fields: [sessionId], references: [id])
}
```

### Relations entre entités

- **User ↔ Community** : Relation many-to-many via Membership
- **User ↔ Post** : Relation one-to-many (un utilisateur peut créer plusieurs posts)
- **Community ↔ Post** : Relation one-to-many (une communauté peut avoir plusieurs posts)
- **User ↔ ChatSession** : Relation one-to-many (un utilisateur peut avoir plusieurs sessions)
- **ChatSession ↔ ChatMessage** : Relation one-to-many (une session peut avoir plusieurs messages)

### Exemple de requêtes

#### Récupération d'une communauté avec ses membres
```typescript
const community = await prisma.community.findUnique({
  where: { slug },
  include: {
    memberships: {
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    }
  }
});
```

#### Récupération des posts d'une communauté avec pagination
```typescript
const posts = await prisma.post.findMany({
  where: { communityId },
  include: {
    author: { select: { id: true, name: true, avatar: true } }
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit
});
```

---

## 🔒 Sécurité et performances

### Méthodes d'authentification et de chiffrement

#### Authentification
- **NextAuth.js** : Gestion centralisée des sessions
- **JWT** : Tokens signés avec secret configurable
- **bcryptjs** : Hachage des mots de passe avec salt
- **Session Redis** : Stockage sécurisé des sessions

#### Chiffrement et sécurité
- **HTTPS** : Chiffrement en transit
- **Helmet** : En-têtes de sécurité HTTP
- **CORS** : Contrôle des origines autorisées
- **Rate Limiting** : Protection contre les attaques par déni de service
- **Validation Zod** : Protection contre les injections et attaques par déni de service

### Stratégies d'optimisation

#### Cache
- **Redis** : Cache des sessions et requêtes fréquentes
- **Next.js** : Cache intégré et ISR (Incremental Static Regeneration)
- **TanStack Query** : Cache côté client avec invalidation intelligente

#### Base de données
- **Index MongoDB** : Optimisation des requêtes fréquentes
- **Prisma** : Requêtes optimisées et lazy loading
- **Connection Pooling** : Gestion efficace des connexions

#### Performance
- **Lazy Loading** : Chargement à la demande des composants
- **Code Splitting** : Division automatique du bundle
- **Image Optimization** : Optimisation automatique des images Next.js
- **CDN Ready** : Structure compatible avec les CDN

### Tests de performance / scalabilité

#### Outils de test
- **Jest** : Tests unitaires et d'intégration
- **Supertest** : Tests d'API
- **Playwright** : Tests end-to-end
- **MongoDB Memory Server** : Tests avec base de données en mémoire

#### Métriques de performance
- **Temps de réponse API** : Objectif < 200ms
- **Temps de chargement page** : Objectif < 2s
- **Throughput** : Tests de charge avec Artillery ou k6
- **Mémoire** : Surveillance de l'utilisation des ressources

---

## 🚀 Déploiement & infrastructure

### Environnements

#### Développement
- **Local** : Docker Compose avec services locaux
- **Ports** : 3000 (Web), 4000 (API), 27017 (MongoDB), 6379 (Redis)
- **Base de données** : MongoDB local
- **Cache** : Redis local
- **Stockage** : MinIO local

#### Staging
- **Hébergement** : Vercel (Web) + Render/Fly.io (API)
- **Base de données** : MongoDB Atlas (cluster de développement)
- **Cache** : Upstash Redis
- **Stockage** : S3 ou Backblaze B2

#### Production
- **Hébergement** : Vercel (Web) + Render/Fly.io (API)
- **Base de données** : MongoDB Atlas (cluster de production)
- **Cache** : Upstash Redis
- **Stockage** : S3 ou Backblaze B2
- **CDN** : Cloudflare ou Vercel Edge

### Pipeline CI/CD

#### GitHub Actions
```yaml
# Workflow principal
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test
      - run: pnpm typecheck
      - run: pnpm lint

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-docker@v3
      - run: docker build -t api ./apps/api
      - run: docker push ${{ secrets.REGISTRY }}/api
```

#### Déploiement automatique
- **Vercel** : Déploiement automatique du frontend
- **Render/Fly.io** : Déploiement automatique de l'API
- **Docker Hub** : Images containerisées
- **Health Checks** : Vérification automatique de la santé des services

### Hébergement

#### Frontend (Next.js)
- **Vercel** : Hébergement optimisé pour Next.js
- **Fonctionnalités** : Edge Functions, ISR, Analytics
- **CDN** : Réseau global de distribution de contenu

#### Backend (Express API)
- **Render** : Plateforme PaaS avec support Docker
- **Fly.io** : Plateforme globale avec edge deployment
- **Alternatives** : Railway, Heroku, DigitalOcean App Platform

#### Base de données
- **MongoDB Atlas** : Service cloud managé
- **Tiers** : M0 (gratuit), M2, M5, M10+
- **Fonctionnalités** : Backup automatique, monitoring, scaling

#### Cache et stockage
- **Upstash Redis** : Redis managé avec pay-per-use
- **S3/Backblaze B2** : Stockage objet scalable
- **MinIO** : Alternative open source pour le développement

### Procédures d'installation et d'exécution

#### Prérequis techniques
- **Node.js** : Version 20.x (spécifiée dans `.nvmrc`)
- **pnpm** : Version 9.x
- **Docker** : Version 20.10+
- **Docker Compose** : Version 2.0+

#### Étapes d'installation

##### 1. Clonage et configuration
```bash
git clone <repository-url>
cd neighborhood-hub
pnpm install
cp env.example .env.local
```

##### 2. Configuration des variables d'environnement
```bash
# Éditer .env.local avec vos configurations
NEXTAUTH_SECRET=your-secret-here
MONGO_URI=mongodb://localhost:27017/neighborhood
REDIS_URL=redis://localhost:6379
```

##### 3. Génération du client Prisma
```bash
pnpm db:generate
pnpm db:push
```

#### Lancement en local et en production

##### Développement local
```bash
# Option A: Docker Compose (recommandé)
docker-compose up -d

# Option B: Services locaux
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

##### Production
```bash
# Build des applications
pnpm build

# Déploiement via CI/CD
git push origin main
```

---

## 🧪 Tests et qualité logicielle

### Stratégie de tests

#### Tests unitaires
- **Framework** : Jest avec TypeScript
- **Couverture** : Logique métier, utilitaires, helpers
- **Objectif** : Couverture > 80%
- **Exécution** : `pnpm test`

#### Tests d'intégration
- **Framework** : Jest + Supertest
- **Couverture** : Endpoints API, intégrations base de données
- **Base de données** : MongoDB Memory Server
- **Exécution** : `pnpm test:integration`

#### Tests end-to-end
- **Framework** : Playwright
- **Couverture** : Flux utilisateur complets
- **Environnement** : Base de données de test
- **Exécution** : `pnpm test:e2e`

### Outils et frameworks utilisés

#### Tests
- **Jest** : Framework de test principal
- **Supertest** : Tests d'API HTTP
- **MongoDB Memory Server** : Base de données en mémoire
- **ts-jest** : Support TypeScript pour Jest
- **Playwright** : Tests de navigateur

#### Qualité du code
- **ESLint** : Linting et détection d'erreurs
- **Prettier** : Formatage automatique du code
- **Husky** : Git hooks pour la qualité
- **Commitlint** : Validation des messages de commit
- **Lint-staged** : Linting des fichiers modifiés

### Couverture des tests

#### Métriques cibles
- **Tests unitaires** : > 80%
- **Tests d'intégration** : > 70%
- **Tests E2E** : > 60%
- **Couverture globale** : > 75%

#### Rapport de couverture
```bash
pnpm test:coverage
# Génère un rapport HTML dans coverage/
```

---

## 🔧 Maintenance & évolutivité

### Plan de mise à jour

#### Mises à jour de sécurité
- **Dépendances** : Mise à jour mensuelle des packages
- **Vulnérabilités** : Correction immédiate des CVE
- **Monitoring** : Dependabot et Snyk

#### Mises à jour fonctionnelles
- **Versions mineures** : Mise à jour trimestrielle
- **Versions majeures** : Évaluation et migration planifiée
- **Breaking changes** : Communication et documentation

#### Mises à jour d'infrastructure
- **Node.js** : Suivi des versions LTS
- **Docker** : Mise à jour des images de base
- **Services cloud** : Suivi des nouvelles fonctionnalités

### Documentation du code

#### Standards de documentation
- **JSDoc** : Documentation des fonctions et classes
- **README** : Documentation des packages
- **Architecture Decision Records (ADR)** : Décisions architecturales
- **API Documentation** : OpenAPI/Swagger généré automatiquement

#### Exemple JSDoc
```typescript
/**
 * Crée un nouveau post dans une communauté
 * @param data - Données du post à créer
 * @param userId - ID de l'utilisateur créateur
 * @returns Promise<Post> - Le post créé
 * @throws {ValidationError} Si les données sont invalides
 * @throws {AuthorizationError} Si l'utilisateur n'est pas membre
 */
async createPost(data: CreatePostData, userId: string): Promise<Post> {
  // Implémentation...
}
```

### Bonnes pratiques pour contribuer

#### Workflow Git
1. **Fork** du repository principal
2. **Feature branch** : `feat/feature-name`
3. **Commit conventionnel** : `feat(api): add user authentication`
4. **Pull Request** avec description détaillée
5. **Code Review** obligatoire
6. **Tests** : Tous les tests doivent passer
7. **Merge** après approbation

#### Standards de code
- **TypeScript strict** : Configuration stricte activée
- **ESLint** : Respect des règles de linting
- **Prettier** : Formatage automatique
- **Tests** : Nouveaux tests pour nouvelles fonctionnalités
- **Documentation** : Mise à jour de la documentation

#### Revue de code
- **Checklist** : Respect des standards, tests, documentation
- **Automation** : CI/CD avec vérifications automatiques
- **Peer Review** : Revue par au moins un autre développeur
- **Feedback** : Commentaires constructifs et suggestions

---

## 📚 Annexes

### Glossaire technique

#### Architecture
- **BFF (Backend for Frontend)** : Pattern où le backend est optimisé pour un frontend spécifique
- **Clean Architecture** : Architecture en couches avec séparation des responsabilités
- **Hexagonal Architecture** : Architecture avec ports et adaptateurs
- **Modular Monolith** : Monolithe divisé en modules logiques

#### Technologies
- **Prisma** : ORM moderne avec génération de client TypeScript
- **Zod** : Bibliothèque de validation de schémas
- **Turborepo** : Outil de gestion de monorepos
- **pnpm** : Gestionnaire de paquets rapide et efficace

#### DevOps
- **CI/CD** : Intégration et déploiement continus
- **Docker** : Containerisation d'applications
- **Kubernetes** : Orchestration de conteneurs
- **Helm** : Gestionnaire de packages Kubernetes

### Références externes et bibliographie

#### Documentation officielle
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)

#### Standards et bonnes pratiques
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [REST API Design Guidelines](https://restfulapi.net/)

#### Outils et frameworks
- [Turborepo](https://turborepo.org/)
- [pnpm](https://pnpm.io/)
- [Zod](https://zod.dev/)
- [n8n](https://n8n.io/)

### Exemples d'utilisation / cas pratiques

#### Création d'une communauté
```typescript
// 1. Validation des données d'entrée
const communityData = createCommunitySchema.parse({
  name: "Quartier Saint-Michel",
  description: "Communauté du quartier historique",
  joinPolicy: "OPEN"
});

// 2. Création de la communauté
const community = await createCommunityUseCase.execute(communityData);

// 3. Ajout du créateur comme admin
await addMemberUseCase.execute({
  userId: currentUser.id,
  communityId: community.id,
  role: "ADMIN"
});
```

#### Intégration du chatbot
```typescript
// 1. Création d'une session de chat
const session = await createChatSession({
  userId: user.id,
  communityId: community.id
});

// 2. Envoi du message à n8n
const response = await fetch(`${N8N_BASE_URL}/webhook/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-N8N-Signature': generateSignature(payload, secret)
  },
  body: JSON.stringify({
    sessionId: session.id,
    content: userMessage,
    communityId: community.id,
    userId: user.id
  })
});

// 3. Traitement de la réponse
const aiResponse = await response.json();
```

#### Upload de fichiers
```typescript
// 1. Génération d'URL présignée
const presignedUrl = await generatePresignedUrl({
  bucket: S3_BUCKET,
  key: `uploads/${userId}/${filename}`,
  contentType: file.type,
  expiresIn: 3600 // 1 heure
});

// 2. Upload direct vers S3
await fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type
  }
});

// 3. Enregistrement en base
await saveFileRecord({
  userId,
  filename,
  s3Key: `uploads/${userId}/${filename}`,
  size: file.size,
  type: file.type
});
```

---

## 📝 Conclusion

Le projet **Neighborhood Community Hub** représente une solution moderne et évolutive pour la création de plateformes communautaires. L'architecture modulaire, les technologies de pointe et les bonnes pratiques de développement garantissent un code maintenable, scalable et sécurisé.

### Points forts du projet
- **Architecture robuste** : Clean Architecture avec séparation claire des responsabilités
- **Technologies modernes** : Next.js 14, Express.js, MongoDB, Prisma
- **Sécurité intégrée** : Authentification NextAuth.js, validation Zod, rate limiting
- **Scalabilité** : Architecture monorepo avec Turborepo, containerisation Docker
- **Qualité du code** : Tests automatisés, linting, formatage, hooks Git

### Évolutions futures
- **Microservices** : Migration progressive vers une architecture microservices
- **Kubernetes** : Orchestration avancée des conteneurs
- **GraphQL** : API plus flexible et performante
- **Real-time** : WebSockets et notifications push
- **Mobile** : Application mobile native ou PWA

### Recommandations
- **Documentation continue** : Maintenir la documentation à jour
- **Tests automatisés** : Augmenter la couverture de tests
- **Monitoring** : Implémenter des métriques et alertes
- **Sécurité** : Audits de sécurité réguliers
- **Performance** : Optimisation continue et tests de charge

---

**Documentation générée le :** $(date)  
**Version du projet :** 1.0.0  
**Dernière mise à jour :** $(date)  
**Maintenu par :** Équipe de développement Neighborhood Hub
