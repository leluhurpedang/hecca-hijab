import fs from 'fs';
import path from 'path';

const env = fs.readFileSync('.env.local', 'utf-8');
env.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) process.env[k.trim()] = v.join('=').trim();
});

const { supabase } = await import('./src/lib/supabaseClient.js');

// Test 1: embed via products_category_fkey
const r1 = await supabase.from('products').select('id, categories!products_category_fkey(id, slug)');
console.log('Test 1 (categories!products_category_fkey):', r1.error ? r1.error.message : 'SUCCESS');

// Test 2: embed via column 'category'
const r2 = await supabase.from('products').select('id, categories!category(id, slug)');
console.log('Test 2 (categories!category):', r2.error ? r2.error.message : 'SUCCESS');

// Test 3: embed via categories!slug
const r3 = await supabase.from('products').select('id, categories!slug(id, slug)');
console.log('Test 3 (categories!slug):', r3.error ? r3.error.message : 'SUCCESS');

// Test 4: embed via categories!id
const r4 = await supabase.from('products').select('id, categories!id(id, slug)');
console.log('Test 4 (categories!id):', r4.error ? r4.error.message : 'SUCCESS');
