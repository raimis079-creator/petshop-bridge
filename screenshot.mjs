process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const WP='https://dev.avesa.lt';
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const U=(process.env.WP_USER||'').trim(), P=(process.env.WP_PASS_CLEAN||process.env.WP_PASS||'').trim();

async function put(path, buf, msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg, content:buf.toString('base64')};
  if(sha) body.sha=sha;
  const r2=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r2.status;
}
async function putJson(path, obj){ return put(path, Buffer.from(JSON.stringify(obj,null,2)), 'v30 vizualas'); }

const out={zingsniai:[], klaidos:[], konsole:[]};
const b=await chromium.launch({args:['--ignore-certificate-errors']});
const ctx=await b.newContext({viewport:{width:1600,height:1200}, ignoreHTTPSErrors:true});
const pg=await ctx.newPage();
pg.on('console', m=>{ if(m.type()==='error') out.konsole.push(m.text().slice(0,160)); });
pg.on('pageerror', e=>out.klaidos.push(String(e).slice(0,160)));

try{
  await pg.goto(`${WP}/wp-login.php`,{waitUntil:'domcontentloaded',timeout:60000});
  await pg.fill('#user_login',U); await pg.fill('#user_pass',P);
  await Promise.all([pg.waitForNavigation({timeout:60000}), pg.click('#wp-submit')]);
  out.zingsniai.push('prisijungta: '+pg.url().slice(0,70));

  await pg.goto(`${WP}/wp-admin/admin.php?page=ps-katalogas`,{waitUntil:'networkidle',timeout:90000});
  await pg.waitForTimeout(2500);
  out.zingsniai.push('katalogas atidarytas');
  out.antraste=await pg.title();

  // stulpelių ir eilių patikra DOM'e
  out.stulpeliai=await pg.$$eval('.pskat-t thead th', ths=>ths.map(t=>t.innerText.trim().replace(/\n/g,' ')));
  out.eiles=await pg.$$eval('.pskat-rail a', as=>as.map(a=>a.innerText.trim().replace(/\n/g,' ')));
  out.eiluciu=await pg.$$eval('.pskat-t tbody tr', rs=>rs.length);
  out.pard_langeliai=await pg.$$eval('.pard-gr', e=>e.length);
  out.dienu_langeliai=await pg.$$eval('.dienu', e=>e.length);
  out.piln_langeliai=await pg.$$eval('.piln', e=>e.length);
  out.pvz_eilute=await pg.$$eval('.pskat-t tbody tr', rs=>rs.slice(0,2).map(r=>Array.from(r.querySelectorAll('td')).map(td=>td.innerText.trim().replace(/\n/g,' ').slice(0,26))));

  await put('screenshots/v30_sarasas.png', await pg.screenshot({fullPage:false}), 'v30 sarasas');
  out.zingsniai.push('sarasas nufotografuotas');

  // eilė "Duomenų skolos"
  const skolos=await pg.$('a[href*="view=skolos"]');
  if(skolos){
    await skolos.click(); await pg.waitForTimeout(3000);
    out.skolos_eiluciu=await pg.$$eval('.pskat-t tbody tr', rs=>rs.length);
    await put('screenshots/v30_skolos.png', await pg.screenshot({fullPage:false}), 'v30 skolos');
    out.zingsniai.push('skolos eile: '+out.skolos_eiluciu);
  } else { out.zingsniai.push('skolos nuorodos nerasta'); }

  // KORTELĖ — prekė, kuri yra rinkiniuose (19574)
  await pg.goto(`${WP}/wp-admin/admin.php?page=ps-katalogas`,{waitUntil:'networkidle',timeout:90000});
  await pg.waitForTimeout(2000);
  await pg.evaluate(()=>{ const a=document.querySelector('a.atv'); if(a) a.click(); });
  await pg.waitForTimeout(3500);
  const kort=await pg.$('#card, .kort-head, .pskat-kort');
  out.kortele_atsidare=!!kort;
  if(kort){
    out.kort_blokai=await pg.$$eval('.kort-antr', e=>e.map(x=>x.innerText.trim().replace(/\n/g,' ').slice(0,44)));
    await put('screenshots/v30_kortele.png', await pg.screenshot({fullPage:false}), 'v30 kortele');
    out.zingsniai.push('kortele nufotografuota');
    // slinkti iki ryšių
    await pg.evaluate(()=>{ const els=[...document.querySelectorAll('.kort-antr')]; const t=els.find(e=>e.innerText.includes('dalyvauja')); if(t) t.scrollIntoView({block:'center'}); });
    await pg.waitForTimeout(1200);
    await put('screenshots/v30_rysiai.png', await pg.screenshot({fullPage:false}), 'v30 rysiai');
    // istorijos skirtukas
    await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>x.dataset.t==='ist'); if(b) b.click(); });
    await pg.waitForTimeout(1500);
    await put('screenshots/v30_juosta.png', await pg.screenshot({fullPage:false}), 'v30 juosta');
    out.zingsniai.push('juosta nufotografuota');
  }
}catch(e){ out.klaidos.push('EIGA: '+String(e).slice(0,300)); }

await b.close();
await putJson('analize/v30_vizualas.json', out);
console.log('baigta');
