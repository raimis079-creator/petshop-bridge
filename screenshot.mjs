process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQyZSBBZHMgcGFnYWwga2FtcGFuaWphcyBpxaEgV0MgZmFrdMWzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MmUnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzQyZSddOwogICRxPWZ1bmN0aW9uKCRzcWwpIHVzZSAoJHdwZGIsJiRyKXsgJHg9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7IGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclsnU1FMX0VSUiddW109bWJfc3Vic3RyKCR3cGRiLT5sYXN0X2Vycm9yLDAsMjAwKTsgcmV0dXJuICR4OyB9OwogIHRyeXsKICAgICRyWydjb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEiKTsKICAgICRyWydwYXNrJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBNQVgoaXJhc3l0YV9hdCkgRlJPTSB7JFB9cHNfZmFrdF9yZWtsYW1hIFdIRVJFIGthbmFsYXM9J2dvb2dsZV9hZHMnIik7CiAgICAkaWRjPWluX2FycmF5KCdrYW1wYW5pamFfaWQnLCRyWydjb2xzJ10pPydrYW1wYW5pamFfaWQnOiInJyI7CiAgICAkclsna2FtcCddPSRxKCJTRUxFQ1QgJGlkYyBpZCwga2FtcGFuaWphIGssIE1JTihkaWVuYSkgbnVvLCBNQVgoZGllbmEpIGlraSwgU1VNKHBhcm9keW1haSkgcGFyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AsIFJPVU5EKFNVTShpc2xhaWRvc19jdCkvMTAwLDIpIGV1ciwgUk9VTkQoU1VNKGtvbnZlcnNpam9zKSwxKSBrb252IEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBBTkQgZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0yMycgQU5EICcyMDI2LTA5LTMwJyBHUk9VUCBCWSAxLDIgT1JERVIgQlkgZXVyIERFU0MiKTsKICAgICRyWydwel9kJ109JHEoIlNFTEVDVCBkaWVuYSwgJGlkYyBpZCwgcGFyb2R5bWFpIHBhciwgcGFzcGF1ZGltYWkgcGFzcCwgUk9VTkQoaXNsYWlkb3NfY3QvMTAwLDIpIGV1ciwga29udmVyc2lqb3Mga29udiBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEgV0hFUkUga2FuYWxhcz0nZ29vZ2xlX2FkcycgQU5EIGthbXBhbmlqYSBMSUtFICclZW5rbCUnIE9SREVSIEJZIGRpZW5hIik7CiAgICAkclsnZGllbmEnXT0kcSgiU0VMRUNUIGRpZW5hLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIsIFNVTShwYXNwYXVkaW1haSkgcGFzcCBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEgV0hFUkUga2FuYWxhcz0nZ29vZ2xlX2FkcycgQU5EIGRpZW5hPj0nMjAyNi0wOS0yMycgR1JPVVAgQlkgMSBPUkRFUiBCWSAxIik7CiAgICAkZz0iKHUuZ2NsaWQ8PicnIE9SIHUudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnIE9SIHUudXRtX3NvdXJjZT0nZ29vZ2xlJykiOwogICAgJHN1Yj0iKFNFTEVDVCBDT0FMRVNDRShTVU0ocy5rYWluYV92ZXplam9fY3QpLDApIEZST00geyRQfXBzX2Zha3Rfc2l1bnRvcyBzIFdIRVJFIHMudXpzYWt5bWFzX2lkPXUudXpzYWt5bWFzX2lkIEFORCBDT0FMRVNDRShzLnN0YXR1c2FzLCcnKTw+J2F0c2F1a3RhJykiOwogICAgJHQ9IkZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgV0hFUkUgdS50ZXN0aW5pcz0wIEFORCB1LnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycpIEFORCB1LnN1a3VydGFfYXQ+PScyMDI2LTA5LTIzJyI7CiAgICAkclsnd2Nfa2FtcCddPSRxKCJTRUxFQ1QgQ09BTEVTQ0UoTlVMTElGKHUudXRtX2NhbXBhaWduLCcnKSxJRih1LmdjbGlkPD4nJywnZ2NsaWRfYmVfdXRtJywnPycpKSBrLCBDT1VOVCgqKSBuLCBST1VORChTVU0odS52aXNvX2N0KS8xMDApIGV1ciwgUk9VTkQoU1VNKHUua29udHJpYnVjaWphX2N0KS8xMDAsMSkga29udHIsIFJPVU5EKFNVTSgkc3ViKS8xMDAsMSkgc2l1bnRhLCBTVU0odS5rbGllbnRhc19uYXVqYXMpIG5hdWppICR0IEFORCAkZyBHUk9VUCBCWSAxIE9SREVSIEJZIG4gREVTQyIpOwogICAgJHJbJ3djX2QnXT0kcSgiU0VMRUNUIERBVEUodS5zdWt1cnRhX2F0KSBkLCBDT1VOVCgqKSBuLCBTVU0oJGcpIGdfbiwgUk9VTkQoU1VNKElGKCRnLHUudmlzb19jdCwwKSkvMTAwKSBnX2V1ciwgUk9VTkQoU1VNKElGKCRnLHUua29udHJpYnVjaWphX2N0LDApKS8xMDAsMSkgZ19rb250ciwgUk9VTkQoU1VNKElGKCRnLCRzdWIsMCkpLzEwMCwxKSBnX3NpdW50YSwgU1VNKElGKCRnLHUua2xpZW50YXNfbmF1amFzLDApKSBnX25hdWppICR0IEdST1VQIEJZIDEgT1JERVIgQlkgMSIpOwogICAgLy8gbmF1am9zIGthbXBhbmlqb3MgdcW+c2FreW1haSBkZXRhbGlhaQogICAgJHJbJ3B6X3V6cyddPSRxKCJTRUxFQ1QgdS51enNha3ltYXNfaWQsIERBVEVfRk9STUFUKHUuc3VrdXJ0YV9hdCwnJW0tJWQgJUg6JWknKSB0LCB1LnV0bV9jYW1wYWlnbiwgdS51dG1fdGVybSwgUk9VTkQodS52aXNvX2N0LzEwMCwyKSBldXIsIFJPVU5EKHUua29udHJpYnVjaWphX2N0LzEwMCwxKSBrb250ciwgdS5rbGllbnRhc19uYXVqYXMgbmogJHQgQU5EIHUuc3VrdXJ0YV9hdD49JzIwMjYtMDktMjgnIEFORCAkZyBPUkRFUiBCWSB1LnN1a3VydGFfYXQiKTsKICAgIC8vIHNlc2lqb3MgacWhIEFkcyBwYWdhbCBrYW1wYW5pasSFIChhbmFsaXRpa2EpLCBqZWkgeXJhCiAgICAkdGI9JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc19hbmFsaXQlJyIpOyAkclsnYW5hbGl0X3RibCddPSR0YjsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-163732';
const GKEY='ps_s1742e';
const PHASES=["1"];
const OUT='analize/s1742_e.json';
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
