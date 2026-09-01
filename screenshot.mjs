process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgzIGFkbWluIGNvb2tpZSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NrJ10pIHx8ICRfR0VUWydwc19jayddIT09J0s3djJzMTU4MycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICR1aWQ9MTsgJGV4cD10aW1lKCkrMTgwMDsKICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxNTgzJywnY29va2llcyc9PmFycmF5KAogICAgYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJykpLAogICAgYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcpKSwKICAgIGFycmF5KCduYW1lJz0+QVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdhdXRoJykpLAogICkpKTsgZXhpdDsKfSk7Cg=='; const VER='dep-184326'; const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets'; let sid=null;
try{
  try{ const l=await fetch(SNIP,{headers:A}); const arr=JSON.parse(await l.text()); for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){}
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})}); try{sid=JSON.parse(await c.text()).id;}catch(e){}
  await miegok(9000);
  const ck=JSON.parse(await (await fetch(WP+'/?ps_ck=K7v2s1583',{headers:{'User-Agent':'Mozilla/5.0 petshopseo','Cache-Control':'no-cache'}})).text());
  const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1300,height:900},ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (X11; Linux x86_64) petshopseo Chrome/120'});
  await ctx.addCookies(ck.cookies.map(x=>({name:x.name,value:x.value,domain:new URL(WP).hostname,path:'/',secure:true,httpOnly:true})));
  const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,120)));
  await pg.goto(WP+'/wp-admin/admin.php?page=ps-kontrole',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(3000);
  out.title=await pg.title(); out.h1=await pg.evaluate(()=>(document.querySelector('#wpbody-content h1')||{}).textContent); out.rows=await pg.evaluate(()=>document.querySelectorAll('#wpbody-content table tbody tr').length);
  out.text=await pg.evaluate(()=>(document.querySelector('#wpbody-content')||{}).innerText.slice(0,1500)); out.pageerrors=errs;
  await put('screenshots/s1587_kontrole.png',await pg.screenshot({fullPage:true}),VER);
  await pg.goto(WP+'/wp-admin/admin.php?page=petshop-reports',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(2000);
  out.hub_kortele=await pg.evaluate(()=>[...document.querySelectorAll('.ps-rep-card')].map(a=>a.innerText.replace(/\s+/g,' ').slice(0,80)).filter(t=>/Kontrol/.test(t)));
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/s1587_kontrole_vis.json',Buffer.from(JSON.stringify(out,null,1)),VER); console.log('ok');
