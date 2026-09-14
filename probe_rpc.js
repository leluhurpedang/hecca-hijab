import fs from 'fs';
import path from 'path';

const env = fs.readFileSync('.env.local', 'utf-8');
env.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) process.env[k.trim()] = v.join('=').trim();
});

const { supabase } = await import('./src/lib/supabaseClient.js');

const funcs = ['exec_sql', 'execute_sql', 'sql', 'query', 'run_sql', 'is_admin'];
for (const f of funcs) {
  const { data, error } = await supabase.rpc(f);
  console.log(`rpc('${f}'):`, error ? `${error.message} (${error.code})` : 'EXISTS');
}
