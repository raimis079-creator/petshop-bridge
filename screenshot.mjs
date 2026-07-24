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
const ctx = await browser.newContext({ viewport: { width: 900, height: 1000 }, ignoreHTTPSErrors: true });
const page = await ctx.newPage();
const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
await page.waitForSelector('#user_login', { timeout: 10000 });
await page.fill('#user_login', U); await page.fill('#user_pass', P);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);

await page.goto('https://dev.avesa.lt/mano-paskyra/mano-augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3500);

const shots = [];
async function snap(name) {
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/' + name + '.png', buf);
  shots.push(name);
}

// Force-mount the form fresh for a DOG (bypass draft/dashboard routing)
const result = await page.evaluate(() => {
  return new Promise((resolve) => {
    var host = document.querySelector('.pspet-form-root') || document.createElement('div');
    if (!host.parentNode) { host.className = 'pspet-form-root'; document.body.prepend(host); }
    if (!window.PetshopPetForm) { resolve('no PetshopPetForm'); return; }
    window.PetshopPetForm.mount(host, { step: 2, data: { species: 'dog', pet_name: 'Reksas' } });
    setTimeout(() => resolve('mounted'), 300);
  });
});
console.log('mount result:', result);
await page.waitForTimeout(500);
await snap('b01_dog_accordion');

// Count rings segments + steps via DOM
const dogInfo = await page.evaluate(() => {
  var segs = document.querySelectorAll('.pspet-ring-seg').length;
  var steps = document.querySelectorAll('.pspet-step').length;
  var ringtext = (document.querySelector('.pspet-ringtext') || {}).textContent || '';
  return { segs, steps, ringtext };
});
console.log('DOG:', JSON.stringify(dogInfo));

// Click first pill in active section, then "Toliau"
try {
  const pill = await page.$('.pspet-step.active .pspet-pill');
  if (pill) await pill.click();
  const next = await page.$('.pspet-btn-primary');
  if (next) await next.click();
  await page.waitForTimeout(500);
  await snap('b02_dog_step2_open');
  const afterInfo = await page.evaluate(() => {
    var confirmedText = document.querySelector('.pspet-step.done .s');
    var ringtext = (document.querySelector('.pspet-ringtext') || {}).textContent || '';
    return { doneSummary: confirmedText ? confirmedText.textContent : null, ringtext };
  });
  console.log('AFTER TOLIAU:', JSON.stringify(afterInfo));
} catch (e) { console.log('click err', e.message); }

// Now mount for FISH (single-section, no accordion chrome expected)
const fishResult = await page.evaluate(() => {
  return new Promise((resolve) => {
    var host = document.querySelector('.pspet-form-root');
    window.PetshopPetForm.mount(host, { step: 2, data: { species: 'fish', pet_name: 'Nemo' } });
    setTimeout(() => resolve('mounted'), 300);
  });
});
await page.waitForTimeout(400);
await snap('b03_fish_single');
const fishInfo = await page.evaluate(() => {
  var segs = document.querySelectorAll('.pspet-ring-seg').length;
  var steps = document.querySelectorAll('.pspet-step').length;
  var single = document.querySelectorAll('.pspet-section-single').length;
  var ringtext = document.querySelector('.pspet-ringtext');
  return { segs, steps, single, hasRingText: !!ringtext };
});
console.log('FISH:', JSON.stringify(fishInfo));

// REPTILE
await page.evaluate(() => {
  var host = document.querySelector('.pspet-form-root');
  window.PetshopPetForm.mount(host, { step: 2, data: { species: 'reptile', pet_name: 'Ragis' } });
});
await page.waitForTimeout(400);
const reptInfo = await page.evaluate(() => {
  var segs = document.querySelectorAll('.pspet-ring-seg').length;
  var single = document.querySelectorAll('.pspet-section-single').length;
  return { segs, single };
});
console.log('REPTILE:', JSON.stringify(reptInfo));

// BIRD (should be 3 sections)
await page.evaluate(() => {
  var host = document.querySelector('.pspet-form-root');
  window.PetshopPetForm.mount(host, { step: 2, data: { species: 'bird', pet_name: 'Kokis' } });
});
await page.waitForTimeout(400);
await snap('b04_bird_accordion');
const birdInfo = await page.evaluate(() => {
  var segs = document.querySelectorAll('.pspet-ring-seg').length;
  var steps = document.querySelectorAll('.pspet-step').length;
  return { segs, steps };
});
console.log('BIRD:', JSON.stringify(birdInfo));

// EDIT-MODE restore test: pet with existing data in "about" + "wellbeing" but not "daily"
await page.evaluate(() => {
  var host = document.querySelector('.pspet-form-root');
  window.PetshopPetForm.mount(host, { step: 2, petId: 999, data: {
    species: 'dog', pet_name: 'Senas',
    birth_date: '2022-01-01', dog_size: 'medium', species_detail: 'Labradoras',
    is_sterilised: 'yes', activity_hint: 'moderate', sensitivities: 'chicken',
    housing: null, feeding_type: null
  }});
});
await page.waitForTimeout(400);
await snap('b05_edit_restore');
const editInfo = await page.evaluate(() => {
  var confirmedDone = document.querySelectorAll('.pspet-step.done').length;
  var activeIdx = -1;
  document.querySelectorAll('.pspet-step').forEach(function(s, i){ if (s.classList.contains('active')) activeIdx = i; });
  var ringtext = (document.querySelector('.pspet-ringtext') || {}).textContent || '';
  return { confirmedDone, activeIdx, ringtext };
});
console.log('EDIT RESTORE:', JSON.stringify(editInfo));

// Accessibility check
const a11y = await page.evaluate(() => {
  var btn = document.querySelector('.pspet-step-head[aria-expanded]');
  return {
    isButton: btn ? btn.tagName : null,
    ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
    ariaControls: btn ? btn.getAttribute('aria-controls') : null
  };
});
console.log('A11Y:', JSON.stringify(a11y));

await browser.close();
const manifest = {};
for (const name of shots) {
  const rc = putB64(name + '.png', fs.readFileSync('/tmp/' + name + '.png').toString('base64'));
  manifest[name] = rc;
}
putB64('shots5.json', Buffer.from(JSON.stringify(manifest)).toString('base64'));
console.log('MANIFEST_DONE', JSON.stringify(manifest));
