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
const shots = [];
function mountJS(spData){
  return `(function(){
    var host = document.getElementById('pspet-synthetic');
    if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
    window.PetshopPetForm.mount(host, { step:2, data:${JSON.stringify(spData)} });
  })()`;
}
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
  await page.waitForTimeout(2500);

  // ===== 1. REOPEN test (after done-class fix) =====
  await page.evaluate(mountJS({ species:'dog', pet_name:'Reksas' }));
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    var pill = document.querySelector('.pspet-step.pspet-is-active .pspet-pill');
    if (pill) pill.click();
    var next = document.querySelector('.pspet-btn-primary');
    if (next) next.click();
  });
  await page.waitForTimeout(500);
  o.doneCardVisibility = await page.evaluate(() => {
    var card = document.querySelector('.pspet-step.pspet-is-done');
    if (!card) return { error: 'no done card' };
    var cs = getComputedStyle(card);
    var head = card.querySelector('.pspet-step-head');
    var r = head ? head.getBoundingClientRect() : null;
    return { cardDisplay: cs.display, headW: r ? Math.round(r.width) : 0, headH: r ? Math.round(r.height) : 0 };
  });
  const rr = await page.evaluate(() => {
    var head = document.querySelector('.pspet-step.pspet-is-done .pspet-step-head');
    if (!head) return 'no head';
    head.click();
    return 'clicked';
  });
  await page.waitForTimeout(500);
  o.afterReopen = await page.evaluate(() => ({
    clickResult: 'ok',
    activeIdx: (function(){ var idx=-1; document.querySelectorAll('.pspet-step').forEach(function(s,i){ if(s.classList.contains('pspet-is-active')) idx=i; }); return idx; })(),
    activeBodyVisible: !!document.querySelector('.pspet-step.pspet-is-active .pspet-step-body')
  }));
  const bufReopen = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/e01_reopen.png', bufReopen); shots.push('e01_reopen');

  // ===== 2. ERROR scenario: block the REST endpoint, then Save =====
  await page.route('**/petshop/v1/pet-profile', route => route.abort());
  await page.evaluate(mountJS({ species:'dog', pet_name:'Klaida' }));
  await page.waitForTimeout(400);
  // fill a pill so there is data to preserve
  await page.evaluate(() => {
    var pill = document.querySelector('.pspet-step.pspet-is-active .pspet-pill');
    if (pill) pill.click();
  });
  // jump to last section and hit "Išsaugoti profilį"
  await page.evaluate(() => {
    // click Toliau twice to reach last section
    function clickNext(){ var b=document.querySelector('.pspet-btn-primary'); if(b) b.click(); }
    clickNext();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => { var b=document.querySelector('.pspet-btn-primary'); if(b) b.click(); });
  await page.waitForTimeout(300);
  o.errorScenario = await page.evaluate(() => {
    var b = document.querySelector('.pspet-btn-primary');
    return {
      btnLabel: b ? b.textContent : null,
      formStillPresent: !!document.querySelector('.pspet-wrap'),
      errorShown: !!document.querySelector('.pspet-error'),
      errorText: (document.querySelector('.pspet-error')||{}).textContent || null,
      dataPreserved: !!document.querySelector('.pspet-step')  // steps still rendered = not navigated away
    };
  });
  await page.unroute('**/petshop/v1/pet-profile');
  const bufErr = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/e02_error.png', bufErr); shots.push('e02_error');

  // ===== 3. prefers-reduced-motion =====
  await ctx.close();
  const ctxRM = await browser.newContext({ viewport: { width: 900, height: 1000 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const pageRM = await ctxRM.newPage();
  await pageRM.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await pageRM.waitForSelector('#user_login', { timeout: 10000 });
  await pageRM.fill('#user_login', U); await pageRM.fill('#user_pass', P);
  await Promise.all([pageRM.waitForNavigation({ waitUntil: 'networkidle' }), pageRM.click('#wp-submit')]);
  await pageRM.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await pageRM.waitForTimeout(2000);
  await pageRM.evaluate(mountJS({ species:'dog', pet_name:'Ramus' }));
  await pageRM.waitForTimeout(400);
  o.reducedMotion = await pageRM.evaluate(() => {
    var seg = document.querySelector('.pspet-ring-seg');
    var cs = seg ? getComputedStyle(seg) : null;
    return {
      mediaMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      segTransition: cs ? cs.transition : null
    };
  });
  await ctxRM.close();

  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,500); }
for (const name of shots) {
  try { putB64(name + '.png', fs.readFileSync('/tmp/' + name + '.png').toString('base64')); } catch(e){}
}
putB64('final.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE', shots.length);
