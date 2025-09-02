#!/usr/bin/env node
/*
 Minimal CRUD generator for Neighborhood Hub
 Generates:
  - Prisma model in apps/api/prisma/schema.prisma
  - API routes in apps/web/src/app/api/<plural>/
  - Pages in apps/web/src/app/<plural>/
*/

const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function fileExists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function toPascal(s) {
  return s.replace(/(^|_|-|\s)+(\w)/g, (_, __, c) => c.toUpperCase());
}

function toCamel(s) {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function prismaType(t) {
  switch (t) {
    case 'string': return 'String';
    case 'int': return 'Int';
    case 'float': return 'Float';
    case 'boolean': return 'Boolean';
    case 'date': return 'DateTime';
    case 'json': return 'Json';
    default: return 'String';
  }
}

function zodType(f) {
  const r = f.required === true;
  switch (f.type) {
    case 'string': return r ? 'z.string().min(1)' : 'z.string().optional()';
    case 'int': return r ? 'z.number().int()' : 'z.number().int().optional()';
    case 'float': return r ? 'z.number()' : 'z.number().optional()';
    case 'boolean': return r ? 'z.boolean()' : 'z.boolean().optional()';
    case 'date': return r ? 'z.string()' : 'z.string().optional()';
    case 'json': return r ? 'z.record(z.any())' : 'z.record(z.any()).optional()';
    case 'enum':
      const enums = JSON.stringify(f.enum || []);
      return r ? `z.enum(${enums})` : `z.enum(${enums}).optional()`;
    default: return r ? 'z.string().min(1)' : 'z.string().optional()';
  }
}

function renderPrismaModel(cfg) {
  const fields = cfg.fields.map(f => {
    if (f.type === 'enum') {
      const enumName = `${toPascal(cfg.name)}${toPascal(f.name)}`;
      const opt = f.required ? '' : '?';
      const def = f.required && Array.isArray(f.enum) && f.enum.length > 0 ? ` @default(${f.enum[0]})` : '';
      return `  ${f.name} ${enumName}${opt}${def}`;
    }
    const t = prismaType(f.type);
    const opt = f.required ? '' : '?';
    return `  ${f.name} ${t}${opt}`;
  }).join('\n');

  const enums = cfg.fields.filter(f => f.type === 'enum' && Array.isArray(f.enum)).map(f => {
    const enumName = `${toPascal(cfg.name)}${toPascal(f.name)}`;
    return `enum ${enumName} {\n  ${f.enum.join('\n  ')}\n}`;
  }).join('\n\n');

  return `
model ${toPascal(cfg.name)} {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  ${fields}
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("${cfg.plural}")
}

${enums}
`.trim();
}

function appendPrismaModel(repoRoot, cfg) {
  const prismaPath = path.join(repoRoot, 'apps', 'api', 'prisma', 'schema.prisma');
  const content = fs.readFileSync(prismaPath, 'utf8');
  if (content.includes(`model ${toPascal(cfg.name)} `)) {
    console.log(`Prisma model ${toPascal(cfg.name)} already exists, skipping.`);
    return;
  }
  const toAppend = '\n\n' + renderPrismaModel(cfg) + '\n';
  fs.writeFileSync(prismaPath, content + toAppend);
  console.log(`Updated Prisma schema: ${prismaPath}`);
}

function renderZodSchemas(cfg) {
  const createFields = cfg.fields.map(f => `  ${f.name}: ${zodType(f)},`).join('\n');
  // For update, everything optional
  const updateFields = cfg.fields.map(f => `  ${f.name}: ${zodType({ ...f, required: false })},`).join('\n');
  return `import { z } from "zod";

export const create${toPascal(cfg.name)}Schema = z.object({
${createFields}
});

export const update${toPascal(cfg.name)}Schema = z.object({
${updateFields}
});
`;
}

function renderApiCollectionRoute(cfg) {
  const name = toPascal(cfg.name);
  const plural = cfg.plural;
  const createSelect = cfg.fields.map(f => f.name).join(', ');
  return `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { create${name}Schema } from "./schemas";

export async function GET(request: NextRequest) {
  try {
    const items = await prisma.${toCamel(name)}.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ data: items });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = create${name}Schema.parse(body);
    const created = await prisma.${toCamel(name)}.create({ data });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
`;
}

function renderApiItemRoute(cfg) {
  const name = toPascal(cfg.name);
  return `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { update${name}Schema } from "../schemas";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.${toCamel(name)}.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = update${name}Schema.parse(body);
    const updated = await prisma.${toCamel(name)}.update({ where: { id: params.id }, data });
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.${toCamel(name)}.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
`;
}

function renderPages(cfg) {
  const pas = toPascal(cfg.name);
  const cam = toCamel(cfg.name);
  const plural = cfg.plural;
  const formFields = cfg.fields.map(f => {
    const label = toPascal(f.name);
    if (f.type === 'boolean') {
      return `
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.${f.name} ?? false} onChange={(e) => setForm(p => ({ ...p, ${f.name}: e.target.checked }))} />
              <span>${label}</span>
            </label>`;
    }
    return `
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">${label}</label>
              <input className="input-field" value={(form.${f.name} ?? '') as any} onChange={(e) => setForm(p => ({ ...p, ${f.name}: e.target.value }))} />
            </div>`;
  }).join('\n');

  const listPage = `"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ${pas}ListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const r = await fetch('/api/${plural}'); const j = await r.json(); setItems(j.data || []); setLoading(false); })(); }, []);
  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">${pas}</h1>
        <Link href="/${plural}/create" className="btn-primary">Create</Link>
      </div>
      <div className="bg-white rounded shadow">
        <ul>
          {items.map((it) => (
            <li key={it.id} className="border-b p-4 flex items-center justify-between">
              <div className="truncate">{it.id}</div>
              <Link className="text-blue-600" href={'/${plural}/' + it.id}>View</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}`;

  const createPage = `"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Create${pas}Page() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: any) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const r = await fetch('/api/${plural}', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Failed');
      router.push('/${plural}/' + j.data.id);
    } catch (e: any) { setError(e.message || 'Failed'); } finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create ${pas}</h1>
        <Link href="/${plural}" className="btn-secondary">Back</Link>
      </div>
      <form onSubmit={submit} className="bg-white rounded shadow p-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}
${formFields}
        <div className="flex justify-end gap-3">
          <Link href="/${plural}" className="btn-secondary">Cancel</Link>
          <button className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}`;

  const detailPage = `"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ${pas}DetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [edit, setEdit] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { (async () => { const r = await fetch('/api/${plural}/' + params.id); const j = await r.json(); if (r.ok) { setItem(j.data); setEdit(j.data); } else { setError('Not found'); } setLoading(false); })(); }, [params.id]);
  const save = async () => { setSaving(true); setError(''); try { const r = await fetch('/api/${plural}/' + params.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(edit) }); if (!r.ok) { const j = await r.json(); throw new Error(j?.error || 'Failed'); } router.refresh(); } catch (e: any) { setError(e.message); } finally { setSaving(false); } };
  const remove = async () => { if (!confirm('Delete?')) return; const r = await fetch('/api/${plural}/' + params.id, { method: 'DELETE' }); if (r.ok) router.push('/${plural}'); };
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">{error}</div>;
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">${pas} Detail</h1>
        <div className="flex gap-3">
          <Link href="/${plural}" className="btn-secondary">Back</Link>
          <button onClick={remove} className="btn-secondary">Delete</button>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-4">
${cfg.fields.map(f => `        <div><label className="block text-sm font-medium text-gray-700 mb-2">${toPascal(f.name)}</label><input className="input-field" value={(edit?.${f.name} ?? '') as any} onChange={(e) => setEdit((p:any) => ({ ...p, ${f.name}: e.target.value }))} /></div>`).join('\n')}
      </div>
    </div>
  );
}`;

  return { listPage, createPage, detailPage };
}

function writeApiRoutes(repoRoot, cfg) {
  const apiDir = path.join(repoRoot, 'apps', 'web', 'src', 'app', 'api', cfg.plural);
  ensureDir(apiDir);
  fs.writeFileSync(path.join(apiDir, 'schemas.ts'), renderZodSchemas(cfg));
  fs.writeFileSync(path.join(apiDir, 'route.ts'), renderApiCollectionRoute(cfg));
  const itemDir = path.join(apiDir, '[id]');
  ensureDir(itemDir);
  fs.writeFileSync(path.join(itemDir, 'route.ts'), renderApiItemRoute(cfg));
  console.log(`API routes created under ${apiDir}`);
}

function writePages(repoRoot, cfg) {
  const pagesDir = path.join(repoRoot, 'apps', 'web', 'src', 'app', cfg.plural);
  ensureDir(pagesDir);
  const { listPage, createPage, detailPage } = renderPages(cfg);
  fs.writeFileSync(path.join(pagesDir, 'page.tsx'), listPage);
  const createDir = path.join(pagesDir, 'create'); ensureDir(createDir);
  fs.writeFileSync(path.join(createDir, 'page.tsx'), createPage);
  const idDir = path.join(pagesDir, '[id]'); ensureDir(idDir);
  fs.writeFileSync(path.join(idDir, 'page.tsx'), detailPage);
  console.log(`Pages created under ${pagesDir}`);
}

function normalizeConfig(cfg) {
  if (!cfg.name) throw new Error('Config must include name');
  cfg.plural = cfg.plural || (cfg.name.toLowerCase() + 's');
  cfg.fields = Array.isArray(cfg.fields) ? cfg.fields : [];
  return cfg;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node packages/generator/index.js crud --config <path.json>');
    process.exit(1);
  }
  const cmd = args[0];
  if (cmd !== 'crud') {
    console.log('Only "crud" command is supported.');
    process.exit(1);
  }
  const cfgFlag = args.indexOf('--config');
  if (cfgFlag === -1 || !args[cfgFlag + 1]) {
    console.log('Missing --config <path.json>');
    process.exit(1);
  }
  const cfgPath = path.resolve(process.cwd(), args[cfgFlag + 1]);
  const cfg = normalizeConfig(readJson(cfgPath));
  const repoRoot = process.cwd();

  appendPrismaModel(repoRoot, cfg);
  writeApiRoutes(repoRoot, cfg);
  writePages(repoRoot, cfg);

  console.log('\nNext steps:');
  console.log('- Stop dev servers if running');
  console.log('- Run: pnpm --filter @neighborhood-hub/api db:push && pnpm --filter @neighborhood-hub/api db:generate');
  console.log('- Restart: pnpm dev');
}

if (require.main === module) {
  main();
}
