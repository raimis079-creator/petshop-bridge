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
const out = { tests: {} };

const php = `
add_action('wp_loaded', function(){
	$K='Mm2Nn8Bb';
	if ( isset($_GET['ps_login']) && $_GET['ps_login']===$K ) {
		$login='dup206_'.wp_rand(10000,99999);
		$uid=wp_create_user($login, wp_generate_password(24), $login.'@gyvunai.lt');
		if (is_wp_error($uid)) { echo 'ERR'; exit; }
		(new WP_User($uid))->set_role('customer');
		wp_set_current_user($uid); wp_set_auth_cookie($uid,true);
		wp_safe_redirect( add_query_arg('action','create', wc_get_account_endpoint_url('augintinis')) ); exit;
	}
	if ( isset($_GET['ps_pets']) && $_GET['ps_pets']===$K ) {
		global $wpdb;
		$uid = absint($_GET['uid'] ?? 0);
		header('Content-Type: application/json');
		echo wp_json_encode($wpdb->get_results($wpdb->prepare("SELECT id,pet_name,species,life_stage,dog_size,feeding_type,status,is_primary FROM {$wpdb->prefix}ps_pets WHERE user_id=%d ORDER BY id", $uid), ARRAY_A));
		exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Dup206', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1200}, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,150)));

async function fillForm(name, species, opts){
  await page.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(2500);
  await page.locator('.pspet-pill', { hasText: species }).first().click();
  await page.waitForTimeout(400);
  if (name) await page.locator('#pspet-form-host input.pspet-input').first().fill(name);
  await page.waitForTimeout(300);
  await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
  await page.waitForTimeout(1200);
  if (opts && opts.stage) { await page.locator('.pspet-pill', { hasText: opts.stage }).first().click().catch(()=>{}); await page.waitForTimeout(300); }
  await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
  await page.waitForTimeout(3000);
}

// Login
await page.goto('https://dev.avesa.lt/?ps_login=Mm2Nn8Bb', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2500);
out.uid = await page.evaluate(() => { const m=document.body.innerText.match(/#(\d+)/); return m?m[1]:null; });
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);

// --- TESTAS 1: pirmas Reksas ---
await fillForm('Reksas', 'Šuo', { stage:'Suaugęs (1–7 m.)' });
out.tests.t1_saved = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);

// --- TESTAS 2: "reksas" mazosiomis -> turi rodyti pasirinkima ---
await fillForm('reksas', 'Šuo', { stage:'Senjoras (7+ m.)' });
out.tests.t2_duplicate_screen = await page.locator('text=jau turite').first().isVisible().catch(()=>false);
out.tests.t2_text = await page.locator('#pspet-form-host').innerText().catch(()=>'');
await page.screenshot({ path:'/tmp/dup1.png' });

// --- TESTAS 3: "Atnaujinti si profili" -> jokio antro augintinio ---
await page.locator('.pspet-btn-primary', { hasText:'Atnaujinti šį profilį' }).first().click();
await page.waitForTimeout(3000);
out.tests.t3_result = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
await page.screenshot({ path:'/tmp/dup2.png' });
let pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Mm2Nn8Bb&uid=${out.uid}"`);
try { out.tests.t3_pets = JSON.parse(pets); } catch(e){ out.tests.t3_pets_raw = pets.slice(0,300); }

// --- TESTAS 4: "Ne, tai kitas augintinis" -> force_new -> 2 augintiniai ---
await fillForm('Reksas', 'Šuo', { stage:'Jauniklis (iki 1 m.)' });
out.tests.t4_duplicate_screen = await page.locator('text=jau turite').first().isVisible().catch(()=>false);
await page.locator('.pspet-btn-secondary', { hasText:'Ne, tai kitas augintinis' }).first().click();
await page.waitForTimeout(3000);
out.tests.t4_result = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Mm2Nn8Bb&uid=${out.uid}"`);
try { out.tests.t4_pets = JSON.parse(pets); } catch(e){}

// --- TESTAS 5: bevardis -> jokio klausimo ---
await fillForm('', 'Katė', { stage:'Suaugusi (1–7 m.)' });
out.tests.t5_no_dup_prompt = !(await page.locator('text=jau turite').first().isVisible().catch(()=>false));
out.tests.t5_saved = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
// antras bevardis
await fillForm('', 'Katė', { stage:'Senjorė (7+ m.)' });
out.tests.t5b_no_dup_prompt = !(await page.locator('text=jau turite').first().isVisible().catch(()=>false));
out.tests.t5b_saved = await page.locator('text=profilis sukurtas').first().isVisible().catch(()=>false);
pets = sh(`curl -sk "https://dev.avesa.lt/?ps_pets=Mm2Nn8Bb&uid=${out.uid}"`);
try { out.tests.final_pets = JSON.parse(pets); } catch(e){}

out.js_errors = errs;
await browser.close();
for (const n of ['dup1','dup2']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'dup');

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kd'])||$_GET['ps_kd']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vD', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kd=Rr3Ww8Yy"');
ghPut('screenshots/m8_dup206.json', Buffer.from(JSON.stringify(out)), 'dup206 result');
console.log('DONE');
