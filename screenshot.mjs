process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'E2-D1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'E2',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

const FAILAI=['petshop-statistika.php','petshop-statistika-vitrina.php'];
try{
for (let i=0;i<FAILAI.length;i++){
  const f=FAILAI[i];
  const b64=fs.readFileSync('deploy/'+f).toString('base64');
  const sS=await snip('TEMP E2 SET '+i,[
    "add_action('wp_loaded', function(){",
    " if ((\$_GET['ps_set'] ?? '') !== 'E2s"+i+"x') return;",
    " update_option('ps_e2_b64_"+i+"', '"+b64+"', false);",
    " header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;",
    "}, 131);"].join(NL));
  await new Promise(r=>setTimeout(r,4500));
  try{ await fetch(WP+'/?ps_set=E2s'+i+'x'); }catch(e){}
  await off(sS); await new Promise(r=>setTimeout(r,2500));
}
const sD=await snip('TEMP E2 WRITE',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_dep'] ?? '') !== 'E2dx') return;",
" \$o=array('failai'=>array());",
" \$sar=array("+FAILAI.map((f,i)=>"'"+f+"'=>'ps_e2_b64_"+i+"'").join(',')+");",
" foreach (\$sar as \$vardas => \$raktas) {",
"   \$b=get_option(\$raktas); if(!\$b){ \$o['failai'][\$vardas]='tuscia'; continue; }",
"   \$k=base64_decode(\$b);",
"   try { token_get_all(\$k, TOKEN_PARSE); } catch (ParseError \$e) { \$o['failai'][\$vardas]='SINTAKSE: '.\$e->getMessage(); delete_option(\$raktas); continue; }",
"   \$kl=WPMU_PLUGIN_DIR.'/'.\$vardas; file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);",
"   \$o['failai'][\$vardas]=(md5_file(\$kl)===md5(\$k))?('OK '.strlen(\$k).'B'):'MD5 NESUTAMPA';",
"   delete_option(\$raktas);",
" }",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.rasymas=JSON.parse(await (await fetch(WP+'/?ps_dep=E2dx')).text()); }catch(e){ out.ras_e=String(e).slice(0,150); }
await off(sD); await new Promise(r=>setTimeout(r,3000));

/* ---- realus testas narsykleje ---- */
const br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
/* sutikimas — kad butu tikrinamas ir sesijos sluoksnis */
await ctx.addCookies([{name:'cmplz_statistics',value:'allow',domain:'dev.avesa.lt',path:'/'}]);
const page=await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const ajax=[]; page.on('request',r=>{ if(r.url().indexOf('admin-ajax.php')>-1 && (r.postData()||'').indexOf('ps_stat_ivykis')>-1){ ajax.push('siusta'); }});

await page.goto(WP+'/?p=34942',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(5000);
out.skriptas = await page.locator('#ps-stat-vitrina').count();
out.sutikimas = await page.evaluate(()=> (typeof window.cmplz_has_consent==='function') ? !!window.cmplz_has_consent('statistics') : 'nera_f');

/* surenkam deze: 4 paspaudimai i deti, 1 isemimas */
const mygtukai = await page.locator('.pslk-kort .pslk-deti').all();
out.mygtuku = mygtukai.length;
for (let i=0;i<Math.min(4,mygtukai.length);i++){ await mygtukai[i].click(); await page.waitForTimeout(700); }
out.kiekis_po_idejimu = await page.locator('#pslk-kiek').textContent().catch(()=>'');
/* isemimas per langeli dezeje */
const lizdas = page.locator('.pslk-el[data-cid]').first();
if (await lizdas.count()) { await lizdas.click(); await page.waitForTimeout(700); }
out.kiekis_po_isemimo = await page.locator('#pslk-kiek').textContent().catch(()=>'');
out.cta = await page.evaluate(()=>{ const c=document.getElementById('pslk-cta'); return c?{disabled:c.disabled,tekstas:c.textContent.slice(0,40)}:null; });
out.sesijos_slapukas = await page.evaluate(()=> /ps_stat_s=([a-z0-9]{32})/.test(document.cookie) ? 'yra' : 'nera');
await page.waitForTimeout(7000);   /* kad suveiktu 5 s laikmatis */
out.ajax_siuntimu = ajax.length;
out.js = jsErr;
await br.close();

/* ---- ka gavo serveris ---- */
const sT=await snip('TEMP E2 TIKRA',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_iv'] ?? '') !== 'E2ivx') return;",
" global \$wpdb; \$t=\$wpdb->prefix.'ps_laukai_ivykiai';",
" \$o=array();",
" \$o['viso']=(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM \$t\");",
" \$o['pagal_tipa']=\$wpdb->get_results(\"SELECT tipas, COUNT(*) kiek, COUNT(DISTINCT NULLIF(sesija,'')) ses FROM \$t GROUP BY tipas ORDER BY kiek DESC\", ARRAY_A);",
" \$o['pavyzdziai']=\$wpdb->get_results(\"SELECT laikas,tipas,deze_id,preke_id,verte,dydis,skirtukas,kiek_dezeje,irenginys,LEFT(sesija,8) ses FROM \$t ORDER BY id DESC LIMIT 14\", ARRAY_A);",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.serveryje=JSON.parse(await (await fetch(WP+'/?ps_iv=E2ivx')).text()); }catch(e){ out.iv_e=String(e).slice(0,150); }
await off(sT);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
