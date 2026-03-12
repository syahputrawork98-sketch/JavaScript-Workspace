import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { libraryBooks } from "@/lib/racks";

export const metadata = {
  title: "Daftar Buku | JavaScript Workspace",
};

export default function BooksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-14">
      <section className="border border-slate-300 bg-white p-4 text-center">
        <p className="text-sm text-slate-500">katalog buku</p>
        <h1 className="text-2xl font-medium text-slate-900">Buku dan Materi JavaScript</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {libraryBooks.length === 0 ? (
          <article className="border border-slate-300 bg-white p-5 md:col-span-2">
            <p className="text-sm text-slate-600">
              Katalog belum tersedia. Pastikan path Learning Hub valid melalui `LEARNING_HUB_PATH`.
            </p>
          </article>
        ) : (
          libraryBooks.map((book) => (
            <article key={book.id} className="border border-slate-300 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                {book.rack.code} / {book.code}
              </p>
              <h2 className="mt-1 text-xl font-medium text-slate-900">{book.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{book.rack.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {book.version} - {book.releaseDate}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-700">{book.summary}</p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-slate-600">{book.materials.length} materi</p>
                <Button asChild variant="outline">
                  <Link href={`/books/${book.id}`}>Buka Buku</Link>
                </Button>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="border border-slate-300 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Perlu Arsip Lama?</p>
            <h2 className="text-lg font-medium text-slate-900">Buka katalog JavaScript Learning Hub v1</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/legacy">Lihat Arsip v1</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
