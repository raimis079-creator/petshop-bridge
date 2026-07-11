import { execSync } from "child_process";
import fs from "fs";
function putText(n, s) {
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  for (let a = 0; a < 5; a++) { try {
      const url = 'https://api.github.com/repos/' + repo + '/contents/analize/' + n;
      let sha = ''; try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
      const b = { message: 'a ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') }; if (sha) b.sha = sha;
      fs.writeFileSync('/tmp/pf.json', JSON.stringify(b));
      const r = execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer ' + tok + '" -d @/tmp/pf.json "' + url + '"', { encoding: 'utf8', maxBuffer: 50000000 });
      if (/HTTP:20[01]/.test(r)) return true;
    } catch (e) {} execSync('sleep 3'); } return false;
}
let out = ''; const L = s => { out += s + '\n'; console.log(s); };
const BASE = 'https://dev.avesa.lt';
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async () => {
  const R = {};
  try {
    const apply = sh('curl -s -k "' + BASE + '/?ps_cmplz_mobile=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_MOBILE"');
    L('=== APPLY ===');
    L(apply.slice(0, 1400));
    R.apply_raw = apply.slice(0, 3000);
    L('DONE');
  } catch (e) { L('!!! EXC: ' + e); }
  finally { putText('cmplz_apply.json', JSON.stringify(R, null, 2)); putText('_run2_log.txt', out); }
})();
