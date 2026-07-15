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
const out = { s: {}, trace: [] };
function T(x){ out.trace.push(x); }

try {
  const php = `
add_filter('pre_wp_mail', function($null, $atts){
	update_option('ps_test_last_mail', array('to'=>$atts['to'],'subject'=>$atts['subject'],'body'=>$atts['message']), false);
	return true;
}, 999, 2);
add_action('wp_loaded', function(){
	$K='Yy4Uu8Ii';
	if ( isset($_GET['ps_mail']) && $_GET['ps_mail']===$K ) {
		header('Content-Type: application/json'); echo wp_json_encode(get_option('ps_test_last_mail', array())); exit;
	}
	if ( isset($_GET['ps_state']) && $_GET['ps_state']===$K ) {
		global $wpdb;
		$em = sanitize_email($_GET['em'] ?? '');
		$u = get_user_by('email', $em);
		$o = array('user' => $u ? array('id'=>$u->ID,'login'=>$u->user_login,'roles'=>$u->roles) : 'NERA');
		if ($u) $o['pets'] = $wpdb->get_results($wpdb->prepare("SELECT id,pet_name,species,life_stage,is_primary FROM {$wpdb->prefix}ps_pets WHERE user_id=%d",$u->ID), ARRAY_A);
		$o['tokens'] = $wpdb->get_results($wpdb->prepare("SELECT id,subject_id,subject_email,status FROM {$wpdb->prefix}ps_action_tokens WHERE subject_email=%s ORDER BY id DESC LIMIT 3",$em), ARRAY_A);
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
});`;
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 E207b', code:php, scope:'global', active:true }));
  sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
  T('snippet ok');

  const EM = 'naujas' + Date.now() + '@gyvunai.lt';
  out.email = EM;

  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,120)));

  await page.goto('https://dev.avesa.lt/anketa-testas/', { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(2500);
  T('anketa atidaryta');
  try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
  await page.evaluate(() => { try { localStorage.removeItem('pspet_draft'); } catch(e){} });
  await page.reload({ waitUntil:'domcontentloaded' }); await page.waitForTimeout(2500);
  out.s.wrap_visible = await page.locator('.pspet-wrap').first().isVisible().catch(()=>false);
  out.s.form_html_head = await page.locator('#pspet-form').innerText().catch(()=>'(nera #pspet-form)');
  T('po reload, wrap=' + out.s.wrap_visible);

  await page.locator('.pspet-pill', { hasText:'Katė' }).first().click();
  await page.waitForTimeout(300);
  await page.locator('input.pspet-input').first().fill('Anonimine');
  await page.waitForTimeout(400);
  T('1 zingsnis uzpildytas');
  await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
  await page.waitForTimeout(1500);
  out.s.step2_title = await page.locator('.pspet-title').first().textContent().catch(()=>null);
  T('2 zingsnis: ' + out.s.step2_title);

  await page.locator('.pspet-pill', { hasText:'Suaugusi' }).first().click().catch(()=>{});
  await page.waitForTimeout(300);
  await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
  await page.waitForTimeout(3000);
  out.s.result_text = await page.locator('.pspet-wrap').first().innerText().catch(()=>'');
  T('rezultatas: ' + (out.s.result_text||'').slice(0,60));

  const ei = page.locator('input[type=email]').first();
  out.s.email_visible = await ei.isVisible().catch(()=>false);
  T('email input matomas: ' + out.s.email_visible);
  if (out.s.email_visible) {
    await ei.fill(EM);
    await page.locator('.pspet-btn-primary', { hasText:'Siųsti nuorodą' }).first().click();
    await page.waitForTimeout(3500);
    out.s.after_request = await page.locator('.pspet-save-box').first().innerText().catch(()=>'');
    T('nuorodos prasyta');
  }
  out.s.draft_before_link = !!(await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return null; } }));

  const mail = sh('curl -sk "https://dev.avesa.lt/?ps_mail=Yy4Uu8Ii"');
  let link = null;
  try {
    const mj = JSON.parse(mail);
    out.s.mail_to = mj.to; out.s.mail_subject = mj.subject;
    const mm = String(mj.body||'').match(/https:\/\/dev\.avesa\.lt\/petshop-login\?token=[^"'&]+/);
    link = mm ? mm[0] : null;
    out.s.link_found = !!link;
  } catch(e){ out.s.mail_raw = mail.slice(0,250); }
  T('nuoroda rasta: ' + out.s.link_found);

  if (link) {
    await page.goto(link, { waitUntil:'domcontentloaded', timeout:45000 });
    await page.waitForTimeout(1500);
    out.s.confirm_page = (await page.locator('body').innerText().catch(()=>'')).slice(0,150);
    await page.screenshot({ path:'/tmp/e207a.png' });
    await page.locator('button[type=submit]').first().click();
    await page.waitForTimeout(6000);
    out.s.landed = page.url();
    out.s.profile_text = await page.locator('#pspet-profile').innerText().catch(()=>'(nera #pspet-profile)');
    out.s.draft_after = await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return 'ERR'; } });
    await page.screenshot({ path:'/tmp/e207b.png' });
    T('prisijungta, url: ' + out.s.landed);
  }
  out.js_errors = errs;
  await browser.close();
  for (const n of ['e207a','e207b']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'e207');
  const st = sh(`curl -sk "https://dev.avesa.lt/?ps_state=Yy4Uu8Ii&em=${EM}"`);
  try { out.s.final = JSON.parse(st); } catch(e){ out.s.final_raw = st.slice(0,300); }
} catch (err) {
  out.FATAL = String(err && err.message ? err.message : err).slice(0, 600);
}

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kj'])||$_GET['ps_kj']!=='Rr3Ww8Yy'){return;} global $wpdb; delete_option('ps_test_last_mail'); $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vJ', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kj=Rr3Ww8Yy"');
ghPut('screenshots/m8_e207.json', Buffer.from(JSON.stringify(out)), 'e207');
console.log('DONE');
