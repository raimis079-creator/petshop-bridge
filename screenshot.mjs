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
const out = { t: {} };
try {
const php = `
add_action('wp_loaded', function(){
	if ( isset($_GET['ps_ph']) && $_GET['ps_ph']==='Hh2Jj6Kk' ) {
		$l='ph_'.wp_rand(10000,99999);
		$uid=wp_create_user($l, wp_generate_password(24), $l.'@gyvunai.lt');
		(new WP_User($uid))->set_role('customer');
		global $wpdb;
		$wpdb->insert($wpdb->prefix.'ps_pets', array('user_id'=>$uid,'pet_name'=>'Foto','species'=>'dog','life_stage'=>'adult','dog_size'=>'medium','feeding_type'=>'dry_only','is_primary'=>1,'status'=>'active','created_at'=>current_time('mysql'),'updated_at'=>current_time('mysql')));
		wp_set_current_user($uid); wp_set_auth_cookie($uid,true);
		wp_safe_redirect( wc_get_account_endpoint_url('augintinis') ); exit;
	}
	if ( isset($_GET['ps_phchk']) && $_GET['ps_phchk']==='Hh2Jj6Kk' ) {
		global $wpdb;
		header('Content-Type: application/json');
		echo wp_json_encode($wpdb->get_results("SELECT id,pet_name,photo_file_id FROM {$wpdb->prefix}ps_pets WHERE pet_name='Foto' ORDER BY id DESC LIMIT 1", ARRAY_A));
		exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Photo', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

// Testinis PNG
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAaklEQVR4nO3QMQ0AAAjAMPybBv+HgSZNegdmT3vmwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwtcOxUsBAcOHKzUAAAAASUVORK5CYII=', 'base64');
fs.writeFileSync('/tmp/test.png', png);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1200}, ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(15000);
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,110)));
const api=[]; page.on('response', r=>{ if(r.url().includes('/petshop/v1/')) api.push(r.request().method()+' '+r.url().split('/petshop/v1')[1].split('?')[0]+' -> '+r.status()); });

await page.goto('https://dev.avesa.lt/?ps_ph=Hh2Jj6Kk', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(4000);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);

// ===== NUOTRAUKA =====
const [fc] = await Promise.all([
  page.waitForEvent('filechooser', { timeout: 8000 }).catch(()=>null),
  page.locator('.pspet-p-action', { hasText:'nuotrauką' }).first().click()
]);
if (fc) {
  await fc.setFiles('/tmp/test.png');
  await page.waitForTimeout(5000);
  out.t.photo_uploaded = true;
} else { out.t.photo_uploaded = 'filechooser neatsidare'; }
const chk = sh('curl -sk "https://dev.avesa.lt/?ps_phchk=Hh2Jj6Kk"');
try { out.t.photo_db = JSON.parse(chk); } catch(e){ out.t.photo_raw = chk.slice(0,150); }
out.t.avatar_img = await page.locator('.pspet-p-avatar img').first().isVisible().catch(()=>false);
await page.screenshot({ path:'/tmp/ph.png' });

// ===== BRENDU AUTOCOMPLETE =====
await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);
await page.locator('.pspet-p-action', { hasText:'Redaguoti profilį' }).first().click();
await page.waitForTimeout(1800);
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1500);
const foodInput = page.locator('#pspet-form-host input.pspet-input').last();
out.t.food_field_exists = await foodInput.isVisible().catch(()=>false);
if (out.t.food_field_exists) {
  await foodInput.fill('jos');
  await page.waitForTimeout(2500);
  out.t.suggestions = await page.evaluate(() => Array.from(document.querySelectorAll('#pspet-form-host .pspet-ac-item, #pspet-form-host .pspet-autocomplete div, #pspet-form-host [class*=ac-]')).map(e=>e.textContent.trim()).filter(Boolean).slice(0,6));
  out.t.food_html = await page.evaluate(() => { const f = document.querySelectorAll('#pspet-form-host .pspet-field'); return f.length ? f[f.length-1].innerHTML.slice(0,300) : ''; });
}
await page.screenshot({ path:'/tmp/ac.png' });
out.t.api = api;
out.t.errs = errs;
await browser.close();
for (const n of ['ph','ac']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'ph');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kq'])||$_GET['ps_kq']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vQ', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kq=Rr3Ww8Yy"');
ghPut('screenshots/m8_ph.json', Buffer.from(JSON.stringify(out)), 'ph');
console.log('DONE');
