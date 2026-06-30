// === sukurk_rinkini.mjs — bridge funkcija fiksuotam MnM rinkiniui ===
// Naudojimas: nustatyti RECEPTAS objektą + MODE ("dry" arba "apply") apačioje, paleisti per bridge.
//
// Recepto formatas:
//   pavadinimas:        "Rinkinio pavadinimas"
//   sku:                "RINK-XYZ-..." (turi būti unikalus)
//   kaina:              13.90  (number, fiksuota dėžės kaina €)
//   dydis:              6      (number, min=max container size)
//   kategorija_slug:    "konservu-rinkiniai" | "skanestu-rinkiniai" | "kramtalu-rinkiniai"
//   trumpas_aprasymas:  "Trumpas pristatymas klientui"
//   komponentai:        [{id: 17421, kiekis: 1}, ...]  (visi kiekiai turi sumuotis iki dydis)
//
// MODE:
//   "dry"   = validuoti receptą, parodyti, ką sukurtų, BE jokių pakeitimų
//   "apply" = sukurti produktą + kompoziciją + priskirti

import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

// === RECEPTAS ===
const RECEPTAS = {
  pavadinimas: "Jaučio ir kiaulės ausų rinkinys šunims · 15 vnt.",
  sku: "RINK-AUSYS-15",
  kaina: 18.39,
  dydis: 15,
  kategorija_slug: "skanestu-rinkiniai",
  trumpas_aprasymas: "Natūralių, džiovintų skanėstų rinkinys — 5 baltos jaučio ausys, 5 rudos jaučio ausys, 5 kiaulės ausys. Tinka kasdieniam apdovanojimui ar kramtymui.",
  komponentai: [
    { id: 19098, kiekis: 5 }, // Balta jaučio ausis (sku 341000)
    { id: 16311, kiekis: 5 }, // Ruda jaučio ausis (sku 723000)
    { id: 16305, kiekis: 5 }  // Ruda kiaulės ausis (sku 338000)
  ]
};
const MODE = "dry"; // "dry" arba "apply"

