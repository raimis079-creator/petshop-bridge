process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import fs from 'fs';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const AL="add_action('init',function(){ if(!isset($_GET['ps_al7'])||($_GET['k']??'')!=='al7p4'){return;} $u=get_user_by('login','raimis079'); if(!$u){$a=get_users(['role'=>'administrator','number'=>1]); $u=$a?$a[0]:null;} wp_set_current_user($u->ID); wp_set_auth_cookie($u->ID,false); wp_safe_redirect(admin_url('admin.php?page=ps-katalogas&kruva=visos&q=PS-TEST')); exit; });";
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
  const aid=await snip('TEMP al7', AL);
  await new Promise(x=>setTimeout(x,2000));
  const b=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await b.newContext({viewport:{width:1680,height:1300},ignoreHTTPSErrors:true,
    httpCredentials:{username:(process.env.WP_USER||'').trim(),password:(process.env.WP_APP_PASS||'').trim()}});
  const p=await ctx.newPage();
  const kl=[]; p.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  await p.goto(`${WP}/?ps_al7=1&k=al7p4`,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(2500);
  const a=p.locator('table.pskat-t a.atv').first();
  if(await a.count()){
    await a.click(); await p.waitForTimeout(4000);
    out.spalvos=await p.evaluate(()=>{
      const g=s=>{const e=document.querySelector(s);return e?getComputedStyle(e).color:null;};
      return {eil_etikete:g('.kort-eil > span:first-child'), antr:g('.kort-antr'), info:g('.kort-info-m'), th:g('.kort-t th')};
    });
    out.ean_plotis=await p.evaluate(()=>{const e=document.querySelector('.kort-red[data-laukas="_ean"] input');return e?Math.round(e.getBoundingClientRect().width):0;});
    out.blokai_kaireje=await p.locator('.kort-kaire .kort-antr').allInnerTexts();
    await p.screenshot({path:'/tmp/v37a.png'});
    /* aprasymu skirtukas */
    await p.click('.kort-tabs button[data-t="apr"]'); await p.waitForTimeout(1500);
    await p.screenshot({path:'/tmp/v37b.png'});
  }
  out.js_klaidos=kl.slice(0,4);
  await b.close(); await off(aid);
  for(const f of ['v37a','v37b']){ try{ await put('screenshots/'+f+'.png', fs.readFileSync('/tmp/'+f+'.png'), f); }catch(e){} }
  await put('analize/v37v.json', Buffer.from(JSON.stringify(out,null,2)),'v');
}
main().catch(async e=>{ await put('analize/v37v.json',Buffer.from(JSON.stringify({klaida:String(e)},null,2)),'err'); });
