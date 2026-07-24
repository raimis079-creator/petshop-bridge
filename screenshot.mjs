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

const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
await page.waitForSelector('#user_login', { timeout: 10000 });
await page.fill('#user_login', U);
await page.fill('#user_pass', P);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

const shots = [];
async function snap(name) {
  const buf = await page.screenshot({ fullPage: true });
  const path = '/tmp/form_' + name + '.png';
  fs.writeFileSync(path, buf);
  shots.push(path);
}

// 1. Dashboard
await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(4000);
await snap('01_dashboard');

// 2. Form page with action=create — triggers form
await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await snap('02_step1_empty');

// 3. Fill species: click Šuo
try {
  await page.click('text=Šuo', { timeout: 5000 });
  await page.waitForTimeout(1000);
  await snap('03_species_dog');
} catch(e) { console.log('no species btn:', e.message); }

// 4. Fill name
try {
  const ni = await page.$('input[name="pet_name"], input[placeholder*="ard"], input[placeholder*="Augintinio"]');
  if (ni) { await ni.fill('TestShot'); await page.waitForTimeout(500); }
  await snap('04_name_filled');
} catch(e) {}

// 5. Fill breed via datalist — type first chars
try {
  const bi = await page.$('input[list], input[name="breed"], input[placeholder*="eislė"], input[placeholder*="Ieško"]');
  if (bi) { await bi.fill('Rotve'); await page.waitForTimeout(1000); }
  await snap('05_breed');
} catch(e) {}

// 6. Birth date
try {
  // LT date selects (year/month/day)
  const ysel = await page.$('select[name*="year"], select.pspet-year');
  if (ysel) { await ysel.selectOption('2024'); await page.waitForTimeout(300); }
  const msel = await page.$('select[name*="month"], select.pspet-month');
  if (msel) { await msel.selectOption({ index: 3 }); await page.waitForTimeout(300); }
  const dsel = await page.$('select[name*="day"], select.pspet-day');
  if (dsel) { await dsel.selectOption('15'); await page.waitForTimeout(300); }
  await snap('06_birth_date');
} catch(e) {}

// 7. Weight
try {
  const wi = await page.$('input[name="weight"], input[name*="svoris"], input[type="number"]');
  if (wi) { await wi.fill('25'); await page.waitForTimeout(500); }
  await snap('07_weight');
} catch(e) {}

// 8. Click Toliau to step 2
try {
  await page.click('button:has-text("Toliau")', { timeout: 5000 });
  await page.waitForTimeout(2000);
  await snap('08_step2');
} catch(e) { console.log('no Toliau:', e.message); }

// 9. Step 2 content — food, allergies
await snap('09_step2_full');

// 10. Scroll down if needed
try {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await snap('10_step2_bottom');
} catch(e) {}

// 11. Try Toliau to step 3
try {
  await page.click('button:has-text("Toliau")', { timeout: 5000 });
  await page.waitForTimeout(2000);
  await snap('11_step3_result');
} catch(e) { console.log('no step3:', e.message); }

await browser.close();

const manifest = {};
for (const p of shots) {
  const name = p.split('/').pop();
  const rc = putB64(name, fs.readFileSync(p).toString('base64'));
  manifest[name] = rc;
}
putB64('shots3_manifest.json', Buffer.from(JSON.stringify(manifest)).toString('base64'));
console.log('done', JSON.stringify(manifest));