// === HELPERS ===
function commit(name, str) {
  const url = 'https://api.github.com/repos/' + repo + '/contents/screenshots/' + name;
  let sha = ''; try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
  const body = { message: 'r', branch: 'main', content: Buffer.from(str, 'utf8').toString('base64') }; if (sha) body.sha = sha;
  fs.writeFileSync('/tmp/cb.json', JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer ' + tok + '" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "' + url + '"', { encoding: 'utf8' });
}
function putBin(name, buf) {
  const url = 'https://api.github.com/repos/' + repo + '/contents/screenshots/' + name;
  let sha = ''; try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
  const body = { message: 'r', branch: 'main', content: buf.toString('base64') }; if (sha) body.sha = sha;
  fs.writeFileSync('/tmp/cb2.json', JSON.stringify(body));
  try { execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer ' + tok + '" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "' + url + '"', { encoding: 'utf8' }); } catch (e) {}
}
function exec(cmd) { try { return execSync(cmd, { encoding: 'utf8', maxBuffer: 300000000 }); } catch (e) { return 'EXC:' + String(e).slice(0, 200); } }
function api(method, path, body) {
  let cmd = 'curl -sk -X ' + method + ' -H "Authorization: ' + AUTH + '" -H "Content-Type: application/json"';
  if (body !== undefined) { fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd += ' -d @/tmp/b.json'; }
  cmd += ' "' + BASE + path + '"';
  let raw = exec(cmd);
  try { return JSON.parse(raw); } catch (e) { return { __raw: raw.slice(0, 400) }; }
}

// === LAYOUT plano funkcija — kaip dėlioti N nuotraukų į grid ===
function gridLayout(n) {
  const layouts = {
    1:  { cols: 1, rows: 1 },
    2:  { cols: 2, rows: 1 },
    3:  { cols: 3, rows: 1 },
    4:  { cols: 2, rows: 2 },
    5:  { cols: 3, rows: 2, last_row_count: 2 },  // 3+2
    6:  { cols: 3, rows: 2 },
    7:  { cols: 4, rows: 2, last_row_count: 3 },  // 4+3
    8:  { cols: 4, rows: 2 },
    9:  { cols: 3, rows: 3 },
    10: { cols: 5, rows: 2 },
    11: { cols: 4, rows: 3, last_row_count: 3 },  // 4+4+3
    12: { cols: 4, rows: 3 },
    15: { cols: 5, rows: 3 }
  };
  return layouts[n] || { cols: Math.ceil(Math.sqrt(n)), rows: Math.ceil(n / Math.ceil(Math.sqrt(n))) };
}

// === STEP 1: VALIDATE recipe ===
function validate(r, comp_details) {
  const errs = [];
  if (!r.pavadinimas) errs.push("Trūksta pavadinimo");
  if (!r.sku || !/^RINK-/.test(r.sku)) errs.push("SKU turi prasidėti 'RINK-'");
  if (!r.kaina || r.kaina <= 0) errs.push("Kaina turi būti > 0");
  if (!r.dydis || r.dydis < 2) errs.push("Dydis turi būti ≥ 2");
  if (!r.kategorija_slug) errs.push("Trūksta kategorijos slug");
  if (!Array.isArray(r.komponentai) || r.komponentai.length === 0) errs.push("Trūksta komponentų");

  // Komponentų kiekių suma turi sutapti su dydžiu
  const total_qty = (r.komponentai || []).reduce((s, c) => s + (c.kiekis || 0), 0);
  if (total_qty !== r.dydis) errs.push(`Komponentų kiekių suma (${total_qty}) ≠ dydis (${r.dydis})`);

  // Patikrint visus komponentus
  comp_details.forEach((c, i) => {
    if (c.error) errs.push(`Komponentas #${i+1} (ID ${r.komponentai[i].id}): ${c.error}`);
    else if (c.status !== 'publish') errs.push(`Komponentas #${i+1} (${c.name}) status=${c.status}, ne publish`);
  });

  return errs;
}

// === STEP 2: Generate description HTML ===
function generateDescription(comp_details, dydis) {
  let html = `<h3>Rinkinyje rasite (${dydis} skardinės):</h3>\n<ol>\n`;
  comp_details.forEach(c => {
    if (c.name) html += `  <li>${c.name}</li>\n`;
  });
  html += `</ol>\n<p><em>Gyvūnas visuomet turi turėti šviežio geriamo vandens.</em></p>`;
  return html;
}

// === MAIN ===
(async () => {
  const out = { ts: new Date().toISOString(), mode: MODE, receptas: RECEPTAS };

  // === KATEGORIJOS ID iš slug ===
  const catSearch = api('GET', '/wp-json/wc/v3/products/categories?slug=' + encodeURIComponent(RECEPTAS.kategorija_slug));
  const cat_id = Array.isArray(catSearch) && catSearch[0] && catSearch[0].id;
  if (!cat_id) {
    out.fatal = `Kategorija slug='${RECEPTAS.kategorija_slug}' nerasta`;
    commit('sukurk_result.json', JSON.stringify(out, null, 1));
    console.log("FATAL");
    return;
  }
  out.kategorija_id = cat_id;

  // === KOMPONENTŲ details ===
  const comp_details = [];
  for (const k of RECEPTAS.komponentai) {
    const p = api('GET', '/wp-json/wc/v3/products/' + k.id);
    if (!p || !p.id) { comp_details.push({ id: k.id, error: 'NOT FOUND' }); continue; }
    comp_details.push({
      id: p.id, name: p.name, sku: p.sku, status: p.status,
      price: p.price, qty: p.stock_quantity,
      image: p.images && p.images[0] && p.images[0].src || null,
      kiekis: k.kiekis
    });
  }
  out.komponentai_details = comp_details.map(c => ({ id: c.id, sku: c.sku, name: (c.name || '').slice(0, 60), status: c.status, qty: c.qty, kiekis: c.kiekis, has_image: !!c.image, error: c.error }));

  // === VALIDATE ===
  const errs = validate(RECEPTAS, comp_details);
  out.validation = { ok: errs.length === 0, errors: errs };

  // === Compute derived ===
  const total_alone = comp_details.reduce((s, c) => s + (parseFloat(c.price || 0) * c.kiekis), 0);
  const saving_pct = total_alone > 0 ? Math.round((1 - RECEPTAS.kaina / total_alone) * 100) : 0;
  out.kainos_analize = {
    atskirai_eur: total_alone.toFixed(2),
    rinkinyje_eur: RECEPTAS.kaina.toFixed(2),
    sutaupymas_pct: saving_pct + '%'
  };

  // === Description preview ===
  const desc_html = generateDescription(comp_details, RECEPTAS.dydis);
  out.aprasymo_preview = desc_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // === Layout preview ===
  const layout = gridLayout(RECEPTAS.komponentai.reduce((s, c) => s + c.kiekis, 0));
  out.kompozicijos_layout = `${layout.cols}×${layout.rows}` + (layout.last_row_count ? ` (paskutinė eilutė: ${layout.last_row_count})` : '');

  // === DRY RUN: stop čia ===
  if (MODE === 'dry') {
    out.dry_run_status = 'OK — receptas validus, bet WP NEpakeistas. Pakeisti MODE = "apply" ir paleisti dar kartą, jei viskas tinka.';
    commit('sukurk_result.json', JSON.stringify(out, null, 1));
    console.log("DRY OK errs=" + errs.length);
    return;
  }

  // === APPLY: validation must pass ===
  if (errs.length > 0) {
    out.apply_status = 'BLOCKED — validation errors';
    commit('sukurk_result.json', JSON.stringify(out, null, 1));
    console.log("BLOCKED");
    return;
  }

  // === STEP 3: Create MnM product ===
  const cr = api('POST', '/wp-json/wc/v3/products', {
    name: RECEPTAS.pavadinimas,
    type: 'mix-and-match',
    status: 'publish',
    sku: RECEPTAS.sku,
    regular_price: RECEPTAS.kaina.toFixed(2),
    short_description: RECEPTAS.trumpas_aprasymas,
    description: desc_html,
    categories: [{ id: cat_id }],
    mnm_content_source: 'products',
    mnm_child_items: RECEPTAS.komponentai.map(k => ({ product_id: k.id })),
    mnm_min_container_size: RECEPTAS.dydis,
    mnm_max_container_size: RECEPTAS.dydis,
    mnm_priced_per_product: false
  });
  out.created = { id: (cr && cr.id) || null, sku: cr && cr.sku, status: cr && cr.status, permalink: cr && cr.permalink, err: (cr && (cr.code || cr.__raw)) || null };

  if (!cr || !cr.id) {
    out.fatal = 'Produkto sukurti nepavyko';
    commit('sukurk_result.json', JSON.stringify(out, null, 1));
    console.log("FATAL CREATE");
    return;
  }
  const PID = cr.id;

  // === STEP 4: Generate composition image ===
  let composedPath = null;
  try {
    // Ensure PIL is installed (sometimes runner image varies)
    exec('python3 -c "from PIL import Image" 2>/dev/null || pip3 install --quiet --break-system-packages Pillow 2>&1');

    const tmpDir = '/tmp/rinkimg_' + PID;
    try { fs.mkdirSync(tmpDir, { recursive: true }); } catch (e) {}

    // Download all component images (unique IDs)
    const seen_ids = new Set();
    const dl = [];
    for (const c of comp_details) {
      if (seen_ids.has(c.id)) continue;
      seen_ids.add(c.id);
      if (!c.image) continue;
      // For each kiekis>1, the same image is used (repeated in grid)
      const file = tmpDir + '/c' + c.id + '.jpg';
      exec('curl -sk "' + c.image + '" -o "' + file + '"');
      if (fs.existsSync(file) && fs.statSync(file).size > 1000) {
        // Push it `kiekis` times
        for (let i = 0; i < c.kiekis; i++) dl.push(file);
      }
    }
    out.composition_tiles = dl.length;

    if (dl.length >= 4) {
      composedPath = tmpDir + '/composition.jpg';
      const lay = gridLayout(dl.length);
      const tile_size = 380;
      const gap = 30;
      const W = lay.cols * tile_size + (lay.cols - 1) * gap + 60;
      const H = lay.rows * tile_size + (lay.rows - 1) * gap + 60;

      const pyScript = `
from PIL import Image
tile_size = ${tile_size}
gap = ${gap}
W, H = ${W}, ${H}
cols = ${lay.cols}
rows = ${lay.rows}
last_row_count = ${lay.last_row_count || lay.cols}
files = ${JSON.stringify(dl)}
canvas = Image.new('RGB', (W, H), (248, 248, 248))
pad_x = (W - cols * tile_size - (cols - 1) * gap) // 2
pad_y = (H - rows * tile_size - (rows - 1) * gap) // 2
for i, f in enumerate(files):
    img = Image.open(f).convert('RGB')
    w, h = img.size
    ratio = min(tile_size / w, tile_size / h)
    nw, nh = int(w * ratio), int(h * ratio)
    img = img.resize((nw, nh), Image.LANCZOS)
    tile = Image.new('RGB', (tile_size, tile_size), (255, 255, 255))
    tile.paste(img, ((tile_size - nw) // 2, (tile_size - nh) // 2))
    row = i // cols
    col = i % cols
    # Center last row if it has fewer items
    if row == rows - 1 and last_row_count < cols:
        row_pad_x = (W - last_row_count * tile_size - (last_row_count - 1) * gap) // 2
        x = row_pad_x + col * (tile_size + gap)
    else:
        x = pad_x + col * (tile_size + gap)
    y = pad_y + row * (tile_size + gap)
    canvas.paste(tile, (x, y))
canvas.save('${composedPath}', 'JPEG', quality=88)
print('OK')
`;
      fs.writeFileSync('/tmp/compose.py', pyScript);
      const r = exec('python3 /tmp/compose.py 2>&1');
      out.python_out = r.slice(0, 200);

      if (fs.existsSync(composedPath)) {
        out.composed_size = fs.statSync(composedPath).size;
        // Backup preview to bridge
        putBin('rinkinys_' + PID + '_compo.jpg', fs.readFileSync(composedPath));
      } else {
        composedPath = null;
      }
    } else {
      out.compose_skip = 'Per mažai nuotraukų: ' + dl.length;
    }
  } catch (e) {
    out.compose_err = String(e).slice(0, 300);
  }

  // === STEP 5: Upload + assign featured image ===
  if (composedPath && fs.existsSync(composedPath)) {
    const filename = (RECEPTAS.sku.toLowerCase()) + '.jpg';
    const upCmd = 'curl -sk -X POST -H "Authorization: ' + AUTH + '" '
      + '-H "Content-Disposition: attachment; filename=\\"' + filename + '\\"" '
      + '-H "Content-Type: image/jpeg" '
      + '--data-binary @"' + composedPath + '" '
      + '"' + BASE + '/wp-json/wp/v2/media"';
    const upRaw = exec(upCmd);
    let media; try { media = JSON.parse(upRaw); } catch (e) { media = { __raw: upRaw.slice(0, 300) }; }
    out.media_id = media && media.id;
    out.media_url = media && media.source_url;
    if (media && media.id) {
      const setImg = api('PUT', '/wp-json/wc/v3/products/' + PID, { images: [{ id: media.id }] });
      out.featured_assigned = setImg && setImg.images && setImg.images[0] && setImg.images[0].id;
    }
  }

  // === STEP 6: Verify final state ===
  const final = api('GET', '/wp-json/wc/v3/products/' + PID + '?context=edit');
  out.verify = {
    id: final.id, name: final.name, sku: final.sku, type: final.type, status: final.status,
    price: final.price, purchasable: final.purchasable,
    min: final.mnm_min_container_size, max: final.mnm_max_container_size,
    pool_count: (final.mnm_child_items || []).length,
    cats: (final.categories || []).map(c => c.id + ':' + c.slug).join('|'),
    images: (final.images || []).length,
    permalink: final.permalink
  };

  commit('sukurk_result.json', JSON.stringify(out, null, 1));
  console.log("DONE pid=" + PID);
})();
