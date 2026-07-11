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
      const b = { message: 'dry ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') };
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

// KANDIDATINIS CSS: kompaktiska sticky juosta mobile <=768px
const CANDIDATE_CSS = `
@media (max-width: 768px) {
  #cmplz-cookiebanner-container .cmplz-cookiebanner,
  .cmplz-cookiebanner.cmplz-bottom-right {
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    border-radius: 14px 14px 0 0 !important;
    max-height: 42vh !important;
    overflow-y: auto !important;
    padding: 10px 14px 12px !important;
    box-shadow: 0 -3px 16px rgba(0,0,0,.18) !important;
  }
  .cmplz-cookiebanner .cmplz-header { margin-bottom: 2px !important; }
  .cmplz-cookiebanner .cmplz-title { font-size: 15px !important; line-height: 1.2 !important; margin: 0 !important; }
  .cmplz-cookiebanner .cmplz-logo { display: none !important; }
  .cmplz-cookiebanner .cmplz-divider { display: none !important; margin: 0 !important; }
  .cmplz-cookiebanner .cmplz-body { margin: 4px 0 6px !important; }
  .cmplz-cookiebanner .cmplz-message { font-size: 11.5px !important; line-height: 1.32 !important; }
  .cmplz-cookiebanner .cmplz-buttons { display: flex !important; flex-wrap: wrap !important; gap: 6px !important; margin-top: 4px !important; }
  .cmplz-cookiebanner .cmplz-buttons .cmplz-btn { flex: 1 1 30% !important; min-width: 90px !important; margin: 0 !important; padding: 9px 8px !important; font-size: 12.5px !important; }
  .cmplz-cookiebanner .cmplz-links { margin-top: 4px !important; font-size: 10.5px !important; }
  .cmplz-cookiebanner .cmplz-links a { font-size: 10.5px !important; }
}
`;

(async () => {
  const R = {};
  let browser;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    const ctx = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });
    const page = await ctx.newPage();

    L('=== PROD puslapis, pilnas banerio DOM ===');
    await page.goto(BASE + PROD, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    const fullHtml = await page.evaluate(() => {
      const el = document.querySelector('.cmplz-cookiebanner');
      return el ? el.outerHTML : 'NOT FOUND';
    });
    R.full_banner_html = fullHtml;
    L('  Banerio HTML ilgis: ' + fullHtml.length + ' (issaugota JSON)');

    // Prieduodam kandidatini CSS
    await page.addStyleTag({ content: CANDIDATE_CSS });
    await page.waitForTimeout(800);

    const after = await page.evaluate(() => {
      const el = document.querySelector('.cmplz-cookiebanner');
      if (!el) return { found: false };
      const r = el.getBoundingClientRect();
      return { found: true, rect: { y: Math.round(r.y), h: Math.round(r.height) }, vh: window.innerHeight };
    });
    R.after = after;
    if (after.found) {
      const pct = Math.round((after.rect.h) / after.vh * 100);
      L('  PO CSS: banerio y=' + after.rect.y + ' h=' + after.rect.h + 'px (' + pct + '% ekrano auksto) vs PRIES h=363px (43%)');
      L('  Matomo turinio virs banerio: ' + after.rect.y + 'px is ' + after.vh + 'px');
    }

    const shotP = await page.screenshot({ fullPage: false });
    putBinary('screenshots/mobile_after_product.png', shotP);
    L('  screenshots/mobile_after_product.png issaugotas');

    L('=== HOME puslapis su tuo paciu CSS ===');
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.addStyleTag({ content: CANDIDATE_CSS });
    await page.waitForTimeout(800);
    const shotH = await page.screenshot({ fullPage: false });
    putBinary('screenshots/mobile_after_home.png', shotH);
    L('  screenshots/mobile_after_home.png issaugotas');

    L('DONE');
  } catch (e) {
    L('!!! EXCEPTION: ' + (e && e.stack ? e.stack : String(e)));
  } finally {
    try { if (browser) await browser.close(); } catch (e) {}
    putText('banner_dryrun.json', JSON.stringify(R, null, 2));
    putText('_dry_log.txt', out);
  }
})();
