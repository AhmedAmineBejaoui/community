# 🚀 Neighborhood Community Hub - Run Instructions

## Prerequisites

- **Node.js**: 20.x (use `.nvmrc` file)
- **pnpm**: 9.x
- **Docker & Docker Compose**: For local development
- **MongoDB**: Local or Atlas cluster
- **Redis**: Local or Upstash

## 🏗️ Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd neighborhood-hub

# Install dependencies
pnpm install

# Copy environment template
cp env.example .env.local
```

### 2. Environment Configuration

Edit `.env.local` with your configuration:

```bash
# Required for development
NEXTAUTH_SECRET=your-secret-here
MONGO_URI=mongodb://localhost:27017/neighborhood?replicaSet=rs0
REDIS_URL=redis://localhost:6379

# Optional (for full functionality)
RESEND_API_KEY=your-resend-key
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=neighborhood
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
N8N_BASE_URL=http://localhost:5678
N8N_SIGNING_SECRET=your-n8n-secret
OPENAI_API_KEY=your-openai-key
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed with sample data
pnpm db:seed
```

### 4. Development Mode

#### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option B: Local Development

```bash
# Terminal 1: Start API
cd apps/api
pnpm dev

# Terminal 2: Start Web
cd apps/web
pnpm dev

# Terminal 3: Start MongoDB & Redis (if not using Docker)
# Use your preferred method

# For MongoDB, ensure it's a replica set (required by Prisma):
# Start mongod with --replSet rs0, then in mongosh run:
# rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] })
```

### 5. Access Applications

- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **API Health**: http://localhost:4000/healthz
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **n8n**: http://localhost:5678

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific app tests
cd apps/api && pnpm test
cd apps/web && pnpm test
```

## 🔧 Build & Deploy

```bash
# Build all packages
pnpm build

# Type check
pnpm typecheck

# Lint code
pnpm lint
```

## 📱 API Endpoints

### Public Endpoints
- `GET /healthz` - Health check
- `GET /api/v1/communities/:slug` - Get community by slug
- `GET /api/v1/posts` - Get posts (with optional auth)

### Protected Endpoints (require JWT)
- `POST /api/v1/posts` - Create post
- `PATCH /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post
- `POST /api/v1/chat/sessions` - Create chat session
- `POST /api/v1/chat/messages` - Send chat message
- `POST /api/v1/uploads/sign` - Get S3 presigned URL

## 🤖 n8n Integration

1. **Import Workflow**: Use `n8n-workflow.json`
2. **Set Environment Variables**:
   - `N8N_SIGNING_SECRET`
   - `API_BASE_URL` (your API URL)
   - OpenAI API credentials
3. **Activate Workflow**: The webhook will be available at `/webhook/chat`

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 4000, 27017, 6379, 9000, 5678 are available
2. **MongoDB Connection**: Check if MongoDB is running and accessible
3. **Redis Connection**: Verify Redis server is running
4. **Prisma Errors**: Run `pnpm db:generate` and `pnpm db:push`

### Logs

```bash
# API logs
docker-compose logs api

# Web logs
docker-compose logs web

# Database logs
docker-compose logs mongodb
```

## 🚀 Production Deployment

### Vercel (Web App)
1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically on push to main

### Render/Fly.io (API)
1. Use the provided Dockerfile
2. Set environment variables
3. Deploy with health check endpoint

### Environment Variables for Production
```bash
NODE_ENV=production
NEXTAUTH_SECRET=<strong-secret>
MONGO_URI=<mongodb-atlas-uri>
REDIS_URL=<upstash-redis-url>
S3_ENDPOINT=<s3-endpoint>
S3_BUCKET=<bucket-name>
S3_ACCESS_KEY=<access-key>
S3_SECRET_KEY=<secret-key>
N8N_BASE_URL=<n8n-url>
N8N_SIGNING_SECRET=<n8n-secret>
```

## 📚 Next Steps

1. **Authentication**: Implement NextAuth.js providers
2. **UI Components**: Build the shared UI package
3. **Real-time**: Add WebSocket support for live updates
4. **Testing**: Add comprehensive test coverage
5. **CI/CD**: Set up GitHub Actions for automated deployment

## 🆘 Support

- Check the logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure all required services are running
- Check the API health endpoint for service status

---

**Happy coding! 🎉**
