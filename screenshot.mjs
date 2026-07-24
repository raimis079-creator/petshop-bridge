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
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1100 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  page.on('pageerror', err => { o.pageerror = o.pageerror || []; o.pageerror.push(String(err).slice(0,300)); });

  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

  await page.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  o.hasPetshopPetForm = await page.evaluate(() => !!window.PetshopPetForm);
  o.hasHost = await page.evaluate(() => !!document.querySelector('#pspet-form-host'));

  async function snap(name) {
    const buf = await page.screenshot({ fullPage: true });
    fs.writeFileSync('/tmp/' + name + '.png', buf);
    shots.push(name);
  }

  // ---- DOG accordion ----
  o.mountDog = await page.evaluate(() => {
    try {
      var host = document.getElementById('pspet-synthetic'); if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
      window.PetshopPetForm.mount(host, { step: 2, data: { species: 'dog', pet_name: 'Reksas' } });
      return 'ok';
    } catch (e) { return 'ERR:' + String(e); }
  });
  await page.waitForTimeout(500);
  await snap('c01_dog_accordion');
  o.dogInfo = await page.evaluate(() => ({
    segs: document.querySelectorAll('.pspet-ring-seg').length,
    steps: document.querySelectorAll('.pspet-step').length,
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||'',
    heroTitle: (document.querySelector('.pspet-hero .pspet-title')||{}).textContent||'',
    ariaBtn: (function(){ var b=document.querySelector('.pspet-step-head[aria-expanded]'); return b?{tag:b.tagName,exp:b.getAttribute('aria-expanded'),ctrl:b.getAttribute('aria-controls')}:null; })()
  }));

  // click a pill in active section + Toliau
  try {
    const pill = await page.$('.pspet-step.active .pspet-pill');
    if (pill) await pill.click();
    const next = await page.$('.pspet-btn-primary');
    if (next) await next.click();
    await page.waitForTimeout(500);
  } catch(e){ o.clickErr = String(e).slice(0,200); }
  await snap('c02_dog_after_toliau');
  o.afterToliau = await page.evaluate(() => ({
    doneCount: document.querySelectorAll('.pspet-step.done').length,
    doneSummary: (document.querySelector('.pspet-step.done .s')||{}).textContent||'',
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||'',
    activeIsSecond: (document.querySelectorAll('.pspet-step')[1]||{}).classList ? document.querySelectorAll('.pspet-step')[1].classList.contains('active') : false,
    nextBtnLabel: (document.querySelector('.pspet-btn-primary')||{}).textContent||''
  }));

  // click back on the DONE step-1 header to reopen for editing
  try {
    const doneHead = await page.$('.pspet-step.done .pspet-step-head');
    if (doneHead) await doneHead.click();
    await page.waitForTimeout(400);
  } catch(e){ o.reopenErr = String(e).slice(0,200); }
  await snap('c03_dog_reopen_step1');
  o.reopenInfo = await page.evaluate(() => ({
    activeIdx: (function(){ var idx=-1; document.querySelectorAll('.pspet-step').forEach(function(s,i){ if(s.classList.contains('active')) idx=i; }); return idx; })(),
    doneStillTracked: document.querySelectorAll('.pspet-step.done').length
  }));

  // ---- FISH (single-section, no accordion chrome) ----
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic'); if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
    window.PetshopPetForm.mount(host, { step: 2, data: { species: 'fish', pet_name: 'Nemo' } });
  });
  await page.waitForTimeout(400);
  await snap('c04_fish_single');
  o.fishInfo = await page.evaluate(() => ({
    segs: document.querySelectorAll('.pspet-ring-seg').length,
    hasRing: !!document.querySelector('.pspet-ring-wrap'),
    single: document.querySelectorAll('.pspet-section-single').length,
    hasRingText: !!document.querySelector('.pspet-ringtext'),
    nextBtnLabel: (document.querySelector('.pspet-btn-primary')||{}).textContent||''
  }));

  // ---- BIRD (3 sections, sparse fields) ----
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic'); if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
    window.PetshopPetForm.mount(host, { step: 2, data: { species: 'bird', pet_name: 'Kokis' } });
  });
  await page.waitForTimeout(400);
  await snap('c05_bird_accordion');
  o.birdInfo = await page.evaluate(() => ({
    segs: document.querySelectorAll('.pspet-ring-seg').length,
    steps: document.querySelectorAll('.pspet-step').length,
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||''
  }));

  // ---- EDIT-MODE restore: pet with existing about+wellbeing data, daily empty ----
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic'); if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
    window.PetshopPetForm.mount(host, { step: 2, petId: 999, data: {
      species: 'dog', pet_name: 'Senas',
      birth_date: '2022-01-01', dog_size: 'medium', species_detail: 'Labradoras',
      is_sterilised: 'yes', activity_hint: 'moderate', sensitivities: 'chicken',
      housing: null, feeding_type: null
    }});
  });
  await page.waitForTimeout(400);
  await snap('c06_edit_restore');
  o.editRestore = await page.evaluate(() => ({
    doneCount: document.querySelectorAll('.pspet-step.done').length,
    activeIdx: (function(){ var idx=-1; document.querySelectorAll('.pspet-step').forEach(function(s,i){ if(s.classList.contains('active')) idx=i; }); return idx; })(),
    ringtext: (document.querySelector('.pspet-ringtext')||{}).textContent||'',
    aboutSummary: (document.querySelectorAll('.pspet-step .s')[0]||{}).textContent||''
  }));

  // ---- Mobile viewport check ----
  await ctx.close();
  const ctx2 = await browser.newContext({ viewport: { width: 375, height: 800 }, ignoreHTTPSErrors: true });
  const page2 = await ctx2.newPage();
  await page2.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page2.waitForSelector('#user_login', { timeout: 10000 });
  await page2.fill('#user_login', U); await page2.fill('#user_pass', P);
  await Promise.all([page2.waitForNavigation({ waitUntil: 'networkidle' }), page2.click('#wp-submit')]);
  await page2.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page2.waitForTimeout(2000);
  await page2.evaluate(() => {
    var host = document.getElementById('pspet-synthetic'); if(!host){ host=document.createElement('div'); host.id='pspet-synthetic'; document.body.prepend(host); }
    window.PetshopPetForm.mount(host, { step: 2, data: { species: 'dog', pet_name: 'Reksas' } });
  });
  await page2.waitForTimeout(400);
  const buf2 = await page2.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/c07_mobile.png', buf2);
  shots.push('c07_mobile');

  await browser.close();
} catch (e) {
  o.fatal = String(e).slice(0,400);
}
for (const name of shots) {
  try { putB64(name + '.png', fs.readFileSync('/tmp/' + name + '.png').toString('base64')); } catch(e){}
}
putB64('full10.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('DONE', shots.length);
