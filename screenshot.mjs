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
      const b = { message: 'x ' + n, branch: 'main', content: Buffer.from(s, 'utf8').toString('base64') };
      if (sha) b.sha = sha;
      fs.writeFileSync('/tmp/pf.json', JSON.stringify(b));
      const r = execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer ' + tok + '" -d @/tmp/pf.json "' + url + '"', { encoding: 'utf8', maxBuffer: 50000000 });
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

function relevant(cookies) {
  return cookies.filter(c => /^(cmplz|_ga|_gcl|_fbp|_gid)/.test(c.name))
    .map(c => c.name + '=' + c.value).sort();
}

async function bannerVisible(page) {
  return await page.evaluate(() => {
    const el = document.querySelector('.cmplz-cookiebanner');
    if (!el) return false;
    const cs = getComputedStyle(el);
    return el.classList.contains('cmplz-show') && cs.display !== 'none' && cs.opacity !== '0';
  });
}

async function scenario(browser, label, action) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + PROD, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const before = relevant(await ctx.cookies());
  const visBefore = await bannerVisible(page);
  L(`--- ${label} ---`);
  L('  Baneris matomas pries veiksma: ' + visBefore);
  L('  Cookies PRIES: ' + JSON.stringify(before));

  await action(page);
  await page.waitForTimeout(2000);

  const after = relevant(await ctx.cookies());
  const visAfter = await bannerVisible(page);
  L('  Baneris matomas PO veiksmo: ' + visAfter);
  L('  Cookies PO: ' + JSON.stringify(after));

  // navigacija i kita puslapi -> ar baneris grizta?
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);
  const visNav = await bannerVisible(page);
  const navCookies = relevant(await ctx.cookies());
  L('  Po navigacijos i kita psl. baneris vel matomas: ' + visNav);
  L('  Cookies po navigacijos: ' + JSON.stringify(navCookies));

  await ctx.close();
  return { label, before, after, navCookies, visBefore, visAfter, visNav };
}

(async () => {
  const R = {};
  let browser;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox'] });

    // 1. Paspaudziam X (cmplz-close)
    R.x = await scenario(browser, 'X mygtukas (cmplz-close)', async (page) => {
      const clicked = await page.evaluate(() => {
        const x = document.querySelector('.cmplz-cookiebanner .cmplz-close');
        if (x) { x.click(); return true; } return false;
      });
      L('  X rastas ir paspaustas: ' + clicked);
    });

    // 2. Paspaudziam ATMESTI (cmplz-deny) - palyginimui
    R.deny = await scenario(browser, 'ATMESTI mygtukas (cmplz-deny)', async (page) => {
      const clicked = await page.evaluate(() => {
        const d = document.querySelector('.cmplz-cookiebanner .cmplz-deny, .cmplz-cookiebanner button.cmplz-deny, .cmplz-cookiebanner .cmplz-btn.cmplz-deny');
        if (d) { d.click(); return true; }
        // fallback pagal teksta
        const btns = [...document.querySelectorAll('.cmplz-cookiebanner .cmplz-btn, .cmplz-cookiebanner button')];
        const b = btns.find(x => /atmesti/i.test(x.textContent));
        if (b) { b.click(); return true; } return false;
      });
      L('  ATMESTI rastas ir paspaustas: ' + clicked);
    });

    // 3. Palyginimas
    L('=== ISVADA: ar X == ATMESTI? ===');
    const xMk = R.x.after.filter(c => /cmplz_(marketing|statistics|banner)/.test(c));
    const dMk = R.deny.after.filter(c => /cmplz_(marketing|statistics|banner)/.test(c));
    L('  X consent cookies: ' + JSON.stringify(xMk));
    L('  ATMESTI consent cookies: ' + JSON.stringify(dMk));
    const same = JSON.stringify(xMk.filter(c=>!/banner-status|saved/.test(c)).sort()) === JSON.stringify(dMk.filter(c=>!/banner-status|saved/.test(c)).sort());
    L('  X ir ATMESTI vienodi (be banner-status): ' + same);

    L('DONE');
  } catch (e) {
    L('!!! EXCEPTION: ' + (e && e.stack ? e.stack : String(e)));
  } finally {
    try { if (browser) await browser.close(); } catch (e) {}
    putText('x_verify.json', JSON.stringify(R, null, 2));
    putText('_x_log.txt', out);
  }
})();
