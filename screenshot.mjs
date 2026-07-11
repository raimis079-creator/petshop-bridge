import { execSync } from "child_process";
import fs from "fs";

// putFile: raso i analize/ per Contents API (SHA fetch -> PUT), 5 bandymai
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

// Grazina {status, location, xredirectby, finalStatus, finalUrl}
async function trace(path) {
  try {
    const r = await fetch(BASE + path, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 recon' } });
    const loc = r.headers.get('location') || '';
    const xrb = r.headers.get('x-redirect-by') || '';
    let finalStatus = r.status, finalUrl = BASE + path;
    if (r.status >= 300 && r.status < 400 && loc) {
      try {
        const f = await fetch(loc.startsWith('http') ? loc : BASE + loc, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 recon' } });
        finalStatus = f.status; finalUrl = loc;
      } catch (e) {}
    }
    return { status: r.status, location: loc, xredirectby: xrb, finalStatus, finalUrl };
  } catch (e) { return { error: String(e).slice(0, 120) }; }
}

async function getHtml(path) {
  try {
    const r = await fetch(BASE + path, { headers: { 'User-Agent': 'Mozilla/5.0 recon' } });
    return { status: r.status, html: await r.text() };
  } catch (e) { return { error: String(e).slice(0, 120) }; }
}

(async () => {
  const R = {};

  L('=== 1. BLOG P0 straipsniai (turi buti 404 pagal v1.55) ===');
  for (const slug of ['royal-canin-kaciu-maistas', 'sterilizuotu-kaciu-maistas', 'maistas-sterilizuotai-katei-su-antsvorio-problema']) {
    const t = await trace('/' + slug + '/');
    R['blog_' + slug] = t;
    L(`  /${slug}/  -> status ${t.status}${t.location ? ' -> ' + t.location : ''} (final ${t.finalStatus})${t.xredirectby ? ' [x-redirect-by:' + t.xredirectby + ']' : ''}`);
  }

  L('=== 2. /exclusion QA gap (v1.56 #4: WP slug spejimas, x-redirect-by:WordPress = FAIL) ===');
  for (const p of ['/exclusion', '/exclusion/', '/gamintojas/exclusion/']) {
    const t = await trace(p);
    R['excl_' + p] = t;
    L(`  ${p}  -> status ${t.status}${t.location ? ' -> ' + t.location : ''} (final ${t.finalStatus})${t.xredirectby ? ' [x-redirect-by:' + t.xredirectby + ']' : ''}`);
  }

  L('=== 3. Slapuku politika URL (v1.55 #6a: senas 34526 vs Complianz /slapuku-politika-es/) ===');
  for (const p of ['/slapuku-politika/', '/slapuku-politika-es/', '/privatumo-politika/']) {
    const t = await trace(p);
    R['cookie_' + p] = t;
    L(`  ${p}  -> status ${t.status}${t.location ? ' -> ' + t.location : ''} (final ${t.finalStatus})`);
  }

  L('=== 4. Footer nuoroda i slapuku politika (kur rodo realiai) ===');
  const home = await getHtml('/');
  if (home.html) {
    const m = [...home.html.matchAll(/href="([^"]*slapuk[^"]*)"/gi)].map(x => x[1]);
    R.footer_cookie_links = [...new Set(m)];
    L('  Rasti slapuku nuorodos href: ' + JSON.stringify(R.footer_cookie_links));
  } else { L('  home fetch klaida: ' + (home.error || home.status)); }

  L('=== 5. Complianz baneris - pozicija (v1.56 #1: mobile turi buti sticky APACIOJE) ===');
  // Fetch prekes puslapi ir istrauk cmplz banner markup + inline CSS
  const prodHtml = home.html || '';
  const hasCmplz = /cmplz/i.test(prodHtml);
  R.cmplz_present = hasCmplz;
  L('  cmplz markup homepage HTML: ' + hasCmplz);
  if (hasCmplz) {
    // istrauk pirmus cmplz-cookiebanner susijusius CSS/pozicijos raktazodzius
    const posHints = [...prodHtml.matchAll(/cmplz-(bottom|top|center|banner)[^"'\s]*/gi)].map(x => x[0]);
    R.cmplz_position_classes = [...new Set(posHints)].slice(0, 20);
    L('  cmplz pozicijos klases/hints: ' + JSON.stringify(R.cmplz_position_classes));
    // ar yra inline style su position:fixed / bottom
    const styleBlocks = [...prodHtml.matchAll(/cmplz[^{]*\{[^}]*\}/gi)].map(x => x[0]).slice(0, 5);
    R.cmplz_style_snippets = styleBlocks;
  }

  L('=== 6. Indexavimas (turi buti UZBLOKUOTAS dev, atidaromas launch diena) ===');
  const robots = await getHtml('/robots.txt');
  R.robots = robots.html ? robots.html.slice(0, 400) : (robots.error || robots.status);
  L('  robots.txt: ' + (robots.html ? robots.html.replace(/\n/g, ' | ').slice(0, 200) : robots.status));
  // noindex meta homepage
  if (home.html) {
    const noindex = /<meta[^>]*name=["']robots["'][^>]*noindex/i.test(home.html);
    R.homepage_noindex = noindex;
    L('  homepage <meta robots noindex>: ' + noindex);
  }

  L('=== 7. Sitemap busena ===');
  for (const p of ['/wp-sitemap.xml', '/sitemap.xml', '/sitemap_index.xml']) {
    const t = await trace(p);
    R['sitemap_' + p] = { status: t.status, final: t.finalStatus };
    L(`  ${p} -> ${t.status} (final ${t.finalStatus})`);
  }

  putFile('recon_migracija.json', JSON.stringify(R, null, 2));
  putFile('_recon_log.txt', out);
  L('DONE');
})();
