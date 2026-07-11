import { execSync } from "child_process";
import fs from "fs";

function putFile(n, s) {
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  for (let a = 0; a < 5; a++) {
    try {
      const url = 'https://api.github.com/repos/' + repo + '/contents/analize/' + n;
      let sha = '';
      try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
      const b = { message: 'recon ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') };
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
const UA = 'Mozilla/5.0 (recon)';
const WP_USER = process.env.WP_USER || '';
const WP_PASS = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');

function sh(cmd) { try { return execSync(cmd, { encoding: 'utf8', maxBuffer: 20000000 }); } catch (e) { return (e.stdout || '') + '\n[EXIT ' + (e.status) + '] ' + String(e.stderr || '').slice(0, 200); } }

// Grazina headerius + status (be redirect sekimo)
function head(path, auth) {
  const a = auth ? ('-u "' + WP_USER + ':' + WP_PASS + '" ') : '';
  const cmd = 'curl -s -k -I ' + a + '-A "' + UA + '" -o /tmp/h.txt -w "%{http_code}|%{redirect_url}" "' + BASE + path + '" 2>/tmp/err.txt; echo "==CODE=="; cat /tmp/err.txt';
  const r = sh(cmd);
  let headers = '';
  try { headers = fs.readFileSync('/tmp/h.txt', 'utf8'); } catch (e) {}
  const cw = r.split('==CODE==');
  const codeline = (cw[0] || '').trim();
  const err = (cw[1] || '').trim();
  const [code, redir] = codeline.split('|');
  const xrb = (headers.match(/x-redirect-by:\s*([^\r\n]+)/i) || [])[1] || '';
  const loc = (headers.match(/^location:\s*([^\r\n]+)/im) || [])[1] || '';
  return { code, redir: (redir || loc || '').trim(), xrb: xrb.trim(), err, headers: headers.slice(0, 600) };
}

(async () => {
  const R = {};

  L('=== 0. DIAGNOSTIKA: ar dev.avesa.lt pasiekiamas / uz basic-auth? ===');
  const d0 = head('/', false);
  L('  homepage (be auth): code=' + d0.code + ' err=' + (d0.err || 'nera'));
  R.diag_noauth = d0;
  if (d0.code === '401' || d0.code === '000' || !d0.code) {
    const d1 = head('/', true);
    L('  homepage (su WP basic auth): code=' + d1.code + ' err=' + (d1.err || 'nera'));
    R.diag_auth = d1;
  }
  L('  WP_USER set: ' + (WP_USER ? 'yes' : 'NO') + ' | WP_PASS len: ' + WP_PASS.length);

  // Nustatom ar naudoti auth visur
  const useAuth = (d0.code === '401');
  L('  -> naudosime auth: ' + useAuth);

  L('=== 1. BLOG P0 straipsniai (v1.55: turi buti 404) ===');
  for (const slug of ['royal-canin-kaciu-maistas', 'sterilizuotu-kaciu-maistas', 'maistas-sterilizuotai-katei-su-antsvorio-problema']) {
    const t = head('/' + slug + '/', useAuth);
    R['blog_' + slug] = t;
    L(`  /${slug}/  -> ${t.code}${t.redir ? ' -> ' + t.redir : ''}${t.xrb ? ' [x-redirect-by:' + t.xrb + ']' : ''}`);
  }

  L('=== 2. /exclusion QA gap (v1.56 #4) ===');
  for (const p of ['/exclusion', '/exclusion/', '/gamintojas/exclusion/']) {
    const t = head(p, useAuth);
    R['excl_' + p] = t;
    L(`  ${p}  -> ${t.code}${t.redir ? ' -> ' + t.redir : ''}${t.xrb ? ' [x-redirect-by:' + t.xrb + ']' : ''}`);
  }

  L('=== 3. Slapuku politika URL (v1.55 #6a) ===');
  for (const p of ['/slapuku-politika/', '/slapuku-politika-es/', '/privatumo-politika/']) {
    const t = head(p, useAuth);
    R['cookie_' + p] = t;
    L(`  ${p}  -> ${t.code}${t.redir ? ' -> ' + t.redir : ''}${t.xrb ? ' [x-redirect-by:' + t.xrb + ']' : ''}`);
  }

  L('=== 4. Footer slapuku nuoroda (homepage HTML) ===');
  const a = useAuth ? ('-u "' + WP_USER + ':' + WP_PASS + '" ') : '';
  sh('curl -s -k ' + a + '-A "' + UA + '" "' + BASE + '/" -o /tmp/home.html 2>/dev/null');
  let homeHtml = '';
  try { homeHtml = fs.readFileSync('/tmp/home.html', 'utf8'); } catch (e) {}
  L('  homepage HTML dydis: ' + homeHtml.length + ' baitu');
  if (homeHtml.length > 500) {
    const links = [...homeHtml.matchAll(/href="([^"]*slapuk[^"]*)"/gi)].map(x => x[1]);
    R.footer_cookie_links = [...new Set(links)];
    L('  slapuku nuorodos: ' + JSON.stringify(R.footer_cookie_links));
    // Complianz baneris
    const hasCmplz = /cmplz/i.test(homeHtml);
    R.cmplz_present = hasCmplz;
    L('  cmplz markup: ' + hasCmplz);
    if (hasCmplz) {
      const posHints = [...homeHtml.matchAll(/cmplz-(?:banner|bottom|top|center)[a-z-]*/gi)].map(x => x[0]);
      R.cmplz_hints = [...new Set(posHints)].slice(0, 25);
      L('  cmplz klases: ' + JSON.stringify(R.cmplz_hints));
    }
    // noindex
    R.homepage_noindex = /<meta[^>]*name=["']robots["'][^>]*noindex/i.test(homeHtml);
    L('  homepage noindex meta: ' + R.homepage_noindex);
  }

  L('=== 5. robots.txt + sitemap ===');
  sh('curl -s -k ' + a + '-A "' + UA + '" "' + BASE + '/robots.txt" -o /tmp/robots.txt 2>/dev/null');
  let robots = '';
  try { robots = fs.readFileSync('/tmp/robots.txt', 'utf8'); } catch (e) {}
  R.robots = robots.slice(0, 500);
  L('  robots.txt (' + robots.length + 'b): ' + robots.replace(/\n/g, ' | ').slice(0, 250));
  for (const p of ['/wp-sitemap.xml', '/sitemap_index.xml']) {
    const t = head(p, useAuth);
    R['sitemap_' + p] = { code: t.code, redir: t.redir };
    L(`  ${p} -> ${t.code}${t.redir ? ' -> ' + t.redir : ''}`);
  }

  putFile('recon_migracija.json', JSON.stringify(R, null, 2));
  putFile('_recon_log.txt', out);
  L('DONE');
})();
