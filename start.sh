#!/bin/bash

echo "Starting Neighborhood Community Hub..."

echo
echo "1. Starting Docker services..."
docker-compose up -d

echo
echo "2. Waiting for services to be ready..."
sleep 10

echo
echo "3. Generating Prisma client..."
pnpm db:generate

echo
echo "4. Pushing database schema..."
pnpm db:push

echo
echo "5. Starting development servers..."
pnpm dev
