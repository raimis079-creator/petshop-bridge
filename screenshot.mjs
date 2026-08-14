process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
async function put(name, buf){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
  const body={message:'shot '+name,content:buf.toString('base64')};
  if(sha) body.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  console.log('put',name,r.status);
}
const br = await chromium.launch();
const out = {marker:'VITRINA SHOT 0814', ts:new Date().toISOString()};
try{
  for (const [name, vw, vh] of [['desk',1366,900],['mob',390,844]]){
    const ctx = await br.newContext({viewport:{width:vw,height:vh}, ignoreHTTPSErrors:true, deviceScaleFactor:1});
    const pg = await ctx.newPage();
    const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,150)));
    await pg.goto('https://dev.avesa.lt/?p=34207', {waitUntil:'domcontentloaded', timeout:90000});
    await pg.waitForTimeout(8000);
    const buf = await pg.screenshot({fullPage:true, type:'jpeg', quality:60});
    await put(`vitrina_${name}_0814.jpg`, buf);
    out[name] = {url: pg.url(), errs, h: await pg.evaluate(()=>document.body.scrollHeight)};
    await ctx.close();
  }
}catch(e){ out.err=String(e).slice(0,400); }
await br.close();
await put('vitrina_shot_0814.json', Buffer.from(JSON.stringify(out,null,1)));
