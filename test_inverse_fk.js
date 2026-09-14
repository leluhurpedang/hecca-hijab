import fs from 'fs';
import path from 'path';

const env = fs.readFileSync('.env.local', 'utf-8');
env.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) process.env[k.trim()] = v.join('=').trim();
});

const { supabase } = await import('./src/lib/supabaseClient.js');

const r1 = await supabase.from('categories').select('id, slug, products!products_category_fkey(id)');
console.log('Inverse 1 (products!products_category_fkey):', r1.error ? r1.error.message : 'SUCCESS');

const r2 = await supabase.from('categories').select('id, slug, products!category(id)');
console.log('Inverse 2 (products!category):', r2.error ? r2.error.message : 'SUCCESS');

const r3 = await supabase.from('categories').select('id, slug, products!id(id)');
console.log('Inverse 3 (products!id):', r3.error ? r3.error.message : 'SUCCESS');
