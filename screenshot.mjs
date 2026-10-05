process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzUzZSBBSSBrYW5hbG8gdXpzYWt5bWFpOiBzaWFuZGllbiArIGlzdG9yaWphIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc1M2UnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJFU9JFAuJ3BzX2Zha3RfdXpzYWt5bWFpJzsgJHI9Wyd2Jz0+J1MxNzUzZSddOwogICRhaT0iKHUua2FuYWxhc19waXJtYXM9J2FpJyBPUiB1LmthbmFsYXNfcGFza3V0aW5pcz0nYWknIE9SIHUucmVmZXJlcl9kb21lbmFzIFJFR0VYUCAnY2hhdGdwdHxvcGVuYWl8cGVycGxleGl0eXxnZW1pbml8Y29waWxvdHxjbGF1ZGV8YmluZy5jb20vY2hhdHx5b3UuY29tfHBvZS5jb20nIE9SIHUudXRtX3NvdXJjZSBSRUdFWFAgJ2NoYXRncHR8b3BlbmFpfHBlcnBsZXhpdHl8Z2VtaW5pfGNvcGlsb3R8Y2xhdWRlJykiOwogICRyWydrYW5hbGFpX3NpYW5kaWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FuYWxhc19waXJtYXMga3AsIGthbmFsYXNfcGFza3V0aW5pcyBrbCwgQ09VTlQoKikgbiBGUk9NICRVIHUgV0hFUkUgdS50ZXN0aW5pcz0wIEFORCB1LnN1a3VydGFfYXQ+PScyMDI2LTEwLTA0IDIxOjAwOjAwJyBHUk9VUCBCWSAxLDIiLEFSUkFZX0EpOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHUudXpzYWt5bWFzX2lkIGlkLCBEQVRFX0ZPUk1BVCh1LnN1a3VydGFfYXQrSU5URVJWQUwgMyBIT1VSLCclbS0lZCAlSDolaScpIHQsIHUuc3RhdHVzYXNfZ2FsdXRpbmlzIHN0LCBST1VORCh1LnZpc29fY3QvMTAwLDIpIGV1ciwgUk9VTkQodS5rb250cmlidWNpamFfY3QvMTAwLDIpIGtvbnRyLCB1LmtsaWVudGFzX25hdWphcyBuYXVqYXMsIHUua2xpZW50YXNfdXpzYWt5bW9fbnIgbnJfaywgdS5rYW5hbGFzX3Bpcm1hcyBrcCwgdS5rYW5hbGFzX3Bhc2t1dGluaXMga2wsIHUudXRtX3NvdXJjZSB1cywgdS5yZWZlcmVyX2RvbWVuYXMgcmVmLCBMRUZUKHUubGFuZGluZ191cmwsMTYwKSBsYW5kLCB1LmlyZW5naW55cyBpciwgdS5taWVzdGFzIEZST00gJFUgdSBXSEVSRSB1LnRlc3RpbmlzPTAgQU5EICRhaSBPUkRFUiBCWSB1LnN1a3VydGFfYXQiLEFSUkFZX0EpOwogIGZvcmVhY2goJHJvd3MgYXMgJiR4KXsgJG89d2NfZ2V0X29yZGVyKChpbnQpJHhbJ2lkJ10pOyBpZighJG8pIGNvbnRpbnVlOyAkeFsnbnInXT0kby0+Z2V0X29yZGVyX251bWJlcigpOyAkaXQ9W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpKSAkaXRbXT1tYl9zdWJzdHIoJGktPmdldF9uYW1lKCksMCw1MCkuJyDDlycuJGktPmdldF9xdWFudGl0eSgpOyAkeFsncHJla2VzJ109JGl0OwogICAgJHhbJ2F0dHInXT0kby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9zb3VyY2VfdHlwZScpLicgLyAnLiRvLT5nZXRfbWV0YSgnX3djX29yZGVyX2F0dHJpYnV0aW9uX3V0bV9zb3VyY2UnKS4nIC8gJy5tYl9zdWJzdHIoKHN0cmluZykkby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9yZWZlcnJlcicpLDAsODApLicgLyBwc2wgJy4kby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9zZXNzaW9uX3BhZ2VzJykuJyAvIHNlc2lqb3MgJy4kby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9zZXNzaW9uX2NvdW50Jyk7CiAgICAkeFsnZW50cnknXT1tYl9zdWJzdHIoKHN0cmluZykkby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9zZXNzaW9uX2VudHJ5JyksMCwxNjApOyAkeFsnc3RhcnQnXT0kby0+Z2V0X21ldGEoJ193Y19vcmRlcl9hdHRyaWJ1dGlvbl9zZXNzaW9uX3N0YXJ0X3RpbWUnKTsKICAgICRrPWpzb25fZGVjb2RlKChzdHJpbmcpJG8tPmdldF9tZXRhKCdfcHNfa2FuYWxhaScpLHRydWUpOyAkeFsna2FuYWxhaV9waXJtYXMnXT1pc19hcnJheSgkaykmJmlzc2V0KCRrWydwaXJtYXMnXSk/YXJyYXlfaW50ZXJzZWN0X2tleSgka1sncGlybWFzJ10sYXJyYXlfZmxpcChbJ3JlZmVyZXJfZG9tZW5hcycsJ2xhbmRpbmdfdXJsJywnbGFpa2FzJywna2FuYWxhcycsJ3V0bV9zb3VyY2UnXSkpOm51bGw7IH0KICAkclsnYWlfdXpzJ109JHJvd3M7CiAgJHJbJ2FpX3Zpc28nXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIGV1ciwgU1VNKGtsaWVudGFzX25hdWphcykgbmF1amksIE1JTihzdWt1cnRhX2F0KSBudW8gRlJPTSAkVSB1IFdIRVJFIHUudGVzdGluaXM9MCBBTkQgJGFpIixBUlJBWV9BKTsKICAkclsndmlzaV9udW9fdDAnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4gRlJPTSAkVSB1IFdIRVJFIHUudGVzdGluaXM9MCBBTkQgdS5zdWt1cnRhX2F0Pj0nMjAyNi0wOS0wOSciLEFSUkFZX0EpOwogIC8vIGxhbmt5bWFpIGlzIEFJIChwc193ZWJfaXZ5a2lhaSkKICAkVD0kUC4ncHNfd2ViX2l2eWtpYWknOyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJFQnIikpeyAkclsnYWlfc2VzaWpvc19kJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEgZCwgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzIEZST00gJFQgV0hFUkUgKGthbmFsYXM9J2FpJyBPUiByZWZlcmVyX2RvbWVuYXMgUkVHRVhQICdjaGF0Z3B0fG9wZW5haXxwZXJwbGV4aXR5fGdlbWluaXxjb3BpbG90fGNsYXVkZScpIEFORCBkaWVuYT49JzIwMjYtMDktMjAnIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnYWlfc2FsdGluaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcmVmZXJlcl9kb21lbmFzIHJkLCBzYWx0aW5pcyBzLCBDT1VOVChESVNUSU5DVCBzZXNpamEpIG4gRlJPTSAkVCBXSEVSRSAoa2FuYWxhcz0nYWknIE9SIHJlZmVyZXJfZG9tZW5hcyBSRUdFWFAgJ2NoYXRncHR8b3BlbmFpfHBlcnBsZXhpdHl8Z2VtaW5pfGNvcGlsb3R8Y2xhdWRlJykgQU5EIGRpZW5hPj0nMjAyNi0wOS0wOScgR1JPVVAgQlkgMSwyIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgICAkclsnYWlfbGFuZGluZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQobGFuZGluZyw5MCkgbCwgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBuIEZST00gJFQgV0hFUkUgKGthbmFsYXM9J2FpJyBPUiByZWZlcmVyX2RvbWVuYXMgUkVHRVhQICdjaGF0Z3B0fG9wZW5haXxwZXJwbGV4aXR5fGdlbWluaXxjb3BpbG90fGNsYXVkZScpIEFORCBkaWVuYT49JzIwMjYtMDktMDknIEdST1VQIEJZIDEgT1JERVIgQlkgbiBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-173753';
const GKEY='ps_s1753e';
const PHASES=["1"];
const OUT='out/s1753_e.json';
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
