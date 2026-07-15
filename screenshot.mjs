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
	if ( isset($_GET['ps_x']) && $_GET['ps_x']==='Uu6Ii4Oo' ) {
		$l='x_'.wp_rand(10000,99999);
		$uid=wp_create_user($l, wp_generate_password(24), $l.'@gyvunai.lt');
		(new WP_User($uid))->set_role('customer');
		global $wpdb;
		$wpdb->insert($wpdb->prefix.'ps_pets', array('user_id'=>$uid,'pet_name'=>'X','species'=>'dog','life_stage'=>'adult','dog_size'=>'medium','feeding_type'=>'dry_only','is_primary'=>1,'status'=>'active','created_at'=>current_time('mysql'),'updated_at'=>current_time('mysql')));
		wp_set_current_user($uid); wp_set_auth_cookie($uid,true);
		wp_safe_redirect( wc_get_account_endpoint_url('augintinis') ); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 X', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAaklEQVR4nO3QMQ0AAAjAMPybBv+HgSZNegdmT3vmwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwtcOxUsBAcOHKzUAAAAASUVORK5CYII=','base64');
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/?ps_x=Uu6Ii4Oo', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(4000);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);
out.pet_id = await page.evaluate(async () => {
  const cfg = window.PSPetConfig || {};
  const l = await (await fetch(cfg.restUrl+'/pet-profile', {headers:{'X-WP-Nonce':cfg.nonce},credentials:'same-origin'})).json();
  return l.pets && l.pets[0] ? l.pets[0].id : null;
});
// Tikslus POST is naršyklės su atsakymo turiniu
out.upload = await page.evaluate(async ({ b64, petId }) => {
  const cfg = window.PSPetConfig || {};
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
  const blob = new Blob([arr], { type: 'image/png' });
  const fd = new FormData();
  fd.append('photo', blob, 'test.png');
  const r = await fetch(cfg.restUrl + '/pet-photo/' + petId, {
    method: 'POST', headers: { 'X-WP-Nonce': cfg.nonce }, body: fd, credentials: 'same-origin'
  });
  const txt = await r.text();
  return { status: r.status, body: txt.slice(0, 300) };
}, { b64: png.toString('base64'), petId: out.pet_id });

// Autocomplete — TIKSLUS selektorius
await page.locator('.pspet-p-action', { hasText:'Redaguoti profilį' }).first().click();
await page.waitForTimeout(1800);
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1500);
await page.locator('#pspet-form-host .pspet-autocomplete input').first().fill('jos');
await page.waitForTimeout(2500);
out.ac_html = await page.evaluate(() => { const e = document.querySelector('#pspet-form-host .pspet-autocomplete'); return e ? e.innerHTML.slice(0,500) : '(nera)'; });
out.ac_children = await page.evaluate(() => {
  const box = document.querySelector('#pspet-form-host .pspet-autocomplete');
  if (!box) return null;
  return Array.from(box.children).map(c => ({ tag:c.tagName, cls:c.className, kids:c.children.length, txt:(c.textContent||'').trim().slice(0,40) }));
});
await page.screenshot({ path:'/tmp/x.png' });
await browser.close();
ghPut('screenshots/m8_x.png', fs.readFileSync('/tmp/x.png'), 'x');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_ks'])||$_GET['ps_ks']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vS', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ks=Rr3Ww8Yy"');
ghPut('screenshots/m8_x.json', Buffer.from(JSON.stringify(out)), 'x');
console.log('DONE');
