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
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1100 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic') || (function(){var h=document.createElement('div');h.id='pspet-synthetic';document.body.prepend(h);return h;})();
    window.PetshopPetForm.mount(host, { step:2, data:{ species:'dog', pet_name:'Reksas' } });
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    var pill = document.querySelector('.pspet-step.active .pspet-pill');
    if (pill) pill.click();
    var next = document.querySelector('.pspet-btn-primary');
    if (next) next.click();
  });
  await page.waitForTimeout(500);
  o.diag = await page.evaluate(() => {
    var card = document.querySelector('.pspet-step.done');
    var head = card ? card.querySelector('.pspet-step-head') : null;
    if (!head) return { error: 'no head found', cardHTML: card ? card.outerHTML.slice(0,300) : 'no card' };
    var cs = getComputedStyle(head);
    var cardCs = card ? getComputedStyle(card) : null;
    return {
      headTag: head.tagName,
      headRect: head.getBoundingClientRect().toJSON ? JSON.stringify(head.getBoundingClientRect()) : String(head.getBoundingClientRect()),
      headDisplay: cs.display, headWidth: cs.width, headHeight: cs.height,
      headPosition: cs.position, headVisibility: cs.visibility,
      cardDisplay: cardCs ? cardCs.display : null,
      cardHeight: cardCs ? cardCs.height : null,
      cardOverflow: cardCs ? cardCs.overflow : null,
      cardChildrenCount: card ? card.children.length : 0,
      cardOuterHTMLStart: card ? card.outerHTML.slice(0,500) : null
    };
  });
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
putB64('diag13.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE');
