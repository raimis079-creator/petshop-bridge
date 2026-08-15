process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
const NL = String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/uzs.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/uzs.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,140)));

/* 1) dėžė → krepšelis (su dovana) */
await page.goto(WP+'/product/test-konservu-deze-800-be-vistienos/',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(3000);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(800);
for(let i=0;i<6;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(90); }
await page.waitForTimeout(900);
out.deze = { kiek:(await page.locator('#pslk-kiek').textContent()).trim(),
  suma:(await page.locator('#pslk-suma').textContent()).trim(),
  dovana:(await page.locator('#pslk-tk-dov.gauta').count()) };
await page.evaluate(()=>document.getElementById('pslk-cta').click());
await page.waitForTimeout(5000);

/* 2) checkout */
await page.goto(WP+'/atsiskaitymas/',{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
if ((await page.locator('#billing_first_name, #billing-first_name').count())===0) {
  await page.goto(WP+'/checkout/',{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
}
await page.waitForTimeout(4000);
out.checkout_url = page.url();
async function fill(sel,val){ const l=page.locator(sel); if(await l.count()){ await l.first().fill(val).catch(()=>{}); return true; } return false; }
await fill('#billing_first_name','Testas');
await fill('#billing_last_name','Statistikos');
await fill('#billing_address_1','Testine g. 1');
await fill('#billing_city','Vilnius');
await fill('#billing_postcode','01100');
await fill('#billing_phone','60000000');
await fill('#billing_email','testas.stat@example.com');
/* pristatymas — pirmas galimas */
const sm = page.locator('input[name^="shipping_method"]');
if (await sm.count()) { await sm.first().check({force:true}).catch(()=>{}); await page.waitForTimeout(2500); }
/* bankinis pavedimas */
const bacs = page.locator('#payment_method_bacs');
out.bacs_yra = await bacs.count();
if (out.bacs_yra) { await bacs.check({force:true}).catch(()=>{}); await page.waitForTimeout(1500); }
const terms = page.locator('#terms');
if (await terms.count()) { await terms.check({force:true}).catch(()=>{}); }
await page.waitForTimeout(1000);
const btn = page.locator('#place_order');
out.mygtukas = await btn.count();
if (out.mygtukas) { await btn.click().catch(e=>out.klik=String(e).slice(0,120)); await page.waitForTimeout(12000); }
out.po_uzsakymo = page.url();
out.tekstas = (await page.locator('body').innerText()).slice(0,500).replace(/\s+/g,' ');
out.js = jsErr;
const sh = await page.screenshot({fullPage:false});
let sha0=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/uzs.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha0=(await g.json()).sha;}catch(e){}
const bo={message:'shot',content:sh.toString('base64')}; if(sha0) bo.sha=sha0;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/uzs.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
await br.close();

/* 3) patikra bazėje — ar savikaina eilutėse */
const sT = await snip('TEMP UZS TIK', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_ut'] ?? '') !== 'UT1x') return;",
" $o=array();",
" $q = wc_get_orders(array('limit'=>1,'orderby'=>'date','order'=>'DESC'));",
" if (!$q) { $o['klaida']='uzsakymu nera'; }",
" else {",
"  $ord = $q[0];",
"  $o['nr'] = $ord->get_id(); $o['statusas']=$ord->get_status();",
"  $o['suma']=$ord->get_total(); $o['budas']=$ord->get_payment_method_title();",
"  $o['eilutes']=array(); $pelnas=0; $bs=0;",
"  foreach ($ord->get_items() as $it) {",
"    $sav = $it->get_meta('_ps_savikaina_vnt', true);",
"    $slt = $it->get_meta('_ps_savikaina_saltinis', true);",
"    $dov = $it->get_meta('_ps_dovana', true);",
"    $kiek = (int) $it->get_quantity();",
"    $suma = (float) $it->get_total();",
"    if ($sav === '' || $sav === null) { $bs++; } else { $pelnas += ($suma/1.21) - ((float)$sav * $kiek); }",
"    $o['eilutes'][] = array(mb_substr($it->get_name(),0,42), $kiek, round($suma,2), ($sav===''?'—':(float)$sav), $slt, $dov?'DOVANA':'');",
"  }",
"  $o['pelnas'] = round($pelnas,2);",
"  $o['be_savikainos'] = $bs;",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.baze = JSON.parse(await (await fetch(WP+'/?ps_ut=UT1x')).text()); }catch(e){ out.baze_e=String(e).slice(0,180); }
await off(sT);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
