process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0dDEgc2thbsSXc3TFsyBwYWllxaFrYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjR0MSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyNHQxJ107CiAgZm9yZWFjaChbJzU5MDcxODQ5MTMwNzAnLCc1OTA3NTE4MzM2ODM0JywnNTkwNzUxODMzNjg1OCcsJzU5MDcxODQ5MTMyMTYnLCc1OTA3MTg0OTEzMjQ3JywnNTkwNzE4NDkxMzA5NCddIGFzICRlKXsgJHJbJ2VhbiddWyRlXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwLklELHAucG9zdF9zdGF0dXMscC5wb3N0X3RpdGxlIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfdmFsdWU9JXMgQU5EIHAucG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgTElNSVQgMyIsJGUpLEFSUkFZX0EpOyB9CiAgJHJbJ3ZhcmRhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3Rfc3RhdHVzLHBvc3RfdGl0bGUgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgKHBvc3RfdGl0bGUgTElLRSAnJURvYnJlIFNtYWtpJScgT1IgcG9zdF90aXRsZSBMSUtFICclQWRCaSUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJcW7ZWJlcmthJScpIExJTUlUIDEwIixBUlJBWV9BKTsKICAkdD1nZXRfdGVybV9ieSgnc2x1ZycsJ3NrYW5lc3RhaS1zdW5pbXMnLCdwcm9kdWN0X2NhdCcpOyAkclsna2F0J109JHQ/WyR0LT50ZXJtX2lkLCR0LT5uYW1lLCR0LT5jb3VudF06bnVsbDsKICAkclsna2F0X3ZhaWthaSddPSR0P2FycmF5X21hcChmdW5jdGlvbigkYyl7JHg9Z2V0X3Rlcm0oJGMsJ3Byb2R1Y3RfY2F0Jyk7cmV0dXJuIFskeC0+dGVybV9pZCwkeC0+c2x1ZywkeC0+bmFtZSwkeC0+Y291bnRdO30sZ2V0X3Rlcm1fY2hpbGRyZW4oJHQtPnRlcm1faWQsJ3Byb2R1Y3RfY2F0JykpOltdOwogICRpZHM9Z2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4zLCdmaWVsZHMnPT4naWRzJywnb3JkZXJieSc9PidkYXRlJywnb3JkZXInPT4nREVTQycsJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+J3NrYW5lc3RhaS1zdW5pbXMnXV1dKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9Z2V0X3Bvc3QoJGlkKTsgJHJbJ3B2eiddW109WydpZCc9PiRpZCwndCc9PiRwLT5wb3N0X3RpdGxlLCdleGMnPT5tYl9zdWJzdHIoJHAtPnBvc3RfZXhjZXJwdCwwLDQwMCksJ2MnPT5tYl9zdWJzdHIoJHAtPnBvc3RfY29udGVudCwwLDIwMDApLCdjYXRzJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nc2x1Z3MnXSksJ2JyYW5kJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKSwnYXR0cnMnPT5hcnJheV9rZXlzKChhcnJheSlnZXRfcG9zdF9tZXRhKCRpZCwnX3Byb2R1Y3RfYXR0cmlidXRlcycsdHJ1ZSkpLCd3Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ193ZWlnaHQnLHRydWUpXTsgfQogICRyWydicmFuZHMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHQpe3JldHVybiBbJHQtPnRlcm1faWQsJHQtPm5hbWVdO30sZ2V0X3Rlcm1zKFsndGF4b25vbXknPT4ncHJvZHVjdF9icmFuZCcsJ2hpZGVfZW1wdHknPT5mYWxzZSwnc2VhcmNoJz0+J3NtYWsnXSkgPzogW10pOwogICRyWydicmFuZHMyJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR0KXtyZXR1cm4gWyR0LT50ZXJtX2lkLCR0LT5uYW1lXTt9LGdldF90ZXJtcyhbJ3RheG9ub215Jz0+J3Byb2R1Y3RfYnJhbmQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UsJ3NlYXJjaCc9PidhZGJpJ10pID86IFtdKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-094749';
const GKEY='ps_s1824t1';
const PHASES=["1"];
const OUT='analize/s1824_t1.json';
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
