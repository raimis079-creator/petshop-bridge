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
async function login(page, U, P){
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
}
function mountJS(spData, editPetId){
  var arg = JSON.stringify({ step:2, petId: editPetId||null, data: spData });
  return `(function(){
    var host = document.getElementById('pspet-synthetic');
    if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
    var opts = ${arg};
    if(!opts.petId) delete opts.petId;
    window.PetshopPetForm.mount(host, opts);
  })()`;
}
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');

  // ---- PAGE A: species variety (fresh, one page, sequential mounts) ----
  const ctxA = await browser.newContext({ viewport: { width: 900, height: 1100 }, ignoreHTTPSErrors: true });
  const pageA = await ctxA.newPage();
  await login(pageA, U, P);
  await pageA.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await pageA.waitForTimeout(2000);

  await pageA.evaluate(mountJS({ species:'fish', pet_name:'Nemo' }));
  await pageA.waitForTimeout(500);
  o.fishInfo = await pageA.evaluate(() => ({
    segs: document.querySelectorAll('.pspet-ring-seg').length,
    hasRing: !!document.querySelector('.pspet-ring-wrap'),
    single: document.querySelectorAll('.pspet-section-single').length,
    hasRingText: !!document.querySelector('.pspet-ringtext'),
    nextBtnLabel: (document.querySelector('.pspet-btn-primary')||{}).textContent||'',
    heroTitle: (document.querySelector('.pspet-hero .pspet-title')||{}).textContent||''
  }));
  const bufF = await pageA.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/d11_fish.png', bufF); shots.push('d11_fish');

  await pageA.evaluate(mountJS({ species:'bird', pet_name:'Kokis' }));
  await pageA.waitForTimeout(500);
  o.birdInfo = await pageA.evaluate(() => ({
    segs: document.querySelectorAll('.pspet-ring-seg').length,
    steps: document.querySelectorAll('.pspet-step').length,
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||''
  }));
  const bufB = await pageA.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/d11_bird.png', bufB); shots.push('d11_bird');

  await pageA.evaluate(mountJS({
    species:'dog', pet_name:'Senas',
    birth_date:'2022-01-01', dog_size:'medium', species_detail:'Labradoras',
    is_sterilised:'yes', activity_hint:'moderate', sensitivities:'chicken',
    housing:null, feeding_type:null
  }, 999));
  await pageA.waitForTimeout(500);
  o.editRestore = await pageA.evaluate(() => ({
    doneCount: document.querySelectorAll('.pspet-step.done').length,
    activeIdx: (function(){ var idx=-1; document.querySelectorAll('.pspet-step').forEach(function(s,i){ if(s.classList.contains('active')) idx=i; }); return idx; })(),
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||'',
    doneSummaries: Array.from(document.querySelectorAll('.pspet-step.done .s')).map(e=>e.textContent)
  }));
  const bufE = await pageA.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/d11_editrestore.png', bufE); shots.push('d11_editrestore');
  await ctxA.close();

  // ---- PAGE B: reopen-click test via direct JS dispatch (no Playwright visibility wait) ----
  const ctxB = await browser.newContext({ viewport: { width: 900, height: 1100 }, ignoreHTTPSErrors: true });
  const pageB = await ctxB.newPage();
  await login(pageB, U, P);
  await pageB.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await pageB.waitForTimeout(2000);
  await pageB.evaluate(mountJS({ species:'dog', pet_name:'Reksas' }));
  await pageB.waitForTimeout(400);
  // pick a pill, click Toliau via direct dispatch
  await pageB.evaluate(() => {
    var pill = document.querySelector('.pspet-step.active .pspet-pill');
    if (pill) pill.click();
    var next = document.querySelector('.pspet-btn-primary');
    if (next) next.click();
  });
  await pageB.waitForTimeout(500);
  o.step1ToStep2 = await pageB.evaluate(() => ({
    doneCount: document.querySelectorAll('.pspet-step.done').length,
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||''
  }));
  // reopen via direct JS click dispatch (bypasses Playwright actionability wait entirely)
  const reopenRes = await pageB.evaluate(() => {
    try {
      var doneHead = document.querySelector('.pspet-step.done .pspet-step-head');
      if (!doneHead) return 'NO_DONE_HEAD_FOUND';
      var rect = doneHead.getBoundingClientRect();
      var visible = rect.width > 0 && rect.height > 0;
      doneHead.click();
      return 'clicked, wasVisible=' + visible + ' rect=' + JSON.stringify(rect);
    } catch (e) { return 'ERR:' + String(e); }
  });
  o.reopenDirectClick = reopenRes;
  await pageB.waitForTimeout(500);
  o.afterReopen = await pageB.evaluate(() => ({
    activeIdx: (function(){ var idx=-1; document.querySelectorAll('.pspet-step').forEach(function(s,i){ if(s.classList.contains('active')) idx=i; }); return idx; })(),
    doneCount: document.querySelectorAll('.pspet-step.done').length,
    ariaExpandedActive: (function(){ var b=document.querySelector('.pspet-step.active .pspet-step-head'); return b?b.getAttribute('aria-expanded'):null; })()
  }));
  const bufR = await pageB.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/d11_reopen.png', bufR); shots.push('d11_reopen');
  await ctxB.close();

  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,500); }
for (const name of shots) {
  try { putB64(name + '.png', fs.readFileSync('/tmp/' + name + '.png').toString('base64')); } catch(e){}
}
putB64('full11.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE', shots.length);
