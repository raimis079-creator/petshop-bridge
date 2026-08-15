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
const s1 = await snip('TEMP SET 129', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s129'] ?? '') !== 'S129x') return;
	update_option('ps_l_b64_129', '${b64}', false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s129=S129x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));
const s2 = await snip('TEMP DEP 129', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d129'] ?? '') !== 'D129x') return;
	\$o=array(); \$b=get_option('ps_l_b64_129');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_129'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d129=D129x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,150); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

const URL8='/product/test-konservu-deze-800-be-vistienos/';
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
async function shot(pg,vardas){
  const b = await pg.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
const T=out.testai;

/* DESKTOP: prekes perziura su antrastemis */
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
await page.goto(WP+URL8,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
await page.locator('.pslk-p').first().click();
await page.waitForTimeout(800);
const boldN = await page.locator('#pslk-pz-apr b').count();
T.t1_prekes_antrastes = { praejo: boldN>=2, bold: boldN };
await shot(page,'v129_perziura_preke');
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());
await page.waitForTimeout(400);
/* dovanos perziura su antrastemis */
await page.locator('.pslk-dovk').nth(0).click();
await page.waitForTimeout(800);
const boldD = await page.locator('#pslk-pz-apr b').count();
T.t2_dovanos_antrastes = { praejo: (await page.locator('#pslk-pz.rodo').count())===1 && boldD>=2, bold: boldD };
await shot(page,'v129_perziura_dovana');
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());

/* MOBILE 390px: dovanu langas — Raimio gedimo medziokle */
const ctxM = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,
  viewport:{width:390,height:844},isMobile:true,hasTouch:true,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
const pm = await ctxM.newPage();
const jsErrM=[]; pm.on('pageerror',e=>jsErrM.push(String(e).slice(0,160)));
await pm.goto(WP+URL8,{waitUntil:'networkidle',timeout:60000});
await pm.waitForTimeout(3000);
await pm.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
/* ar dovanu blokas isvis matomas mobile */
const dovYra = await pm.locator('.pslk-dovk').count();
await pm.locator('#pslk-dov').scrollIntoViewIfNeeded().catch(()=>{});
await pm.waitForTimeout(400);
let langasM=0, aprM='', klaidaM='';
try{
  await pm.locator('.pslk-dovk').nth(0).click({timeout:8000});
  await pm.waitForTimeout(900);
  langasM = await pm.locator('#pslk-pz.rodo').count();
  aprM = await pm.evaluate(()=>{var a=document.getElementById('pslk-pz-apr');return a?a.textContent.slice(0,80):'';});
}catch(e){ klaidaM=String(e).slice(0,220); }
T.t3_mobile_dovanos_langas = { praejo: langasM===1 && aprM.length>20, korteliu: dovYra, langas: langasM, apr: aprM, klaida: klaidaM };
await shot(pm,'v129_mobile_dovana');
/* zenkliukai: SVG yra, emoji nebera, spalva keiciasi pasiekus */
await page.goto(WP+URL8,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
const svgN = await page.locator('#pslk-tk-pr .ik svg, #pslk-tk-dov .ik svg').count();
const emoji = await page.evaluate(()=>{
  var t=(document.querySelector('.pslk-tikslai')||{}).textContent||'';
  return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t);
});
const spalva0 = await page.evaluate(()=>getComputedStyle(document.querySelector('#pslk-tk-pr .ik')).color);
T.t5_zenkliukai = { praejo: svgN===2 && !emoji, svg: svgN, emoji_liko: emoji, spalva_pries: spalva0 };
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(700);
for(let i=0;i<6;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(80); }
await page.waitForTimeout(800);
const spalva1 = await page.evaluate(()=>getComputedStyle(document.querySelector('#pslk-tk-pr .ik')).color);
const spalvaD = await page.evaluate(()=>getComputedStyle(document.querySelector('#pslk-tk-dov .ik')).color);
T.t6_zenkliuku_spalva = { praejo: spalva1!==spalva0, pries: spalva0, po: spalva1, dovana: spalvaD };
await shot(page,'v129_tikslai');
T.t4_js = { praejo: jsErr.length===0 && jsErrM.length===0, desktop: jsErr, mobile: jsErrM };
await br.close();
out.viso=Object.keys(T).length; out.praejo=Object.values(T).filter(x=>x.praejo).length;

let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw129.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw129.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
