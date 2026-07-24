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
  page.on('console', msg => { o.console = o.console || []; o.console.push(msg.text().slice(0,200)); });
  page.on('pageerror', err => { o.pageerror = o.pageerror || []; o.pageerror.push(String(err).slice(0,300)); });

  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

  await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  o.hasPetshopPetForm = await page.evaluate(() => !!window.PetshopPetForm);
  o.hasHost = await page.evaluate(() => !!document.querySelector('.pspet-form-root'));

  try {
    const r1 = await page.evaluate(() => {
      try {
        var host = document.querySelector('.pspet-form-root');
        if (!host) { host = document.createElement('div'); host.className = 'pspet-form-root2'; document.body.prepend(host); }
        window.PetshopPetForm.mount(host, { step: 2, data: { species: 'dog', pet_name: 'Reksas' } });
        return 'ok';
      } catch (e) { return 'ERR: ' + String(e) + ' STACK:' + (e && e.stack ? e.stack.slice(0,400) : ''); }
    });
    o.mountResult = r1;
  } catch (e) { o.mountEvalErr = String(e).slice(0,300); }

  await page.waitForTimeout(600);
  try {
    const dogInfo = await page.evaluate(() => {
      var segs = document.querySelectorAll('.pspet-ring-seg').length;
      var steps = document.querySelectorAll('.pspet-step').length;
      var ringtext = (document.querySelector('.pspet-ringtext') || {}).textContent || '';
      var heroTitle = (document.querySelector('.pspet-hero .pspet-title') || {}).textContent || '';
      return { segs, steps, ringtext, heroTitle };
    });
    o.dogInfo = dogInfo;
  } catch (e) { o.dogInfoErr = String(e).slice(0,200); }

  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/diag6.png', buf);

  await browser.close();
} catch (e) {
  o.fatal = String(e) + ' STACK:' + (e && e.stack ? e.stack.slice(0,500) : '');
}
try { putB64('diag6.png', fs.readFileSync('/tmp/diag6.png').toString('base64')); } catch(e){}
putB64('diag6.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE');
