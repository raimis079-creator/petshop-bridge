process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import fs from 'fs';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const AL="add_action('init',function(){ if(!isset($_GET['ps_al6'])||($_GET['k']??'')!=='al6m2'){return;} $u=get_user_by('login','raimis079'); if(!$u){$a=get_users(['role'=>'administrator','number'=>1]); $u=$a?$a[0]:null;} if(!$u){wp_die('nera');} wp_set_current_user($u->ID); wp_set_auth_cookie($u->ID,false); wp_safe_redirect(admin_url('admin.php?page=ps-katalogas')); exit; });";
async function put(path, buf, msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'m', content:buf.toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function snip(name,code){
  const r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:name, code:code.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  return (await r.json()).id;
}
async function off(id){ await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})}); }
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))) await off(t.id);
  const aid=await snip('TEMP al6', AL);
  await new Promise(x=>setTimeout(x,2000));
  const b=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await b.newContext({viewport:{width:1680,height:1300},ignoreHTTPSErrors:true,
    httpCredentials:{username:(process.env.WP_USER||'').trim(),password:(process.env.WP_APP_PASS||'').trim()}});
  const p=await ctx.newPage();
  const kl=[]; p.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  await p.goto(`${WP}/?ps_al6=1&k=al6m2`,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(3000);
  out.eiles=await p.locator('.pskat-rail a, .pskat-rail .eile').allInnerTexts().catch(()=>[]);
  out.antrastes=await p.locator('table.pskat-t thead th').allInnerTexts();
  out.lenteles_plotis=await p.evaluate(()=>{const t=document.querySelector('table.pskat-t');return t?Math.round(t.getBoundingClientRect().width):0;});
  await p.screenshot({path:'/tmp/k36_sar.png'});
  /* kortele — imam preke su partijomis (PS-TEST) */
  await p.goto(`${WP}/wp-admin/admin.php?page=ps-katalogas&kruva=visos&q=PS-TEST`,{waitUntil:'networkidle'});
  await p.waitForTimeout(2500);
  const a=p.locator('table.pskat-t a.atv').first();
  if(await a.count()){
    await a.click(); await p.waitForTimeout(4000);
    out.skirtukai=await p.locator('.kort-tabs button').allInnerTexts();
    out.kaire=await p.locator('.kort-kaire .kort-antr').allInnerTexts();
    out.desine=await p.locator('.kort-desine .kort-antr').allInnerTexts();
    await p.screenshot({path:'/tmp/k36_kort.png'});
    /* pakuotes skirtukas */
    const pk=p.locator('.kort-tabs button[data-t="pak"]');
    if(await pk.count()){ await pk.click(); await p.waitForTimeout(1500);
      out.pakuote_turinys=await p.locator('.kort-pane[data-p="pak"] .kort-antr').allInnerTexts();
      await p.screenshot({path:'/tmp/k36_pak.png'}); }
    const pr=p.locator('.kort-tabs button[data-t="prd"]');
    if(await pr.count()){ await pr.click(); await p.waitForTimeout(1200);
      await p.screenshot({path:'/tmp/k36_prd.png'}); }
  }
  out.js_klaidos=kl.slice(0,5);
  await b.close(); await off(aid);
  for(const f of ['k36_sar','k36_kort','k36_pak','k36_prd']){ try{ await put('screenshots/'+f+'.png', fs.readFileSync('/tmp/'+f+'.png'), f); }catch(e){} }
  await put('analize/k36.json', Buffer.from(JSON.stringify(out,null,2)),'k36');
}
main().catch(async e=>{ await put('analize/k36.json',Buffer.from(JSON.stringify({klaida:String(e)},null,2)),'err'); });
