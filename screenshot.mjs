import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(path, buf, msg) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${path}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: msg, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};

const php = `
add_action('wp_loaded', function(){
	if ( isset($_GET['ps_v205']) && $_GET['ps_v205'] === 'Tt8Uu2Ii' ) {
		$login = 'm8v205_' . wp_rand(10000,99999);
		$uid = wp_create_user( $login, wp_generate_password(24), $login . '@gyvunai.lt' );
		if ( is_wp_error($uid) ) { echo 'ERR'; exit; }
		(new WP_User($uid))->set_role('customer');
		wp_set_current_user($uid); wp_set_auth_cookie($uid, true);
		wp_safe_redirect( add_query_arg('action','create', wc_get_account_endpoint_url('augintinis')) ); exit;
	}
	if ( isset($_GET['ps_v205log']) && $_GET['ps_v205log'] === 'Tt8Uu2Ii' ) {
		global $wpdb;
		$t = $wpdb->prefix.'ps_event_log';
		$o = array('rows' => $wpdb->get_results("SELECT id,event_name,email,status,attempts,last_error,esp_response,emitted_at FROM {$t} ORDER BY id DESC LIMIT 6", ARRAY_A));
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 V205', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 }, ignoreHTTPSErrors: true });
const page = await ctx.newPage();
const errors = []; const senderCalls = [];
page.on('pageerror', e => errors.push(String(e).slice(0,150)));
page.on('request', r => { if (r.url().includes('sender.net')) senderCalls.push(r.method()+' '+r.url()); });

await page.goto('https://dev.avesa.lt/?ps_v205=Tt8Uu2Ii', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3000);
try { const c = page.locator('text=PRIIMTI').first(); if (await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(600);
await page.locator('.pspet-pill', { hasText:'Katė' }).first().click();
await page.waitForTimeout(400);
await page.locator('#pspet-form-host input.pspet-input').first().fill('Murkė205');
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1200);
await page.locator('.pspet-pill', { hasText:'Suaugusi (1–7 m.)' }).first().click().catch(()=>{});
await page.waitForTimeout(300);
await page.locator('.pspet-pill', { hasText:'Taip' }).first().click().catch(()=>{});
await page.waitForTimeout(300);
await page.locator('.pspet-pill', { hasText:'Mišrus' }).first().click().catch(()=>{});
await page.waitForTimeout(400);
await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
await page.waitForTimeout(4000);
out.result_ok = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
await page.screenshot({ path:'/tmp/v205.png' });
out.js_errors = errors;
out.browser_sender_calls = senderCalls;
await browser.close();
ghPut('screenshots/m8_v205.png', fs.readFileSync('/tmp/v205.png'), 'v205');

// Palaukiam kol async Action Scheduler apdoros eventa
sh('sleep 8');
const log = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_v205log=Tt8Uu2Ii"');
try { out.log = JSON.parse(log); } catch(e){ out.log_raw = log.slice(0,400); }

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8k7'])||$_GET['ps_m8k7']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill v7', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8k7=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_v205.json', Buffer.from(JSON.stringify(out)), 'v205 result');
console.log('DONE');
