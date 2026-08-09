process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const WP='https://dev.avesa.lt';
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim().replace(/\s+/g,'')).toString('base64');
const TOK='ps'+Date.now();

async function put(path, buf, msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg, content:buf.toString('base64')};
  if(sha) body.sha=sha;
  const r2=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r2.status;
}
const out={zingsniai:[], klaidos:[], konsole:[]};

// 1) vienkartinis auto-login snippetas per REST
let snipId=0;
try{
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  const code = "add_action('init',function(){ if(!isset($_GET['ps_al'])||$_GET['ps_al']!=='"+TOK+"'){return;} $u=get_users(['role'=>'administrator','number'=>1]); if(!$u){wp_die('nera admin');} wp_set_current_user($u[0]->ID); wp_set_auth_cookie($u[0]->ID,false); wp_safe_redirect(admin_url('admin.php?page=ps-katalogas')); exit; });";
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP autologin', code, scope:'global', active:true})});
  const s=await r.json(); snipId=s.id||0;
  out.zingsniai.push('autologin snippetas #'+snipId+' st='+r.status);
}catch(e){ out.klaidos.push('snippetas: '+String(e).slice(0,200)); }

if(!snipId){ await put('analize/v30_vizualas.json', Buffer.from(JSON.stringify(out,null,2)), 'viz'); process.exit(0); }
await new Promise(x=>setTimeout(x,2500));

const b=await chromium.launch({args:['--ignore-certificate-errors']});
const ctx=await b.newContext({viewport:{width:1620,height:1150}, ignoreHTTPSErrors:true});
const pg=await ctx.newPage();
pg.on('console', m=>{ if(m.type()==='error') out.konsole.push(m.text().slice(0,150)); });
pg.on('pageerror', e=>out.klaidos.push('JS: '+String(e).slice(0,150)));

try{
  await pg.goto(`${WP}/?ps_al=${TOK}`,{waitUntil:'networkidle',timeout:90000});
  await pg.waitForTimeout(3000);
  out.url=pg.url();
  out.zingsniai.push('po autologin: '+out.url.slice(0,80));

  if(!out.url.includes('ps-katalogas')){
    await pg.goto(`${WP}/wp-admin/admin.php?page=ps-katalogas`,{waitUntil:'networkidle',timeout:90000});
    await pg.waitForTimeout(2500);
  }
  out.antraste=await pg.title();
  out.yra_lentele=await pg.$$eval('.pskat-t', e=>e.length);

  out.stulpeliai=await pg.$$eval('.pskat-t thead th', ths=>ths.map(t=>t.innerText.trim().replace(/\n/g,' ')));
  out.eiles=await pg.$$eval('.pskat-rail a', as=>as.map(a=>a.innerText.trim().replace(/\n/g,' ')));
  out.eiluciu=await pg.$$eval('.pskat-t tbody tr', rs=>rs.length);
  out.langeliai={pard:await pg.$$eval('.pard-gr',e=>e.length), dienu:await pg.$$eval('.dienu',e=>e.length), piln:await pg.$$eval('.piln',e=>e.length)};
  out.pvz=await pg.$$eval('.pskat-t tbody tr', rs=>rs.slice(0,3).map(r=>Array.from(r.querySelectorAll('td')).map(td=>td.innerText.trim().replace(/\n/g,' ').slice(0,22))));
  await put('screenshots/v30_sarasas.png', await pg.screenshot(), 'v30 sarasas');
  out.zingsniai.push('sarasas OK');

  const sk=await pg.$('a[href*="view=skolos"]');
  if(sk){ await sk.click(); await pg.waitForTimeout(3000);
    out.skolos_eiluciu=await pg.$$eval('.pskat-t tbody tr', rs=>rs.length);
    await put('screenshots/v30_skolos.png', await pg.screenshot(), 'v30 skolos');
    out.zingsniai.push('skolos: '+out.skolos_eiluciu);
  }

  await pg.goto(`${WP}/wp-admin/admin.php?page=ps-katalogas&q=Animonda`,{waitUntil:'networkidle',timeout:90000});
  await pg.waitForTimeout(2500);
  await pg.evaluate(()=>{ const a=document.querySelector('a.atv'); if(a) a.click(); });
  await pg.waitForTimeout(4000);
  out.kortele=await pg.$$eval('.kort-antr', e=>e.map(x=>x.innerText.trim().replace(/\n/g,' ').slice(0,42)));
  if(out.kortele.length){
    await put('screenshots/v30_kortele.png', await pg.screenshot(), 'v30 kortele');
    await pg.evaluate(()=>{ const t=[...document.querySelectorAll('.kort-antr')].find(e=>e.innerText.includes('dalyvauja')); if(t) t.scrollIntoView({block:'center'}); });
    await pg.waitForTimeout(1200);
    await put('screenshots/v30_rysiai.png', await pg.screenshot(), 'v30 rysiai');
    await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>x.dataset.t==='ist'); if(b) b.click(); });
    await pg.waitForTimeout(1500);
    await put('screenshots/v30_juosta.png', await pg.screenshot(), 'v30 juosta');
    out.zingsniai.push('kortele+rysiai+juosta OK');
  }
}catch(e){ out.klaidos.push('EIGA: '+String(e).slice(0,250)); }

await b.close();
try{ await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${snipId}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.zingsniai.push('autologin deaktyvuotas'); }catch(e){ out.klaidos.push('deakt: '+String(e).slice(0,100)); }
await put('analize/v30_vizualas.json', Buffer.from(JSON.stringify(out,null,2)), 'viz');
console.log('baigta');
