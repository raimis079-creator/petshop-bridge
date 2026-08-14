process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER, P=process.env.WP_APP_PASS;
const out={zingsniai:[]};
async function put(name,buf){ try{ let sha=null;
  const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:name,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}catch(e){} }
async function z(p,fn){ try{ await fn(); out.zingsniai.push(p+' OK'); }catch(e){ out.zingsniai.push(p+' KLAIDA: '+String(e).split('\n')[0].slice(0,130)); } }
let br;
try{
  br=await chromium.launch({args:['--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true});
  const pg=await ctx.newPage();
  const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,110)));
  await z('prisijungimas', async()=>{
    await pg.goto('https://dev.avesa.lt/wp-login.php',{waitUntil:'domcontentloaded',timeout:60000});
    await pg.fill('#user_login',U); await pg.fill('#user_pass',P);
    await pg.click('#wp-submit'); await pg.waitForTimeout(3000);
    out.prisijunge=pg.url().includes('wp-admin');
  });
  await z('sarasas', async()=>{
    await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-laukai',{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(1500);
    out.korteliu=await pg.locator('.pslka-kortele').count();
    out.eiles=await pg.locator('.pslka-e').allInnerTexts();
    out.seimos=await pg.locator('.pslka-seima').allInnerTexts();
    await put('ad1_sarasas.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });
  await z('atidarom lauka', async()=>{
    await pg.locator('.pslka-kortele').first().click();
    await pg.waitForLoadState('domcontentloaded'); await pg.waitForTimeout(1500);
    out.lauko_url=pg.url();
    out.pakopu_eiluciu=await pg.locator('#pak-kunas tr').count();
    out.krepsio_eiluciu=await pg.locator('.pslka-isimti').count();
    out.saugi=(await pg.locator('.pslka-kort h3 .pslka-z').allInnerTexts()).join(' | ');
    out.apsaugos=await pg.locator('.pslka-apsauga b').allInnerTexts();
    await put('ad2_laukas.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });
  await z('per gili pakopa', async()=>{
    const in_=pg.locator('.pak-d').first();
    await in_.fill('25'); await in_.dispatchEvent('change'); await pg.waitForTimeout(400);
    out.per_gili_tekstas=(await pg.locator('#pak-kunas tr').first().innerText()).replace(/\n/g,' | ');
    await pg.locator('#pak-saugoti').click(); await pg.waitForTimeout(2500);
    out.perspejimas=(await pg.locator('#pslka-stat').innerText().catch(()=>'')).slice(0,200);
    await put('ad3_pakopa.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });
  await z('po perkrovimo', async()=>{
    await pg.waitForTimeout(2500);
    out.pakopos_po=(await pg.locator('#pak-kunas').innerText().catch(()=>'')).replace(/\n/g,' | ').slice(0,220);
  });
  await z('paieska', async()=>{
    await pg.fill('#f-q','skanėstas');
    await pg.waitForTimeout(2500);
    out.paieskos_eiluciu=await pg.locator('#f-rez tbody tr').count();
    out.paieskos_pirma=(await pg.locator('#f-rez tbody tr').first().innerText().catch(()=>'')).replace(/\n/g,' | ').slice(0,200);
    await put('ad4_paieska.jpg', await pg.screenshot({type:'jpeg',quality:80,fullPage:true}));
  });
  await z('pilnas krepsys neleidzia', async()=>{
    await pg.locator('#f-rez .pslka-prideti').first().click();
    await pg.waitForTimeout(2500);
    out.pilno_zinute=(await pg.locator('#pslka-stat').innerText().catch(()=>'')).slice(0,200);
  });
  out.js_klaidos=kl.slice(0,5);
}catch(e){ out.fatal=String(e).slice(0,200); }
finally{ if(br) await br.close(); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ad.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const b={message:'ad',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ad.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
console.log('ok');
