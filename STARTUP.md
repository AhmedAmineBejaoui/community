# 🚀 Instructions de Démarrage - Neighborhood Community Hub

## Prérequis

- **Node.js** 20.x ou supérieur
- **pnpm** 9.x ou supérieur
- **Docker** et **Docker Compose** (pour les services)
- **Git**

## 🏗️ Installation et Configuration

### 1. Cloner et Installer

```bash
# Cloner le repository
git clone <repository-url>
cd neighborhood-hub

# Installer les dépendances
pnpm install
```

### 2. Configuration de l'Environnement

```bash
# Copier le fichier d'environnement
cp env.example .env.local

# Éditer .env.local avec vos valeurs
# Voir env.example pour les variables requises
```

### 3. Démarrer les Services

```bash
# Démarrer MongoDB, Redis, MinIO et n8n
docker-compose up -d

# Vérifier que tous les services sont démarrés
docker-compose ps
```

### 4. Configuration de la Base de Données

```bash
# Générer le client Prisma
pnpm db:generate

# Pousser le schéma vers MongoDB
pnpm db:push

# Optionnel: Seeder avec des données de test
pnpm db:seed
```

### 5. Démarrer l'Application

```bash
# Démarrer tous les services en mode développement
pnpm dev
```

## 🌐 Accès aux Services

- **Application Web**: http://localhost:3000
- **API Express**: http://localhost:4000
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379
- **MinIO Console**: http://localhost:9001 (admin/admin)
- **n8n**: http://localhost:5678 (admin/admin)

## 📱 Fonctionnalités Disponibles

### Pages Principales
- **Accueil**: `/` - Page de bienvenue et navigation
- **Connexion**: `/login` - Authentification utilisateur
- **Rejoindre**: `/join` - Rejoindre une communauté par code d'invitation
- **Communauté**: `/c/[slug]` - Dashboard de la communauté
- **Annonces**: `/c/[slug]/annonces` - Tous les posts de la communauté
- **Créer Post**: `/c/[slug]/create` - Créer un nouveau post
- **Services**: `/services` - Demandes et offres de services
- **Marché**: `/market` - Acheter/vendre des objets
- **Sondages**: `/polls` - Voter sur des décisions communautaires
- **Admin**: `/admin` - Gestion des communautés et utilisateurs

### Types de Posts
- **📢 Annonces**: Informations importantes pour la communauté
- **🤝 Services**: Demander ou offrir de l'aide
- **🏷️ Listings**: Vendre ou donner des objets
- **📊 Sondages**: Prendre des décisions communautaires

## 🔧 Configuration Avancée

### Variables d'Environnement Importantes

```bash
# Authentification
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Base de données
MONGO_URI=mongodb://localhost:27017/neighborhood

# Cache et Sessions
REDIS_URL=redis://localhost:6379

# Stockage
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=neighborhood
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# IA et n8n
N8N_BASE_URL=http://localhost:5678
OPENAI_API_KEY=your-openai-key
```

### Scripts Disponibles

```bash
# Développement
pnpm dev              # Démarrer tous les services
pnpm build            # Construire tous les packages
pnpm lint             # Vérifier le code
pnpm typecheck        # Vérifier les types TypeScript

# Base de données
pnpm db:generate      # Générer le client Prisma
pnpm db:push          # Pousser le schéma
pnpm db:seed          # Seeder avec des données de test

# Nettoyage
pnpm clean            # Nettoyer les builds
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests d'intégration
pnpm test:integration

# Tests E2E
pnpm test:e2e

# Vérification des types
pnpm typecheck
```

## 🚀 Déploiement

### Production

```bash
# Construire pour la production
pnpm build

# Démarrer en production
pnpm start
```

### Docker

```bash
# Construire les images
docker-compose -f docker-compose.prod.yml build

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d
```

## 🆘 Dépannage

### Problèmes Courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :4000
   ```

2. **MongoDB ne démarre pas**
   ```bash
   # Vérifier les logs
   docker-compose logs mongodb
   
   # Redémarrer le service
   docker-compose restart mongodb
   ```

3. **Erreurs Prisma**
   ```bash
   # Régénérer le client
   pnpm db:generate
   
   # Vérifier la connexion MongoDB
   pnpm db:push
   ```

### Logs et Debug

```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f api
docker-compose logs -f web

# Redémarrer tous les services
docker-compose restart
```

## 📚 Ressources

- **Documentation Prisma**: https://www.prisma.io/docs
- **Next.js 14**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **n8n**: https://docs.n8n.io

## 🤝 Support

Pour toute question ou problème :
1. Vérifier les logs Docker
2. Consulter la documentation
3. Créer une issue sur le repository

---

**🎉 Votre Neighborhood Community Hub est maintenant prêt !**
