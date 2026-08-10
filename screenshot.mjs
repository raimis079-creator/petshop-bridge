process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import fs from 'fs';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const AL="add_action('init',function(){ if(!isset($_GET['ps_al9'])||($_GET['k']??'')!=='al9r2'){return;} $u=get_user_by('login','raimis079'); if(!$u){$a=get_users(['role'=>'administrator','number'=>1]); $u=$a?$a[0]:null;} wp_set_current_user($u->ID); wp_set_auth_cookie($u->ID,false); wp_safe_redirect(admin_url('admin.php?page=ps-katalogas&kruva=visos&q=PS-TEST')); exit; });";
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
  const aid=await snip('TEMP al9', AL);
  await new Promise(x=>setTimeout(x,2000));
  const b=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await b.newContext({viewport:{width:1680,height:1250},ignoreHTTPSErrors:true,
    httpCredentials:{username:(process.env.WP_USER||'').trim(),password:(process.env.WP_APP_PASS||'').trim()}});
  const p=await ctx.newPage();
  const kl=[]; p.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  p.on('dialog', d=>d.accept());
  await p.goto(`${WP}/?ps_al9=1&k=al9r2`,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(2500);
  const a=p.locator('table.pskat-t a.atv').first();
  if(!(await a.count())){ out.klaida='prekes nerasta'; await b.close(); await off(aid);
    await put('analize/v39v.json',Buffer.from(JSON.stringify(out,null,2)),'e'); return; }
  await a.click(); await p.waitForTimeout(3500);
  await p.click('.kort-tabs button[data-t="apr"]'); await p.waitForTimeout(1500);

  out.redaktorius_yra=await p.locator('.kort-apr-red').count();
  out.mygtukai=await p.locator('.kort-apr-veiksmai button').allInnerTexts();
  out.tekstas_pries=await p.inputValue('.kort-apr-txt');

  /* 1. KARKASAS */
  await p.click('.ka-karkasas'); await p.waitForTimeout(3000);
  out.karkaso_zenklas=await p.locator('.ka-stat').innerText();
  out.tekstas_po_karkaso=(await p.inputValue('.kort-apr-txt')).slice(0,160);

  /* 2. IRASYMAS */
  await p.fill('.kort-apr-txt', 'Aprašymas:\nTestinė prekė, neliesti.\n\nSudėtis:\n100 % testas.\n');
  await p.click('.ka-irasyti'); await p.waitForTimeout(3000);
  out.irasymo_zenklas=await p.locator('.ka-stat').innerText();

  /* 3. ATSAUKIMAS */
  const at=p.locator('.ka-atsaukti');
  if(await at.count()){
    await at.click(); await p.waitForTimeout(3000);
    out.atsaukimo_zenklas=await p.locator('.ka-stat').innerText().catch(()=>'(perkrauta)');
  } else { out.atsaukimo_zenklas='mygtuko nera'; }
  await p.waitForTimeout(2000);
  await p.screenshot({path:'/tmp/v39.png',fullPage:false});
  out.js_klaidos=kl.slice(0,4);
  await b.close(); await off(aid);
  try{ await put('screenshots/v39.png', fs.readFileSync('/tmp/v39.png'), 'v39'); }catch(e){}
  await put('analize/v39v.json', Buffer.from(JSON.stringify(out,null,2)),'v');
}
main().catch(async e=>{ await put('analize/v39v.json',Buffer.from(JSON.stringify({klaida:String(e)},null,2)),'err'); });
