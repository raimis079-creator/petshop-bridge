import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";

function putText(n, s) {
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  for (let a = 0; a < 5; a++) {
    try {
      const url = 'https://api.github.com/repos/' + repo + '/contents/analize/' + n;
      let sha = '';
      try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
      const b = { message: 'shot ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') };
      if (sha) b.sha = sha;
      fs.writeFileSync('/tmp/pf.json', JSON.stringify(b));
      const r = execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer ' + tok + '" -d @/tmp/pf.json "' + url + '"', { encoding: 'utf8', maxBuffer: 50000000 });
      if (/HTTP:20[01]/.test(r)) return true;
    } catch (e) {}
    execSync('sleep 3');
  }
  return false;
}

function putBinary(path, buf) {
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  for (let a = 0; a < 5; a++) {
    try {
      const url = 'https://api.github.com/repos/' + repo + '/contents/' + path;
      let sha = '';
      try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer ' + tok + '" "' + url + '?ref=main&t=' + Date.now() + '"', { encoding: 'utf8' })).sha || ''; } catch (e) {}
      const b = { message: 'img ' + path, branch: 'main', content: buf.toString('base64') };
      if (sha) b.sha = sha;
      fs.writeFileSync('/tmp/pb.json', JSON.stringify(b));
      const r = execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer ' + tok + '" -d @/tmp/pb.json "' + url + '"', { encoding: 'utf8', maxBuffer: 50000000 });
      if (/HTTP:20[01]/.test(r)) return true;
    } catch (e) {}
    execSync('sleep 3');
  }
  return false;
}

let out = '';
const L = s => { out += s + '\n'; console.log(s); };

const BASE = 'https://dev.avesa.lt';
const PROD = '/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/';

(async () => {
  const R = {};
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await ctx.newPage();

  L('=== Kraunam prekes puslapi (mobile 390x844, svarus kontekstas -> baneris turi rodytis) ===');
  await page.goto(BASE + PROD, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000); // leidziam Complianz JS suktis

  // Ar baneris matomas?
  const bannerInfo = await page.evaluate(() => {
    const sels = ['.cmplz-cookiebanner', '#cmplz-cookiebanner-container .cmplz-cookiebanner', '.cmplz-cookiebanner.cmplz-bottom-right'];
    let el = null, usedSel = '';
    for (const s of sels) { const e = document.querySelector(s); if (e) { el = e; usedSel = s; break; } }
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      found: true,
      selector: usedSel,
      classes: el.className,
      computed: {
        position: cs.position, bottom: cs.bottom, right: cs.right, left: cs.left, top: cs.top,
        width: cs.width, maxWidth: cs.maxWidth, margin: cs.margin, borderRadius: cs.borderRadius, zIndex: cs.zIndex
      },
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      viewport: { w: window.innerWidth, h: window.innerHeight },
      outerHTML_head: el.outerHTML.slice(0, 500)
    };
  });
  R.banner = bannerInfo;
  if (bannerInfo.found) {
    L('  Baneris RASTAS: ' + bannerInfo.selector);
    L('  Klases: ' + bannerInfo.classes);
    L('  Computed: ' + JSON.stringify(bannerInfo.computed));
    L('  Rect (px): ' + JSON.stringify(bannerInfo.rect) + ' | viewport ' + JSON.stringify(bannerInfo.viewport));
    const r = bannerInfo.rect, vp = bannerInfo.viewport;
    const coversTop = r.y < vp.h * 0.6; // ar dengia virsutine turinio dali
    L('  Ar dengia virsutini turini (prekes nuotrauka/pavadinima)? y=' + r.y + ' vs viewport h=' + vp.h + ' -> ' + coversTop);
    L('  Uzima ' + Math.round((r.w * r.h) / (vp.w * vp.h) * 100) + '% ekrano ploto');
  } else {
    L('  Baneris NERASTAS (galbut consent cookie jau yra arba selektorius kitas). Dumpinam DOM fragmenta.');
    const dump = await page.evaluate(() => {
      const any = document.querySelector('[class*="cmplz"]');
      return any ? any.outerHTML.slice(0, 800) : 'jokio cmplz elemento';
    });
    R.banner_dump = dump;
    L('  ' + dump.slice(0, 300));
  }

  // Screenshot: viewport (pirmas ekranas) - matosi ar baneris dengia prekes virsu
  const shot = await page.screenshot({ fullPage: false });
  putBinary('screenshots/mobile_before_product.png', shot);
  L('  Screenshot issaugotas: screenshots/mobile_before_product.png');

  // Papildomai: homepage mobile
  L('=== Homepage mobile (papildomai) ===');
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const shot2 = await page.screenshot({ fullPage: false });
  putBinary('screenshots/mobile_before_home.png', shot2);
  L('  Screenshot issaugotas: screenshots/mobile_before_home.png');

  await browser.close();
  putText('banner_recon.json', JSON.stringify(R, null, 2));
  putText('_shot_log.txt', out);
  L('DONE');
})();
