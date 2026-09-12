import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = resolve(
  "attached_assets/мнемотехника_1778394417462.docx",
);
const outputPath = resolve(
  "artifacts/api-server/src/data/homework.generated.ts",
);

const xml = execFileSync(
  "unzip",
  ["-p", sourcePath, "word/document.xml"],
  { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 },
);

const decodeXml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");

const paragraphs = [...xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)]
  .map((paragraph) =>
    [...paragraph[1].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
      .map((text) => decodeXml(text[1]))
      .join("")
      .trim(),
  )
  .filter(Boolean);

const homeworkStarts = paragraphs
  .map((paragraph, index) =>
    paragraph === "Домашнее задание" ? index : -1,
  )
  .filter((index) => index >= 0);

if (homeworkStarts.length !== 14) {
  throw new Error(
    `Ожидалось 14 домашних заданий, найдено ${homeworkStarts.length}`,
  );
}

const homeworkBlocks = homeworkStarts.map((start, index) => {
  const end =
    paragraphs.findIndex(
      (paragraph, paragraphIndex) =>
        paragraphIndex > start && paragraph.startsWith("ЗАНЯТИЕ "),
    ) || paragraphs.length;
  const body = paragraphs.slice(start + 1, end).join("\n\n");
  return `## Домашнее задание к занятию ${index + 1}\n\n${body}`;
});

// Восемь уроков сайта объединяют четырнадцать занятий книги.
const bookLessonsBySiteLesson = {
  1: [1],
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [6, 7, 9, 10, 11],
  7: [8, 12],
  8: [13, 14],
};

const homeworkByLesson = Object.fromEntries(
  Object.entries(bookLessonsBySiteLesson).map(([lesson, bookLessons]) => [
    lesson,
    bookLessons
      .map((bookLesson) => homeworkBlocks[bookLesson - 1])
      .join("\n\n---\n\n"),
  ]),
);

writeFileSync(
  outputPath,
  `// Generated from the uploaded book. Run: node scripts/src/generate-homework.mjs\n` +
    `export const homeworkByLesson: Record<number, string> = ${JSON.stringify(homeworkByLesson, null, 2)};\n`,
);

console.log(`Generated ${outputPath} with 14 full homework sections.`);