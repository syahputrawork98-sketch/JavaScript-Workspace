import fs from "node:fs";
import path from "node:path";

export const CONTENT_DIR_BY_PRIORITY = ["chapters", "topics", "exercises"];
export const MATERIAL_TYPE_BY_DIR = {
  chapters: "chapter",
  topics: "topic",
  exercises: "exercise",
};

export function parseLeadingNumber(value) {
  const match = value.match(/^(?:[A-Z])?(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export function sortByLeadingNumberThenName(a, b) {
  const diff = parseLeadingNumber(a) - parseLeadingNumber(b);
  if (diff !== 0) return diff;
  return a.localeCompare(b);
}

export function titleFromSlug(slug) {
  const cleaned = slug.replace(/^[A-Z]?\d+-/i, "").replace(/-/g, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words
    .map((word) => {
      if (word.toLowerCase() === "javascript") return "JavaScript";
      if (word.toLowerCase() === "ecmascript") return "ECMAScript";
      if (word.toLowerCase() === "api") return "API";
      return word[0] ? word[0].toUpperCase() + word.slice(1) : word;
    })
    .join(" ");
}

export function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

export function extractFirstHeading(markdownText) {
  const line = markdownText.split(/\r?\n/).find((item) => item.startsWith("# "));
  if (!line) return "";
  return line.replace(/^#\s+/, "").trim();
}

export function extractSummary(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("- ")) continue;
    if (line.startsWith("```")) continue;
    if (line.startsWith("![")) continue;
    return line;
  }
  return "";
}

export function stripLeadingCode(value) {
  return value.replace(/^[A-Z]?\d{2}\s*-\s*/i, "").trim();
}

export function extractVersionAndDateFromChangelog(changelogText) {
  const match = changelogText.match(/v?\d+\.\d+\.\d+.*\d{4}-\d{2}-\d{2}/i);
  if (!match) return null;

  const versionMatch = match[0].match(/v?\d+\.\d+\.\d+/i)?.[0] || "v0.0.0";
  const releaseDate = match[0].match(/\d{4}-\d{2}-\d{2}/)?.[0] || "unknown";
  const version = versionMatch.toLowerCase().startsWith("v") ? versionMatch : `v${versionMatch}`;
  return { version, releaseDate };
}

export function pickContentDirectory(bookAbsolutePath) {
  return CONTENT_DIR_BY_PRIORITY.find((dirName) =>
    fs.existsSync(path.join(bookAbsolutePath, dirName))
  );
}

export function extractMaterialTitle(fileAbsolutePath, fileName) {
  const markdown = readFileIfExists(fileAbsolutePath);
  const heading = extractFirstHeading(markdown);
  if (heading) return heading;
  return titleFromSlug(path.basename(fileName, ".md"));
}

export function inferMaterialCode(fileName, materialType) {
  const baseName = path.basename(fileName, ".md");
  const explicitCode = baseName.match(/^([A-Z]+\d+)/i)?.[1];
  if (explicitCode) return explicitCode.toUpperCase();

  const numericCode = baseName.match(/^(\d+)/)?.[1];
  if (!numericCode) return "M00";

  if (materialType === "chapter") return `C${numericCode}`;
  if (materialType === "topic") return `T${numericCode}`;
  if (materialType === "exercise") return `E${numericCode}`;
  if (materialType === "reference") return `R${numericCode}`;
  return `M${numericCode}`;
}

export function inferMaterialOrder(fileName) {
  const baseName = path.basename(fileName, ".md");
  return parseLeadingNumber(baseName);
}

export function extractMaterialSummary(fileAbsolutePath) {
  const markdown = readFileIfExists(fileAbsolutePath);
  return extractSummary(markdown) || "Ringkasan materi belum tersedia.";
}
