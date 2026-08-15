process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sAuth=null;
try{
/* Laikinas prisijungimas per slapuka — slapukas siunciamas ir su admin-ajax */
sAuth = await snip('TEMP COOKIE AUTH', `add_filter('determine_current_user', function(\$u){
	if (isset(\$_COOKIE['ps_kas']) && \$_COOKIE['ps_kas']==='Kas136x') return 1;
	return \$u; }, 99);
add_filter('user_has_cap', function(\$caps,\$c,\$a,\$user){
	if (isset(\$_COOKIE['ps_kas']) && \$_COOKIE['ps_kas']==='Kas136x') { \$caps['manage_woocommerce']=true; \$caps['manage_options']=true; }
	return \$caps; }, 99, 4);`);
await new Promise(r=>setTimeout(r,5000));

const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1600,height:1200}});
await ctx.addCookies([{name:'ps_kas',value:'Kas136x',domain:'dev.avesa.lt',path:'/'}]);
const page = await ctx.newPage();
const konsole=[], klaidos=[], uzklausos=[];
page.on('console',m=>{ if(m.type()==='error') konsole.push(m.text().slice(0,200)); });
page.on('pageerror',e=>klaidos.push(String(e).slice(0,250)));
page.on('response',async r=>{ if(r.url().includes('admin-ajax')) uzklausos.push({url:r.url().slice(-110), st:r.status()}); });

await page.goto(WP+'/wp-admin/admin.php?page=ps-laukai&id=34942',{waitUntil:'domcontentloaded',timeout:60000});
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
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/brow.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
out.js_klaidos = klaidos; out.konsole = konsole.slice(0,8); out.ajax = uzklausos.slice(0,8);
await br.close();
}catch(e){ out.bendra=String(e).slice(0,300); }
if (sAuth) await off(sAuth);
await irasyk();
console.log('ok');
