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

const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = { ts: new Date().toISOString() };

const php = `
add_action('wp_loaded', function(){
	// --- login mode ---
	if ( isset($_GET['ps_m8e2e']) && $_GET['ps_m8e2e'] === 'Hb7Yr4Zp' ) {
		$login = 'm8e2e_' . wp_rand(10000,99999);
		$uid = wp_create_user( $login, wp_generate_password(24), $login . '@gyvunai.lt' );
		if ( is_wp_error($uid) ) { echo 'ERR ' . $uid->get_error_message(); exit; }
		$u = new WP_User($uid); $u->set_role('customer');
		wp_set_current_user($uid); wp_set_auth_cookie($uid, true);
		wp_safe_redirect( add_query_arg('action','create', wc_get_account_endpoint_url('augintinis')) ); exit;
	}
	// --- db check mode ---
	if ( isset($_GET['ps_m8db']) && $_GET['ps_m8db'] === 'Hb7Yr4Zp' ) {
		global $wpdb;
		$uid = absint( $_GET['uid'] ?? 0 );
		$out = array();
		$out['tables'] = $wpdb->get_col("SHOW TABLES LIKE '{$wpdb->prefix}ps\\\\_pet%'");
		$t = $wpdb->prefix . 'ps_pets';
		if ( $wpdb->get_var("SHOW TABLES LIKE '{$t}'") ) {
			$out['cols'] = $wpdb->get_col("SHOW COLUMNS FROM {$t}", 0);
			$out['rows'] = $wpdb->get_results( $uid
				? $wpdb->prepare("SELECT * FROM {$t} WHERE user_id=%d ORDER BY id DESC LIMIT 5", $uid)
				: "SELECT * FROM {$t} ORDER BY id DESC LIMIT 5", ARRAY_A );
		}
		$el = $wpdb->prefix . 'ps_event_log';
		$out['events'] = $wpdb->get_results("SELECT id,event_id,event_name,email,status,attempts,reason,last_error FROM {$el} ORDER BY id DESC LIMIT 5", ARRAY_A);
		header('Content-Type: application/json'); echo wp_json_encode($out); exit;
	}
	// --- self clean ---
	if ( isset($_GET['ps_m8clean']) && $_GET['ps_m8clean'] === 'Hb7Yr4Zp' ) {
		global $wpdb;
		$n = $wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");
		header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit;
	}
});`;

fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 E2E v1', code: php, scope: 'global', active: true }));
const create = sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
try { out.snippet_id = JSON.parse(create).id; } catch(e) { out.create_raw = create.slice(0,400); }

if (out.snippet_id) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errors = []; const apiCalls = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,200)));
  page.on('response', r => { if (r.url().includes('/petshop/v1/')) apiCalls.push(r.request().method()+' '+r.url().split('/petshop/v1')[1]+' -> '+r.status()); });

  const steps = {};
  await page.goto('https://dev.avesa.lt/?ps_m8e2e=Hb7Yr4Zp', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  steps.landed_url = page.url();
  steps.uid = await page.evaluate(() => { const m = document.body.innerText.match(/#(\d+)/); return m ? m[1] : null; });

  // Uzdarom slapuku juosta (dengia apacia)
  try { const c = page.locator('text=PRIIMTI').first(); if (await c.isVisible()) { await c.click(); await page.waitForTimeout(800); steps.cookie_dismissed = true; } } catch(e) { steps.cookie_dismissed = false; }

  // --- ZINGSNIS 1 ---
  steps.step1_visible = await page.locator('#pspet-form-host .pspet-wrap').isVisible().catch(()=>false);
  await page.locator('.pspet-pill', { hasText: 'Šuo' }).first().click();
  await page.waitForTimeout(400);
  await page.locator('#pspet-form-host input.pspet-input').first().fill('Testukas');
  await page.waitForTimeout(300);
  await page.locator('.pspet-pill', { hasText: 'Jautrus virškinimas' }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/e2e_1.png' });
  await page.locator('.pspet-btn-primary', { hasText: 'Tęsti' }).first().click();
  await page.waitForTimeout(1200);

  // --- ZINGSNIS 2 ---
  steps.step2_title = await page.locator('#pspet-form-host .pspet-title').textContent().catch(()=>null);
  await page.locator('.pspet-pill', { hasText: 'Suaugęs (1–7 m.)' }).first().click().catch(e=>steps.err_life=String(e).slice(0,80));
  await page.waitForTimeout(300);
  await page.locator('.pspet-pill', { hasText: 'Vidutinis (10–25 kg)' }).first().click().catch(e=>steps.err_size=String(e).slice(0,80));
  await page.waitForTimeout(300);
  await page.locator('.pspet-pill', { hasText: 'Daugiausia sausas' }).first().click().catch(e=>steps.err_feed=String(e).slice(0,80));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/e2e_2.png' });

  // --- SAVE ---
  await page.locator('.pspet-btn-primary', { hasText: 'Išsaugoti profilį' }).first().click();
  await page.waitForTimeout(3500);
  steps.result_visible = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
  steps.result_text = await page.locator('#pspet-form-host').innerText().catch(()=>'');
  await page.screenshot({ path: '/tmp/e2e_3.png' });

  // --- GRIZIMAS I PROFILI ---
  await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);
  steps.profile_empty_state = await page.locator('text=Susipažinkime su jūsų augintiniu').isVisible().catch(()=>false);
  steps.profile_text = await page.locator('#pspet-profile').innerText().catch(()=>'');
  await page.screenshot({ path: '/tmp/e2e_4.png' });

  steps.js_errors = errors; steps.api_calls = apiCalls;
  out.steps = steps;
  await browser.close();

  for (const n of ['e2e_1','e2e_2','e2e_3','e2e_4']) {
    if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'm8 e2e');
  }

  // DB patikra
  const db = sh(`curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8db=Hb7Yr4Zp&uid=${steps.uid||0}"`);
  try { out.db = JSON.parse(db); } catch(e) { out.db_raw = db.slice(0,500); }

  // Valymas
  out.clean = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8clean=Hb7Yr4Zp"').slice(0,200);
  const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
  try { out.remaining_temp = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e) { out.remaining_temp='err'; }
}

ghPut('screenshots/m8_e2e_result.json', Buffer.from(JSON.stringify(out)), 'm8 e2e result');
console.log('DONE');
