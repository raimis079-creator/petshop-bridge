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
// NORMALUS KLIENTAS (ne admin), be admin juostos
const php = `
add_action('wp_loaded', function(){
	$K='Vs2Nn6Cc';
	if ( isset($_GET['ps_cust']) && $_GET['ps_cust']===$K ) {
		$l='klientas'.wp_rand(100,999);
		$uid=wp_create_user($l, wp_generate_password(24), $l.'@gyvunai.lt');
		if(is_wp_error($uid)){echo 'ERR';exit;}
		$u = new WP_User($uid); $u->set_role('customer');
		wp_update_user(array('ID'=>$uid,'first_name'=>'Jonas','display_name'=>'Jonas'));
		update_user_meta($uid, 'show_admin_bar_front', 'false');
		wp_set_current_user($uid); wp_set_auth_cookie($uid,true);
		wp_safe_redirect( add_query_arg('action','create', wc_get_account_endpoint_url('augintinis')) ); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Cust', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();

// ===== DESKTOP =====
let ctx = await browser.newContext({ viewport:{width:1440,height:1300}, ignoreHTTPSErrors:true });
let page = await ctx.newPage(); page.setDefaultTimeout(15000);
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,110)));
await page.goto('https://dev.avesa.lt/?ps_cust=Vs2Nn6Cc', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(600);

out.t.admin_bar = await page.locator('#wpadminbar').first().isVisible().catch(()=>false);
out.t.onboarding_class = await page.evaluate(() => document.body.classList.contains('ps-pet-onboarding'));
out.t.sidebar_visible = await page.locator('.woocommerce-MyAccount-navigation').first().isVisible().catch(()=>false);
out.t.back_link = await page.locator('.ps-back-to-account').first().isVisible().catch(()=>false);
out.t.card_width = await page.evaluate(() => { const w=document.querySelector('.pspet-wrap'); return w ? Math.round(w.getBoundingClientRect().width) : null; });
out.t.progress_text = await page.locator('.pspet-progress').first().innerText().catch(()=>'');
out.t.pill_has_img = await page.evaluate(() => !!document.querySelector('.pspet-pill-species img'));
out.t.pill_img_src = await page.evaluate(() => { const i=document.querySelector('.pspet-pill-species img'); return i ? i.currentSrc || i.src : null; });
out.t.needs_cols = await page.evaluate(() => { const g=document.querySelector('.pspet-pills-grid'); return g ? getComputedStyle(g).gridTemplateColumns : null; });
await page.screenshot({ path:'/tmp/d1.png' });
// Uzpildom -> issaugom, kad turetume augintini
await page.locator('.pspet-pill-species', { hasText:'Šuo' }).first().click();
await page.waitForTimeout(400);
await page.locator('#pspet-form-host input.pspet-input').first().fill('Rikis');
await page.waitForTimeout(300);
await page.screenshot({ path:'/tmp/d2.png' });
await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
await page.waitForTimeout(1300);
await page.locator('.pspet-pill', { hasText:'Suaugęs (1–7 m.)' }).first().click().catch(()=>{});
await page.waitForTimeout(200);
await page.locator('.pspet-pill', { hasText:'Vidutinis (10–25 kg)' }).first().click().catch(()=>{});
await page.waitForTimeout(200);
// PRODUKTU PAIESKA
const inp = page.locator('#pspet-form-host .pspet-autocomplete input').first();
await inp.click();
await inp.type('josera', { delay: 140 });
await page.waitForTimeout(2800);
out.t.suggestions = await page.evaluate(() => {
  const b = document.querySelector('#pspet-form-host .pspet-suggestions');
  return b ? Array.from(b.children).map(c => (c.textContent||'').trim().slice(0,60)) : null;
});
await page.screenshot({ path:'/tmp/d3.png' });
if (out.t.suggestions && out.t.suggestions.length) {
  await page.locator('#pspet-form-host .pspet-suggestion').first().click();
  await page.waitForTimeout(600);
  out.t.picked_state = await page.evaluate(() => {
    // state nera globalus; tikrinam per DOM + siusim POST ir ziuresim DB
    const i = document.querySelector('#pspet-form-host .pspet-autocomplete input');
    return i ? i.value.slice(0,50) : null;
  });
}
await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
await page.waitForTimeout(3500);
out.t.result_text = (await page.locator('#pspet-form-host').innerText().catch(()=>'')).slice(0,150);
await page.screenshot({ path:'/tmp/d4.png' });
// Po issaugojimo -> profilis, sidebar turi GRIZTI
await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);
out.t.sidebar_after_save = await page.locator('.woocommerce-MyAccount-navigation').first().isVisible().catch(()=>false);
out.t.nav_transform = await page.evaluate(() => { const a=document.querySelector('.woocommerce-MyAccount-navigation ul li a'); return a ? getComputedStyle(a).textTransform : null; });
out.t.nav_active_bg = await page.evaluate(() => { const a=document.querySelector('.woocommerce-MyAccount-navigation li.is-active a'); return a ? getComputedStyle(a).backgroundColor : null; });
await page.screenshot({ path:'/tmp/d5.png' });
// REDAGAVIMAS — sidebar turi LIKTI
await page.locator('.pspet-p-action', { hasText:'Redaguoti profilį' }).first().click();
await page.waitForTimeout(2000);
out.t.sidebar_on_edit = await page.locator('.woocommerce-MyAccount-navigation').first().isVisible().catch(()=>false);
await page.screenshot({ path:'/tmp/d6.png' });
out.t.errs = errs;
await ctx.close();

// ===== MOBILE 390 =====
ctx = await browser.newContext({ viewport:{width:390,height:844}, ignoreHTTPSErrors:true, deviceScaleFactor:2 });
page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/?ps_cust=Vs2Nn6Cc', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(3500);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.waitForTimeout(600);
out.t.m_needs_cols = await page.evaluate(() => { const g=document.querySelector('.pspet-pills-grid'); return g ? getComputedStyle(g).gridTemplateColumns : null; });
out.t.m_input_font = await page.evaluate(() => { const i=document.querySelector('.pspet-input'); return i ? getComputedStyle(i).fontSize : null; });
out.t.m_pill_h = await page.evaluate(() => { const p=document.querySelector('.pspet-pill'); return p ? Math.round(p.getBoundingClientRect().height) : null; });
out.t.m_illust = await page.evaluate(() => { const i=document.querySelector('.pspet-head .pspet-illustration'); return i ? Math.round(i.getBoundingClientRect().width) : null; });
await page.screenshot({ path:'/tmp/m1.png' });
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(400);
await page.screenshot({ path:'/tmp/m2.png' });
await ctx.close();
await browser.close();
for (const n of ['d1','d2','d3','d4','d5','d6','m1','m2']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/s211_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 's211 shots');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_ka'])||$_GET['ps_ka']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill wA', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ka=Rr3Ww8Yy"');
ghPut('screenshots/s211_test.json', Buffer.from(JSON.stringify(out)), 's211 test');
console.log('DONE');
