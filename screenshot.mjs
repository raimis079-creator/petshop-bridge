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
const o = {};
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  o.allPspetIds = await page.evaluate(() => Array.from(document.querySelectorAll('[id*="pspet"]')).map(e => e.id));
  o.formRootClass = await page.evaluate(() => Array.from(document.querySelectorAll('[class*="pspet"]')).slice(0,10).map(e => e.className));
  o.bodyHtmlSnippet = await page.evaluate(() => {
    var m = document.body.innerHTML.match(/id="pspet[^"]*"/g);
    return m || [];
  });
  o.PS_PET_FORM_OPEN = await page.evaluate(() => window.PS_PET_FORM_OPEN);
  o.hasPetshopPetForm = await page.evaluate(() => !!window.PetshopPetForm);
  o.wrapExists = await page.evaluate(() => !!document.querySelector('.pspet-wrap'));
  o.heroExists = await page.evaluate(() => !!document.querySelector('.pspet-hero'));
  o.titleText = await page.evaluate(() => (document.querySelector('.pspet-title')||{}).textContent || null);
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/diag9.png', buf);
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
try { putB64('diag9.png', fs.readFileSync('/tmp/diag9.png').toString('base64')); } catch(e){}
putB64('diag9.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE');
