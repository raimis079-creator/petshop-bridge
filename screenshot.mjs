import { execSync } from "child_process";
import fs from "fs";

function putText(n, s) {
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  for (let a = 0; a < 5; a++) {
    try {
      const url = 'https://api.github.com/repos/' + repo + '/contents/analize/' + n;
      let sha = '';
      try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
      const b = { message: 'r ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') };
      if (sha) b.sha = sha;
      fs.writeFileSync('/tmp/pf.json', JSON.stringify(b));
      const r = execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer ' + tok + '" -d @/tmp/pf.json "' + url + '"', { encoding: 'utf8', maxBuffer: 50000000 });
      if (/HTTP:20[01]/.test(r)) return true;
    } catch (e) {}
    execSync('sleep 3');
  }
  return false;
}

let out = '';
const L = s => { out += s + '\n'; console.log(s); };
const BASE = 'https://dev.avesa.lt';
const U = process.env.WP_USER || '';
const P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');

function sh(cmd) { try { return execSync(cmd, { encoding: 'utf8', maxBuffer: 30000000 }); } catch (e) { return (e.stdout || '') + '[EXIT ' + e.status + ']'; } }

(async () => {
  const R = {};

  L('=== 1. WP REST namespaces ===');
  const ns = sh('curl -s -k -u "' + U + ':' + P + '" "' + BASE + '/wp-json/" ');
  try {
    const j = JSON.parse(ns);
    R.namespaces = j.namespaces || [];
    L('  namespaces: ' + JSON.stringify(R.namespaces));
    L('  code-snippets yra: ' + (R.namespaces || []).some(x => /code-snippets/.test(x)));
  } catch (e) { L('  klaida parse /wp-json/: ' + ns.slice(0, 200)); }

  L('=== 2. code-snippets REST snippets (jei yra) ===');
  const cs = sh('curl -s -k -u "' + U + ':' + P + '" -w "\\nHTTP:%{http_code}" "' + BASE + '/wp-json/code-snippets/v1/snippets?limit=200" ');
  const csCode = (cs.match(/HTTP:(\d+)/) || [])[1] || '?';
  L('  GET /code-snippets/v1/snippets -> HTTP ' + csCode);
  if (csCode === '200') {
    try {
      const arr = JSON.parse(cs.replace(/\nHTTP:\d+$/, ''));
      R.snippets = arr.map(s => ({ id: s.id, name: s.name, active: s.active, scope: s.scope }));
      L('  snippet skaicius: ' + arr.length);
      for (const s of R.snippets) L('    #' + s.id + ' [' + (s.active ? 'ON ' : 'off') + '] ' + s.scope + ' :: ' + s.name);
    } catch (e) { L('  parse klaida: ' + cs.slice(0, 300)); }
  } else {
    L('  body: ' + cs.slice(0, 200));
  }

  L('=== 3. Dabartinis banner custom_css (per layout_fix DRY token) ===');
  const dry = sh('curl -s -k "' + BASE + '/?cmplz_layout=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  try {
    const j = JSON.parse(dry);
    R.banner_dry = j;
    L('  PRIES: ' + JSON.stringify(j.PRIES || {}));
  } catch (e) { L('  layout_fix DRY neatsake JSON (gal snippet deaktyvuotas): ' + dry.slice(0, 200)); }

  putText('deploy_recon.json', JSON.stringify(R, null, 2));
  putText('_deploy_recon_log.txt', out);
  L('DONE');
})();
