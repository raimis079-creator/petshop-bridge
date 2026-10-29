process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA5YiBrYXNhIGJlIHBpcmtpbW8g4oCUIDE0IGQuIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwOWInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJFQ9JFAuJ3BzX3dlYl9pdnlraWFpJzsgJHI9Wyd2Jz0+J1MxODA5YiddOwogIHRyeXsKICAgICRudW89Z21kYXRlKCdZLW0tZCBIOmk6cycsdGltZSgpLTE0Kjg2NDAwKTsgJFc9ImxhaWthcz49J3skbnVvfScgQU5EIHRlc3RpbmlzPTAgQU5EIHNhbHRpbmlzX2FwbGlua2E9J3Byb2QnIjsKICAgICRyWydwdXNsX3RpcGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHVzbF90aXBhcywgQ09VTlQoKikgbiwgQ09VTlQoRElTVElOQ1QgbGFua3l0b2phc19kKSBsYW5rIEZST00geyRUfSBXSEVSRSB7JFd9IEFORCB0aXBhcz0ncGFnZXZpZXcnIEdST1VQIEJZIHB1c2xfdGlwYXMgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAgICRyWydrYXNhX3VybCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENBU0UgV0hFTiB1cmxfa2VsaWFzIExJS0UgJy9rYXNhL29yZGVyLXJlY2VpdmVkJScgVEhFTiAnb3JkZXItcmVjZWl2ZWQnIFdIRU4gdXJsX2tlbGlhcyBMSUtFICcva2FzYS9vcmRlci1wYXklJyBUSEVOICdvcmRlci1wYXknIFdIRU4gdXJsX2tlbGlhcyBMSUtFICcva2FzYS8lJyBPUiB1cmxfa2VsaWFzPScva2FzYScgVEhFTiAna2FzYScgRUxTRSB1cmxfa2VsaWFzIEVORCBrLCBwdXNsX3RpcGFzLCBDT1VOVCgqKSBuLCBDT1VOVChESVNUSU5DVCBsYW5reXRvamFzX2QpIGxhbmsgRlJPTSB7JFR9IFdIRVJFIHskV30gQU5EIHRpcGFzPSdwYWdldmlldycgQU5EIHVybF9rZWxpYXMgTElLRSAnL2thc2ElJyBHUk9VUCBCWSBrLHB1c2xfdGlwYXMgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAgIC8vIGxhbmt5dG9qYWkgc3UgL2thc2EvIChuZSBvcmRlci0qKSBpciBhciB0dXJpIGFjaXUKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhbmt5dG9qYXNfZCBsLCBkaWVuYSwgTUlOKGxhaWthcykgcGlybSwgU1VNKHVybF9rZWxpYXMgTk9UIExJS0UgJy9rYXNhL29yZGVyLSUnKSBrYXNhX24sIFNVTSh1cmxfa2VsaWFzIExJS0UgJy9rYXNhL29yZGVyLXJlY2VpdmVkJScpIGFjaXVfbiwgU1VNKHVybF9rZWxpYXMgTElLRSAnL2thc2Evb3JkZXItcGF5JScpIHBheV9uLCBNQVgoaXJlbmdpbnlzKSBpciwgTUFYKGthbmFsYXMpIGthbiwgTUFYKHByaXNpanVuZ2VzKSBwcnMgRlJPTSB7JFR9IFdIRVJFIHskV30gQU5EIHRpcGFzPSdwYWdldmlldycgQU5EIHVybF9rZWxpYXMgTElLRSAnL2thc2ElJyBHUk9VUCBCWSBsYW5reXRvamFzX2QsIGRpZW5hIixBUlJBWV9BKTsKICAgICRzPVsnbGFua3l0b2p1X2RpZW51X3N1X2thc2EnPT4wLCdzdV9hY2l1Jz0+MCwnYmVfYWNpdSc9PjAsJ2JlX2FjaXVfdGlrXzFfcGVyeml1cmEnPT4wLCdiZV9hY2l1X3BheSc9PjBdOyAkYmU9W107IAogICAgZm9yZWFjaCgkcm93cyBhcyAkeCl7IGlmKChpbnQpJHhbJ2thc2FfbiddPD0wKSBjb250aW51ZTsgJHNbJ2xhbmt5dG9qdV9kaWVudV9zdV9rYXNhJ10rKzsgaWYoKGludCkkeFsnYWNpdV9uJ10+MCl7ICRzWydzdV9hY2l1J10rKzsgY29udGludWU7IH0gJHNbJ2JlX2FjaXUnXSsrOyBpZigoaW50KSR4WydrYXNhX24nXT09PTEpICRzWydiZV9hY2l1X3Rpa18xX3BlcnppdXJhJ10rKzsgaWYoKGludCkkeFsncGF5X24nXT4wKSAkc1snYmVfYWNpdV9wYXknXSsrOyAkYmVbXT0keDsgfQogICAgJHJbJ3N1dmVzdGluZSddPSRzOwogICAgLy8gYmUgYWNpdTogaXJlbmdpbnlzLCBrYW5hbGFzLCBhciB0dXJlam8gYWRkX3RvX2NhcnQsIGxhaWthcyBrYXNvamUsIGtpdGFzIGl2eWtpcyBwbyBrYXNvcwogICAgJGFncj1bJ2lyJz0+W10sJ2thbic9PltdLCdhZGRfdG9fY2FydCc9PjAsJ2JlX2FkZCc9PjAsJ3RydWttZSc9PlsnPDEwcyc9PjAsJzEwLTYwcyc9PjAsJzEtNW1pbic9PjAsJz41bWluL3Bhc2t1dGluaXMnPT4wXSwncG9fa2Fzb3MnPT5bXV07ICRwdj1bXTsKICAgIGZvcmVhY2goJGJlIGFzICR4KXsgJGFnclsnaXInXVskeFsnaXInXV09KCRhZ3JbJ2lyJ11bJHhbJ2lyJ11dPz8wKSsxOyAkYWdyWydrYW4nXVskeFsna2FuJ11dPSgkYWdyWydrYW4nXVskeFsna2FuJ11dPz8wKSsxOwogICAgICAkYXRjPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskVH0gV0hFUkUgbGFua3l0b2phc19kPSVzIEFORCBkaWVuYT0lcyBBTkQgdGlwYXM9J2FkZF90b19jYXJ0JyIsJHhbJ2wnXSwkeFsnZGllbmEnXSkpOyBpZigkYXRjKSAkYWdyWydhZGRfdG9fY2FydCddKys7IGVsc2UgJGFnclsnYmVfYWRkJ10rKzsKICAgICAgJGs9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBsYWlrYXMgRlJPTSB7JFR9IFdIRVJFIGxhbmt5dG9qYXNfZD0lcyBBTkQgZGllbmE9JXMgQU5EIHRpcGFzPSdwYWdldmlldycgQU5EIHVybF9rZWxpYXMgTElLRSAnL2thc2ElJScgQU5EIHVybF9rZWxpYXMgTk9UIExJS0UgJy9rYXNhL29yZGVyLSUlJyBPUkRFUiBCWSBsYWlrYXMgREVTQyBMSU1JVCAxIiwkeFsnbCddLCR4WydkaWVuYSddKSxBUlJBWV9BKTsKICAgICAgJG54PSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbGFpa2FzLCB0aXBhcywgcHVzbF90aXBhcywgTEVGVCh1cmxfa2VsaWFzLDYwKSB1IEZST00geyRUfSBXSEVSRSBsYW5reXRvamFzX2Q9JXMgQU5EIGxhaWthcz4lcyBBTkQgdGlwYXM9J3BhZ2V2aWV3JyBPUkRFUiBCWSBsYWlrYXMgTElNSVQgMSIsJHhbJ2wnXSwka1snbGFpa2FzJ10pLEFSUkFZX0EpOwogICAgICBpZigkbngpeyAkZD1zdHJ0b3RpbWUoJG54WydsYWlrYXMnXSktc3RydG90aW1lKCRrWydsYWlrYXMnXSk7ICRiPSRkPDEwPyc8MTBzJzooJGQ8NjA/JzEwLTYwcyc6KCRkPDMwMD8nMS01bWluJzonPjVtaW4vcGFza3V0aW5pcycpKTsgJGFnclsncG9fa2Fzb3MnXVskbnhbJ3B1c2xfdGlwYXMnXV09KCRhZ3JbJ3BvX2thc29zJ11bJG54WydwdXNsX3RpcGFzJ11dPz8wKSsxOyB9IGVsc2UgeyAkYj0nPjVtaW4vcGFza3V0aW5pcyc7ICRhZ3JbJ3BvX2thc29zJ11bJyhuaWVrYXMpJ109KCRhZ3JbJ3BvX2thc29zJ11bJyhuaWVrYXMpJ10/PzApKzE7IH0KICAgICAgJGFnclsndHJ1a21lJ11bJGJdKys7CiAgICAgIGlmKGNvdW50KCRwdik8MTUpICRwdltdPVskeFsnZGllbmEnXSxzdWJzdHIoJHhbJ2wnXSwwLDgpLCR4WydpciddLCR4WydrYW4nXSwkeFsna2FzYV9uJ10sJGF0Yywkbng/KCRueFsncHVzbF90aXBhcyddLicgJy4kbnhbJ3UnXS4nICsnLihzdHJ0b3RpbWUoJG54WydsYWlrYXMnXSktc3RydG90aW1lKCRrWydsYWlrYXMnXSkpLidzJyk6Jy0nXTsgfQogICAgJHJbJ2JlX2FjaXVfYW5hbGl6ZSddPSRhZ3I7ICRyWydwYXZ5emR6aWFpJ109JHB2OwogICAgLy8gV0MgdXpzYWt5bWFpIHBlciAxNCBkLgogICAgJHJbJ3V6c2FreW1haSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgZGF0ZV9jcmVhdGVkX2dtdD49J3skbnVvfScgQU5EIHR5cGU9J3Nob3Bfb3JkZXInIEdST1VQIEJZIHN0YXR1cyBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ2RpZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGRpZW5hLCBDT1VOVChESVNUSU5DVCBDQVNFIFdIRU4gdXJsX2tlbGlhcyBOT1QgTElLRSAnL2thc2Evb3JkZXItJScgVEhFTiBsYW5reXRvamFzX2QgRU5EKSBrYXNhLCBDT1VOVChESVNUSU5DVCBDQVNFIFdIRU4gdXJsX2tlbGlhcyBMSUtFICcva2FzYS9vcmRlci1yZWNlaXZlZCUnIFRIRU4gbGFua3l0b2phc19kIEVORCkgYWNpdSBGUk9NIHskVH0gV0hFUkUgeyRXfSBBTkQgdGlwYXM9J3BhZ2V2aWV3JyBBTkQgdXJsX2tlbGlhcyBMSUtFICcva2FzYSUnIEdST1VQIEJZIGRpZW5hIE9SREVSIEJZIGRpZW5hIixBUlJBWV9BKTsKICAgICRyWyd2aWRpbmlhaSddPWdldF9vcHRpb24oJ3BzX3dlYl92aWRpbmlhaV9pcCcpPyd5cmEnOiduZXJhJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-130729';
const GKEY='ps_s1809b';
const PHASES=["1"];
const OUT='analize/s1809b.json';
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
