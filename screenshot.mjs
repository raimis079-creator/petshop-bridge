import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = { t: {}, trace: [] };
function T(x){ out.trace.push(x); }
try {
const php = `
add_action('wp_loaded', function(){
	$K='Ww1Qq7Zz';
	if ( isset($_GET['ps_login']) && $_GET['ps_login']===$K ) {
		$l='s208_'.wp_rand(10000,99999);
		$uid=wp_create_user($l, wp_generate_password(24), $l.'@gyvunai.lt');
		if(is_wp_error($uid)){echo 'ERR';exit;}
		(new WP_User($uid))->set_role('customer');
		wp_set_current_user($uid); wp_set_auth_cookie($uid,true);
		wp_safe_redirect( add_query_arg('action','create', wc_get_account_endpoint_url('augintinis')) ); exit;
	}
	if ( isset($_GET['ps_pets']) && $_GET['ps_pets']===$K ) {
		global $wpdb; $uid=absint($_GET['uid']??0);
		header('Content-Type: application/json');
		echo wp_json_encode($wpdb->get_results($wpdb->prepare("SELECT id,pet_name,species,life_stage,dog_size,feeding_type,status,is_primary FROM {$wpdb->prefix}ps_pets WHERE user_id=%d ORDER BY id",$uid), ARRAY_A));
		exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 T208', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1200}, ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(15000);
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,120)));

await page.goto('https://dev.avesa.lt/?ps_login=Ww1Qq7Zz', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2500);
out.uid = await page.evaluate(() => { const m=document.body.innerText.match(/#(\d+)/); return m?m[1]:null; });
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);
T('uid ' + out.uid);

// --- Sukuriam pirma: Sarikas, suo, vidutinis, tik sausas ---
await page.locator('.pspet-pill', { hasText:'Šuo' }).first().click();
await page.waitForTimeout(300);
await page.locator('#pspet-form-host input.pspet-input').first().fill('Sarikas');
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1200);
await page.locator('.pspet-pill', { hasText:'Suaugęs (1–7 m.)' }).first().click().catch(()=>{});
await page.waitForTimeout(200);
await page.locator('.pspet-pill', { hasText:'Vidutinis (10–25 kg)' }).first().click().catch(()=>{});
await page.waitForTimeout(200);
await page.locator('.pspet-pill', { hasText:'Tik sausas' }).first().click().catch(()=>{});
await page.waitForTimeout(300);
await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
await page.waitForTimeout(3000);
T('Sarikas sukurtas');

// --- I profili ---
await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);

// ===== T1: REDAGAVIMAS — ar anketa atsidaro UZPILDYTA? =====
await page.locator('.pspet-p-action', { hasText:'Redaguoti profilį' }).first().click();
await page.waitForTimeout(2000);
out.t.edit_name_value = await page.locator('#pspet-form-host input.pspet-input').first().inputValue().catch(()=>'(nera)');
out.t.edit_species_active = await page.locator('#pspet-form-host .pspet-pill.active').first().textContent().catch(()=>'(nera)');
await page.screenshot({ path:'/tmp/s208a.png' });
T('redagavimas: vardas=' + out.t.edit_name_value + ' rusis=' + out.t.edit_species_active);
// keiciam varda -> issaugom
await page.locator('#pspet-form-host input.pspet-input').first().fill('Sarikas Naujas');
await page.waitForTimeout(300);
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1200);
out.t.edit_step2_prefilled = await page.locator('#pspet-form-host .pspet-pill.active').count().catch(()=>0);
await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
await page.waitForTimeout(3000);
out.t.edit_result = (await page.locator('#pspet-form-host').innerText().catch(()=>'')).slice(0,80);
let pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Ww1Qq7Zz&uid=${out.uid}"`);
try { out.t.pets_after_edit = JSON.parse(pets); } catch(e){}
T('po redagavimo');

// ===== T2: PRIDETI KITA — ar anketa SVARI? =====
await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);
await page.locator('.pspet-p-action', { hasText:'Pridėti kitą augintinį' }).first().click();
await page.waitForTimeout(1800);
out.t.add_name_empty = (await page.locator('#pspet-form-host input.pspet-input').first().inputValue().catch(()=>'x')) === '';
out.t.add_active_pills = await page.locator('#pspet-form-host .pspet-pill.active').count().catch(()=>-1);
T('prideti kita: vardas tuscias=' + out.t.add_name_empty + ' aktyvus pill=' + out.t.add_active_pills);
// sukuriam antra
await page.locator('.pspet-pill', { hasText:'Katė' }).first().click();
await page.waitForTimeout(300);
await page.locator('#pspet-form-host input.pspet-input').first().fill('Murka');
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1200);
await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
await page.waitForTimeout(3000);
pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Ww1Qq7Zz&uid=${out.uid}"`);
try { out.t.pets_after_add = JSON.parse(pets); } catch(e){}

// ===== T3: PERJUNGIKLIS + TRYNIMAS =====
await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);
out.t.switcher_visible = await page.locator('.pspet-switch-item').first().isVisible().catch(()=>false);
out.t.switcher_count = await page.locator('.pspet-switch-item').count().catch(()=>0);
await page.screenshot({ path:'/tmp/s208b.png' });
await page.locator('.pspet-p-action', { hasText:'Ištrinti profilį' }).first().click();
await page.waitForTimeout(1500);
out.t.delete_confirm = (await page.locator('#pspet-profile').innerText().catch(()=>'')).slice(0,110);
await page.screenshot({ path:'/tmp/s208c.png' });
await page.locator('.pspet-btn-primary', { hasText:'Taip, ištrinti' }).first().click();
await page.waitForTimeout(3500);
out.t.after_delete = (await page.locator('#pspet-profile').innerText().catch(()=>'')).slice(0,110);
pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Ww1Qq7Zz&uid=${out.uid}"`);
try { out.t.pets_after_delete = JSON.parse(pets); } catch(e){}
out.js_errors = errs;
await browser.close();
for (const n of ['s208a','s208b','s208c']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 's208');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_km'])||$_GET['ps_km']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vM', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_km=Rr3Ww8Yy"');
ghPut('screenshots/m8_t208.json', Buffer.from(JSON.stringify(out)), 't208');
console.log('DONE');
