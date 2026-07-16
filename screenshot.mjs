import { execSync } from 'child_process';
import fs from 'fs';

const TOKG = process.env.GH_TOKEN;
const REPO = 'raimis079-creator/petshop-bridge';

function putResult(name, obj) {
  const u = `https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;
  let s = '';
  try {
    const j = JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());
    if (j.sha) s = j.sha;
  } catch (e) {}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({
    message: 'q_tables',
    content: Buffer.from(JSON.stringify(obj, null, 1)).toString('base64'),
    ...(s ? { sha: s } : {})
  }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`, { maxBuffer: 40 * 1024 * 1024 });
}

function get(u) {
  try {
    return execSync(`curl -sL --max-time 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${u}"`, { maxBuffer: 30 * 1024 * 1024 }).toString();
  } catch (e) { return ''; }
}

function decodeEnt(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;|&ndash;|&#8212;/g, '-')
          .replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function parseTables(html) {
  const res = [];
  const tabs = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const t of tabs) {
    const rows = [];
    const trs = t.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (const tr of trs) {
      const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)]
        .map(m => decodeEnt(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim());
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) continue;
    const flat = rows.flat().join(' ');
    const nums = (flat.match(/\d+/g) || []).length;
    const feedish = /svor|kg|norma|kiekis|par[aą]|gram|\bg\b/i.test(flat);
    if (nums >= 6 && feedish) res.push({ rows, nums });
  }
  return res;
}

const out = { pages: {}, wp_diag: {} };

/* ---------- 1. WP DIAGNOSTIKA ---------- */
try {
  const U = process.env.WP_USER || '';
  const P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  out.wp_diag.user_set = U.length > 0;
  out.wp_diag.user_len = U.length;
  out.wp_diag.pass_len = P.length;
  fs.writeFileSync('/tmp/wpu', U); fs.writeFileSync('/tmp/wpp', P);
  const probe = execSync(
    `curl -s -m 30 -o /tmp/wp_out.txt -w "%{http_code}" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/wc/v3/products?search=quattro&per_page=5&status=publish" 2>&1 || echo CURLFAIL`
  ).toString().trim();
  out.wp_diag.http = probe;
  out.wp_diag.body_head = fs.readFileSync('/tmp/wp_out.txt', 'utf8').slice(0, 300);
} catch (e) { out.wp_diag.err = String(e && e.message ? e.message : e).slice(0, 400); }

/* ---------- 2. RETAILER PUSLAPIAI ---------- */
const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));
for (const u of urls) {
  const h = get(u);
  if (!h) { out.pages[u] = { err: 'tuscias' }; continue; }
  const title = (h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1];
  const tabs = parseTables(h);
  out.pages[u] = {
    title: decodeEnt(title.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim().slice(0, 160),
    n_tables: tabs.length,
    tables: tabs.slice(0, 3),
    bytes: h.length
  };
}

putResult('q_tables.json', out);
const withT = Object.values(out.pages).filter(p => p.n_tables > 0).length;
console.log('DONE pages=' + Object.keys(out.pages).length + ' with_tables=' + withT + ' wp_http=' + out.wp_diag.http);
