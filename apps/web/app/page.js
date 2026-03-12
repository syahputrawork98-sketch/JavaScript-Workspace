import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { archiveBooks } from "@/lib/archive";
import { libraryBooks } from "@/lib/racks";

const learningReasons = [
  "Bagaimana kode JavaScript dieksekusi.",
  "Bagaimana Execution Context bekerja.",
  "Bagaimana Lexical Environment terbentuk.",
  "Bagaimana Event Loop menjalankan asynchronous code.",
  "Bagaimana Prototype Chain membentuk object system.",
  "Bagaimana nilai dan reference disimpan di memory.",
  "Bagaimana JavaScript engine mengeksekusi program.",
];

export default function Home() {
  const totalMaterials = libraryBooks.reduce((acc, book) => acc + book.materials.length, 0);
  const totalRacks = new Set(libraryBooks.map((book) => book.rack.id)).size;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-14">
      <section className="border border-slate-300 bg-white p-5">
        <p className="text-sm text-slate-500">JavaScript Workspace</p>
        <h1 className="mt-1 text-2xl font-medium text-slate-900">
          Platform pembaca untuk JavaScript Learning Hub
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">
          JavaScript Learning Hub adalah perpustakaan kecil berisi buku teknis JavaScript. JavaScript
          Workspace adalah gedung belajarnya: tempat membaca buku, menavigasi materi, dan membangun
          pemahaman JavaScript secara bertahap.
        </p>
      </section>

      <section className="border border-slate-300 bg-white p-5">
        <p className="mb-3 text-sm text-slate-500">Tujuan belajar</p>
        <ul className="grid gap-2 md:grid-cols-2">
          {learningReasons.map((item) => (
            <li key={item} className="border border-slate-200 px-3 py-2 text-sm text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-slate-300 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Katalog Utama</p>
            <h2 className="text-xl font-medium text-slate-900">JavaScript Learning Hub v2</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/books">Buka Katalog v2</Link>
          </Button>
        </div>

        {libraryBooks.length === 0 ? (
          <p className="text-sm text-slate-600">
            Katalog belum tersedia. Pastikan path Learning Hub valid melalui `LEARNING_HUB_PATH`.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {libraryBooks.slice(0, 6).map((book) => (
              <article key={book.id} className="border border-slate-200 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  {book.rack.code} / {book.code}
                </p>
                <h3 className="mt-1 text-lg font-medium text-slate-900">{book.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{book.rack.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {book.version} - {book.releaseDate}
                </p>
                <p className="mt-3 text-sm text-slate-700">{book.materials.length} materi</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border border-slate-300 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Arsip</p>
            <h2 className="text-xl font-medium text-slate-900">JavaScript Learning Hub v1</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/legacy">Buka Arsip v1</Link>
          </Button>
        </div>

        <p className="max-w-4xl text-sm leading-7 text-slate-700">
          Versi lama tetap tersedia sebagai arsip referensi terpisah. Home tetap fokus ke struktur
          aktif v2, sementara materi lama bisa dibuka dari halaman khusus.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Buku Arsip</p>
            <p className="mt-1 text-2xl font-medium text-slate-900">{archiveBooks.length}</p>
          </div>
          <div className="border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Versi</p>
            <p className="mt-1 text-2xl font-medium text-slate-900">v1</p>
          </div>
          <div className="border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Status</p>
            <p className="mt-1 text-2xl font-medium text-slate-900">Arsip Aktif</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Rak Aktif</p>
          <p className="mt-1 text-2xl font-medium text-slate-900">{totalRacks}</p>
        </div>
        <div className="border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Materi</p>
          <p className="mt-1 text-2xl font-medium text-slate-900">{totalMaterials}</p>
        </div>
        <div className="border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Buku Aktif</p>
          <p className="mt-1 text-2xl font-medium text-slate-900">{libraryBooks.length}</p>
        </div>
      </section>
    </main>
  );
}
