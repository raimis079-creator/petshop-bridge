import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(path, buf, msg) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${path}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: msg, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,400); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};

const php = `
add_action('wp_loaded', function(){
	$K = 'Ss3Dd7Ff';
	// A: sukurti useri + prisijungti
	if ( isset($_GET['ps_t205']) && $_GET['ps_t205'] === $K ) {
		$u = get_user_by('email','terra@petshop.lt');
		if ( ! $u ) {
			$uid = wp_create_user('terra_test_s205', wp_generate_password(24), 'terra@petshop.lt');
			if ( is_wp_error($uid) ) { echo 'ERR '.$uid->get_error_message(); exit; }
			(new WP_User($uid))->set_role('customer');
		} else { $uid = $u->ID; }
		wp_set_current_user($uid); wp_set_auth_cookie($uid, true);
		wp_safe_redirect( add_query_arg('action','create', wc_get_account_endpoint_url('augintinis')) ); exit;
	}
	// B: rezultatai
	if ( isset($_GET['ps_t205res']) && $_GET['ps_t205res'] === $K ) {
		global $wpdb;
		$o = array();
		$o['events'] = $wpdb->get_results("SELECT id,event_name,email,status,attempts,last_error,esp_response,emitted_at FROM {$wpdb->prefix}ps_event_log ORDER BY id DESC LIMIT 3", ARRAY_A);
		$u = get_user_by('email','terra@petshop.lt');
		$o['pets'] = $u ? $wpdb->get_results($wpdb->prepare("SELECT id,pet_name,species,life_stage,dog_size,feeding_type,is_primary FROM {$wpdb->prefix}ps_pets WHERE user_id=%d",$u->ID), ARRAY_A) : array();
		if ( function_exists('ps_esp_adapter') ) {
			$a = ps_esp_adapter();
			foreach (array('PS_PET_SPECIES','PS_PET_NAME','PS_PET_LIFE_STAGE','PS_DOG_SIZE','PS_FEEDING_TYPE','PS_PRIMARY_NEED') as $f) {
				$o['sender_fields'][$f] = $a->get_contact_field('terra@petshop.lt', $f);
			}
		}
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
	// C: VALYMAS
	if ( isset($_GET['ps_t205clean']) && $_GET['ps_t205clean'] === $K ) {
		global $wpdb;
		$o = array();
		$u = get_user_by('email','terra@petshop.lt');
		if ($u) {
			$o['pets_deleted'] = $wpdb->delete($wpdb->prefix.'ps_pets', array('user_id'=>$u->ID));
			// Sender laukai — isvalom (buvo tusti pries testa)
			if ( function_exists('ps_esp_adapter') ) {
				$a = ps_esp_adapter();
				$r = $a->upsert_contact('terra@petshop.lt', array(
					'PS_PET_SPECIES'=>'', 'PS_PET_NAME'=>'', 'PS_PET_LIFE_STAGE'=>'',
					'PS_DOG_SIZE'=>'', 'PS_FEEDING_TYPE'=>'', 'PS_PRIMARY_NEED'=>'',
				));
				$o['sender_cleared'] = $r;
			}
			require_once ABSPATH.'wp-admin/includes/user.php';
			$o['user_deleted'] = wp_delete_user($u->ID);
		} else { $o['note'] = 'user nerastas'; }
		// patikra
		$o['pets_left'] = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}ps_pets WHERE pet_name LIKE 'TEST-S205%'");
		$o['user_left'] = get_user_by('email','terra@petshop.lt') ? 'DAR YRA' : 'istrintas';
		if ( function_exists('ps_esp_adapter') ) {
			$a = ps_esp_adapter();
			$o['sender_after'] = array('PS_PET_NAME'=>$a->get_contact_field('terra@petshop.lt','PS_PET_NAME'), 'PS_PET_SPECIES'=>$a->get_contact_field('terra@petshop.lt','PS_PET_SPECIES'));
		}
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 T205', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1200}, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,150)));
await page.goto('https://dev.avesa.lt/?ps_t205=Ss3Dd7Ff', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3000);
out.landed = page.url();
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(600);
await page.locator('.pspet-pill', { hasText:'Šuo' }).first().click();
await page.waitForTimeout(400);
await page.locator('#pspet-form-host input.pspet-input').first().fill('TEST-S205');
await page.locator('.pspet-pill', { hasText:'Kasdienė mityba' }).first().click().catch(()=>{});
await page.waitForTimeout(400);
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1200);
await page.locator('.pspet-pill', { hasText:'Suaugęs (1–7 m.)' }).first().click().catch(()=>{});
await page.waitForTimeout(300);
await page.locator('.pspet-pill', { hasText:'Didelis (25+ kg)' }).first().click().catch(()=>{});
await page.waitForTimeout(300);
await page.locator('.pspet-pill', { hasText:'Tik sausas' }).first().click().catch(()=>{});
await page.waitForTimeout(400);
await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
await page.waitForTimeout(4000);
out.saved = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
await page.screenshot({ path:'/tmp/t205.png' });
out.js_errors = errs;
await browser.close();
ghPut('screenshots/m8_t205.png', fs.readFileSync('/tmp/t205.png'), 't205');

sh('sleep 10');
const res = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_t205res=Ss3Dd7Ff"');
try { out.result = JSON.parse(res); } catch(e){ out.result_raw = res.slice(0,600); }

const cl = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_t205clean=Ss3Dd7Ff"');
try { out.cleanup = JSON.parse(cl); } catch(e){ out.cleanup_raw = cl.slice(0,600); }

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8ka'])||$_GET['ps_m8ka']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vA', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8ka=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_t205.json', Buffer.from(JSON.stringify(out)), 't205 result');
console.log('DONE');
