import { execSync } from 'child_process';
import fs from 'fs';

const TOKG = process.env.GH_TOKEN;
function ghPut(path, buf, msg) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${path}`;
  let sha = '';
  try { const j = JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if (j.sha) sha = j.sha; } catch(e) {}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: msg, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }

const WP_USER = (process.env.WP_USER||'').trim();
const WP_PASS = (process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH = Buffer.from(WP_USER+':'+WP_PASS).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = { ts: new Date().toISOString(), steps: [] };

const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_m8auth']) || $_GET['ps_m8auth'] !== 'Zq8Kt3Vw' ) { return; }
	$suffix = sanitize_key( $_GET['s'] ?? 'x' );
	$login = 'm8ui_' . $suffix . '_' . wp_rand(1000,9999);
	$uid = wp_create_user( $login, wp_generate_password(24), $login . '@gyvunai.lt' );
	if ( is_wp_error($uid) ) { echo 'ERR ' . $uid->get_error_message(); exit; }
	$u = new WP_User($uid); $u->set_role('customer');
	wp_set_current_user($uid);
	wp_set_auth_cookie($uid, true);
	$url = wc_get_account_endpoint_url('augintinis');
	if ( isset($_GET['n']) && $_GET['n'] === 'create' ) { $url = add_query_arg('action','create',$url); }
	wp_safe_redirect($url); exit;
});`;

fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 AutoLogin v1', code: php, scope: 'global', active: true }));
const create = sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
let snipId = 0;
try { snipId = JSON.parse(create).id || 0; } catch(e) {}
out.auth_snippet = snipId;

if (snipId) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();

  async function runFlow(name, viewport, urlSuffix, doClick) {
    const ctx = await browser.newContext({ viewport, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e).slice(0,150)));
    await page.goto('https://dev.avesa.lt/?ps_m8auth=Zq8Kt3Vw&s=' + name + urlSuffix, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    const step = { name, url: page.url(), errors };
    await page.screenshot({ path: `/tmp/${name}_1.png`, fullPage: false });
    step.shot1 = `${name}_1.png`;
    if (doClick) {
      const btn = page.locator('text=Sukurti profilį').first();
      step.button_visible = await btn.isVisible().catch(()=>false);
      if (step.button_visible) {
        await btn.click();
        try {
          await page.waitForSelector('#pspet-form-host .pspet-wrap', { timeout: 8000 });
          step.form_mounted = true;
        } catch(e) { step.form_mounted = false; }
        await page.waitForTimeout(1200);
        await page.screenshot({ path: `/tmp/${name}_2.png`, fullPage: false });
        step.shot2 = `${name}_2.png`;
        step.host_visible = await page.locator('#pspet-form-host').isVisible().catch(()=>false);
        step.profile_hidden = !(await page.locator('#pspet-profile').isVisible().catch(()=>true));
      }
    } else {
      // action=create serverio kelias - forma turi buti atidaryta IS KARTO
      step.form_auto = await page.locator('#pspet-form-host .pspet-wrap').isVisible().catch(()=>false);
    }
    out.steps.push(step);
    await ctx.close();
  }

  await runFlow('desktop', { width: 1440, height: 900 }, '', true);
  await runFlow('mobile',  { width: 390,  height: 844 }, '', true);
  await runFlow('srvcreate', { width: 1440, height: 900 }, '&n=create', false);

  await browser.close();

  // Upload screenshots
  for (const s of out.steps) {
    for (const key of ['shot1','shot2']) {
      if (s[key] && fs.existsSync('/tmp/'+s[key])) {
        ghPut('screenshots/m8_' + s[key], fs.readFileSync('/tmp/'+s[key]), 'm8 shot');
        s[key+'_size'] = fs.statSync('/tmp/'+s[key]).size;
      }
    }
  }

  // Istrinam auth snippet NEDELSIANT
  sh(`curl -sk -X DELETE -H "Authorization: Basic ${AUTH}" "${API}/${snipId}"`);
  out.auth_snippet_deleted = sh(`curl -sk -o /dev/null -w "%{http_code}" -H "Authorization: Basic ${AUTH}" "${API}/${snipId}"`);
}

ghPut('screenshots/m8_browsertest_1.json', Buffer.from(JSON.stringify(out)), 'm8 browser test result');
console.log('DONE');
