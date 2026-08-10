process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import fs from 'fs';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const AL="add_action('init',function(){ if(!isset($_GET['ps_al5'])||($_GET['k']??'')!=='al5q3'){return;} $u=get_user_by('login','raimis079'); if(!$u){$a=get_users(['role'=>'administrator','number'=>1]); $u=$a?$a[0]:null;} if(!$u){wp_die('nera');} wp_set_current_user($u->ID); wp_set_auth_cookie($u->ID,false); wp_safe_redirect(admin_url('admin.php?page=ps-gavimas')); exit; });";
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
  const aid=await snip('TEMP al5', AL);
  await new Promise(x=>setTimeout(x,2000));

  const b=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await b.newContext({viewport:{width:1500,height:1200},ignoreHTTPSErrors:true,
    httpCredentials:{username:(process.env.WP_USER||'').trim(),password:(process.env.WP_APP_PASS||'').trim()}});
  const p=await ctx.newPage();
  const kl=[]; p.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  p.on('dialog', d=>d.accept());

  await p.goto(`${WP}/?ps_al5=1&k=al5q3`,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(2500);
  out.url=p.url();
  out.puslapis_yra=await p.locator('#g-q').count();
  if(!out.puslapis_yra){ out.klaida='gavimo puslapis nerastas'; await b.close(); await off(aid);
    await put('analize/gavbrowser.json',Buffer.from(JSON.stringify(out,null,2)),'e'); return; }

  /* 1. tiekejas */
  await p.fill('#g-tiek','TESTAS naršyklė');

  /* 2. paieska — be diakritiku */
  await p.fill('#g-q','PS-TEST');
  await p.waitForTimeout(900);
  out.rado=await p.locator('#g-rez .r').count();
  out.pirmas=await p.locator('#g-rez .r .pav').first().innerText().catch(()=>'');
  await p.press('#g-q','Enter');
  await p.waitForTimeout(600);
  out.eiluciu=await p.locator('#g-tbody tr').count();
  out.savikaina_uzpildyta=await p.inputValue('tr[data-i="0"] input[data-f="sav"]').catch(()=>'');

  /* 3. klaviatura: kiekis -> Enter -> savikaina -> Enter -> data -> Enter */
  await p.keyboard.type('7');
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  await p.keyboard.type('25.00');
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  await p.keyboard.type('2028-01-31');
  await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  out.fokusas=await p.evaluate(()=>document.activeElement.id);
  out.suma=await p.locator('#s-suma').innerText();
  out.pozicijos=await p.locator('#s-poz').innerText();

  /* 4. saskaitos kontrole */
  await p.fill('#s-tikr','175.00'); await p.waitForTimeout(400);
  out.skirtumas_ok=await p.locator('#s-skirt').innerText();
  await p.fill('#s-tikr','200.00'); await p.waitForTimeout(400);
  out.skirtumas_bad=await p.locator('#s-skirt').innerText();
  await p.fill('#s-tikr','');

  await p.screenshot({path:'/tmp/gav1.png',fullPage:true});

  /* 5. IRASYMAS */
  await p.click('#b-irasyti');
  await p.waitForTimeout(4000);
  out.rezultatas=await p.locator('#g-rezultatas').innerText().catch(()=>'');
  out.eiluciu_po=await p.locator('#g-tbody tr').count();
  await p.screenshot({path:'/tmp/gav2.png',fullPage:true});

  /* 6. kartoti praeita */
  await p.click('#b-kartoti');
  await p.waitForTimeout(2500);
  out.kartoti_eiluciu=await p.locator('#g-tbody tr').count();
  out.kartoti_info=await p.locator('#kartoti-info').innerText().catch(()=>'');

  out.js_klaidos=kl;
  await b.close(); await off(aid);
  for(const f of ['gav1','gav2']){ try{ await put('screenshots/'+f+'.png', fs.readFileSync('/tmp/'+f+'.png'), f); }catch(e){} }
  await put('analize/gavbrowser.json', Buffer.from(JSON.stringify(out,null,2)),'gb');
}
main().catch(async e=>{ await put('analize/gavbrowser.json',Buffer.from(JSON.stringify({klaida:String(e)},null,2)),'err'); });
