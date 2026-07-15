import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_dash']) || $_GET['ps_dash'] !== 'Xx5Cc1Vv' ) { return; }
	$l='dash_'.wp_rand(10000,99999);
	$uid=wp_create_user($l, wp_generate_password(24), $l.'@gyvunai.lt');
	(new WP_User($uid))->set_role('customer');
	global $wpdb;
	$wpdb->insert($wpdb->prefix.'ps_pets', array('user_id'=>$uid,'pet_name'=>'Dash','species'=>'dog','life_stage'=>'senior','dog_size'=>'large','feeding_type'=>'mixed','primary_need'=>'digestion','is_primary'=>1,'status'=>'active','created_at'=>current_time('mysql'),'updated_at'=>current_time('mysql')));
	$pid = $wpdb->insert_id;
	wp_set_current_user($uid); wp_set_auth_cookie($uid,true);
	wp_safe_redirect( wc_get_account_endpoint_url('augintinis') ); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Dash', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/?ps_dash=Xx5Cc1Vv', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(4000);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);
// Dashboard pet objekto laukai
out.dash_pet = await page.evaluate(async () => {
  const cfg = window.PSPetConfig || {};
  const list = await (await fetch(cfg.restUrl + '/pet-profile', { headers:{'X-WP-Nonce':cfg.nonce}, credentials:'same-origin' })).json();
  const id = list.pets && list.pets[0] ? list.pets[0].id : null;
  if (!id) return { err:'nera augintiniu', list: list };
  const d = await (await fetch(cfg.restUrl + '/pet-dashboard/' + id, { headers:{'X-WP-Nonce':cfg.nonce}, credentials:'same-origin' })).json();
  return { pet_keys: d.dashboard && d.dashboard.pet ? Object.keys(d.dashboard.pet) : null, pet: d.dashboard ? d.dashboard.pet : null };
});
// Atidarom redagavima ir surenkam aktyvius pill'us
await page.locator('.pspet-p-action', { hasText:'Redaguoti profilį' }).first().click();
await page.waitForTimeout(1800);
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1500);
out.active_pills = await page.evaluate(() => Array.from(document.querySelectorAll('#pspet-form-host .pspet-pill.active')).map(e => e.textContent.trim()));
out.all_labels = await page.evaluate(() => Array.from(document.querySelectorAll('#pspet-form-host .pspet-label')).map(e => e.textContent.trim()));
await page.screenshot({ path:'/tmp/dash.png' });
await browser.close();
ghPut('screenshots/m8_dash.png', fs.readFileSync('/tmp/dash.png'), 'dash');
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kn'])||$_GET['ps_kn']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vN', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kn=Rr3Ww8Yy"');
ghPut('screenshots/m8_dash.json', Buffer.from(JSON.stringify(out)), 'dash');
console.log('DONE');
