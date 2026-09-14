import fs from 'fs';
import path from 'path';

const filePath = path.resolve('migration_stage4_categories.sql');
const rawBuffer = fs.readFileSync(filePath);
const rawContent = rawBuffer.toString('utf-8');

console.log('=== BYTE & CONTENT LEVEL VERIFICATION ===');
console.log(`File: ${filePath}`);
console.log(`Total Bytes: ${rawBuffer.length}`);
console.log(`Total Characters: ${rawContent.length}\n`);

const issues = [];

// 1. Check SQL comments: '--' NOT '\--'
const escapedCommentMatches = rawContent.match(/\\--/g) || [];
if (escapedCommentMatches.length > 0) {
  issues.push(`Found ${escapedCommentMatches.length} escaped comments ('\\--')`);
} else {
  console.log('1. SQL comments check: PASSED (Zero "\\--" found; all comments use clean "--")');
}

// 2. Check SQL identifiers: 'image_url' NOT 'image\_url'
const escapedIdentifierMatches = rawContent.match(/[a-zA-Z0-9]\\[_][a-zA-Z0-9]/g) || [];
if (escapedIdentifierMatches.length > 0) {
  issues.push(`Found escaped identifiers with '\\_': ${escapedIdentifierMatches.join(', ')}`);
} else {
  console.log('2. SQL identifiers check: PASSED (Zero "\\_" escapes found; clean identifiers like image_url, sort_order, is_visible)');
}

// 3. Check URL query parameters: '&fit=crop&w=800&q=80'
const queryParamMatch = rawContent.includes('&fit=crop&w=800&q=80');
const escapedAmpMatch = rawContent.includes('&amp;') || rawContent.includes('\\&');
if (!queryParamMatch) {
  issues.push('Query parameter string &fit=crop&w=800&q=80 missing or corrupted');
} else if (escapedAmpMatch) {
  issues.push('Found HTML/Markdown escaped ampersands in URLs');
} else {
  console.log('3. URL query parameters check: PASSED (Clean "&fit=crop&w=800&q=80", zero "&amp;" or "\\&")');
}

// 4. Extract and print the exact SQL string for all 4 image_url values
console.log('\n4. Exact image_url SQL Strings in file:');
const lines = rawContent.split(/\r?\n/);
const imageUrlLines = [];
lines.forEach((line, idx) => {
  if (line.includes('images.unsplash.com')) {
    imageUrlLines.push({ lineNum: idx + 1, text: line.trim() });
  }
});

imageUrlLines.forEach((item, i) => {
  console.log(`   [Item ${i + 1} | Line ${item.lineNum}]: ${item.text}`);
  // Verify format
  const expectedFormat = /^'https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?[^']+)?',?$/;
  if (!expectedFormat.test(item.text)) {
    issues.push(`Line ${item.lineNum} does not match exact raw SQL string format: ${item.text}`);
  }
  if (item.text.includes('[') || item.text.includes(']') || item.text.includes('(') && !item.text.includes('?')) {
    issues.push(`Line ${item.lineNum} contains unexpected brackets or parentheses: ${item.text}`);
  }
});
console.log(`   Total image_url lines found: ${imageUrlLines.length} (expected: 4)`);
if (imageUrlLines.length !== 4) {
  issues.push(`Expected exactly 4 image_url lines, found ${imageUrlLines.length}`);
}

// 5. Exact statement counts
console.log('\n5. Statement Counts:');
const insertMatches = rawContent.match(/INSERT\s+INTO\s+public\.categories/gi) || [];
const onConflictMatches = rawContent.match(/ON\s+CONFLICT\s+\(id\)\s+DO\s+UPDATE\s+SET/gi) || [];
const beginMatches = rawContent.match(/^\s*BEGIN;/gm) || [];
const commitMatches = rawContent.match(/^\s*COMMIT;/gm) || [];
const selectMatches = rawContent.match(/^\s*SELECT\s+/gm) || [];

console.log(`   - INSERT INTO public.categories: ${insertMatches.length} (expected: 4)`);
console.log(`   - ON CONFLICT (id) DO UPDATE SET: ${onConflictMatches.length} (expected: 4)`);
console.log(`   - BEGIN;:                        ${beginMatches.length} (expected: 1)`);
console.log(`   - COMMIT;:                       ${commitMatches.length} (expected: 1)`);
console.log(`   - SELECT verification queries:   ${selectMatches.length} (expected: 3)`);

if (insertMatches.length !== 4) issues.push(`INSERT count is ${insertMatches.length}, expected 4`);
if (onConflictMatches.length !== 4) issues.push(`ON CONFLICT count is ${onConflictMatches.length}, expected 4`);
if (beginMatches.length !== 1) issues.push(`BEGIN count is ${beginMatches.length}, expected 1`);
if (commitMatches.length !== 1) issues.push(`COMMIT count is ${commitMatches.length}, expected 1`);
if (selectMatches.length !== 3) issues.push(`SELECT count is ${selectMatches.length}, expected 3`);

// 6. Scan for any Markdown syntax artifacts
console.log('\n6. Markdown Artifacts Scan:');
const mdLinkSyntax = /\[https?:\/\//i.test(rawContent);
const mdCloseParen = /\]\(/i.test(rawContent);
const mdFencedCode = /```/i.test(rawContent);
const mdBackticks = /`/i.test(rawContent);

console.log(`   - '[https://':    ${mdLinkSyntax ? 'FOUND (ERROR)' : 'NONE (Clean)'}`);
console.log(`   - '](':           ${mdCloseParen ? 'FOUND (ERROR)' : 'NONE (Clean)'}`);
console.log(`   - '` + '``' + `':         ${mdFencedCode ? 'FOUND (ERROR)' : 'NONE (Clean)'}`);
console.log(`   - backticks:      ${mdBackticks ? 'FOUND (ERROR)' : 'NONE (Clean)'}`);

if (mdLinkSyntax) issues.push("Found '[https://' in file");
if (mdCloseParen) issues.push("Found '](' in file");
if (mdFencedCode) issues.push("Found markdown code fence ``` in file");
if (mdBackticks) issues.push("Found markdown backticks in file");

// 7. Summary
console.log('\n================================================================');
if (issues.length === 0) {
  console.log('RAW FILE VERIFIED: CLEAN');
} else {
  console.log('RAW FILE VERIFIED: NOT CLEAN');
  console.log('Issues:');
  issues.forEach(iss => console.log(` - ${iss}`));
  process.exit(1);
}
console.log('================================================================');
