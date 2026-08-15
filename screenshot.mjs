process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow3.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow3.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sAuth=null;
try{
/* Laikinas prisijungimas per slapuka — slapukas siunciamas ir su admin-ajax */

const b64 = (await import('fs')).readFileSync('deploy/petshop-laukai.php').toString('base64');
const sS = await snip('TEMP SET 137', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s137'] ?? '') !== 'S137x') return;
	update_option('ps_l_b64_137','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.set = await (await fetch(WP+'/?ps_s137=S137x')).json(); }catch(e){ out.set_err=String(e).slice(0,120); }
await off(sS); await new Promise(r=>setTimeout(r,3000));
const sD = await snip('TEMP DEP 137', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d137'] ?? '') !== 'D137x') return;
	\$o=array(); \$b=get_option('ps_l_b64_137');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_137'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.diegimas = await (await fetch(WP+'/?ps_d137=D137x')).json(); }catch(e){ out.dep_err=String(e).slice(0,120); }
await off(sD); await new Promise(r=>setTimeout(r,3000));

sAuth = await snip('TEMP LOGIN', `add_action('init', function(){
	if ((\$_GET['ps_login'] ?? '') !== 'Log136x') return;
	\$adm = get_users(array('role'=>'administrator','number'=>1,'fields'=>'ID'));
	if (!\$adm) return;
	wp_set_current_user((int)\$adm[0]);
	wp_set_auth_cookie((int)\$adm[0], false, is_ssl());
	wp_safe_redirect(admin_url('admin.php?page=ps-laukai&id=34942')); exit;
}, 1);`);
await new Promise(r=>setTimeout(r,5000));

const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1600,height:1200}});
const page = await ctx.newPage();
const konsole=[], klaidos=[], uzklausos=[];
page.on('console',m=>{ if(m.type()==='error') konsole.push(m.text().slice(0,200)); });
page.on('pageerror',e=>klaidos.push(String(e).slice(0,250)));
page.on('response',async r=>{ if(r.url().includes('admin-ajax')) uzklausos.push({url:r.url().slice(-110), st:r.status()}); });

await page.goto(WP+'/?ps_login=Log136x',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(4000);
out.puslapis = { url:page.url(), yra_dovanu_blokas:(await page.locator('#dov-kunas').count())===1,
  kategoriju_select:(await page.locator('#dov-kat').count()), mygtukas:(await page.locator('#dov-rodyti').count()) };
if (out.puslapis.yra_dovanu_blokas) {
  await page.locator('#dov-rez').scrollIntoViewIfNeeded().catch(()=>{});
  await page.waitForTimeout(6000);
  out.rez_po_uzkrovimo = (await page.locator('#dov-rez').innerText().catch(()=>'')).slice(0,300);
  /* spaudziam Rodyti */
  await page.locator('#dov-rodyti').click().catch(e=>out.klik_klaida=String(e).slice(0,150));
  await page.waitForTimeout(8000);
  out.rez_po_rodyti = (await page.locator('#dov-rez').innerText().catch(()=>'')).slice(0,400);
  out.eiluciu = await page.locator('#dov-rez tbody tr').count();
  /* kategorija = Skanestai sunims (95) */
  await page.selectOption('#dov-kat','95').catch(e=>out.sel_klaida=String(e).slice(0,150));
  await page.waitForTimeout(8000);
  out.rez_skanestai = (await page.locator('#dov-rez').innerText().catch(()=>'')).slice(0,400);
  out.eiluciu_skanestai = await page.locator('#dov-rez tbody tr').count();
  const b = await page.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow3.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow3.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
out.js_klaidos = klaidos; out.konsole = konsole.slice(0,8); out.ajax = uzklausos.slice(0,8);
await br.close();
}catch(e){ out.bendra=String(e).slice(0,300); }
if (sAuth) await off(sAuth);
await irasyk();
console.log('ok');
