import fs from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uciwtmxydhmwpvlyxcag.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaXd0bXh5ZGhtd3B2bHl4Y2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwODk1NzksImV4cCI6MjEwMjY2NTU3OX0.3LB0nVffOBWf9Fnjnq4rrNm2LI7D6DgGEonOKuNHSu8';

async function fetchTable(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${table}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function escapeSql(val, colName) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return val.toString();
  if (colName === 'craft_details') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  if (Array.isArray(val)) {
    // Array of strings
    if (val.length === 0) return "'{}'";
    const escapedItems = val.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(',');
    return `'{${escapedItems}}'`;
  }
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function run() {
  console.log('Fetching live Supabase tables...');

  const tables = ['pieces', 'journal_notes', 'social_embeds', 'site_settings'];
  let sqlStatements = ['-- Live Supabase Data Export', 'BEGIN;'];

  for (const table of tables) {
    try {
      const rows = await fetchTable(table);
      console.log(`- ${table}: ${rows.length} rows`);

      for (const row of rows) {
        const columns = Object.keys(row);
        const values = columns.map(c => escapeSql(row[c], c));
        const colList = columns.join(', ');
        const valList = values.join(', ');

        const conflictKey = table === 'site_settings' ? 'key' : 'id';
        const updateSets = columns
          .filter(c => c !== conflictKey)
          .map(c => `${c} = EXCLUDED.${c}`)
          .join(', ');

        const sql = `INSERT INTO public.${table} (${colList}) VALUES (${valList}) ON CONFLICT (${conflictKey}) DO UPDATE SET ${updateSets};`;
        sqlStatements.push(sql);
      }
    } catch (e) {
      console.error(`Error on ${table}:`, e.message);
    }
  }

  sqlStatements.push('COMMIT;');
  const sqlOutput = sqlStatements.join('\n');
  fs.writeFileSync('docker/postgres/supabase-data.sql', sqlOutput, 'utf8');
  console.log('Data successfully saved to docker/postgres/supabase-data.sql');
}

run().catch(console.error);
