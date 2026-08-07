// S636 — storas ėjimas: (1) išjungti 1358 ir 493, (2) diegti DB probe snippetą,
// (3) dry-run trynimo kandidatai + backup, (4) filtrų puslapio ekrano nuotrauka
const USER = process.env.WP_USER.trim();
const PASS = process.env.WP_APP_PASS.trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');
const BASE = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK  = process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const PROBE_B64 = 'aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19zbmlwZGInXT8/JycpIT09J1M2MzZ4JykgcmV0dXJuOwogIGlmKCEoIGN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykgfHwgKCgkX0dFVFsnayddPz8nJyk9PT0ncHMyMDI2JykgKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHQgPSAkd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7ICRvdXQgPSBhcnJheSgndic9PidTTklQREItVjEnKTsKICAkb3V0Wyd0YWJsZSddID0gJHQ7CiAgJG91dFsnZXhpc3RzJ10gPSAoYm9vbCkgJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpOwogIGlmKCEkb3V0WydleGlzdHMnXSl7IGhlYWRlcignQ29udGVudC1UeXBlOmFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsgfQogICRvdXRbJ3RvdGFsJ10gID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgJG91dFsnYWN0aXZlJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgYWN0aXZlPTEiKTsKICAvLyBUUllOSU1PIEtBTkRJREFUQUk6IG5lYWt0eXbFq3MgSVIgcGF2YWRpbmltZSBURU1QIC8gKHRlbXApIC8gdG1wCiAgJHdoZXJlID0gImFjdGl2ZT0wIEFORCAoIG5hbWUgTElLRSAnVEVNUCUnIE9SIG5hbWUgTElLRSAnJSh0ZW1wKSUnIE9SIG5hbWUgTElLRSAnJSB0bXAlJyBPUiBuYW1lIExJS0UgJyV0bXAgJScgT1IgbmFtZSBMSUtFICclVEVNUCAlJyBPUiBuYW1lIExJS0UgJyUodG1wKSUnICkiOwogICRvdXRbJ2thbmRpZGF0YWknXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSAkd2hlcmUiKTsKICAkb3V0WydrYW5kX3B2eiddICAgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NICR0IFdIRVJFICR3aGVyZSBPUkRFUiBCWSBpZCBMSU1JVCAyNSIsIEFSUkFZX0EpOwogIC8vIFNBVUdJS0xJUzogYXIgdGFycCBrYW5kaWRhdMWzIG7El3JhIGFrdHl2acWzIGFyYmEgc3ZhcmJpxbMgSUQKICAkb3V0WydzYXVnaWtsaXNfYWt0eXZ1c190YXJwX2thbmQnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSAoJHdoZXJlKSBBTkQgYWN0aXZlPTEiKTsKICAka2VlcCA9IGFycmF5KDIzODQsMjM4Nyw0OTIsNDkzLDEzNTcsMTM1OCw3MDcsMjA1MSw0NzIsNDY5KTsKICAkb3V0WydzYXVnaWtsaXNfc3ZhcmJ1cyddID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NICR0IFdIRVJFICgkd2hlcmUpIEFORCBpZCBJTiAoIi5pbXBsb2RlKCcsJywka2VlcCkuIikiKTsKICAvLyBMSUtVVElTIHBvIGhpcG90ZXRpbmlvIHRyeW5pbW8KICAkb3V0WydsaWt0dSddID0gJG91dFsndG90YWwnXSAtICRvdXRbJ2thbmRpZGF0YWknXTsKICAvLyBuZWFrdHl2xatzIEJFIHRlbXAgcG/FvnltaW8gKGrFsyBuZWxpZXNpbSkKICAkb3V0WyduZWFrdHl2dXNfYmVfdGVtcCddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGFjdGl2ZT0wIEFORCBOT1QgKCAkd2hlcmUgKSIpOwogIC8vIGFyIHlyYSBiYWNrdXAgbGVudGVsxJcKICAkYiA9ICR0LidfYmFrX3M2MzYnOwogICRvdXRbJ2JhY2t1cF95cmEnXSA9IChib29sKSAkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJGInIik7CiAgaWYoKCRfR0VUWydkbyddPz8nJyk9PT0nYmFja3VwJyAmJiAhJG91dFsnYmFja3VwX3lyYSddKXsKICAgICR3cGRiLT5xdWVyeSgiQ1JFQVRFIFRBQkxFICRiIExJS0UgJHQiKTsKICAgICR3cGRiLT5xdWVyeSgiSU5TRVJUIElOVE8gJGIgU0VMRUNUICogRlJPTSAkdCIpOwogICAgJG91dFsnYmFja3VwX3N1a3VydGEnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkYiIpOwogIH0gZWxzZWlmKCRvdXRbJ2JhY2t1cF95cmEnXSkgewogICAgJG91dFsnYmFja3VwX2VpbHVjaXUnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkYiIpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTphcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0LCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgNik7Cg==';

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
async function putFile(path, buf, msg) {
  const url = 'https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/' + path;
  let sha;
  const g = await fetch(url, { headers: { Authorization: 'Bearer ' + TOK } });
  if (g.status === 200) sha = (await g.json()).sha;
  const body = { message: msg, content: buf.toString('base64') };
  if (sha) body.sha = sha;
  const r = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  console.log('putFile', path, r.status);
}

