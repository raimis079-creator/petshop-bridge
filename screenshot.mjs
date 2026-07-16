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
    message: 'q_disc',
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

const out = { retailers: {}, wp: {} };

/* ---------- 1. RETAILER DISCOVERY per sitemap ---------- */
const sites = [
  ['petirvet', 'https://petirvet.lt'],
  ['dogsnanny', 'https://dogsnanny.lt'],
];

for (const [key, base] of sites) {
  const r = { sitemaps_tried: [], product_sitemaps: [], quattro_urls: [] };
  try {
    // robots.txt -> sitemap nuorodos
    const robots = get(base + '/robots.txt');
    let maps = [...robots.matchAll(/Sitemap:\s*(\S+)/gi)].map(m => m[1].trim());
    if (!maps.length) maps = [base + '/wp-sitemap.xml', base + '/sitemap_index.xml', base + '/sitemap.xml'];
    r.sitemaps_tried = maps;

    // surenkam visus product sitemap'us is indekso
    const seen = new Set();
    const queue = [...maps];
    while (queue.length) {
      const sm = queue.shift();
      if (seen.has(sm) || seen.size > 25) continue;
      seen.add(sm);
      const xml = get(sm);
      if (!xml) continue;
      const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m => m[1]);
      const isIndex = /<sitemapindex/i.test(xml);
      if (isIndex) {
        for (const l of locs) if (/product|preke|prekes|produkt/i.test(l)) { queue.push(l); r.product_sitemaps.push(l); }
      } else {
        for (const l of locs) if (/quattro|qattro/i.test(l)) r.quattro_urls.push(l);
      }
    }

    // fallback: WooCommerce paieska
    if (!r.quattro_urls.length) {
      const s = get(base + '/?s=quattro&post_type=product');
      const hrefs = [...s.matchAll(/href="(https?:\/\/[^"]*?(?:quattro|qattro)[^"]*?)"/gi)].map(m => m[1]);
      r.quattro_urls = [...new Set(hrefs)];
      r.via = 'search-fallback';
    }
    r.quattro_urls = [...new Set(r.quattro_urls)];
    r.count = r.quattro_urls.length;
  } catch (e) { r.err = String(e && e.message ? e.message : e).slice(0, 300); }
  out.retailers[key] = r;
}

/* ---------- 2. WP: Quattro SKU sarasas ---------- */
try {
  const U = process.env.WP_USER;
  const P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  const items = [];
  for (let page = 1; page <= 3; page++) {
    const j = execSync(
      `curl -s -u "$WPU:$WPP" "https://dev.avesa.lt/wp-json/wc/v3/products?search=quattro&per_page=100&status=publish&page=${page}"`,
      { maxBuffer: 40 * 1024 * 1024, env: { ...process.env, WPU: U, WPP: P } }
    ).toString();
    let arr;
    try { arr = JSON.parse(j); } catch (e) { out.wp.parse_err = j.slice(0, 200); break; }
    if (!Array.isArray(arr) || !arr.length) break;
    for (const p of arr) items.push({ id: p.id, sku: p.sku, name: p.name, stock: p.stock_status, cat: (p.categories || []).map(c => c.name).join('/') });
    if (arr.length < 100) break;
  }
  out.wp.total = items.length;
  out.wp.instock = items.filter(i => i.stock === 'instock').length;
  out.wp.items = items;
} catch (e) { out.wp.err = String(e && e.message ? e.message : e).slice(0, 300); }

putResult('q_disc.json', out);
console.log('DONE', JSON.stringify({
  petirvet: out.retailers.petirvet && out.retailers.petirvet.count,
  dogsnanny: out.retailers.dogsnanny && out.retailers.dogsnanny.count,
  wp: out.wp.total
}));
