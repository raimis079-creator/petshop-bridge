import { execSync } from 'child_process';
import fs from 'fs';
function putResult(name, obj) {
  const tok = process.env.GH_TOKEN;
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/${name}`;
  let sha = '';
  try { const j = JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${tok}" "${url}"`).toString()); if (j.sha) sha = j.sha; } catch(e) {}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: `r ${name}`, content: Buffer.from(JSON.stringify(obj)).toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${tok}" -d @/tmp/p.json "${url}"`);
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
let temps = [];
try {
  const j = JSON.parse(list);
  temps = j.filter(s => /TEMP M8/i.test(s.name)).map(s => ({id: s.id, name: s.name, active: s.active}));
} catch(e) { out.list_err = list.slice(0,300); }
out.found = temps;
out.deleted = [];
for (const t of temps) {
  const d = sh(`curl -sk -X DELETE -H "Authorization: Basic ${AUTH}" "${API}/${t.id}"`);
  out.deleted.push({id: t.id, resp: d.slice(0,120)});
}
// Pakartotine patikra
const list2 = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list2).filter(s => /TEMP M8/i.test(s.name)).length; } catch(e) { out.remaining = 'err'; }
putResult('m8_cleanup_1.json', out);
console.log('DONE');
