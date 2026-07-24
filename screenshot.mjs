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
const o = { failed: [], scripts: [] };
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  page.on('requestfailed', req => { o.failed.push(req.url() + ' :: ' + (req.failure() ? req.failure().errorText : '')); });
  page.on('response', res => { if (res.url().includes('pet-form') || res.url().includes('pet-profile')) o.scripts.push(res.url() + ' -> ' + res.status()); });
  page.on('pageerror', err => { o.pageerror = o.pageerror || []; o.pageerror.push(String(err).slice(0,400)); });

  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

  await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  o.html_has_pspet_form_host = await page.evaluate(() => document.documentElement.innerHTML.includes('pspet-form-host'));
  o.html_has_ps_pet_form_open = await page.evaluate(() => document.documentElement.innerHTML.includes('PS_PET_FORM_OPEN'));

  await browser.close();
} catch (e) {
  o.fatal = String(e).slice(0,400);
}
putB64('diag8.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE');
