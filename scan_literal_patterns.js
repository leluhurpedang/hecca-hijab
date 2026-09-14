import fs from 'fs';
import path from 'path';

const sqlPath = path.resolve('migration_stage4_categories.sql');
const rawBuffer = fs.readFileSync(sqlPath);
const rawText = rawBuffer.toString('utf-8');

console.log('=== LITERAL SCAN OF migration_stage4_categories.sql ===');
console.log(`File: ${sqlPath}`);
console.log(`File Size: ${rawBuffer.length} bytes`);

// Literal string search (exact substring matching)
const patterns = [
  '[https://',
  '](',
  '](https://',
  '\\_',
  '\\&',
  '\\--',
  '[',
  ']',
];

function countOccurrences(str, target) {
  let count = 0;
  let pos = 0;
  while ((pos = str.indexOf(target, pos)) !== -1) {
    count++;
    pos += target.length;
  }
  return count;
}

console.log('\n1. Pattern Occurrence Counts:');
for (const p of patterns) {
  const cnt = countOccurrences(rawText, p);
  console.log(`   - "${p}": ${cnt}`);
}

// Extract exact image_url strings between single quotes
console.log('\n2. Extracting exact image_url lines:');
const lines = rawText.split(/\r?\n/);
let found = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('images.unsplash.com')) {
    found++;
    const trimmed = line.trim();
    console.log(`   Category image_url #${found} (line ${i + 1}):`);
    console.log(`   ${trimmed}`);
    
    // Check characters
    const hasOpenBracket = trimmed.includes('[');
    const hasCloseBracket = trimmed.includes(']');
    const hasOpenParen = trimmed.includes('(');
    const hasCloseParen = trimmed.includes(')');
    console.log(`   Contains '[': ${hasOpenBracket}`);
    console.log(`   Contains ']': ${hasCloseBracket}`);
    console.log(`   Contains '(': ${hasOpenParen}`);
    console.log(`   Contains ')': ${hasCloseParen}`);
  }
}

// 3. Count SQL statements
console.log('\n3. SQL Statement Counts:');
const insertCount = (rawText.match(/INSERT\s+INTO\s+public\.categories/gi) || []).length;
const onConflictCount = (rawText.match(/ON\s+CONFLICT\s+\(id\)\s+DO\s+UPDATE\s+SET/gi) || []).length;
const beginCount = (rawText.match(/^\s*BEGIN;/gm) || []).length;
const commitCount = (rawText.match(/^\s*COMMIT;/gm) || []).length;
const selectCount = (rawText.match(/^\s*SELECT\s+/gm) || []).length;

console.log(`   - 4 INSERT INTO public.categories: ${insertCount}`);
console.log(`   - 4 ON CONFLICT (id):              ${onConflictCount}`);
console.log(`   - 1 BEGIN:                         ${beginCount}`);
console.log(`   - 1 COMMIT:                        ${commitCount}`);
console.log(`   - 3 SELECT verification queries:   ${selectCount}`);

// 4. Forbidden patterns
console.log('\n4. Security & Safety Check:');
const forbidden = [
  'DELETE',
  'TRUNCATE',
  'ALTER TABLE',
  'CREATE TABLE',
  'DROP TABLE',
  'CREATE POLICY',
  'ALTER POLICY',
  'DROP POLICY',
];
let forbiddenFound = 0;
for (const f of forbidden) {
  const cnt = countOccurrences(rawText, f);
  console.log(`   - "${f}": ${cnt}`);
  if (cnt > 0) forbiddenFound += cnt;
}

console.log('\n================================================================');
if (
  countOccurrences(rawText, '[https://') === 0 &&
  countOccurrences(rawText, '](') === 0 &&
  countOccurrences(rawText, '](https://') === 0 &&
  countOccurrences(rawText, '\\_') === 0 &&
  countOccurrences(rawText, '\\&') === 0 &&
  countOccurrences(rawText, '\\--') === 0 &&
  countOccurrences(rawText, '[') === 0 &&
  countOccurrences(rawText, ']') === 0 &&
  insertCount === 4 &&
  onConflictCount === 4 &&
  beginCount === 1 &&
  commitCount === 1 &&
  selectCount === 3 &&
  forbiddenFound === 0
) {
  console.log('CATEGORY SQL VERIFIED CLEAN — NOT EXECUTED');
} else {
  console.log('CATEGORY SQL STILL INVALID — NOT EXECUTED');
}
console.log('================================================================');
