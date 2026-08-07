// S635 — aktyvių snippetų dublikatų analizė (read-only)
// Tikslas: 1357/1358, 707/2051, 492/493 kodas + visų aktyvių hash palyginimas
const USER = process.env.WP_USER.trim();
const PASS = process.env.WP_APP_PASS.trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');
const BASE = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK = process.env.GH_TOKEN;
const crypto = await import('node:crypto');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function putResult(name, obj) {
  const url = 'https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/' + name;
  let sha;
  const g = await fetch(url, { headers: { Authorization: 'Bearer ' + TOK } });
  if (g.status === 200) sha = (await g.json()).sha;
  const body = { message: 'result ' + name, content: Buffer.from(JSON.stringify(obj, null, 1)).toString('base64') };
  if (sha) body.sha = sha;
  const r = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  console.log('putResult', name, r.status);
}

const PAIRS = [1357, 1358, 707, 2051, 492, 493];
const out = { version: 'SNIPDUP-V1', pairs: {}, active_hashes: [], dup_groups: [], rest_routes: {}, errors: [] };

// 1) porų pilnas kodas
for (const id of PAIRS) {
  try {
    const r = await fetch(BASE + '/' + id, { headers: { Authorization: AUTH } });
    const j = await r.json();
    const code = j.code || '';
    out.pairs[id] = {
      name: j.name, active: j.active, scope: j.scope, priority: j.priority,
      modified: j.modified, len: code.length,
      sha: crypto.createHash('sha256').update(code).digest('hex').slice(0, 16),
      code_b64: Buffer.from(code).toString('base64'),
    };
  } catch (e) { out.errors.push({ id, e: String(e) }); }
}

// 2) VISŲ aktyvių snippetų kodo hash — rasti tikslius dublikatus
try {
  const r = await fetch(BASE, { headers: { Authorization: AUTH } });
  const all = await r.json();
  const act = all.filter(s => s.active);
  for (const s of act) {
    const code = s.code || '';
    out.active_hashes.push({
      id: s.id, name: s.name, scope: s.scope, len: code.length,
      sha: crypto.createHash('sha256').update(code).digest('hex').slice(0, 16),
      // REST route ir hook markeriai
      routes: (code.match(/register_rest_route\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g) || []).slice(0, 6),
      shortcodes: (code.match(/add_shortcode\s*\(\s*['"]([^'"]+)['"]/g) || []).slice(0, 6),
    });
  }
  // grupuojam pagal hash
  const byHash = {};
  for (const s of out.active_hashes) { (byHash[s.sha] = byHash[s.sha] || []).push(s.id); }
  out.dup_groups = Object.entries(byHash).filter(([, v]) => v.length > 1)
    .map(([h, ids]) => ({ sha: h, ids, name: out.active_hashes.find(x => x.id === ids[0]).name }));

  // route konfliktai tarp AKTYVIŲ
  const byRoute = {};
  for (const s of out.active_hashes) {
    for (const r2 of s.routes) { (byRoute[r2] = byRoute[r2] || []).push(s.id); }
    for (const sc of s.shortcodes) { (byRoute[sc] = byRoute[sc] || []).push(s.id); }
  }
  out.rest_routes = Object.fromEntries(Object.entries(byRoute).filter(([, v]) => v.length > 1));
  out.active_count = act.length;
} catch (e) { out.errors.push({ step: 'all', e: String(e) }); }

await putResult('snipdup_v1.json', out);
console.log('DONE dupgroups=' + out.dup_groups.length + ' routeconf=' + Object.keys(out.rest_routes).length);
