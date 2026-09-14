import fs from 'fs';
import path from 'path';

const sqlPath = path.resolve('migration_stage4_categories.sql');
let content = fs.readFileSync(sqlPath, 'utf-8');

console.log('================================================================');
console.log(' HAECCA HIJAB — CATEGORIES SQL VALIDATION & CLEANING            ');
console.log('================================================================\n');

// 1. Check for and clean any markdown links like [url](url) in the SQL file
const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
let cleaned = false;

if (markdownLinkRegex.test(content)) {
  console.log('Found markdown hyperlink wrapper. Cleaning to raw URL...');
  content = content.replace(markdownLinkRegex, (match, text, url) => {
    return url;
  });
  cleaned = true;
}

// Write back if cleaned
if (cleaned) {
  fs.writeFileSync(sqlPath, content, 'utf-8');
  console.log('✓ Cleaned markdown links in migration_stage4_categories.sql\n');
} else {
  console.log('✓ Confirmed: No markdown link syntax [url](url) found in SQL file.\n');
}

// 2. Verify all 4 category image_url values
const expectedUrls = {
  voal: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
  pashmina: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
  hijab: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  accessories: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
};

console.log('2. Validating Category image_url Values:');
for (const [catId, expectedUrl] of Object.entries(expectedUrls)) {
  const linePattern = new RegExp(`'${catId}'[\\s\\S]*?'(${expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})'`, 'i');
  if (linePattern.test(content)) {
    console.log(`   ✓ [${catId}] image_url is raw: '${expectedUrl}'`);
  } else {
    console.error(`   ✗ [${catId}] Failed to verify raw image_url!`);
    process.exit(1);
  }
}
console.log();

// 3. Verify exactly 4 INSERT INTO public.categories
const insertMatches = content.match(/INSERT\s+INTO\s+public\.categories/gi) || [];
console.log(`3. Category INSERT Statements: ${insertMatches.length} (expected: 4)`);
console.assert(insertMatches.length === 4, 'Expected exactly 4 INSERT statements');

// 4. Verify Idempotent ON CONFLICT (id) DO UPDATE
const conflictMatches = content.match(/ON\s+CONFLICT\s+\(id\)\s+DO\s+UPDATE\s+SET/gi) || [];
console.log(`4. Idempotent Conflict Handlers: ${conflictMatches.length} (expected: 4)`);
console.assert(conflictMatches.length === 4, 'Expected exactly 4 ON CONFLICT clauses');

// 5. Verify BEGIN and COMMIT
const hasBegin = /^\s*BEGIN;/m.test(content);
const hasCommit = /^\s*COMMIT;/m.test(content);
console.log(`5. Transaction Block: BEGIN=${hasBegin}, COMMIT=${hasCommit}`);
console.assert(hasBegin && hasCommit, 'Missing BEGIN or COMMIT');

// 6. Verify 3 verification queries
const hasQuery1 = content.includes('SELECT COUNT(*) AS total_categories FROM public.categories;');
const hasQuery2 = content.includes("SELECT COUNT(*) AS required_categories_present FROM public.categories WHERE id IN ('voal', 'pashmina', 'hijab', 'accessories');");
const hasQuery3 = content.includes('SELECT id, slug, name, sort_order, is_visible, updated_at FROM public.categories ORDER BY sort_order ASC;');
console.log(`6. Verification Queries: Q1=${hasQuery1}, Q2=${hasQuery2}, Q3=${hasQuery3}`);
console.assert(hasQuery1 && hasQuery2 && hasQuery3, 'Missing verification queries');

// 7. Security Check: ZERO DDL, ZERO RLS, ZERO DELETE/TRUNCATE
const executableSql = content
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

const forbidden = [
  /\bCREATE\s+POLICY\b/i,
  /\bALTER\s+POLICY\b/i,
  /\bDROP\s+POLICY\b/i,
  /\bALTER\s+TABLE\b/i,
  /\bCREATE\s+TABLE\b/i,
  /\bDROP\s+TABLE\b/i,
  /\bTRUNCATE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bDELETE\b/i,
];

for (const p of forbidden) {
  if (p.test(executableSql)) {
    console.error(`SECURITY VIOLATION: ${p} found!`);
    process.exit(1);
  }
}
console.log('7. Security Audit: ZERO DDL, ZERO policy changes, and ZERO deletes detected.\n');

console.log('================================================================');
console.log('CATEGORY SQL CLEAN — READY TO EXECUTE — NOT EXECUTED');
console.log('================================================================');
