process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY5YSBFeGNsdXNpb24gc2F2aWthaW5vcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjlhJ10pKSByZXR1cm47ICRyPVsndic9PidTMTg2OWEnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogICRFPWpzb25fZGVjb2RlKCdbIjgwMTEyNTkwMDAwNDAiLCAiODAxMTI1OTAwMDA3MSIsICI4MDExMjU5MDAwMDg4IiwgIjgwMTEyNTkwMDAxMzIiLCAiODAxMTI1OTAwMDE3MCIsICI4MDExMjU5MDAwMjI0IiwgIjgwMTEyNTkwMDAyNjIiLCAiODAxMTI1OTAwMDMwIiwgIjgwMTEyNTkwMDE4MTgiLCAiODAxMTI1OTAwMTg1NiIsICI4MDExMjU5MDAxOTYiLCAiODAxMTI1OTAwMTk3OSIsICI4MDExMjU5MDAyMDA2IiwgIjgwMTEyNTkwMDIwMSIsICI4MDExMjU5MDAyNDI2IiwgIjgwMTEyNTkwMDI0MzMiLCAiODAxMTI1OTAwMjQ1NyIsICI4MDExMjU5MDAyNDY0IiwgIjgwMTEyNTkwMDI0NzEiLCAiODAxMTI1OTAwMjQ4OCIsICI4MDExMjU5MDAyNDk1IiwgIjgwMTEyNTkwMDI1MDEiLCAiODAxMTI1OTAwMjUxOCIsICI4MDExMjU5MDAyNTI1IiwgIjgwMTEyNTkwMDI1MzIiLCAiODAxMTI1OTAwMjU0OSIsICI4MDExMjU5MDAyNTU2IiwgIjgwMTEyNTkwMDI1NjMiLCAiODAxMTI1OTAwMjU3MCIsICI4MDExMjU5MDAyNTg3IiwgIjgwMTEyNTkwMDI1OTQiLCAiODAxMTI1OTAwMjYxNyIsICI4MDExMjU5MDAyNjI0IiwgIjgwMTEyNTkwMDI2MzEiLCAiODAxMTI1OTAwMjY4NiIsICI4MDExMjU5MDAyNjkzIiwgIjgwMTEyNTkwMDI3MDkiLCAiODAxMTI1OTAwMjcxNiIsICI4MDExMjU5MDAyNzIzIiwgIjgwMTEyNTkwMDI3MzAiLCAiODAxMTI1OTAwMjgyMiIsICI4MDExMjU5MDAyODM5IiwgIjgwMTEyNTkwMDI4NDYiLCAiODAxMTI1OTAwMjg1MyIsICI4MDExMjU5MDAyODgiLCAiODAxMTI1OTAwMjkzOCIsICI4MDExMjU5MDAyOTQ1IiwgIjgwMTEyNTkwMDI5NTIiLCAiODAxMTI1OTAwMjk2OSIsICI4MDExMjU5MDAyOTc2IiwgIjgwMTEyNTkwMDI5ODMiLCAiODAxMTI1OTAwMjk5MCIsICI4MDExMjU5MDAzMDY1IiwgIjgwMTEyNTkwMDMxMDIiLCAiODAxMTI1OTAwMzExOSIsICI4MDExMjU5MDAzMTI2IiwgIjgwMTEyNTkwMDMxMzMiLCAiODAxMTI1OTAwMzE0MCIsICI4MDExMjU5MDAzMTU3IiwgIjgwMTEyNTkwMDMyMzIiLCAiODAxMTI1OTAwMzI0OSIsICI4MDExMjU5MDAzMjU2IiwgIjgwMTEyNTkwMDM0OTIiLCAiODAxMTI1OTAwMzUwOCIsICI4MDExMjU5MDAzNTE1IiwgIjgwMTEyNTkwMDM1MjIiLCAiODAxMTI1OTAwMzUzOSIsICI4MDExMjU5MDAzNTQ2IiwgIjgwMTEyNTkwMDM1NTMiLCAiODAxMTI1OTAwMzY1MiIsICI4MDExMjU5MDAzNjY5IiwgIjgwMTEyNTkwMDM2ODMiLCAiODAxMTI1OTAwMzcwNiIsICI4MDExMjU5MDAzNzEzIiwgIjgwMTEyNTkwMDM3NDQiLCAiODAxMTI1OTAwMzc1MSIsICI4MDExMjU5MDAzNzc1IiwgIjgwMTEyNTkwMDM3ODIiLCAiODAxMTI1OTAwMzc5OSIsICI4MDExMjU5MDAzODA1IiwgIjgwMTEyNTkwMDM4MjkiLCAiODAxMTI1OTAwMzg1MCIsICI4MDExMjU5MDAzODY3IiwgIjgwMTEyNTkwMDM4NzQiLCAiODAxMTI1OTAwMzg4MSIsICI4MDExMjU5MDAzODk4IiwgIjgwMTEyNTkwMDM5MCIsICI4MDExMjU5MDAzOTEiLCAiODAxMTI1OTAwMzkyIiwgIjgwMTEyNTkwMDM5MyIsICI4MDExMjU5MDAzOTQiLCAiODAxMTI1OTAwMzk1OSIsICI4MDExMjU5MDAzOTY2IiwgIjgwMTEyNTkwMDM5NzMiLCAiODAxMTI1OTAwNDAwMCIsICI4MDExMjU5MDA0MDMxIiwgIjgwMTEyNTkwMDQwNDgiLCAiODAxMTI1OTAwNDA1NSIsICI4MDExMjU5MDA0MDYyIiwgIjgwMTEyNTkwMDQyMDgiLCAiODAxMTI1OTAwNDIxNSIsICI4MDExMjU5MDA0MjIyIiwgIjgwMTEyNTkwMDQyMzkiLCAiODAxMTI1OTAwNDI2MCIsICI4MDExMjU5MDA0Mjc3IiwgIjgwMTEyNTkwMDQyODQiLCAiODAxMTI1OTAwNDI5MSIsICI4MDExMjU5MDA0MzA3IiwgIjgwMTEyNTkwMDQzMjEiLCAiODAxMTI1OTAwNDMzOCIsICI4MDExMjU5MDA0MzQiLCAiODAxMTI1OTAwNDM1MiIsICI4MDExMjU5MDA0MzY5IiwgIjgwMTEyNTkwMDQzNzYiLCAiODAxMTI1OTAwNDM5MCIsICI4MDExMjU5MDA0NDA2IiwgIjgwMTEyNTkwMDQ0MTMiLCAiODAxMTI1OTAwNDQyMCIsICI4MDExMjU5MDA0NDM3IiwgIjgwMTEyNTkwMDQ0NDQiLCAiODAxMTI1OTAwNDQ1MSIsICI4MDExMjU5MDA0NDY4IiwgIjgwMTEyNTkwMDQ0ODIiLCAiODAxMTI1OTAwNDUzIiwgIjgwMTEyNTkwMTEyMjAiLCAiODAxMTI1OTAxMTM1IiwgIjgwMTEyNTkwMTEzNyIsICI4MDExMjU5MDExMzgxIiwgIjgwMTEyNTkwMTE0MDQiLCAiODAxMTI1OTAxMTQ0IiwgIjgwMTEyNTkwMTE0NyIsICI4MDExMjU5MTYzNzUiLCAiODAxMTI1OTE5Mzc1IiwgIjgwMTEyNTkyMTM3NSJdJyx0cnVlKTsgJGluPSInIi5pbXBsb2RlKCInLCciLGFycmF5X21hcCgnZXNjX3NxbCcsJEUpKS4iJyI7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHAuSUQgRlJPTSB7JFB9cG9zdHMgcCBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV92YWx1ZSBJTiAoJGluKSBXSEVSRSBwLnBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIEFORCAobS5tZXRhX2lkIElTIE5PVCBOVUxMIE9SIHAucG9zdF90aXRsZSBMSUtFICclRXhjbHVzaW9uJScpIik7CiAgJG91dD1bXTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgICRtPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5IGssIG1ldGFfdmFsdWUgdiBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVjb3N0JSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlZWFuJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlYmFyY29kZSUlJyBPUiBtZXRhX2tleSBJTiAoJ19nbG9iYWxfdW5pcXVlX2lkJywnX3ByaWNlJywnX3JlZ3VsYXJfcHJpY2UnLCdfc2FsZV9wcmljZScsJ19za3UnLCdfcHNfc2FuZGVsaXMnLCdfcHNfc2FsZXNfMzY1ZCcsJ19wc19zYWxlc185MGQnLCdfc3RvY2snLCdfc3RvY2tfc3RhdHVzJywnX3BzX3JldmVudWVfMzY1ZCcsJ19wc19vcmRlcnNfMzY1ZCcsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnKSkgIiwkaWQpLEFSUkFZX0EpOwogICAgJG1tPVtdOyBmb3JlYWNoKCRtIGFzICR4KXsgaWYoc3RybGVuKCR4Wyd2J10pPDgwKSAkbW1bJHhbJ2snXV09JHhbJ3YnXTsgfQogICAgJHA9Z2V0X3Bvc3QoJGlkKTsKICAgICRvdXRbXT1bJ2lkJz0+KGludCkkaWQsJ3QnPT4kcC0+cG9zdF90aXRsZSwnc3QnPT4kcC0+cG9zdF9zdGF0dXMsJ3R5cGUnPT4kcC0+cG9zdF90eXBlLCdtJz0+JG1tXTsKICB9CiAgJHJbJ24nXT1jb3VudCgkb3V0KTsgJHJbJ3Jvd3MnXT0kb3V0OwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-080738';
const GKEY='ps_s1869a';
const PHASES=["1"];
const OUT='analize/s1869_a.json';
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
