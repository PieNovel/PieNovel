import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const NOVEL_DIR = "../novel-data";

// Helper escape single quote buat SQL
function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/'/g, "''");
}

function readJson(jsonPath) {
  try {
    const raw = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`\n❌ Gagal baca ${jsonPath}: ${err.message}`);
    return null;
  }
}

// Map buat genre id biar gak duplikat di DB
const genreMap = new Map();

function getGenreId(genreName) {
  if (!genreMap.has(genreName)) {
    genreMap.set(genreName, uuid());
  }
  return genreMap.get(genreName);
}

// ---
// Schema (bisa di-run sekali di D1): uncomment kalau mau print juga
// ---
// console.log(`
// CREATE TABLE IF NOT EXISTS Novels (
//   id TEXT PRIMARY KEY,
//   slug TEXT,
//   author TEXT,
//   publisher TEXT,
//   translator TEXT,
//   originalLanguage TEXT,
//   releaseYear INTEGER,
//   cover TEXT,
//   status TEXT,
//   viewCount INTEGER DEFAULT 0,
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// CREATE TABLE IF NOT EXISTS Novel_translations (
//   id TEXT PRIMARY KEY,
//   novelId TEXT,
//   language TEXT,
//   title TEXT,
//   alternativeTitles TEXT,
//   description TEXT
// );
// CREATE TABLE IF NOT EXISTS Genres (
//   id TEXT PRIMARY KEY,
//   name TEXT UNIQUE
// );
// CREATE TABLE IF NOT EXISTS Novel_genres (
//   id TEXT PRIMARY KEY,
//   novelId TEXT,
//   genreId TEXT
// );
// CREATE TABLE IF NOT EXISTS Chapters (
//   id TEXT PRIMARY KEY,
//   novelId TEXT,
//   number INTEGER,
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// CREATE TABLE IF NOT EXISTS Chapter_translations (
//   id TEXT PRIMARY KEY,
//   chapterId TEXT,
//   language TEXT,
//   title TEXT,
//   file TEXT,
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// `);

// Ambil semua folder novel
const entries = fs.readdirSync(NOVEL_DIR, { withFileTypes: true });
const novelFolders = entries.filter((e) => e.isDirectory());

console.log(`\n📚 Ditemukan ${novelFolders.length} novel folder\n`);

for (const folder of novelFolders) {
  const infoPath = path.join(NOVEL_DIR, folder.name, "info.json");

  if (!fs.existsSync(infoPath)) {
    console.log(`⚠️  Skip "${folder.name}": info.json tidak ditemukan`);
    continue;
  }

  const data = readJson(infoPath);
  if (!data) continue;

  const novelId = uuid();
  const n = data.novel || {};

  console.log("\n================================================");
  console.log(`-- Import: ${n.slug ?? folder.name}`);
  console.log("================================================\n");

  // =================
  // NOVELS
  // =================
  console.log(`INSERT INTO Novels (id, slug, author, publisher, translator, originalLanguage, releaseYear, cover, status, viewCount, createdAt, updatedAt) VALUES(
  '${novelId}',
  '${esc(n.slug)}',
  '${esc(n.author)}',
  '${esc(n.publisher)}',
  '${esc(n.translator)}',
  '${esc(n.originalLanguage)}',
  ${n.releaseYear === null || n.releaseYear === undefined ? "NULL" : n.releaseYear},
  '${esc(n.cover)}',
  '${esc(n.status)}',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`);

  // =================
  // TRANSLATIONS
  // =================
  if (Array.isArray(data.translations)) {
    for (const t of data.translations) {
      const id = uuid();
      console.log(`INSERT INTO Novel_translations (id, novelId, language, title, alternativeTitles, description) VALUES(
  '${id}',
  '${novelId}',
  '${esc(t.language)}',
  '${esc(t.title)}',
  '${esc(JSON.stringify(t.alternativeTitles ?? []))}',
  '${esc(t.description)}'
);`);
    }
  }

  // =================
  // GENRES
  // =================
  if (Array.isArray(data.genres)) {
    for (const g of data.genres) {
      const genreId = getGenreId(g);
      const linkId = uuid();
      console.log(`INSERT OR IGNORE INTO Genres (id, name) VALUES('${genreId}', '${esc(g)}');`);
      console.log(`INSERT INTO Novel_genres (id, novelId, genreId) VALUES('${linkId}', '${novelId}', '${genreId}');`);
    }
  }

  // =================
  // CHAPTERS
  // =================
  if (Array.isArray(data.chapters)) {
    for (const ch of data.chapters) {
      const chapterId = uuid();
      console.log(`INSERT INTO Chapters (id, novelId, number, createdAt, updatedAt) VALUES(
  '${chapterId}',
  '${novelId}',
  ${ch.number ?? 0},
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`);

      if (Array.isArray(ch.translations)) {
        for (const ct of ch.translations) {
          const ctId = uuid();
          console.log(`INSERT INTO Chapter_translations (id, chapterId, language, title, file, createdAt, updatedAt) VALUES(
  '${ctId}',
  '${chapterId}',
  '${esc(ct.language)}',
  '${esc(ct.title)}',
  '${esc(ct.file)}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`);
        }
      }
    }
  }

  console.log("\n");
}

console.log("\n✅ Selesai generate SQL untuk semua novel.\n");
