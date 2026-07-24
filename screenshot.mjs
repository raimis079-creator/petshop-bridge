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
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Login as admin
const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
await page.goto('https://dev.avesa.lt/wp-login.php', { waitUntil: 'networkidle', timeout: 30000 });
await page.fill('#user_login', U);
await page.fill('#user_pass', P);
await page.click('#wp-submit');
await page.waitForLoadState('networkidle');

// Navigate to Mano augintinis
await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/s01_dashboard.png', fullPage: true });

// Click "Sukurti profilį" or first pet
const createBtn = await page.$('text=Sukurti profilį');
const petCard = await page.$('.pspet-pet-card');
if (createBtn) {
  await createBtn.click();
} else if (petCard) {
  await petCard.click();
}
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/s02_form_start.png', fullPage: true });

// Fill step by step — look for the questionnaire form
// Step 1: species selection
const dogBtn = await page.$('text=Šuo');
if (dogBtn) {
  await dogBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/s03_species.png', fullPage: true });
}

// Step 2: name
const nameInput = await page.$('input[name="pet_name"], input[placeholder*="Vard"]');
if (nameInput) {
  await nameInput.fill('TestShot');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/s04_name.png', fullPage: true });
}

// Click next/continue buttons
async function clickNext() {
  for (const sel of ['text=Toliau', 'text=Tęsti', 'button.pspet-next', '.pspet-btn-next']) {
    const b = await page.$(sel);
    if (b && await b.isVisible()) { await b.click(); await page.waitForTimeout(1500); return true; }
  }
  return false;
}

// Capture remaining steps
for (let i = 5; i <= 14; i++) {
  const clicked = await clickNext();
  if (!clicked) break;
  await page.screenshot({ path: `/tmp/s${String(i).padStart(2,'0')}_step.png`, fullPage: true });
}

await browser.close();

// Upload all screenshots
const files = fs.readdirSync('/tmp').filter(f => f.startsWith('s0') || f.startsWith('s1')).sort();
const manifest = {};
for (const f of files) {
  const b64 = fs.readFileSync('/tmp/' + f).toString('base64');
  const rc = putB64('form_' + f.replace('.png', '') + '.png', b64);
  manifest[f] = rc;
}
putB64('shots_manifest.json', Buffer.from(JSON.stringify(manifest)).toString('base64'));
console.log('done', JSON.stringify(manifest));
