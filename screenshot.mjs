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
const out = { t: {}, trace: [] };
function T(x){ out.trace.push(x); }
try {
const php = `
add_filter('pre_wp_mail', function($null, $atts){
	update_option('ps_test_last_mail', array('to'=>$atts['to'],'subject'=>$atts['subject'],'body'=>$atts['message']), false);
	return true;
}, 999, 2);
add_action('wp_loaded', function(){
	$K='Qq8Ww2Ee';
	if ( isset($_GET['ps_mail']) && $_GET['ps_mail']===$K ) {
		header('Content-Type: application/json'); echo wp_json_encode(get_option('ps_test_last_mail', array())); exit;
	}
	if ( isset($_GET['ps_st']) && $_GET['ps_st']===$K ) {
		global $wpdb;
		$em = sanitize_email($_GET['em'] ?? '');
		$u = get_user_by('email', $em);
		$o = array('user' => $u ? $u->ID : 'NERA');
		$o['token'] = $wpdb->get_row($wpdb->prepare("SELECT id,subject_id,action,status FROM {$wpdb->prefix}ps_action_tokens WHERE subject_email=%s ORDER BY id DESC LIMIT 1",$em), ARRAY_A);
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
	if ( isset($_GET['ps_expire1']) && $_GET['ps_expire1']===$K ) {
		global $wpdb;
		$id = absint($_GET['id']);
		$wpdb->update($wpdb->prefix.'ps_action_tokens', array('expires_at'=>'2020-01-01 00:00:00'), array('id'=>$id));
		echo 'ok'; exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 E209', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);

async function getLink(){
  const mail = sh('curl -sk "https://dev.avesa.lt/?ps_mail=Qq8Ww2Ee"');
  try { const mj = JSON.parse(mail); const m = String(mj.body||'').match(/https:\/\/dev\.avesa\.lt\/petshop-login\?token=[^"'&]+/); return { link: m?m[0]:null, subject: mj.subject, to: mj.to }; } catch(e){ return { link:null }; }
}

const { chromium } = await import('playwright');
const browser = await chromium.launch();

// ============ A. DESKTOP: naujas email is login ekrano ============
let ctx = await browser.newContext({ viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true });
let page = await ctx.newPage(); page.setDefaultTimeout(15000);
const errsA=[]; page.on('pageerror', e=>errsA.push(String(e).slice(0,110)));
await page.goto('https://dev.avesa.lt/my-account/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2500);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
out.t.title_visible = await page.locator('.ps-login-title').first().textContent().catch(()=>null);
out.t.side_visible = await page.locator('.ps-login-side').first().isVisible().catch(()=>false);
out.t.pass_hidden_initially = !(await page.locator('#ps-pass-box').first().isVisible().catch(()=>true));
await page.screenshot({ path:'/tmp/l1.png' });
T('login ekranas atidarytas');

const EM_NEW = 'lognaujas' + Date.now() + '@gyvunai.lt';
await page.locator('#ps-magic-email').fill(EM_NEW);
await page.locator('#ps-magic-send').click();
await page.waitForTimeout(3000);
out.t.done_shown = await page.locator('#ps-magic-done').first().isVisible().catch(()=>false);
await page.screenshot({ path:'/tmp/l2.png' });
let m1 = await getLink();
out.t.new_mail_subject = m1.subject;
let st = sh(`curl -sk "https://dev.avesa.lt/?ps_st=Qq8Ww2Ee&em=${EM_NEW}"`);
try { out.t.new_token = JSON.parse(st); } catch(e){}
T('naujas email: nuoroda ' + !!m1.link);

// paspaudziam — turi sukurti paskyra ir nukreipti I PASKYROS PRADZIA (context=account)
if (m1.link) {
  await page.goto(m1.link, { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(1200);
  await page.locator('button[type=submit]').first().click();
  await page.waitForTimeout(5000);
  out.t.new_landed = page.url();
  st = sh(`curl -sk "https://dev.avesa.lt/?ps_st=Qq8Ww2Ee&em=${EM_NEW}"`);
  try { out.t.new_after = JSON.parse(st); } catch(e){}
}
out.t.errsA = errsA;
await ctx.close();

// ============ B. Esamas useris + PASIBAIGES TOKENAS -> retry forma ============
ctx = await browser.newContext({ viewport:{width:1440,height:1000}, ignoreHTTPSErrors:true });
page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/my-account/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2200);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.locator('#ps-magic-email').fill(EM_NEW); // dabar jau EGZISTUOJANTIS
await page.locator('#ps-magic-send').click();
await page.waitForTimeout(3000);
let m2 = await getLink();
out.t.exist_mail_subject = m2.subject;
st = sh(`curl -sk "https://dev.avesa.lt/?ps_st=Qq8Ww2Ee&em=${EM_NEW}"`);
let tokid = null;
try { const j = JSON.parse(st); out.t.exist_token = j.token; tokid = j.token ? j.token.id : null; } catch(e){}
// pasendinam ir spaudziam
if (tokid) sh(`curl -sk "https://dev.avesa.lt/?ps_expire1=Qq8Ww2Ee&id=${tokid}"`);
if (m2.link) {
  await page.goto(m2.link, { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(1500);
  const body1 = await page.locator('body').innerText().catch(()=>'');
  // GET gali rodyti confirm forma — spaudziam submit, tada consume atmes
  const sb = page.locator('button[type=submit]').first();
  if (await sb.isVisible().catch(()=>false)) { await sb.click(); await page.waitForTimeout(2500); }
  out.t.retry_form_shown = await page.locator('#ps-retry-form').first().isVisible().catch(()=>false);
  out.t.retry_page_text = (await page.locator('body').innerText().catch(()=>'')).slice(0,120);
  await page.screenshot({ path:'/tmp/l3.png' });
  // Is retry formos prasom naujos
  if (out.t.retry_form_shown) {
    await page.locator('#ps-retry-email').fill(EM_NEW);
    await page.locator('#ps-retry-send').click();
    await page.waitForTimeout(3000);
    out.t.retry_done = await page.locator('#ps-retry-done').first().isVisible().catch(()=>false);
    const m3 = await getLink();
    out.t.retry_new_link = !!m3.link && m3.link !== m2.link;
  }
}
await ctx.close();

// ============ C. Slaptazodzio kelias issiskleidzia ============
ctx = await browser.newContext({ viewport:{width:1440,height:1000}, ignoreHTTPSErrors:true });
page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/my-account/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2200);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.locator('#ps-pass-toggle').click();
await page.waitForTimeout(600);
out.t.pass_opens = await page.locator('#ps-pass-box').first().isVisible().catch(()=>false);
out.t.pass_fields = await page.locator('#ps-pass-box input[name=username]').first().isVisible().catch(()=>false);
await ctx.close();

// ============ D. MOBILE 390px ============
ctx = await browser.newContext({ viewport:{width:390,height:844}, ignoreHTTPSErrors:true });
page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/my-account/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2500);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
out.t.mobile_form = await page.locator('#ps-magic-form').first().isVisible().catch(()=>false);
out.t.mobile_one_col = await page.evaluate(() => {
  const w = document.getElementById('ps-login-wrap');
  return w ? getComputedStyle(w).flexDirection : null;
});
await page.screenshot({ path:'/tmp/l4.png', fullPage:false });
await ctx.close();
await browser.close();
for (const n of ['l1','l2','l3','l4']) if (fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'l209');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kx'])||$_GET['ps_kx']!=='Rr3Ww8Yy'){return;} global $wpdb; delete_option('ps_test_last_mail'); $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vX', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kx=Rr3Ww8Yy"');
ghPut('screenshots/m8_e209.json', Buffer.from(JSON.stringify(out)), 'e209');
console.log('DONE');
