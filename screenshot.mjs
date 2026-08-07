// TEMP snippetų skaitymas (read-only) — S633 žingsnis 1
// Tikslas: 13 aktyvių laikinų (736,738,797,798-805,1410,1647) pilnas kodas
// + visų snippetų inventorius (id, name, active, scope) statistikai.
const USER = process.env.WP_USER.trim();
const PASS = process.env.WP_APP_PASS.trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');
const BASE = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK = process.env.GH_TOKEN;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function putResult(name, obj) {
  const path = 'screenshots/' + name;
  const url = 'https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/' + path;
  let sha = undefined;
  const g = await fetch(url, { headers: { Authorization: 'Bearer ' + TOK } });
  if (g.status === 200) { const j = await g.json(); sha = j.sha; }
  const body = {
    message: 'result ' + name,
    content: Buffer.from(JSON.stringify(obj, null, 1)).toString('base64'),
  };
  if (sha) body.sha = sha;
  const r = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log('putResult', name, r.status);
}

const TARGETS = [736, 738, 797, 798, 799, 800, 801, 802, 803, 804, 805, 1410, 1647];

const out = { version: 'SNIPREAD-V1', targets: {}, inventory: null, errors: [] };

// 1) tiksliniai snippetai — pilnas kodas
for (const id of TARGETS) {
  try {
    const r = await fetch(BASE + '/' + id, { headers: { Authorization: AUTH } });
    if (r.status !== 200) { out.targets[id] = { http: r.status }; continue; }
    const j = await r.json();
    out.targets[id] = {
      name: j.name, active: j.active, scope: j.scope, priority: j.priority,
      modified: j.modified, code_b64: Buffer.from(j.code || '').toString('base64'),
      code_len: (j.code || '').length,
    };
  } catch (e) { out.errors.push({ id, e: String(e) }); }
}

// 2) inventorius — visi snippetai be kodo
try {
  const r = await fetch(BASE, { headers: { Authorization: AUTH } });
  if (r.status === 200) {
    const all = await r.json();
    out.inventory = all.map(s => ({
      id: s.id, name: s.name, active: s.active ? 1 : 0, scope: s.scope,
    }));
    out.inventory_count = all.length;
    out.active_count = all.filter(s => s.active).length;
  } else {
    out.inventory = 'HTTP ' + r.status;
  }
} catch (e) { out.errors.push({ step: 'inventory', e: String(e) }); }

await putResult('snipread_v1.json', out);
console.log('DONE targets=' + Object.keys(out.targets).length + ' inv=' + (out.inventory_count || '?'));
