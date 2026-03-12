import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { archiveBooks } from "@/lib/archive";

export const metadata = {
  title: "Arsip v1 | JavaScript Workspace",
};

export default function LegacyBooksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-14">
      <section className="border border-slate-300 bg-white p-4 text-center">
        <p className="text-sm text-slate-500">arsip buku</p>
        <h1 className="text-2xl font-medium text-slate-900">JavaScript Learning Hub v1</h1>
      </section>

      <section className="border border-slate-300 bg-white p-5">
        <p className="text-sm leading-7 text-slate-700">
          Halaman ini menampung struktur lama yang sekarang disimpan di folder `v1/`. Materinya
          tetap bisa dibaca terpisah dari jalur utama v2.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {archiveBooks.length === 0 ? (
          <article className="border border-slate-300 bg-white p-5 md:col-span-2">
            <p className="text-sm text-slate-600">Arsip v1 belum tersedia atau path Learning Hub belum valid.</p>
          </article>
        ) : (
          archiveBooks.map((book) => (
            <article key={book.id} className="border border-slate-300 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">v1 / {book.code}</p>
              <h2 className="mt-1 text-xl font-medium text-slate-900">{book.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {book.version} - {book.releaseDate}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-700">{book.summary}</p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-slate-600">{book.materials.length} materi</p>
                <Button asChild variant="outline">
                  <Link href={`/legacy/${book.id}`}>Buka Arsip</Link>
                </Button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
