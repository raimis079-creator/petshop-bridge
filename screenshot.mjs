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
try {
const php = `
add_action('wp_loaded', function(){
	if ( isset(\$_GET['ps_f']) && \$_GET['ps_f']==='Zz2Xx9Cc' ) {
		\$l='f_'.wp_rand(10000,99999);
		\$uid=wp_create_user(\$l, wp_generate_password(24), \$l.'@gyvunai.lt');
		(new WP_User(\$uid))->set_role('customer');
		global \$wpdb;
		\$wpdb->insert(\$wpdb->prefix.'ps_pets', array('user_id'=>\$uid,'pet_name'=>'Fin','species'=>'dog','life_stage'=>'adult','dog_size'=>'medium','feeding_type'=>'dry_only','is_primary'=>1,'status'=>'active','created_at'=>current_time('mysql'),'updated_at'=>current_time('mysql')));
		wp_set_current_user(\$uid); wp_set_auth_cookie(\$uid,true);
		wp_safe_redirect( wc_get_account_endpoint_url('augintinis') ); exit;
	}
	if ( isset(\$_GET['ps_fchk']) && \$_GET['ps_fchk']==='Zz2Xx9Cc' ) {
		global \$wpdb;
		header('Content-Type: application/json');
		echo wp_json_encode(\$wpdb->get_results("SELECT id,pet_name,photo_file_id,current_food_brand FROM {\$wpdb->prefix}ps_pets WHERE pet_name='Fin' ORDER BY id DESC LIMIT 1", ARRAY_A));
		exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Fin', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(15000);
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,110)));
await page.goto('https://dev.avesa.lt/?ps_f=Zz2Xx9Cc', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(4000);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);
out.pet_id = await page.evaluate(async () => {
  const cfg = window.PSPetConfig || {};
  const l = await (await fetch(cfg.restUrl+'/pet-profile',{headers:{'X-WP-Nonce':cfg.nonce},credentials:'same-origin'})).json();
  return l.pets && l.pets[0] ? l.pets[0].id : null;
});
// TIKRAS PNG
out.upload = await page.evaluate(async ({ b64, petId }) => {
  const cfg = window.PSPetConfig || {};
  const bin = atob(b64); const arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
  const fd = new FormData();
  fd.append('photo', new Blob([arr], {type:'image/png'}), 'real.png');
  const r = await fetch(cfg.restUrl+'/pet-photo/'+petId, { method:'POST', headers:{'X-WP-Nonce':cfg.nonce}, body:fd, credentials:'same-origin' });
  return { status: r.status, body: (await r.text()).slice(0,220) };
}, { b64: 'iVBORw0KGgoAAAANSUhEUgAAAlgAAAHgCAIAAAD2dYQOAAAHRklEQVR4nO3XMQ3DUBQEwTgKHWMwFCttKKQ2BbehGhhP+juD4LrVbft5PACg6jk9AAAmCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkCSEAaUIIQJoQApAmhACkvaYHsKbv5z09gQVd9296AgvyCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgDQhBCBNCAFIE0IA0oQQgLRtP4/pDQAwxiMEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIE0IAUgTQgDShBCANCEEIO0P8dIIV/QojnUAAAAASUVORK5CYII=', petId: out.pet_id });
await page.reload({ waitUntil:'domcontentloaded' }); await page.waitForTimeout(3500);
out.avatar_src = await page.evaluate(() => { const i = document.querySelector('.pspet-p-avatar img'); return i ? i.src.slice(0,90) : '(nera img)'; });
await page.screenshot({ path:'/tmp/fin1.png' });
// AUTOCOMPLETE — realus rasymas
await page.locator('.pspet-p-action', { hasText:'Redaguoti profilį' }).first().click();
await page.waitForTimeout(1800);
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1500);
const inp = page.locator('#pspet-form-host .pspet-autocomplete input').first();
await inp.click();
await inp.type('jos', { delay: 160 });
await page.waitForTimeout(2500);
out.suggestions = await page.evaluate(() => {
  const b = document.querySelector('#pspet-form-host .pspet-suggestions');
  return b ? Array.from(b.children).map(c => (c.textContent||'').trim()) : null;
});
await page.screenshot({ path:'/tmp/fin2.png' });
if (out.suggestions && out.suggestions.length) {
  await page.locator('#pspet-form-host .pspet-suggestions').locator('*').first().click();
  await page.waitForTimeout(600);
  out.after_pick = await inp.inputValue().catch(()=>'');
  await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
  await page.waitForTimeout(3000);
}
const chk = sh('curl -sk "https://dev.avesa.lt/?ps_fchk=Zz2Xx9Cc"');
try { out.db = JSON.parse(chk); } catch(e){ out.db_raw = chk.slice(0,150); }
out.errs = errs;
await browser.close();
for (const n of ['fin1','fin2']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'fin');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset(\$_GET['ps_kt'])||\$_GET['ps_kt']!=='Rr3Ww8Yy'){return;} global \$wpdb; \$n=\$wpdb->query("DELETE FROM {\$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>\$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vT', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kt=Rr3Ww8Yy"');
ghPut('screenshots/m8_fin.json', Buffer.from(JSON.stringify(out)), 'fin');
console.log('DONE');
