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
add_filter('pre_wp_mail', function($null, $atts){
	update_option('ps_test_last_mail', array('to'=>$atts['to'],'body'=>$atts['message']), false);
	return true;
}, 999, 2);
add_action('wp_loaded', function(){
	$K='Cc9Vv3Nn';
	if ( isset($_GET['ps_seed']) && $_GET['ps_seed']===$K ) {
		global $wpdb;
		$em = sanitize_email($_GET['em']);
		$u = get_user_by('email',$em);
		if (!$u) { $uid = wp_create_user('seed_'.wp_rand(10000,99999), wp_generate_password(24), $em); if(is_wp_error($uid)){echo 'ERR';exit;} (new WP_User($uid))->set_role('customer'); }
		else { $uid = $u->ID; }
		$wpdb->insert($wpdb->prefix.'ps_pets', array('user_id'=>$uid,'pet_name'=>'Reksas','species'=>'dog','life_stage'=>'adult','is_primary'=>1,'status'=>'active','created_at'=>current_time('mysql'),'updated_at'=>current_time('mysql')));
		header('Content-Type: application/json'); echo wp_json_encode(array('uid'=>$uid,'pet_id'=>$wpdb->insert_id)); exit;
	}
	if ( isset($_GET['ps_mail']) && $_GET['ps_mail']===$K ) {
		header('Content-Type: application/json'); echo wp_json_encode(get_option('ps_test_last_mail', array())); exit;
	}
	if ( isset($_GET['ps_expire']) && $_GET['ps_expire']===$K ) {
		global $wpdb;
		$n = $wpdb->query("UPDATE {$wpdb->prefix}ps_action_tokens SET expires_at = '2020-01-01 00:00:00' WHERE status='active'");
		header('Content-Type: application/json'); echo wp_json_encode(array('expired'=>$n)); exit;
	}
	if ( isset($_GET['ps_pets']) && $_GET['ps_pets']===$K ) {
		global $wpdb;
		$em = sanitize_email($_GET['em']); $u = get_user_by('email',$em);
		header('Content-Type: application/json');
		echo wp_json_encode($u ? $wpdb->get_results($wpdb->prepare("SELECT id,pet_name,species,life_stage FROM {$wpdb->prefix}ps_pets WHERE user_id=%d ORDER BY id",$u->ID), ARRAY_A) : array());
		exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Matrix', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();

async function anonFill(page, name, species, stage){
  await page.goto('https://dev.avesa.lt/anketa-testas/', { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(2500);
  try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
  await page.waitForTimeout(400);
  await page.locator('.pspet-pill', { hasText: species }).first().click();
  await page.waitForTimeout(300);
  if (name) await page.locator('input.pspet-input').first().fill(name);
  await page.waitForTimeout(300);
  await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
  await page.waitForTimeout(1300);
  if (stage) { await page.locator('.pspet-pill', { hasText: stage }).first().click().catch(()=>{}); await page.waitForTimeout(300); }
  await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
  await page.waitForTimeout(2500);
}
async function getLink(){
  const mail = sh('curl -sk "https://dev.avesa.lt/?ps_mail=Cc9Vv3Nn"');
  try { const mj = JSON.parse(mail); const m = String(mj.body||'').match(/https:\/\/dev\.avesa\.lt\/petshop-login\?token=[^"'&]+/); return m ? m[0] : null; } catch(e){ return null; }
}

// ============ T1: DUBLIKATAS PERKELIANT ============
const EM1 = 'dupxfer' + Date.now() + '@gyvunai.lt';
const seed = sh(`curl -sk "https://dev.avesa.lt/?ps_seed=Cc9Vv3Nn&em=${EM1}"`);
T('seed: ' + seed.slice(0,60));
let ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
let page = await ctx.newPage(); page.setDefaultTimeout(15000);
const e1=[]; page.on('pageerror', e=>e1.push(String(e).slice(0,100)));
await anonFill(page, 'Reksas', 'Šuo', 'Senjoras');
await page.locator('input[type=email]').first().fill(EM1);
await page.locator('.pspet-btn-primary', { hasText:'Siųsti nuorodą' }).first().click();
await page.waitForTimeout(3000);
let link = await getLink();
T('T1 nuoroda: ' + !!link);
if (link) {
  await page.goto(link, { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(1200);
  await page.locator('button[type=submit]').first().click();
  await page.waitForTimeout(6000);
  out.t.t1_url = page.url();
  out.t.t1_screen = (await page.locator('#pspet-profile').innerText().catch(()=>'')).slice(0,200);
  out.t.t1_choice_shown = /jau turite/.test(out.t.t1_screen);
  out.t.t1_draft_kept = !!(await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return null; } }));
  await page.screenshot({ path:'/tmp/mx1.png' });
  // Renkam "Atnaujinti si profili"
  const b = page.locator('.pspet-btn-primary', { hasText:'Atnaujinti šį profilį' }).first();
  if (await b.isVisible().catch(()=>false)) {
    await b.click(); await page.waitForTimeout(4000);
    out.t.t1_after_update = (await page.locator('#pspet-profile').innerText().catch(()=>'')).slice(0,120);
    out.t.t1_draft_after = await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return 'ERR'; } });
  }
  let pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Cc9Vv3Nn&em=${EM1}"`);
  try { out.t.t1_pets = JSON.parse(pets); } catch(e){}
}
out.t.t1_errs = e1;
await ctx.close();

// ============ T2: 30 DIENU JUODRASTIS ============
ctx = await browser.newContext({ viewport:{width:1440,height:1000}, ignoreHTTPSErrors:true });
page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/anketa-testas/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  localStorage.setItem('pspet_draft', JSON.stringify({
    schema_version:1, draft_id:'d_senas', created_at:'2026-01-01T00:00:00.000Z',
    expires_at:'2026-02-01T00:00:00.000Z', current_step:2,
    pet_data:{ species:'dog', pet_name:'SenasJuodrastis' }
  }));
});
await page.reload({ waitUntil:'domcontentloaded' });
await page.waitForTimeout(2500);
out.t.t2_draft_removed = !(await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return null; } }));
out.t.t2_screen = (await page.locator('.pspet-wrap').first().innerText().catch(()=>'')).slice(0,90);
await ctx.close();

