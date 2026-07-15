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
const out = { t:{} };
try {
const php = `
add_filter('pre_wp_mail', function($null, $atts){
	update_option('ps_test_last_mail', array('to'=>$atts['to'],'body'=>$atts['message']), false);
	return true;
}, 999, 2);
add_action('wp_loaded', function(){
	$K='Gg6Hh0Jj';
	if ( isset($_GET['ps_rl']) && $_GET['ps_rl']===$K ) {
		global $wpdb;
		$n = $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient%ps_ml_%'");
		echo 'cleared '.$n; exit;
	}
	if ( isset($_GET['ps_mail']) && $_GET['ps_mail']===$K ) {
		header('Content-Type: application/json'); echo wp_json_encode(get_option('ps_test_last_mail', array())); exit;
	}
	if ( isset($_GET['ps_expire']) && $_GET['ps_expire']===$K ) {
		global $wpdb;
		$n = $wpdb->query("UPDATE {$wpdb->prefix}ps_action_tokens SET expires_at='2020-01-01 00:00:00' WHERE status='active'");
		echo 'expired '.$n; exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 R2', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
out.rl = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_rl=Gg6Hh0Jj"').slice(0,40);

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1440,height:1000}, ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(15000);
await page.goto('https://dev.avesa.lt/my-account/', { waitUntil:'domcontentloaded', timeout:45000 });
await page.waitForTimeout(2200);
try { const c=page.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click(); } catch(e){}
await page.locator('#ps-magic-email').fill('terra@gyvunai.lt');
await page.locator('#ps-magic-send').click();
await page.waitForTimeout(3200);
const mail = sh('curl -sk "https://dev.avesa.lt/?ps_mail=Gg6Hh0Jj"');
let link=null; try { const mj=JSON.parse(mail); const m=String(mj.body||'').match(/https:\/\/dev\.avesa\.lt\/petshop-login\?token=[^"'&]+/); link=m?m[0]:null; } catch(e){}
out.t.link = !!link;
sh('curl -sk "https://dev.avesa.lt/?ps_expire=Gg6Hh0Jj"');
if (link) {
  await page.goto(link, { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForTimeout(1500);
  out.t.retry_form = await page.locator('#ps-retry-form').first().isVisible().catch(()=>false);
  out.t.page_head = (await page.locator('body').innerText().catch(()=>'')).slice(0,90);
  await page.screenshot({ path:'/tmp/retry.png' });
  if (out.t.retry_form) {
    sh('curl -sk "https://dev.avesa.lt/?ps_rl=Gg6Hh0Jj"');
    await page.locator('#ps-retry-email').fill('terra@gyvunai.lt');
    await page.locator('#ps-retry-send').click();
    await page.waitForTimeout(3200);
    out.t.retry_done = await page.locator('#ps-retry-done').first().isVisible().catch(()=>false);
    const m2 = sh('curl -sk "https://dev.avesa.lt/?ps_mail=Gg6Hh0Jj"');
    try { const mj2=JSON.parse(m2); const mm=String(mj2.body||'').match(/petshop-login\?token=([^"'&]+)/); out.t.new_link_diff = !!(mm && link.indexOf(mm[1])<0); } catch(e){}
  }
}
await browser.close();
if (fs.existsSync('/tmp/retry.png')) ghPut('screenshots/m8_retry.png', fs.readFileSync('/tmp/retry.png'), 'retry');
} catch(err){ out.FATAL = String(err&&err.message?err.message:err).slice(0,300); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kz'])||$_GET['ps_kz']!=='Rr3Ww8Yy'){return;} global $wpdb; delete_option('ps_test_last_mail'); $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vZ', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kz=Rr3Ww8Yy"');
ghPut('screenshots/m8_retry2.json', Buffer.from(JSON.stringify(out)), 'retry2');
console.log('DONE');
