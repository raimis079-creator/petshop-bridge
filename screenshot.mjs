process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={testai:{}};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const s1 = await snip('TEMP SET 130', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s130'] ?? '') !== 'S130x') return;
	update_option('ps_l_b64_130', '${b64}', false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s130=S130x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));
const s2 = await snip('TEMP DEP 130', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d130'] ?? '') !== 'D130x') return;
	\$o=array(); \$b=get_option('ps_l_b64_130');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_130'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d130=D130x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,150); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const T=out.testai;
async function shot(vardas){
  const b = await page.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
/* KATE: dovanu vardai trumpi */
await page.goto(WP+'/product/test-konservu-deze-katei-isrankioms/',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
const vardai = await page.locator('.pslk-dovk .pv').allTextContents();
const ilgiausias = Math.max(...vardai.map(v=>v.trim().length));
const auksciai = await page.evaluate(()=>Array.from(document.querySelectorAll('.pslk-dovk')).map(e=>Math.round(e.getBoundingClientRect().height)));
T.t1_dovanu_vardai = { praejo: ilgiausias<=40 && new Set(auksciai).size===1, vardai: vardai.map(v=>v.trim()), ilgiausias, auksciai };
await shot('v130_kate_dovanos');
/* nuotrauka perziuroje — ar virsuje, ne nukritusi */
await page.locator('.pslk-p').first().click();
await page.waitForTimeout(1000);
const geo = await page.evaluate(()=>{
  var f=document.getElementById('pslk-pz-f'), i=f.querySelector('img'), v=document.querySelector('.pslk-pz-v');
  if(!i) return null;
  var fr=f.getBoundingClientRect(), ir=i.getBoundingClientRect(), vr=v.getBoundingClientRect();
  return { fotoAukstis:Math.round(fr.height), vidAukstis:Math.round(vr.height),
    imgTop:Math.round(ir.top-vr.top), matoma: ir.top>=0 && ir.top<window.innerHeight };
});
T.t2_nuotrauka_virsuje = { praejo: geo && geo.matoma && geo.imgTop < 500, geo };
await shot('v130_kate_perziura');
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());
await page.waitForTimeout(400);
/* dovanos perziura — pilnas vardas */
await page.locator('.pslk-dovk').nth(2).locator('.pslk-dov-apie').click();
await page.waitForTimeout(800);
const pilnas = await page.locator('#pslk-pz-pav').textContent();
T.t3_perziura_pilnas_vardas = { praejo: pilnas.trim().length>35, pav: pilnas.trim() };
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());
/* SUO: regresija */
await page.goto(WP+'/product/test-konservu-deze-800-be-vistienos/',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
const sVardai = await page.locator('.pslk-dovk .pv').allTextContents();
T.t4_suo_dovanos = { praejo: sVardai.length===3 && Math.max(...sVardai.map(v=>v.trim().length))<=40, vardai: sVardai.map(v=>v.trim()) };
await page.locator('.pslk-p').first().click();
await page.waitForTimeout(900);
const geo2 = await page.evaluate(()=>{
  var i=document.querySelector('#pslk-pz-f img'), v=document.querySelector('.pslk-pz-v');
  if(!i) return null; var ir=i.getBoundingClientRect(), vr=v.getBoundingClientRect();
  return { imgTop:Math.round(ir.top-vr.top), matoma: ir.top>=0 && ir.top<window.innerHeight };
});
T.t5_suo_nuotrauka = { praejo: geo2 && geo2.matoma && geo2.imgTop<500, geo: geo2 };
await shot('v130_suo_perziura');
T.t6_js = { praejo: jsErr.length===0, klaidos: jsErr };
out.viso=Object.keys(T).length; out.praejo=Object.values(T).filter(x=>x.praejo).length;
await br.close();
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw130.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw130.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
