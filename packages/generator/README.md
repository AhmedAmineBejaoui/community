Neighborhood Hub CRUD Generator

Usage
- Define your entity in a small JSON config, for example: configs/task.json

{
  "name": "Task",
  "plural": "tasks",
  "fields": [
    { "name": "title", "type": "string", "required": true },
    { "name": "description", "type": "string" },
    { "name": "status", "type": "enum", "enum": ["TODO","DOING","DONE"], "required": true }
  ]
}

Run
- pnpm gen crud --config configs/task.json

What it generates
- Prisma model (apps/api/prisma/schema.prisma)
- Next.js API routes: apps/web/src/app/api/<plural>/route.ts and /[id]/route.ts
- Zod schemas for validation colocated with routes
- Frontend pages: list, create, detail/edit under apps/web/src/app/<plural>
- Basic React Query hooks usage in pages

After generation
- Stop dev servers, then run: pnpm --filter @neighborhood-hub/api db:push && pnpm --filter @neighborhood-hub/api db:generate
- Restart pnpm dev

Notes
- This generator is dependency-free and template-based. Adjust templates in the source as needed.

