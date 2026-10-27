process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA0YyBaQiBwcmVrZXMsIGRpbmd1c2lvcyBpcyBmZWVkIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwNGMnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODA0YyddOwogIHRyeXsKICAgIGZvcmVhY2goWzIsM10gYXMgJGlkKXsgJHJvdz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLGl0ZXJhdGlvbixsYXN0X2FjdGl2aXR5IEZST00geyRQfXBteGlfaW1wb3J0cyBXSEVSRSBpZD0kaWQiLEFSUkFZX0EpOyAkbz1tYXliZV91bnNlcmlhbGl6ZSgkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JFB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPSRpZCIpKTsKICAgICAgJGs9W107IGZvcmVhY2goKGFycmF5KSRvIGFzICRraz0+JHZ2KXsgaWYocHJlZ19tYXRjaCgnL21pc3Npbmd8ZGVsZXRlfGRyYWZ0fHNraXB8dW5jaGFuZ2VkL2knLCRraykpICRrWyRra109aXNfc2NhbGFyKCR2dik/JHZ2Ompzb25fZW5jb2RlKCR2dik7IH0KICAgICAgJHJvd1snbWlzc2luZ19vcHRzJ109JGs7ICRyb3dbJ2l0ZXJfcGFzaXNraXJzdHltYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpdGVyYXRpb24sIENPVU5UKCopIG4gRlJPTSB7JFB9cG14aV9wb3N0cyBXSEVSRSBpbXBvcnRfaWQ9JGlkIEdST1VQIEJZIGl0ZXJhdGlvbiBPUkRFUiBCWSBpdGVyYXRpb24gREVTQyBMSU1JVCA4IixBUlJBWV9BKTsgJHJbJ2ltcCcuJGlkXT0kcm93OyB9CiAgICAkaXQzPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBpdGVyYXRpb24gRlJPTSB7JFB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiKTsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBwLnBvc3RfaWQsIHBwLml0ZXJhdGlvbiwgcC5wb3N0X3N0YXR1cywgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cHAucG9zdF9pZCBBTkQgbWV0YV9rZXk9J19zdG9jaycgTElNSVQgMSkgc3QsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBwLnBvc3RfaWQgQU5EIG1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBMSU1JVCAxKSBzcywgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cHAucG9zdF9pZCBBTkQgbWV0YV9rZXk9J196Yl9sYXN0X3N5bmMnIExJTUlUIDEpIGxzLCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcC5wb3N0X2lkIEFORCBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBMSU1JVCAxKSBzYW5kIEZST00geyRQfXBteGlfcG9zdHMgcHAgSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPXBwLnBvc3RfaWQgV0hFUkUgcHAuaW1wb3J0X2lkPTMgQU5EIHBwLml0ZXJhdGlvbiA8ICIuKCRpdDMtMiksQVJSQVlfQSk7CiAgICAkclsnZGluZ3VzaXVfbiddPWNvdW50KCRyb3dzKTsgJHNrPVsncHVibGlzaF9pbnN0b2NrJz0+MCwncHVibGlzaF9vdXQnPT4wLCdraXRhJz0+MF07ICRwdj1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCl7IGlmKCR4Wydwb3N0X3N0YXR1cyddPT09J3B1Ymxpc2gnICYmICR4WydzcyddPT09J2luc3RvY2snKXsgJHNrWydwdWJsaXNoX2luc3RvY2snXSsrOyBpZihjb3VudCgkcHYpPDI1KSAkcHZbXT1bJHhbJ3Bvc3RfaWQnXSxnZXRfcG9zdF9tZXRhKCR4Wydwb3N0X2lkJ10sJ19za3UnLHRydWUpLG1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCR4Wydwb3N0X2lkJ10pLDAsNTUpLCR4WydzdCddLCR4WydzYW5kJ10sJHhbJ2xzJ10sJHhbJ2l0ZXJhdGlvbiddXTsgfSBlbHNlaWYoJHhbJ3Bvc3Rfc3RhdHVzJ109PT0ncHVibGlzaCcpICRza1sncHVibGlzaF9vdXQnXSsrOyBlbHNlICRza1sna2l0YSddKys7IH0KICAgICRyWydkaW5ndXNpdV9zdXZlc3RpbmUnXT0kc2s7ICRyWydpbnN0b2NrX3Bhdnl6ZHppYWknXT0kcHY7CiAgICAkaD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxkYXRlLHN1bW1hcnkgRlJPTSB7JFB9cG14aV9oaXN0b3J5IFdIRVJFIGltcG9ydF9pZD0zIE9SREVSIEJZIGlkIEFTQyBMSU1JVCAzIixBUlJBWV9BKTsgJHJbJ2ltcDNfc2VuaWF1c2lhX2lzdCddPSRoOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-194846';
const GKEY='ps_s1804c';
const PHASES=["1"];
const OUT='analize/s1804c.json';
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
