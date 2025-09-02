@echo off
echo Starting Neighborhood Community Hub...

echo.
echo 1. Starting Docker services...
docker-compose up -d

echo.
echo 2. Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo 3. Generating Prisma client...
pnpm db:generate

echo.
echo 4. Pushing database schema...
pnpm db:push

echo.
echo 5. Starting development servers...
pnpm dev

pause
