// S634 — 13 aktyvių laikinų snippetų IŠJUNGIMAS (active:false) + patikra
const USER = process.env.WP_USER.trim();
const PASS = process.env.WP_APP_PASS.trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');
const BASE = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK = process.env.GH_TOKEN;
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

const TARGETS = [736, 738, 797, 798, 799, 800, 801, 802, 803, 804, 805, 1410, 1647];
const out = { version: 'SNIPOFF-V1', steps: {}, verify: {}, errors: [] };

// 1) išjungimas
for (const id of TARGETS) {
  try {
    const r = await fetch(BASE + '/' + id, {
      method: 'POST',
      headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    let txt = await r.text();
    let act = null;
    try { act = JSON.parse(txt).active; } catch (e) {}
    out.steps[id] = { http: r.status, active_after_post: act };
  } catch (e) { out.errors.push({ id, e: String(e) }); }
}

// 2) NEPRIKLAUSOMA patikra — perskaitom iš naujo
for (const id of TARGETS) {
  try {
    const r = await fetch(BASE + '/' + id, { headers: { Authorization: AUTH } });
    const j = await r.json();
    out.verify[id] = { name: j.name, active: j.active };
  } catch (e) { out.errors.push({ id, step: 'verify', e: String(e) }); }
}

// 3) bendras aktyvių skaičius PO
try {
  const r = await fetch(BASE, { headers: { Authorization: AUTH } });
  const all = await r.json();
  out.total = all.length;
  out.active_after = all.filter(s => s.active).length;
  out.still_active_temp = all.filter(s => s.active && /temp|tmp/i.test(s.name)).map(s => ({ id: s.id, name: s.name }));
} catch (e) { out.errors.push({ step: 'count', e: String(e) }); }

await putResult('snipoff_v1.json', out);
console.log('DONE active_after=' + out.active_after);
