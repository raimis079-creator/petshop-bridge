import { execSync } from 'child_process';
import fs from 'fs';

function putResult(name, obj) {
  const tok = process.env.GH_TOKEN;
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/${name}`;
  let sha = '';
  try { const j = JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${tok}" "${url}"`).toString()); if (j.sha) sha = j.sha; } catch(e) {}
  const content = Buffer.from(JSON.stringify(obj)).toString('base64');
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: `r ${name}`, content, ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${tok}" -d @/tmp/p.json "${url}"`);
}
function sh(c){ try { return execSync(c,{maxBuffer:30*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }

const out = { ts: new Date().toISOString() };

// 1. Env var VARDAI (ne reiksmes) - kokie WP secretai prieinami
out.env_names = Object.keys(process.env).filter(k => /WP|PASS|USER|AUTH|SECRET/i.test(k) && !/GITHUB|RUNNER|npm/i.test(k));

// 2. Pilni JS failai (base64, kad be sugadinimo)
const f1 = sh('curl -sk --max-time 25 "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-form.js"');
const f2 = sh('curl -sk --max-time 25 "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-profile.js"');
out.pet_form_b64 = Buffer.from(f1).toString('base64');
out.pet_profile_b64 = Buffer.from(f2).toString('base64');

// 3. Kur veda /anketa/ 301
out.anketa_redirect = sh('curl -sk -o /dev/null -w "%{http_code} -> %{redirect_url}" --max-time 15 "https://dev.avesa.lt/anketa/"');

// 4. Ar yra kitu galimu anketos puslapiu
for (const slug of ['augintinis','pet','augintiniai','mano-augintinis-anketa']) {
  out['page_'+slug] = sh(`curl -sk -o /dev/null -w "%{http_code}" --max-time 15 "https://dev.avesa.lt/${slug}/"`);
}

putResult('m8_recon_2.json', out);
console.log('DONE');
