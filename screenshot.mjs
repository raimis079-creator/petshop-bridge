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
const out = { s: {} };
const php = `
add_action('wp_loaded', function(){
	$K='Ee2Rr6Tt';
	if ( isset($_GET['ps_tok']) && $_GET['ps_tok']===$K ) {
		global $wpdb;
		header('Content-Type: application/json');
		echo wp_json_encode($wpdb->get_results("SELECT id,purpose,subject_email,status,created_at,expires_at FROM {$wpdb->prefix}ps_action_tokens ORDER BY id DESC LIMIT 4", ARRAY_A));
		exit;
	}
	if ( isset($_GET['ps_mk']) && $_GET['ps_mk']===$K ) {
		$em = sanitize_email($_GET['em'] ?? '');
		$u = get_user_by('email',$em);
		if (!$u) { $uid = wp_create_user('anon_'.wp_rand(10000,99999), wp_generate_password(24), $em); if(!is_wp_error($uid)) (new WP_User($uid))->set_role('customer'); }
		else { $uid=$u->ID; }
		header('Content-Type: application/json'); echo wp_json_encode(array('uid'=>$uid)); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Anon2', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

// Esamas useris testui B daliai
const EXIST = 'anon.esamas@gyvunai.lt';
sh(`curl -sk "https://dev.avesa.lt/?ps_mk=Ee2Rr6Tt&em=${EXIST}"`);

const { chromium } = await import('playwright');
const browser = await chromium.launch();

async function runAnon(email, label){
  const ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,120)));
  const r = { email: email };
  await page.goto('https://dev.avesa.lt/anketa-testas/', { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(2500);
  try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
  await page.waitForTimeout(500);
  // svarus startas
  await page.evaluate(() => { try { localStorage.removeItem('pspet_draft'); } catch(e){} });
  await page.reload({ waitUntil:'domcontentloaded' }); await page.waitForTimeout(2200);

  // 1 zingsnis
  await page.locator('.pspet-pill', { hasText:'Šuo' }).first().click();
  await page.waitForTimeout(300);
  await page.locator('input.pspet-input').first().fill('AnonTest');
  await page.waitForTimeout(400);
  await page.locator('.pspet-btn-primary', { hasText:'Tęsti' }).first().click();
  await page.waitForTimeout(1200);
  r.step2 = await page.locator('.pspet-title').first().textContent().catch(()=>null);
  // 2 zingsnis
  await page.locator('.pspet-pill', { hasText:'Suaugęs (1–7 m.)' }).first().click().catch(()=>{});
  await page.waitForTimeout(300);
  await page.locator('.pspet-btn-primary', { hasText:'Išsaugoti profilį' }).first().click();
  await page.waitForTimeout(2500);
  r.result = await page.locator('.pspet-wrap').first().innerText().catch(()=>'');
  r.draft_still_there = !!(await page.evaluate(() => { try { return localStorage.getItem('pspet_draft'); } catch(e){ return null; } }));
  // email CTA
  const ei = page.locator('input[type=email]').first();
  r.email_cta = await ei.isVisible().catch(()=>false);
  if (r.email_cta) {
    await ei.fill(email);
    await page.locator('.pspet-btn-primary', { hasText:'Siųsti nuorodą' }).first().click();
    await page.waitForTimeout(3000);
    r.response = await page.locator('.pspet-save-box').first().innerText().catch(()=>'');
  }
  await page.screenshot({ path:'/tmp/'+label+'.png' });
  r.errs = errs;
  await ctx.close();
  return r;
}

// A: VISIŠKAI NAUJAS email
out.s.new_user = await runAnon('naujas.klientas.' + Date.now() + '@gyvunai.lt', 'anonA');
let t = sh('curl -sk "https://dev.avesa.lt/?ps_tok=Ee2Rr6Tt"');
try { out.s.tokens_after_new = JSON.parse(t); } catch(e){ out.s.tok_raw_new = t.slice(0,200); }

// B: ESAMAS useris
out.s.existing_user = await runAnon(EXIST, 'anonB');
t = sh('curl -sk "https://dev.avesa.lt/?ps_tok=Ee2Rr6Tt"');
try { out.s.tokens_after_existing = JSON.parse(t); } catch(e){ out.s.tok_raw_ex = t.slice(0,200); }

await browser.close();
for (const n of ['anonA','anonB']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'anon');

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kg'])||$_GET['ps_kg']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vG', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kg=Rr3Ww8Yy"');
ghPut('screenshots/m8_anon2.json', Buffer.from(JSON.stringify(out)), 'anon2');
console.log('DONE');
