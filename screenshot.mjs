process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'KELIAS-G1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'kelias',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100},httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS}});
await ctx.addCookies([{name:'cmplz_statistics',value:'allow',domain:'dev.avesa.lt',path:'/'}]);
const page=await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));

await page.goto(WP+'/?p=34942',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(5000);
out.zingsniai=[];

/* 1) surenkam visas prekes po viena */
const mygtukai=await page.locator('.pslk-kort .pslk-deti').all();
for (let i=0;i<mygtukai.length;i++){ try{ await mygtukai[i].click({timeout:4000}); await page.waitForTimeout(400);}catch(e){} }
out.zingsniai.push('po pirmo rato: '+(await page.locator('#pslk-kiek').textContent().catch(()=>'')));
out.suma1=await page.locator('#pslk-viso').textContent().catch(()=>'');
out.cta1=await page.evaluate(()=>{const c=document.getElementById('pslk-cta');return c?{disabled:c.disabled,t:c.textContent.slice(0,30)}:null;});
out.dov1=await page.evaluate(()=>{const d=document.getElementById('pslk-dov');return d?{atrakinta:d.classList.contains('atrakinta'),bl:(document.getElementById('pslk-dov-bl')||{}).textContent}:'nera';});

/* 2) jei dovana dar neatrakinta — didinam kiekius per stepper'i */
for (let k=0;k<14;k++){
  const at=await page.evaluate(()=>{const d=document.getElementById('pslk-dov');return d?d.classList.contains('atrakinta'):true;});
  if (at) break;
  const plius=page.locator('.pslk-stp button[data-d="1"]').first();
  if (!(await plius.count())) break;
  try{ await plius.click({timeout:3000}); await page.waitForTimeout(400);}catch(e){ break; }
}
out.zingsniai.push('po didinimo: '+(await page.locator('#pslk-kiek').textContent().catch(()=>'')));
out.suma2=await page.locator('#pslk-viso').textContent().catch(()=>'');
out.dov2=await page.evaluate(()=>{const d=document.getElementById('pslk-dov');return d?{atrakinta:d.classList.contains('atrakinta'),bl:(document.getElementById('pslk-dov-bl')||{}).textContent}:'nera';});

/* 3) renkam dovana */
const dovk=page.locator('.pslk-dovk').nth(1);
if (await dovk.count()) { try{ await dovk.click({timeout:3000}); await page.waitForTimeout(600);}catch(e){} }
out.dovana_pasirinkta=await page.evaluate(()=>{const k=document.querySelector('.pslk-dovk.pas');return k?k.dataset.gid:'nepasirinkta';});

/* 4) i krepseli */
const cta=page.locator('#pslk-cta');
out.cta2=await page.evaluate(()=>{const c=document.getElementById('pslk-cta');return c?{disabled:c.disabled,t:c.textContent.slice(0,30)}:null;});
if (await cta.count() && !(await page.evaluate(()=>document.getElementById('pslk-cta').disabled))) {
  await page.waitForTimeout(1200);
  try{ await cta.click({timeout:5000}); }catch(e){ out.cta_klaida=String(e).slice(0,80); }
  await page.waitForTimeout(6000);
}
out.url_po_krepselio=page.url();
out.krepselio_eiluciu=await page.locator('.cart_item, .woocommerce-cart-form__cart-item').count().catch(()=>0);

/* 5) dydzio perjungimas */
await page.goto(WP+'/?p=34942',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(4000);
const dbtn=page.locator('.pslk-dbtn:not(.on)').first();
out.dydzio_mygtuku=await page.locator('.pslk-dbtn').count();
if (await dbtn.count()) { try{ await dbtn.click({timeout:4000}); await page.waitForTimeout(5000);}catch(e){} }
out.url_po_dydzio=page.url();
out.js=jsErr;
await br.close();

/* 6) ka gavo serveris */
const sT=await snip('TEMP KELIAS TIKRA',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_k'] ?? '') !== 'KelGx') return;",
" global \$wpdb; \$t=\$wpdb->prefix.'ps_laukai_ivykiai'; \$o=array();",
" \$o['pagal_tipa']=\$wpdb->get_results(\"SELECT tipas, COUNT(*) kiek, COUNT(DISTINCT NULLIF(sesija,'')) ses FROM \$t GROUP BY tipas ORDER BY kiek DESC\", ARRAY_A);",
" \$o['svarbus']=\$wpdb->get_results(\"SELECT laikas,tipas,preke_id,verte,kiek_dezeje,dydis FROM \$t WHERE tipas IN ('min_pasiekta','dovana_atrakinta','dovana_rinko','krepselis','dydis_perjunge') ORDER BY id DESC LIMIT 12\", ARRAY_A);",
" delete_transient('ps_ata_siandien_'.current_time('Y-m-d'));",
" \$o['agreguota']=Petshop_Ataskaitu_Agregavimas::agreguoti_diena(current_time('Y-m-d'));",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.serveryje=JSON.parse(await (await fetch(WP+'/?ps_k=KelGx')).text()); }catch(e){ out.e=String(e).slice(0,150); }
await off(sT);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
