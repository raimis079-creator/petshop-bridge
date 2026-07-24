import { execSync } from 'child_process';
import fs from 'fs';

const TOKG = process.env.GH_TOKEN, REPO = process.env.GH_REPO || 'raimis079-creator/petshop-bridge';
function putB64(name, b64) {
  const u = 'https://api.github.com/repos/' + REPO + '/contents/screenshots/' + name;
  let s = '';
  for (let i = 0; i < 5; i++) {
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

// Admin login via wp-login
await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
await page.waitForSelector('#user_login', { timeout: 10000 });
const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
await page.fill('#user_login', U);
await page.fill('#user_pass', P);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

// Go to pet module
await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(4000);

const shots = [];
async function snap(name) {
  const buf = await page.screenshot({ fullPage: true });
  const path = '/tmp/form_' + name + '.png';
  fs.writeFileSync(path, buf);
  shots.push(path);
}

await snap('01_dashboard');

// Open create form — look for button
const btns = await page.$$('button, a');
for (const b of btns) {
  const txt = await b.textContent().catch(() => '');
  if (/Sukurti|Pridėti|Naujas/.test(txt) && await b.isVisible().catch(() => false)) {
    await b.click();
    await page.waitForTimeout(2000);
    break;
  }
}
await snap('02_form_open');

// Try to interact with form steps
const steps = ['Šuo', 'Katė']; // species buttons
for (const label of steps) {
  const el = await page.$(`text="${label}"`);
  if (el && await el.isVisible().catch(() => false)) {
    await el.click();
    await page.waitForTimeout(1000);
    await snap('03_species_dog');
    break;
  }
}

// Advance through form steps using Next/Toliau buttons
for (let i = 4; i <= 15; i++) {
  let clicked = false;
  for (const sel of ['button:has-text("Toliau")', 'button:has-text("Tęsti")', '.pspet-form-next', '.pspet-btn-next']) {
    const b = await page.$(sel);
    if (b && await b.isVisible().catch(() => false)) {
      await b.click();
      await page.waitForTimeout(2000);
      clicked = true;
      break;
    }
  }
  if (!clicked) break;
  await snap(String(i).padStart(2, '0') + '_step');
}

await browser.close();

// Upload
const manifest = {};
for (const p of shots) {
  const name = p.split('/').pop();
  const rc = putB64(name, fs.readFileSync(p).toString('base64'));
  manifest[name] = rc;
}
putB64('shots2_manifest.json', Buffer.from(JSON.stringify(manifest)).toString('base64'));
console.log('done', JSON.stringify(manifest));
