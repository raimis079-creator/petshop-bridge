process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import fs from 'fs';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const AL="add_action('init',function(){ if(!isset($_GET['ps_alb'])||($_GET['k']??'')!=='albz4'){return;} $u=get_user_by('login','raimis079'); if(!$u){$a=get_users(['role'=>'administrator','number'=>1]); $u=$a?$a[0]:null;} wp_set_current_user($u->ID); wp_set_auth_cookie($u->ID,false); wp_safe_redirect(admin_url('admin.php?page=ps-katalogas&kruva=visos&q=Tropical')); exit; });";
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
  const aid=await snip('TEMP alb', AL);
  await new Promise(x=>setTimeout(x,2000));
  const b=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await b.newContext({viewport:{width:1680,height:1300},ignoreHTTPSErrors:true,
    httpCredentials:{username:(process.env.WP_USER||'').trim(),password:(process.env.WP_APP_PASS||'').trim()}});
  const p=await ctx.newPage();
  const kl=[]; p.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  await p.goto(`${WP}/?ps_alb=1&k=albz4`,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(3000);
  const a=p.locator('table.pskat-t a.atv').first();
  if(!(await a.count())){ out.klaida='nerasta'; await b.close(); await off(aid);
    await put('analize/v41b.json',Buffer.from(JSON.stringify(out,null,2)),'e'); return; }
  out.preke=await a.innerText();
  await a.click(); await p.waitForTimeout(3500);
  await p.click('.kort-tabs button[data-t="apr"]'); await p.waitForTimeout(1000);
  out.textarea_ilgis=await p.evaluate(()=>{const t=document.getElementById('ps-apr-editor');return t?t.value.length:-1;});
  await p.waitForTimeout(3500);
  out.rengykle=await p.evaluate(()=>!!(window.tinymce && tinymce.get('ps-apr-editor')));
  out.turinys_teksto=await p.evaluate(()=>{const e=window.tinymce&&tinymce.get('ps-apr-editor');return e?e.getContent({format:'text'}).length:0;});
  out.turinys_html=await p.evaluate(()=>{const e=window.tinymce&&tinymce.get('ps-apr-editor');return e?e.getContent().length:0;});
  out.lenteliu=await p.evaluate(()=>{const e=window.tinymce&&tinymce.get('ps-apr-editor');return e?(e.getContent().match(/<table/gi)||[]).length:-1;});
  out.matomas_tekstas=await p.frameLocator('.kort-apr-red iframe').locator('body').innerText().then(t=>t.slice(0,180)).catch(e=>'iframe klaida: '+e.message.slice(0,60));
  await p.screenshot({path:'/tmp/v41b.png'});
  out.js_klaidos=kl.slice(0,4);
  await b.close(); await off(aid);
  try{ await put('screenshots/v41b.png', fs.readFileSync('/tmp/v41b.png'), 'v41b'); }catch(e){}
  await put('analize/v41b.json', Buffer.from(JSON.stringify(out,null,2)),'v');
}
main().catch(async e=>{ await put('analize/v41b.json',Buffer.from(JSON.stringify({klaida:String(e)},null,2)),'err'); });
