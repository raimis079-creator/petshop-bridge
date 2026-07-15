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
const out = { steps: {} };

const php = `
add_action('wp_loaded', function(){
	$K='Aa1Ss5Dd';
	// Kur yra shortcode?
	if ( isset($_GET['ps_find']) && $_GET['ps_find']===$K ) {
		global $wpdb;
		$rows = $wpdb->get_results("SELECT ID,post_title,post_name,post_status FROM {$wpdb->posts} WHERE post_content LIKE '%petshop_pet_form%' AND post_status IN ('publish','draft')", ARRAY_A);
		foreach ($rows as &$r) $r['url'] = get_permalink($r['ID']);
		header('Content-Type: application/json'); echo wp_json_encode($rows); exit;
	}
	// Tokenai DB (ar issiustas magic link)
	if ( isset($_GET['ps_tok']) && $_GET['ps_tok']===$K ) {
		global $wpdb;
		header('Content-Type: application/json');
		echo wp_json_encode($wpdb->get_results("SELECT id,purpose,subject_email,status,created_at,expires_at FROM {$wpdb->prefix}ps_action_tokens ORDER BY id DESC LIMIT 5", ARRAY_A));
		exit;
	}
	// Sukurti esama useri testui
	if ( isset($_GET['ps_mkuser']) && $_GET['ps_mkuser']===$K ) {
		$em = sanitize_email($_GET['em'] ?? '');
		$u = get_user_by('email',$em);
		if (!$u) { $uid = wp_create_user('anon_'.wp_rand(10000,99999), wp_generate_password(24), $em); (new WP_User($uid))->set_role('customer'); }
		else { $uid = $u->ID; }
		header('Content-Type: application/json'); echo wp_json_encode(array('uid'=>$uid)); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Anon', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const pages = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_find=Aa1Ss5Dd"');
try { out.shortcode_pages = JSON.parse(pages); } catch(e){ out.pages_raw = pages.slice(0,300); }
const formUrl = (out.shortcode_pages && out.shortcode_pages[0] && out.shortcode_pages[0].url) || 'https://dev.avesa.lt/augintinis/';
out.form_url = formUrl;

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,150)));

// --- 1. Anoniminis atidaro anketa ---
await page.goto(formUrl, { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2500);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(500);
out.steps.form_visible = await page.locator('.pspet-wrap').first().isVisible().catch(()=>false);
out.steps.is_logged_in = await page.evaluate(() => (window.PSPetConfig||{}).isLoggedIn);

// --- 2. Pildo + juodrastis ---
await page.locator('.pspet-pill', { hasText:'Šuo' }).first().click().catch(()=>{});
await page.waitForTimeout(300);
await page.locator('input.pspet-input').first().fill('AnonReksas');
await page.waitForTimeout(600);
out.steps.draft_after_typing = await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return 'ERR'; } });

// --- 3. PERKROVIMAS -> ar juodrastis islieka ---
await page.reload({ waitUntil:'domcontentloaded' });
await page.waitForTimeout(2500);
out.steps.draft_after_reload = await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return 'ERR'; } });
out.steps.screen_after_reload = await page.locator('.pspet-wrap').first().innerText().catch(()=>'');
await page.screenshot({ path:'/tmp/anon1.png' });

// --- 4. Testi -> uzbaigti ---
const cont = page.locator('.pspet-btn', { hasText:'Tęsti' }).first();
if (await cont.isVisible().catch(()=>false)) { await cont.click(); await page.waitForTimeout(1200); }
const save = page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first();
if (await save.isVisible().catch(()=>false)) { await save.click(); await page.waitForTimeout(2000); }
out.steps.result_screen = await page.locator('.pspet-wrap').first().innerText().catch(()=>'');
await page.screenshot({ path:'/tmp/anon2.png' });

// --- 5. NAUJAS email -> ar ateina nuoroda? ---
const emailInput = page.locator('input[type=email]').first();
out.steps.email_cta_present = await emailInput.isVisible().catch(()=>false);
if (out.steps.email_cta_present) {
  await emailInput.fill('visiskai.naujas.' + Date.now() + '@gyvunai.lt');
  await page.locator('.pspet-btn-primary', { hasText:'Siųsti nuorodą' }).first().click();
  await page.waitForTimeout(2500);
  out.steps.new_email_response = await page.locator('.pspet-save-box, .pspet-wrap').first().innerText().catch(()=>'');
}
let toks = sh('curl -sk "https://dev.avesa.lt/?ps_tok=Aa1Ss5Dd"');
try { out.steps.tokens_after_new_email = JSON.parse(toks); } catch(e){ out.steps.tokens_raw = toks.slice(0,300); }
await page.screenshot({ path:'/tmp/anon3.png' });

out.js_errors = errs;
await browser.close();
for (const n of ['anon1','anon2','anon3']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'anon');

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kf'])||$_GET['ps_kf']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vF', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kf=Rr3Ww8Yy"');
ghPut('screenshots/m8_anon.json', Buffer.from(JSON.stringify(out)), 'anon test');
console.log('DONE');
