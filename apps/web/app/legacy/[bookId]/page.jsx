import { notFound } from "next/navigation";
import BookReaderClient from "@/components/book-reader-client";
import { archiveBooks, getArchiveBookById } from "@/lib/archive";
import { loadMaterialMarkdown } from "@/lib/learning-hub-content";

export async function generateStaticParams() {
  return archiveBooks.map((book) => ({ bookId: book.id }));
}

export async function generateMetadata({ params }) {
  const { bookId } = await params;
  const book = getArchiveBookById(bookId);

  if (!book) return { title: "Arsip Tidak Ditemukan | JavaScript Workspace" };

  return { title: `v1 / ${book.code} - ${book.title} | JavaScript Workspace` };
}

export default async function LegacyBookDetailPage({ params, searchParams }) {
  const { bookId } = await params;
  const query = await searchParams;
  const book = getArchiveBookById(bookId);

  if (!book) notFound();

  const selectedMaterialId = query.material || book.materials[0]?.id;
  const selectedMaterial =
    book.materials.find((material) => material.id === selectedMaterialId) || book.materials[0];
  const markdown = await loadMaterialMarkdown(selectedMaterial.sourcePath);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-6 md:px-6">
      <section className="border border-slate-300 bg-white p-4 text-center">
        <p className="text-sm text-slate-500">v1 · arsip legacy</p>
        <h1 className="text-2xl font-medium text-slate-900">
          {book.code} - {book.title}
        </h1>
      </section>

      <BookReaderClient
        backHref="/legacy"
        backLabel="Kembali ke Arsip v1"
        book={book}
        selectedMaterialId={selectedMaterial.id}
        markdown={markdown}
      />
    </main>
  );
}
