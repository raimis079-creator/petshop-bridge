process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2NiddKSB8fCAkX0dFVFsncHNfaDI2NiddIT09J1JVTjIwMjYwODI0WicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjZCJyk7IGdsb2JhbCAkd3BkYjsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdVswXS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHVbMF0tPklELHRydWUsdHJ1ZSk7IH0KIGlmKGlzc2V0KCRfR0VUWydkZXBsb3knXSkpewogICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOyAkZj0ncGV0c2hvcC1yaW5raW5pYWkucGhwJzsKICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS8nLiRmLicuYjY0P3JlZj0nLiRzaGEsYXJyYXkoJ3RpbWVvdXQnPT40MCwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J3BzJywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL3ZuZC5naXRodWIranNvbicpKSk7CiAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOyAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oaXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJykpOwogICRpbmY9YXJyYXkoJ2dhdXRhJz0+c3RybGVuKCRjb2RlKSk7CiAgaWYoJGNvZGUgJiYgc3RycG9zKCRjb2RlLCc8P3BocCcpPT09MCl7IHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkaW5mWydzaW50YWtzZSddPSdvayc7IH0gY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgIGlmKCdvayc9PT0kaW5mWydzaW50YWtzZSddKXsgJGRzdD1XUE1VX1BMVUdJTl9ESVIuJy8nLiRmOyBAY29weSgkZHN0LCBXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcy8nLiRmLicuYmFrX2gyNjYnKTsgZmlsZV9wdXRfY29udGVudHMoJGRzdCwkY29kZSk7ICRpbmZbJ21kNSddPW1kNV9maWxlKCRkc3QpOyB9IH0KICAkVFsnZmFpbGFpJ11bJGZdPSRpbmY7CiAgLy8gdmllbmthcnRpbmlzOiBNTk0gcmlua2luaWFpIHN1IHR1xaHEjWl1IF9wcmljZSDihpIgX3ByaWNlID0gX3JlZ3VsYXJfcHJpY2UKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskd3BkYi0+dGVybXN9IHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF90eXBlJyBBTkQgdC5zbHVnPSdtaXgtYW5kLW1hdGNoJyBBTkQgcC5wb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIik7CiAgJGZpeD1hcnJheSgpOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHByPWdldF9wb3N0X21ldGEoJGlkLCdfcHJpY2UnLHRydWUpOyAkcmc9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKTsgaWYoJyc9PT0oc3RyaW5nKSRwciAmJiAoZmxvYXQpJHJnPjApeyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3ByaWNlJywkcmcpOyAkZml4W109JGlkLic9Jy4kcmc7IH0gfQogICRUWydwYXRhaXN5dGEnXT0kZml4OyAkVFsnbW5tX3Zpc28nXT1jb3VudCgkaWRzKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const SHA='61db6827a123456d4d7cfe862fd451f87716b138';
const MD5={"petshop-rinkiniai.php": "5f79ff63ffe2e57cee87129b41e0ca32"};
const out={v:'H266B'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
async function busena(pg,name){ await miegok(800); const html=await pg.content();
  const o={url:pg.url().replace(WP,'').slice(0,160), h1:await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'?'), fatal:/Fatal error|critical error|Kritinė klaida/i.test(html),
    notices:await pg.$$eval('.notice,.pd-msg,.updated,.error',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,260)).filter(t=>!t.includes('WordPress 7.1'))).catch(()=>[])};
  if(name) o.put=await put('screenshots/h266_'+name+'.png',await pg.screenshot({fullPage:true}),'H266B'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H257 v1 (deploy+E2E laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h266=RUN20260824Z&deploy=1&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  let visi=true; for(const k in MD5){ if(!out.deploy.failai||!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } out.md5_ok=visi;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  if(visi && cookies.length){
    await miegok(2000);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
    pg.on('dialog',async dg=>{ (out.dialogai=out.dialogai||[]).push(dg.message().slice(0,100)); await dg.accept(); });
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-rinkiniai',{waitUntil:'networkidle',timeout:60000}); out.rink=await busena(pg,'rinkiniai');
    out.eilutes=await pg.$$eval('tr',ns=>ns.filter(n=>/#3507[02]/.test(n.textContent)).map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,220)));
    out.js=kl; await br.close();
  }
  
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h266run.json', Buffer.from(JSON.stringify(out,null,1)), 'H266B');
