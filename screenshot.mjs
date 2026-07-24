import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN, REPO = process.env.GH_REPO || 'raimis079-creator/petshop-bridge';
function putB64(name, b64) {
  const u = 'https://api.github.com/repos/' + REPO + '/contents/screenshots/' + name;
  let s = '';
  for (let i = 0; i < 3; i++) {
    try { const j = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + TOKG + '" "' + u + '?n=' + Math.random() + '"', { maxBuffer: 50e6 }).toString()); if (j.sha) s = j.sha; } catch (e) {}
    fs.writeFileSync('/tmp/pj.json', JSON.stringify({ message: 'r', content: b64, ...(s ? { sha: s } : {}) }));
    const c = execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ' + TOKG + '" -d @/tmp/pj.json "' + u + '"', { maxBuffer: 50e6 }).toString().trim();
    if (c === '200' || c === '201') return c;
    execSync('sleep 2');
  }
  return 'fail';
}
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
const page = await ctx.newPage();
const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
await page.waitForSelector('#user_login', { timeout: 10000 });
await page.fill('#user_login', U); await page.fill('#user_pass', P);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

const shots = [];
async function snap(name) {
  await page.waitForTimeout(800);
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/' + name + '.png', buf);
  shots.push(name);
}

// 1. Dashboard
await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(4000);
await snap('a01_dashboard');

// 2. Force form mount via JS (bypass broken button)
await page.evaluate(() => {
  localStorage.removeItem('petshop_pet_draft');
  const host = document.querySelector('.pspet-form-root') || document.querySelector('.woocommerce-MyAccount-content');
  if (host && window.PetshopPetForm) { window.PetshopPetForm.mount(host); }
});
await page.waitForTimeout(2000);
await snap('a02_step1_tuscias');

// 3. Select Šuo
const pills = await page.$$('.pspet-pill-species');
for (const p of pills) {
  const txt = await p.textContent();
  if (/Šuo|Dog/.test(txt)) { await p.click(); break; }
}
await page.waitForTimeout(800);
await snap('a03_step1_suo');

// 4. Select Katė (to show that option too)
for (const p of await page.$$('.pspet-pill-species')) {
  const txt = await p.textContent();
  if (/Katė|Cat/.test(txt)) { await p.click(); break; }
}
await page.waitForTimeout(800);
await snap('a04_step1_kate');

// Back to Šuo for the rest
for (const p of await page.$$('.pspet-pill-species')) {
  const txt = await p.textContent();
  if (/Šuo|Dog/.test(txt)) { await p.click(); break; }
}

// 5. Fill name + weight
const nameIn = await page.$('.pspet-input[type="text"]');
if (nameIn) await nameIn.fill('Šarūnas');
const weightIn = await page.$('input[inputmode="decimal"]');
if (weightIn) await weightIn.fill('25');
await page.waitForTimeout(800);
await snap('a05_step1_uzpildytas');

// 6. Click "Sukurti profilį" → goes to step2 (or submits, then we edit)
const createBtn = await page.$('.pspet-btn-primary');
if (createBtn) {
  await createBtn.click();
  await page.waitForTimeout(3000);
  await snap('a06_po_sukurimo');
}

// 7. If we're on dashboard now (profile created), click edit to get step2
const editBtns = await page.$$('.pspet-edit-btn, button:has-text("Redaguoti")');
if (editBtns.length > 0) {
  // find the last created pet
  const last = editBtns[editBtns.length - 1];
  await last.click();
  await page.waitForTimeout(2000);
  await snap('a07_step2_virsus');
}

// 8. If step2 visible — scroll and capture sections
const step2 = await page.$('.pspet-wrap');
if (step2) {
  await snap('a08_step2_top');
  // Scroll to middle
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  await snap('a09_step2_mid');
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await snap('a10_step2_bot');
}

// 9. Clean up test pet
await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await snap('a11_dashboard_final');

await browser.close();

// Upload
const manifest = {};
for (const name of shots) {
  const rc = putB64(name + '.png', fs.readFileSync('/tmp/' + name + '.png').toString('base64'));
  manifest[name] = rc;
}
putB64('shots4.json', Buffer.from(JSON.stringify(manifest)).toString('base64'));
console.log('done', JSON.stringify(manifest));
