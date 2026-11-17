process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc2ZyBKb3NlcmEgcGVyIEFkcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzZnJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg3NmcnXTsKICB0cnl7CiAgJHJbJ3Jla2xfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfZmFrdF9yZWtsYW1hIik7CiAgJHJbJ3Jla2xfa2FuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FuYWxhcywgTUlOKGRpZW5hKSBtbiwgTUFYKGRpZW5hKSBteCwgQ09VTlQoKikgbiBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ2Fkc190YmwnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzXFxfYWRzJSciKTsKICBmb3JlYWNoKCRyWydhZHNfdGJsJ10gYXMgJHQpeyAkclsnYWRzX3QnXVskdF09Wydjb2xzJz0+JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0IiksJ24nPT4kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKV07IH0KICAkYXA9Z2V0X29wdGlvbigncHNfYWRzX3Bhc2t1dGluaXMnKTsgJHJbJ2Fkc19wYXNrJ109aXNfYXJyYXkoJGFwKT9hcnJheV9tYXAoZm4oJHYpPT5pc19zY2FsYXIoJHYpP21iX3N1YnN0cigoc3RyaW5nKSR2LDAsMjAwKTptYl9zdWJzdHIoanNvbl9lbmNvZGUoJHYsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSksMCw2MDApLCRhcCk6JGFwOwogICRyWydrYW1wX2lzbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGthbXBhbmlqYSwgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AsIFJPVU5EKFNVTShrb252ZXJzaWpvcyksMSkga29udiBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEgV0hFUkUga2FuYWxhcz0nZ29vZ2xlX2FkcycgQU5EIGRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMDknIEFORCAnMjAyNi0xMS0xNicgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgJGc9Iih1LmdjbGlkPD4nJyBPUiB1LnV0bV9jYW1wYWlnbiBSRUdFWFAgJ15bMC05XSskJyBPUiB1LnV0bV9zb3VyY2U9J2dvb2dsZScpIjsKICAkYmFzZT0iRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgdSBKT0lOIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBPTiBlLnV6c2FreW1hc19pZD11LnV6c2FreW1hc19pZCBXSEVSRSB1LnRlc3RpbmlzPTAgQU5EIHUuc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgQU5EIHUuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIjsKICAvLyBKb3NlcmEgZWlsdXRlcyBwYWdhbCBrYW5hbGEva2FtcGFuaWphCiAgJHJbJ2pvc19rYW1wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUYoJGcsQ09BTEVTQ0UoTlVMTElGKHUudXRtX2NhbXBhaWduLCcnKSwnZ2NsaWQnKSx1LmthbmFsYXNfcGFza3V0aW5pcykgaywgQ09VTlQoRElTVElOQ1QgdS51enNha3ltYXNfaWQpIHV6cywgU1VNKGUua2lla2lzKSB2bnQsIFJPVU5EKFNVTShlLmthaW5hX2N0KS8xMDAsMikgcGFqYW1vc19iZV9wdm0sIFJPVU5EKFNVTShlLmthaW5hX2N0LUNPQUxFU0NFKGUuc2F2aWthaW5hX2N0LDApKS8xMDAsMikgbWFyemEsIFNVTShlLnNhdmlrYWluYV9jdCBJUyBOVUxMKSBiZV9zYXYgJGJhc2UgQU5EIGUuYnJlbmRhc19zbHVnPSdqb3NlcmEnIEdST1VQIEJZIDEgT1JERVIgQlkgdXpzIERFU0MiLEFSUkFZX0EpOwogIC8vIEdvb2dsZSB1enNha3ltYWkgc3UgSm9zZXJhOiB2aXNhIHV6c2FreW1vIGtvbnRyaWJ1Y2lqYSBpciB2ZXplamFzLCBuYXVqaQogICRzdWI9IihTRUxFQ1QgQ09BTEVTQ0UoU1VNKHMua2FpbmFfdmV6ZWpvX2N0KSwwKSBGUk9NIHskUH1wc19mYWt0X3NpdW50b3MgcyBXSEVSRSBzLnV6c2FreW1hc19pZD11LnV6c2FreW1hc19pZCBBTkQgQ09BTEVTQ0Uocy5zdGF0dXNhcywnJyk8PidhdHNhdWt0YScpIjsKICAkclsnam9zX2dfdXpzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ09BTEVTQ0UoTlVMTElGKHUudXRtX2NhbXBhaWduLCcnKSwnZ2NsaWQnKSBrLCBDT1VOVCgqKSB1enMsIFJPVU5EKFNVTSh1LnZpc29fY3QpLzEwMCkgZXVyLCBST1VORChTVU0odS5rb250cmlidWNpamFfY3QpLzEwMCwyKSBrb250ciwgUk9VTkQoU1VNKCRzdWIpLzEwMCwyKSB2ZXplamFzLCBTVU0odS5rbGllbnRhc19uYXVqYXMpIG5hdWppIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgV0hFUkUgdS50ZXN0aW5pcz0wIEFORCB1LnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycpIEFORCB1LnN1a3VydGFfYXQ+PScyMDI2LTA5LTA5JyBBTkQgJGcgQU5EIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBXSEVSRSBlLnV6c2FreW1hc19pZD11LnV6c2FreW1hc19pZCBBTkQgZS5icmVuZGFzX3NsdWc9J2pvc2VyYScpIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogIC8vIEpvc2VyYSBkYWxpcyBHb29nbGUgdXpzYWt5bXVvc2UgcGFnYWwgbWVuCiAgJHJbJ2pvc19nX21lbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKHUuc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCBDT1VOVChESVNUSU5DVCB1LnV6c2FreW1hc19pZCkgdXpzLCBTVU0oZS5raWVraXMpIHZudCwgUk9VTkQoU1VNKGUua2FpbmFfY3QpLzEwMCkgcGFqLCBST1VORChTVU0oZS5rYWluYV9jdC1DT0FMRVNDRShlLnNhdmlrYWluYV9jdCwwKSkvMTAwKSBtYXJ6YSAkYmFzZSBBTkQgJGcgQU5EIGUuYnJlbmRhc19zbHVnPSdqb3NlcmEnIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogIC8vIEpvc2VyYSBwaXJraW5pYWkgaXMgR29vZ2xlOiBrb2tpb3MgcHJla2VzCiAgJHJbJ2pvc19nX3ByZWsnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBMRUZUKGUucGF2YWRpbmltYXNfdHVvX21ldHUsNDUpIHAsIFNVTShlLmtpZWtpcykgdm50LCBST1VORChTVU0oZS5rYWluYV9jdC1DT0FMRVNDRShlLnNhdmlrYWluYV9jdCwwKSkvMTAwLDIpIG1hcnphICRiYXNlIEFORCAkZyBBTkQgZS5icmVuZGFzX3NsdWc9J2pvc2VyYScgR1JPVVAgQlkgMSBPUkRFUiBCWSB2bnQgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgLy8gdmlzb3MgR29vZ2xlIHBhamFtb3MvbWFyemEgcGFseWdpbmltdWkKICAkclsnZ192aXNvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdS51enNha3ltYXNfaWQpIHV6cywgUk9VTkQoU1VNKGUua2FpbmFfY3QpLzEwMCkgcGFqLCBST1VORChTVU0oZS5rYWluYV9jdC1DT0FMRVNDRShlLnNhdmlrYWluYV9jdCwwKSkvMTAwKSBtYXJ6YSAkYmFzZSBBTkQgJGciLEFSUkFZX0EpOwogICRyWydqb3Nfa2l0aV9waXJrbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUuYnJlbmRhc19zbHVnIGIsIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIGUgV0hFUkUgZS51enNha3ltYXNfaWQgSU4gKFNFTEVDVCBESVNUSU5DVCBlMi51enNha3ltYXNfaWQgRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIGUyIEpPSU4geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgT04gdS51enNha3ltYXNfaWQ9ZTIudXpzYWt5bWFzX2lkIFdIRVJFIGUyLmJyZW5kYXNfc2x1Zz0nam9zZXJhJyBBTkQgdS5zdWt1cnRhX2F0Pj0nMjAyNi0wOS0wOScgQU5EICRnKSBBTkQgZS5icmVuZGFzX3NsdWc8Pidqb3NlcmEnIEdST1VQIEJZIDEgT1JERVIgQlkgbiBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBpZigkd3BkYi0+bGFzdF9lcnJvcikgJHJbJ3NxbF9lcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-095418';
const GKEY='ps_s1876g';
const PHASES=["1"];
const OUT='analize/s1876_g.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
