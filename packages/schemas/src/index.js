import { z } from "zod";

export const rackSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourcePath: z.string().min(1),
});

export const materialSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  summary: z.string().min(1),
  type: z.enum(["chapter", "topic", "exercise", "reference"]),
  sourcePath: z.string().min(1),
});

export const bookSchema = z.object({
  id: z.string().min(1),
  rack: rackSchema,
  code: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  releaseDate: z.string().min(1),
  summary: z.string().min(1),
  materials: z.array(materialSchema).min(1),
});

export const bookCatalogSchema = z.array(bookSchema);
