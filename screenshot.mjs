process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import { execSync } from 'child_process';
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const U=process.env.WP_USER, P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
async function put(name, buf){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'shot '+name,content:buf.toString('base64')}; if(sha) body.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  console.log('put',name,r.status);
}
const out={marker:'ADMIN SHOT 0814',ts:new Date().toISOString()};
const br=await chromium.launch();
try{
  const ctx=await br.newContext({viewport:{width:1500,height:1000},ignoreHTTPSErrors:true,
    httpCredentials:{username:U,password:P}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,140)));
  // 1) prisijungiam per WP login forma
  await pg.goto('https://dev.avesa.lt/wp-login.php',{waitUntil:'domcontentloaded',timeout:90000});
  await pg.waitForTimeout(1500);
  const yra = await pg.$('#user_login');
  out.login_forma = !!yra;
  if (yra){
    await pg.fill('#user_login', U);
    await pg.fill('#user_pass', P);
    await Promise.all([pg.waitForNavigation({waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{}), pg.click('#wp-submit')]);
    await pg.waitForTimeout(2000);
  }
  out.po_login = pg.url();
  // 2) Rinkiniu langas
  await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-rinkiniai',{waitUntil:'domcontentloaded',timeout:90000});
  await pg.waitForTimeout(6000);
  out.url = pg.url();
  out.titulas = await pg.title();
  out.errs = errs;
  out.h = await pg.evaluate(()=>document.body.scrollHeight);
  out.tekstas = (await pg.evaluate(()=>document.body.innerText)).slice(0,1200);
  await put('admin_rink_0814.jpg', await pg.screenshot({fullPage:true,type:'jpeg',quality:58}));
  await ctx.close();
}catch(e){ out.err=String(e).slice(0,400); }
await br.close();
await put('admin_shot_0814.json', Buffer.from(JSON.stringify(out,null,1)));
