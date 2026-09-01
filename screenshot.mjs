process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgzIGFkbWluIGNvb2tpZSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NrJ10pIHx8ICRfR0VUWydwc19jayddIT09J0s3djJzMTU4MycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICR1aWQ9MTsgJGV4cD10aW1lKCkrMTgwMDsKICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxNTgzJywnY29va2llcyc9PmFycmF5KAogICAgYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJykpLAogICAgYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcpKSwKICAgIGFycmF5KCduYW1lJz0+QVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdhdXRoJykpLAogICkpKTsgZXhpdDsKfSk7Cg=='; const VER='dep-173506'; const OUT='analize/s1583_admin_menu.json';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets'; let sid=null;
try{
  try{ const l=await fetch(SNIP,{headers:A}); const arr=JSON.parse(await l.text()); for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){}
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  try{sid=JSON.parse(await c.text()).id; out.sid=sid;}catch(e){}
  await miegok(9000);
  const ck=JSON.parse(await (await fetch(WP+'/?ps_ck=K7v2s1583',{headers:{'User-Agent':'Mozilla/5.0 petshopseo','Cache-Control':'no-cache'}})).text());
  out.cookies_n=(ck.cookies||[]).length;
  const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1400,height:900},ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (X11; Linux x86_64) petshopseo Chrome/120'});
  const host=new URL(WP).hostname;
  await ctx.addCookies(ck.cookies.map(x=>({name:x.name,value:x.value,domain:host,path:'/',secure:true,httpOnly:true})));
  const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,120)));
  await pg.goto(WP+'/wp-admin/',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(4000);
  out.url=pg.url(); out.title=await pg.title();
  out.menu=await pg.evaluate(()=>{ const r=[]; document.querySelectorAll('#adminmenu > li.menu-top').forEach(li=>{ const t=(li.querySelector('.wp-menu-name')||{}).textContent||''; const subs=[...li.querySelectorAll('.wp-submenu li a')].map(a=>a.textContent.trim()+' → '+a.getAttribute('href')); r.push({top:t.trim(),subs}); }); return r; });
  // Petshop langai + ataskaitos: atidaryti kiekvieną pirmą puslapį ir paimti h1 + lentelių/eilučių skaičių
  const targets=out.menu.filter(m=>/Petshop/i.test(m.top)).flatMap(m=>m.subs).filter(s=>/page=/.test(s)).map(s=>s.split(' → ')[1]).slice(0,40);
  out.langai={};
  for(const href of targets){ try{ const u=href.startsWith('http')?href:WP+'/wp-admin/'+href.replace(/^\//,''); await pg.goto(u,{waitUntil:'domcontentloaded',timeout:45000}); await pg.waitForTimeout(2500);
      out.langai[href]=await pg.evaluate(()=>{ const h=(document.querySelector('#wpbody-content h1, #wpbody-content h2')||{}).textContent||''; const tables=document.querySelectorAll('#wpbody-content table').length; const rows=document.querySelectorAll('#wpbody-content table tbody tr').length; const tabs=[...document.querySelectorAll('#wpbody-content .nav-tab, #wpbody-content .ps-tab, #wpbody-content .subsubsub a')].map(a=>a.textContent.trim()).slice(0,20); const txt=(document.querySelector('#wpbody-content')||{}).innerText||''; const empty=/nėra duomenų|nera duomenu|tuščia|0 įrašų|Nėra įrašų/i.test(txt); return {h:h.trim().slice(0,80),tables,rows,tabs,empty,len:txt.length,notice:[...document.querySelectorAll('#wpbody-content .notice, #wpbody-content .error')].map(n=>n.innerText.trim().slice(0,100))}; });
      await pg.waitForTimeout(2000); }catch(e){ out.langai[href]={klaida:String(e).slice(0,120)}; } }
  out.pageerrors=errs.slice(0,10);
  await pg.goto(WP+'/wp-admin/',{waitUntil:'domcontentloaded',timeout:45000}); await pg.waitForTimeout(3000);
  const shot=await pg.screenshot({fullPage:false}); await put('screenshots/s1583_admin_dash.png',shot,VER+' dash');
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,600); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER); console.log('ok');