// ============ T3: PASIBAIGES LINKAS ============
const EM3 = 'expired' + Date.now() + '@gyvunai.lt';
ctx = await browser.newContext({ viewport:{width:1440,height:1000}, ignoreHTTPSErrors:true });
page = await ctx.newPage(); page.setDefaultTimeout(15000);
await anonFill(page, 'Pasibaiges', 'Šuo', 'Suaugęs');
await page.locator('input[type=email]').first().fill(EM3);
await page.locator('.pspet-btn-primary', { hasText:'Siųsti nuorodą' }).first().click();
await page.waitForTimeout(3000);
link = await getLink();
sh('curl -sk "https://dev.avesa.lt/?ps_expire=Cc9Vv3Nn"');
T('tokenai pasenninti');
if (link) {
  await page.goto(link, { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(1500);
  out.t.t3_page = (await page.locator('body').innerText().catch(()=>'')).slice(0,140);
  const sb = page.locator('button[type=submit]').first();
  if (await sb.isVisible().catch(()=>false)) { await sb.click(); await page.waitForTimeout(3000); out.t.t3_after_submit = (await page.locator('body').innerText().catch(()=>'')).slice(0,140); }
  out.t.t3_draft_kept = !!(await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return null; } }));
}
await ctx.close();

await browser.close();
for (const n of ['mx1']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'mx');
} catch(err) { out.FATAL = String(err && err.message ? err.message : err).slice(0,500); }

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kk'])||$_GET['ps_kk']!=='Rr3Ww8Yy'){return;} global $wpdb; delete_option('ps_test_last_mail'); $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vK', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kk=Rr3Ww8Yy"');
ghPut('screenshots/m8_matrix.json', Buffer.from(JSON.stringify(out)), 'matrix');
console.log('DONE');
