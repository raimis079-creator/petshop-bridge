process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU3aCBrbGFpZHUgdGFpc3ltYXMgKFJBU08pICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg1N2gnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODU3aCddOwogIHRyeXsKICAgIC8vIDEpIFNuaXBwZXQgNTM1OiByaW5raW5pbyBrYWluYSAwIChkZXplcywga2FpbmEgcGFnYWwgdHVyaW5pKSAtPiAiU3V0YXVwb3RlIDEwMCAlIiAtPiBuZXJvZHl0aQogICAgJGNvZGU9JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGlkPTUzNSIpOwogICAgJG9sZD0iICAgIFwkYnVuZGxlX3ByaWNlID0gKGZsb2F0KSB3Y19nZXRfcHJpY2VfdG9fZGlzcGxheShcJHByb2R1Y3QpO1xuIjsKICAgIGlmKHN0cnBvcygkY29kZSwnUzE4NTcnKSE9PWZhbHNlKXsgJHJbJ3M1MzUnXT0namF1IHBhdGFpc3l0YSc7IH0KICAgIGVsc2VpZihzdHJwb3MoJGNvZGUsJG9sZCkhPT1mYWxzZSl7CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2Jha19zMTg1N19zbmlwNTM1JywkY29kZSxmYWxzZSk7CiAgICAgICRuZXc9JG9sZC4iICAgIGlmIChcJGJ1bmRsZV9wcmljZSA8PSAwKSByZXR1cm4gZmFsc2U7IC8vIFMxODU3OiBkZXplcyBiZSBmaWtzdW90b3Mga2Fpbm9zIC0+IG5lICdTdXRhdXBvdGUgMTAwICUnXG4iOwogICAgICAkY29kZTI9c3RyX3JlcGxhY2UoJG9sZCwkbmV3LCRjb2RlKTsKICAgICAgJGNvZGUyPXN0cl9yZXBsYWNlKCIgICAgaWYgKFwkcGVyY2VudCA8IDMpIHJldHVybiBmYWxzZTsiLCIgICAgaWYgKFwkcGVyY2VudCA8IDMgfHwgXCRwZXJjZW50ID4gNjApIHJldHVybiBmYWxzZTsgLy8gUzE4NTc6ID42MCAlID0gZHVvbWVudSBrbGFpZGEiLCRjb2RlMik7CiAgICAgICR3cGRiLT51cGRhdGUoInskUH1zbmlwcGV0cyIsWydjb2RlJz0+JGNvZGUyXSxbJ2lkJz0+NTM1XSk7ICRyWydzNTM1J109J3BhdGFpc3l0YSc7CiAgICB9IGVsc2UgJHJbJ3M1MzUnXT0nRUlMVVRFIE5FUkFTVEEnOwogICAgLy8gMikgTWVuaXUgIlNQUkVORElNQUkiIC0+IC9zcHJlbmRpbWFpLyAodmlldG9qIHR1c2Npb3Mga2F0ZWdvcmlqb3MpCiAgICAkbWlkPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIGEgT04gYS5wb3N0X2lkPXAuSUQgQU5EIGEubWV0YV9rZXk9J19tZW51X2l0ZW1fb2JqZWN0X2lkJyBBTkQgYS5tZXRhX3ZhbHVlPSc2ODAnIEpPSU4geyRQfXBvc3RtZXRhIGIgT04gYi5wb3N0X2lkPXAuSUQgQU5EIGIubWV0YV9rZXk9J19tZW51X2l0ZW1fb2JqZWN0JyBBTkQgYi5tZXRhX3ZhbHVlPSdwcm9kdWN0X2NhdCcgV0hFUkUgcC5wb3N0X3R5cGU9J25hdl9tZW51X2l0ZW0nIik7CiAgICAkclsnbWVuaXVfaWRzJ109JG1pZDsKICAgIGZvcmVhY2goJG1pZCBhcyAkaWQpeyAkYmFrPVsndHlwZSc9PmdldF9wb3N0X21ldGEoJGlkLCdfbWVudV9pdGVtX3R5cGUnLHRydWUpLCdvYmonPT5nZXRfcG9zdF9tZXRhKCRpZCwnX21lbnVfaXRlbV9vYmplY3QnLHRydWUpLCdvYmppZCc9PmdldF9wb3N0X21ldGEoJGlkLCdfbWVudV9pdGVtX29iamVjdF9pZCcsdHJ1ZSksJ3RpdGxlJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfdGl0bGUnLCRpZCldOwogICAgICB1cGRhdGVfb3B0aW9uKCdwc19iYWtfczE4NTdfbWVudV8nLiRpZCwkYmFrLGZhbHNlKTsKICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19tZW51X2l0ZW1fdHlwZScsJ2N1c3RvbScpOyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX21lbnVfaXRlbV9vYmplY3QnLCdjdXN0b20nKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19tZW51X2l0ZW1fb2JqZWN0X2lkJywkaWQpOyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX21lbnVfaXRlbV91cmwnLGhvbWVfdXJsKCcvc3ByZW5kaW1haS8nKSk7CiAgICAgIGlmKGdldF9wb3N0X2ZpZWxkKCdwb3N0X3RpdGxlJywkaWQpPT09JycpIHdwX3VwZGF0ZV9wb3N0KFsnSUQnPT4kaWQsJ3Bvc3RfdGl0bGUnPT4nU3ByZW5kaW1haSddKTsgfQogICAgLy8gMykgTnVrcmVpcGltYWkgL2thdGVnb3JpamEvc3ByZW5kaW1haS8uLi4gLT4gL3NwcmVuZGltYWkvLi4uIChSZWRpcmVjdGlvbikKICAgIGlmKGNsYXNzX2V4aXN0cygnUmVkX0l0ZW0nKSAmJiBjbGFzc19leGlzdHMoJ1JlZF9Hcm91cCcpKXsKICAgICAgJGV4PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgaWQgRlJPTSB7JFB9cmVkaXJlY3Rpb25faXRlbXMgV0hFUkUgdXJsIExJS0UgJyVrYXRlZ29yaWphL3NwcmVuZGltYWklJyIpOwogICAgICBpZighJGV4KXsgJGc9JHdwZGItPmdldF92YXIoIlNFTEVDVCBpZCBGUk9NIHskUH1yZWRpcmVjdGlvbl9ncm91cHMgT1JERVIgQlkgaWQgTElNSVQgMSIpOwogICAgICAgICRyZXM9UmVkX0l0ZW06OmNyZWF0ZShbJ3VybCc9PideL2thdGVnb3JpamEvc3ByZW5kaW1haS8/KC4qKSQnLCdhY3Rpb25fZGF0YSc9PlsndXJsJz0+Jy9zcHJlbmRpbWFpLyQxJ10sJ3JlZ2V4Jz0+dHJ1ZSwnZ3JvdXBfaWQnPT4oaW50KSRnLCdtYXRjaF90eXBlJz0+J3VybCcsJ2FjdGlvbl90eXBlJz0+J3VybCcsJ2FjdGlvbl9jb2RlJz0+MzAxLCd0aXRsZSc9PidTMTg1NyB0dXNjaWEga2F0ZWdvcmlqYSBzcHJlbmRpbWFpIC0+IHB1c2xhcGlhaSddKTsKICAgICAgICAkclsncmVkaXInXT1pc193cF9lcnJvcigkcmVzKT8kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpOidzdWt1cnRhJzsgfSBlbHNlICRyWydyZWRpciddPSdqYXUgeXJhICcuJGV4OwogICAgfSBlbHNlICRyWydyZWRpciddPSdSZWRpcmVjdGlvbiBrbGFzaXUgbmVyYSc7CiAgICAvLyA0KSBSaW5raW55cyAzNTM5MjogcGF2YWRpbmltYXMvdHJ1bXBhcyBhcHJhc3ltYXMgcGFnYWwgdGlrcmEgc3VkZXRpICgxeDIga2cgKyA1eDIwMCBnKSwgc2F1c28gbWFpc3RvIGFuYWxpdGlrYQogICAgJHA9Z2V0X3Bvc3QoMzUzOTIpOyB1cGRhdGVfb3B0aW9uKCdwc19iYWtfczE4NTdfMzUzOTInLFsndCc9PiRwLT5wb3N0X3RpdGxlLCdlJz0+JHAtPnBvc3RfZXhjZXJwdCwnYyc9PiRwLT5wb3N0X2NvbnRlbnRdLGZhbHNlKTsKICAgICR0Mj1zdHJfcmVwbGFjZSgnMiBrZyBzYXVzYXMgKyA0IGtvbnNlcnZhaScsJzIga2cgc2F1c2FzICsgNSBrb25zZXJ2YWknLCRwLT5wb3N0X3RpdGxlKTsKICAgICRlMj1zdHJfcmVwbGFjZSgnNCDDlyA0MDAgZyB0byBwYXRpZXMgYmFsdHltbyBrb25zZXJ2YWknLCc1IMOXIDIwMCBnIHRvIHBhdGllcyBiYWx0eW1vIGtvbnNlcnZhaScsJHAtPnBvc3RfZXhjZXJwdCk7CiAgICAkYz0kcC0+cG9zdF9jb250ZW50OyAkbj0wOwogICAgJGMyPXByZWdfcmVwbGFjZSgnLyhBbmFsaXRpbsSXcyBzdWRlZGFtb3Npb3MgZGFseXM6LnswLDQwMH0/KWJhbHR5bWFpKFxzfCZuYnNwO3w8W14+XSs+KSo4XHMqJSguezAsMzAwfT8pZHLEl2dtxJcoXHN8Jm5ic3A7fDxbXj5dKz4pKjc4XHMqJS9zdScsJ0FuYWxpdGluxJcgc3VkxJd0aXM6IGJhbHR5bWFpIDI0LDUgJSwgcmllYmFsYWkgMTIgJSwgxb5hbGlhIGzEhXN0ZWxpZW5hIDIsMyAlLCDFvmFsaSBwZWxlbmFpIDUgJSwgZHLEl2dtxJcgOCAlLCBrYWxjaXMgMSAlLCBmb3Nmb3JhcyAwLDggJScsJGMsMSwkbik7CiAgICAkclsna2l0X2FuYWxpdGlrYV9wYWtlaXN0YSddPSRuOwogICAgaWYoJG49PT0wKXsgJHBvcz1tYl9zdHJwb3MoJGMsJ2RyxJdnbcSXJyk7ICRyWydraXRfY3R4J109bWJfc3Vic3RyKCRjLG1heCgwLCRwb3MtNjAwKSw3MDApOyB9CiAgICAkdXBkPVsnSUQnPT4zNTM5MiwncG9zdF90aXRsZSc9PiR0MiwncG9zdF9leGNlcnB0Jz0+JGUyXTsgaWYoJG4pICR1cGRbJ3Bvc3RfY29udGVudCddPSRjMjsKICAgICRyWydraXRfdXBkJ109d3BfdXBkYXRlX3Bvc3QoJHVwZCx0cnVlKTsgJHJbJ2tpdF90aXRsZSddPSR0MjsgJHJbJ2tpdF9leGNlcnB0J109JGUyOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoMzUzOTIpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-181106';
const GKEY='ps_s1857h';
const PHASES=["1"];
const OUT='analize/s1857_h.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
