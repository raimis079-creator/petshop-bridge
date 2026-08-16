process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'DOV-I1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'dov',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const b64=fs.readFileSync('deploy/petshop-statistika-vitrina.php').toString('base64');
const sS=await snip('TEMP DOV SET',["add_action('wp_loaded', function(){"," if ((\$_GET['ps_s'] ?? '') !== 'DvSx') return;"," update_option('ps_dov_b64', '"+b64+"', false);"," header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;","}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ await fetch(WP+'/?ps_s=DvSx'); }catch(e){}
await off(sS); await new Promise(r=>setTimeout(r,2500));
const sW=await snip('TEMP DOV WRITE',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_w'] ?? '') !== 'DvWx') return;",
" global \$wpdb; \$o=array(); \$b=get_option('ps_dov_b64');",
" if(\$b){ \$k=base64_decode(\$b);",
"  try{ token_get_all(\$k, TOKEN_PARSE); \$kl=WPMU_PLUGIN_DIR.'/petshop-statistika-vitrina.php'; file_put_contents(\$kl,\$k); clearstatcache(true,\$kl); \$o['failas']=(md5_file(\$kl)===md5(\$k))?'OK':'MD5'; }",
"  catch(ParseError \$e){ \$o['failas']='SINTAKSE'; }",
"  delete_option('ps_dov_b64'); }",
" \$t=\$wpdb->prefix.'ps_laukai_ivykiai';",
" \$o['pries']=(int)\$wpdb->get_var(\"SELECT MAX(id) FROM \$t\");",
" \$o['dovriba']=get_post_meta(34942,'_ps_laukas_dovanos_riba',true);",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.diegimas=JSON.parse(await (await fetch(WP+'/?ps_w=DvWx')).text()); }catch(e){ out.e1=String(e).slice(0,120); }
await off(sW); await new Promise(r=>setTimeout(r,3000));

const br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors','--disable-http2']});
const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100},httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS}});
await ctx.addCookies([{name:'cmplz_statistics',value:'allow',domain:'dev.avesa.lt',path:'/'}]);
const page=await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,150)));
await page.goto(WP+'/?p=34942',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(5000);
/* greitai iki dovanos ribos */
const myg=await page.locator('.pslk-kort .pslk-deti').all();
for (let i=0;i<myg.length;i++){ try{ await myg[i].click({timeout:3000}); await page.waitForTimeout(300);}catch(e){} }
for (let k=0;k<16;k++){
  const at=await page.evaluate(()=>{const d=document.getElementById('pslk-dov');return d?d.classList.contains('atrakinta'):true;});
  if (at) break;
  const p=page.locator('.pslk-stp button[data-d="1"]').first();
  if(!(await p.count())) break;
  try{ await p.click({timeout:3000}); await page.waitForTimeout(350);}catch(e){}
}
const dovk=page.locator('.pslk-dovk').nth(2);
if (await dovk.count()) { try{ await dovk.click({timeout:3000}); await page.waitForTimeout(800);}catch(e){} }
out.pasirinkta_gid=await page.evaluate(()=>{const k=document.querySelector('.pslk-dovk.pas');return k?k.dataset.gid:'nera';});
/* dydzio perjungimas */
const db=page.locator('.pslk-dbtn:not(.on)').first();
out.dydzio_mygtuku=await page.locator('.pslk-dbtn').count();
if (await db.count()) { try{ await db.click({timeout:4000}); await page.waitForTimeout(6000);}catch(e){ out.db_e=String(e).slice(0,80); } }
out.url_po=page.url();
out.js=jsErr;
await br.close();

const sT=await snip('TEMP DOV TIKRA',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_t'] ?? '') !== 'DvTx') return;",
" global \$wpdb; \$t=\$wpdb->prefix.'ps_laukai_ivykiai';",
" \$o=array('nauji'=>\$wpdb->get_results(\"SELECT tipas,preke_id,verte,kiek_dezeje FROM \$t WHERE tipas IN ('dovana_rinko','dovana_atrakinta','dydis_perjunge','min_pasiekta') ORDER BY id DESC LIMIT 8\", ARRAY_A));",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.serveryje=JSON.parse(await (await fetch(WP+'/?ps_t=DvTx')).text()); }catch(e){ out.e2=String(e).slice(0,120); }
await off(sT);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