const out = { version: 'S636-V1', errors: [] };

// ---------- 0) PRIEŠ: filtrų puslapio HTML matavimas ----------
const FURL = 'https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/';
async function matuok(tag) {
  try {
    const r = await fetch(FURL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const h = await r.text();
    return {
      http: r.status, len: h.length,
      style_ps_open: (h.match(/id="ps-open-filter"/g) || []).length,
      yith_filter_blokai: (h.match(/yith-wcan-filter/g) || []).length,
      filter_content: (h.match(/filter-content/g) || []).length,
      placeholder: (h.match(/yith-wcan-filters-placeholder|filters-placeholder/g) || []).length,
    };
  } catch (e) { return { err: String(e) }; }
}
out.pries = await matuok('pries');

// ---------- 1) IŠJUNGTI 1358 ir 493 ----------
for (const id of [1358, 493]) {
  try {
    const r = await fetch(BASE + '/' + id, {
      method: 'POST', headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    await r.text();
    const v = await (await fetch(BASE + '/' + id, { headers: { Authorization: AUTH } })).json();
    out['isjungta_' + id] = { name: v.name, active: v.active };
  } catch (e) { out.errors.push({ step: 'off' + id, e: String(e) }); }
}

// ---------- 2) PO: tas pats matavimas ----------
await new Promise(r => setTimeout(r, 4000));
out.po = await matuok('po');

// ---------- 3) DB probe snippeto diegimas ----------
try {
  const code = Buffer.from(PROBE_B64, 'base64').toString('utf8');
  const r = await fetch(BASE, {
    method: 'POST', headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'TEMP Snippetu DB Probe v1 (S636)', code, scope: 'global', active: true, priority: 10 }),
  });
  const j = await r.json();
  out.probe = { http: r.status, id: j.id, active: j.active };
  out.probe_id = j.id;
} catch (e) { out.errors.push({ step: 'probe', e: String(e) }); }

// ---------- 4) dry-run + backup ----------
if (out.probe_id) {
  await new Promise(r => setTimeout(r, 3000));
  try {
    const u = 'https://dev.avesa.lt/?ps_snipdb=S636x&k=ps2026&do=backup&cb=' + Date.now();
    const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const t = await r.text();
    try { out.db = JSON.parse(t); } catch (e) { out.db_raw = t.slice(0, 2500); }
  } catch (e) { out.errors.push({ step: 'db', e: String(e) }); }
}

// ---------- 5) ekrano nuotrauka ----------
try {
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1400, height: 1100 }, ignoreHTTPSErrors: true });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(FURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pg.waitForTimeout(4000);
  const buf = await pg.screenshot({ fullPage: false });
  await putFile('screenshots/s636_filtrai.png', buf, 'S636 filtrai po isjungimo');
  out.js_klaidos = errs;
  // matomumo matavimas naršyklėje
  out.dom = await pg.evaluate(() => {
    const fs = document.querySelectorAll('.yith-wcan-filters .yith-wcan-filter');
    const res = [];
    fs.forEach((f, i) => {
      const c = f.querySelector('.filter-content');
      const t = f.querySelector('.filter-title');
      res.push({
        i, title: t ? t.textContent.trim().slice(0, 30) : null,
        display: c ? getComputedStyle(c).display : 'NO-CONTENT',
        h: c ? Math.round(c.getBoundingClientRect().height) : 0,
      });
    });
    return { filtru: fs.length, sarasas: res.slice(0, 8), styleTags: document.querySelectorAll('#ps-open-filter').length };
  });
  await br.close();
} catch (e) { out.errors.push({ step: 'shot', e: String(e) }); }

await putResult('s636_v1.json', out);
console.log('DONE');
