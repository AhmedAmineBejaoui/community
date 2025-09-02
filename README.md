# Neighborhood Community Hub

A modern neighborhood community platform built with a modular monolith architecture, featuring Next.js BFF, Express API, MongoDB, and AI-powered chatbot integration.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router (BFF pattern)
- **Backend**: Express.js API with Clean/Hexagonal Architecture
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **AI Chat**: n8n workflow with OpenAI integration
- **Storage**: S3-compatible object storage
- **Cache**: Redis for sessions and rate limiting

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x
- pnpm 9.x
- MongoDB (local or Atlas)
- Redis (local or Upstash)

Note: Prisma requires MongoDB to run as a replica set for any operation that uses transactions. The provided Docker setup starts MongoDB as a single-node replica set. If you run MongoDB yourself, enable a replica set (e.g., rs0) and use a URI with `?replicaSet=rs0`.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd neighborhood-hub

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development servers
pnpm dev
```

### Development

```bash
# Start all services
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## 📁 Project Structure

```
/apps
  /web            # Next.js BFF application
  /api            # Express API with Clean Architecture
/packages
  /types          # Shared Zod schemas and types
  /configs        # Shared configurations (ESLint, Prettier, TypeScript)
  /ui             # Shared UI components
```

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

## 🧪 Testing

- **Unit Tests**: Jest for business logic
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for full user flows

## 🚀 Deployment

- **Web App**: Vercel
- **API**: Render or Fly.io
- **Database**: MongoDB Atlas
- **Storage**: S3 or Backblaze B2

## 📚 Documentation

- [API Documentation](./apps/api/README.md)
- [Web App Guide](./apps/web/README.md)
- [Architecture Overview](./docs/architecture.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
# Neigberhood
