# JavaScript Workspace

JavaScript Workspace adalah **platform pembelajaran** untuk ekosistem JavaScript.

Analogi utamanya:

- **JavaScript Learning Hub** = perpustakaan (koleksi buku/materi).
- **JavaScript Workspace** = gedung/platform belajar (pengalaman belajar + operasional).

Learning Hub menyimpan ilmu. Workspace menyajikan pengalaman belajarnya.

## Tech Stack

- Framework: Next.js
- Language: JavaScript + JSX
- Styling: Tailwind CSS
- UI Components: shadcn/ui foundations
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Monorepo: pnpm workspace

## Monorepo Structure

```text
javascript-workspace/
|-- apps/
|   `-- web/                  # frontend + backend route handlers (Next.js app/api)
|-- packages/
|   |-- db/                   # prisma schema + prisma client wrapper
|   |-- schemas/              # zod schemas lintas layer
|   `-- ui/                   # komponen UI foundation (shadcn style)
|-- docs/
|   `-- architecture.md
|-- .env.example
|-- package.json
`-- pnpm-workspace.yaml
```

## Learning Hub Integration

- Workspace membaca JavaScript Learning Hub v2 dengan struktur `Rxx-*` untuk rak.
- Setiap rak berisi buku `Bxx-*`.
- Materi dibaca dari folder seperti `chapters/`, `topics/`, atau `exercises/` di level buku.
- Folder `v1/` pada Learning Hub dianggap arsip dan tidak dipakai sebagai sumber katalog aktif.
- Home menampilkan jalur aktif `v2`, sementara arsip `v1` tersedia di halaman terpisah `/legacy`.

## Development Commands

```bash
pnpm install
pnpm dev
```

Database commands:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

## Environment

Salin `.env.example` menjadi `.env`, lalu isi nilai yang valid:

- `DATABASE_URL`
- `LEARNING_HUB_PATH` (opsional, untuk override path source materi)

## Current Status

- Fondasi monorepo sudah dibuat.
- App Next.js `apps/web` sudah aktif.
- Package `db`, `schemas`, dan `ui` sudah tersedia sebagai baseline.
- Endpoint backend awal tersedia di `GET /api/health`.
- Halaman katalog buku tersedia di `/books`.
- Halaman detail materi per buku tersedia di `/books/[bookId]`.
- Jika Learning Hub tidak terdeteksi, aplikasi tetap jalan dan menampilkan empty-state katalog.

## Local Setup Checklist

1. (Opsional) Buat database PostgreSQL lokal.
2. Salin `.env.example` ke `.env`, isi `LEARNING_HUB_PATH` bila lokasi repo berbeda.
3. Jalankan:

```bash
pnpm install
pnpm dev
```
