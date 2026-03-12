import fs from "node:fs";
import path from "node:path";
import { bookCatalogSchema } from "@javascript-workspace/schemas";
import { resolveLearningHubRoot } from "./learning-hub-path";
import {
  extractFirstHeading,
  extractMaterialSummary,
  extractMaterialTitle,
  extractSummary,
  extractVersionAndDateFromChangelog,
  inferMaterialCode,
  inferMaterialOrder,
  MATERIAL_TYPE_BY_DIR,
  pickContentDirectory,
  readFileIfExists,
  sortByLeadingNumberThenName,
  stripLeadingCode,
  titleFromSlug,
} from "./library-helpers";

const RACK_DIRECTORY_PATTERN = /^R(\d{2})-/;
const BOOK_DIRECTORY_PATTERN = /^B(\d{2})-/;

function materialTypeForBook(code, contentDirName) {
  if (code === "08") return "reference";
  return MATERIAL_TYPE_BY_DIR[contentDirName] || "topic";
}

function collectMaterials(hubRoot, rackDirName, bookDirName, code) {
  const bookAbsolutePath = path.join(hubRoot, rackDirName, bookDirName);
  const contentDirName = pickContentDirectory(bookAbsolutePath);
  if (!contentDirName) return [];

  const contentAbsolutePath = path.join(bookAbsolutePath, contentDirName);
  const files = fs
    .readdirSync(contentAbsolutePath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => fileName.toLowerCase() !== "readme.md")
    .sort(sortByLeadingNumberThenName);

  return files.map((fileName) => {
    const fileAbsolutePath = path.join(contentAbsolutePath, fileName);
    const type = materialTypeForBook(code, contentDirName);
    return {
      id: path.basename(fileName, ".md"),
      code: inferMaterialCode(fileName, type),
      order: inferMaterialOrder(fileName),
      title: extractMaterialTitle(fileAbsolutePath, fileName),
      summary: extractMaterialSummary(fileAbsolutePath),
      type,
      sourcePath: `${rackDirName}/${bookDirName}/${contentDirName}/${fileName}`,
    };
  });
}

function collectRack(hubRoot, rackDirName) {
  const rackAbsolutePath = path.join(hubRoot, rackDirName);
  const readmeText = readFileIfExists(path.join(rackAbsolutePath, "README.md"));
  const heading = extractFirstHeading(readmeText);
  const code = (rackDirName.match(RACK_DIRECTORY_PATTERN)?.[1] || "").trim();

  return {
    id: rackDirName,
    code: code ? `R${code}` : rackDirName,
    title: stripLeadingCode(heading || titleFromSlug(rackDirName)),
    summary: extractSummary(readmeText) || `Rak ${rackDirName} dari JavaScript Learning Hub.`,
    sourcePath: rackDirName,
  };
}

function collectBook(hubRoot, rackDirName, bookDirName) {
  const bookAbsolutePath = path.join(hubRoot, rackDirName, bookDirName);
  const code = (bookDirName.match(BOOK_DIRECTORY_PATTERN)?.[1] || "").trim();
  const rack = collectRack(hubRoot, rackDirName);
  const readmeText = readFileIfExists(path.join(bookAbsolutePath, "README.md"));
  const changelogText = readFileIfExists(path.join(bookAbsolutePath, "CHANGELOG.md"));
  const heading = extractFirstHeading(readmeText);
  const title = heading ? stripLeadingCode(heading) : titleFromSlug(bookDirName);
  const summary = extractSummary(readmeText) || `Materi ${title} dari JavaScript Learning Hub.`;
  const versionAndDate = extractVersionAndDateFromChangelog(changelogText) || {
    version: "v0.0.0",
    releaseDate: "unknown",
  };
  const materials = collectMaterials(hubRoot, rackDirName, bookDirName, code);
  if (!materials.length) return null;

  return {
    id: `${rack.code}-${bookDirName}`,
    rack,
    code: code ? `B${code}` : bookDirName,
    title,
    version: versionAndDate.version,
    releaseDate: versionAndDate.releaseDate,
    summary,
    materials,
  };
}

function collectBooksFromLearningHubV2() {
  const hubRoot = resolveLearningHubRoot();
  if (!fs.existsSync(hubRoot)) return [];

  const rawBooks = fs
    .readdirSync(hubRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((dirName) => RACK_DIRECTORY_PATTERN.test(dirName))
    .sort(sortByLeadingNumberThenName)
    .flatMap((rackDirName) => {
      const rackAbsolutePath = path.join(hubRoot, rackDirName);
      return fs
        .readdirSync(rackAbsolutePath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((dirName) => BOOK_DIRECTORY_PATTERN.test(dirName))
        .sort(sortByLeadingNumberThenName)
        .map((bookDirName) => collectBook(hubRoot, rackDirName, bookDirName));
    })
    .filter((book) => book !== null);

  try {
    return bookCatalogSchema.parse(rawBooks);
  } catch {
    return [];
  }
}

export const libraryBooks = collectBooksFromLearningHubV2();

export function getLibraryBookById(id) {
  return libraryBooks.find((book) => book.id === id) || null;
}
