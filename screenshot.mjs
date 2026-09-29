process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwZCBwcmVrZXMgcHVzbGFwaW8gcGlsdHV2ZWxpcyByZWNvbiAoMSByZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MGQnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzQwZCddOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3NDBkJywnZmF6ZSc9PiRmXTsgJFQ9JHdwZGItPnByZWZpeC4ncHNfd2ViX2l2eWtpYWknOwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkbnVvPWRhdGUoJ1ktbS1kJyxzdHJ0b3RpbWUoJy0yMSBkYXlzJykpOyAkaWtpPWRhdGUoJ1ktbS1kJyxzdHJ0b3RpbWUoJy0xIGRheScpKTsgJHJbJ2xhaWtvdGFycGlzJ109WyRudW8sJGlraV07CiAgICAkclsnaXJlbmdpbmlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlyZW5naW55cywgQ09VTlQoKikgbiBGUk9NICRUIFdIRVJFIGRpZW5hIEJFVFdFRU4gJXMgQU5EICVzIEdST1VQIEJZIDEiLCRudW8sJGlraSksQVJSQVlfQSk7CiAgICAkd3BkYi0+cXVlcnkoIkRST1AgVEVNUE9SQVJZIFRBQkxFIElGIEVYSVNUUyBwc190bXBfYm90Iik7CiAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkNSRUFURSBURU1QT1JBUlkgVEFCTEUgcHNfdG1wX2JvdCAobCBWQVJDSEFSKDY0KSBQUklNQVJZIEtFWSkgU0VMRUNUIGxhbmt5dG9qYXNfZCBsIEZST00gJFQgV0hFUkUgZGllbmEgQkVUV0VFTiAlcyBBTkQgJXMgQU5EICh0ZXN0aW5pcz0wIE9SIHRlc3RpbmlzIElTIE5VTEwpIEdST1VQIEJZIGxhbmt5dG9qYXNfZCBIQVZJTkcgU1VNKHRpcGFzPSdwYWdldmlldycpPD0xIEFORCBTVU0odGlwYXM9J2FkZF90b19jYXJ0Jyk+PTEiLCRudW8sJGlraSkpOwogICAgJFc9JHdwZGItPnByZXBhcmUoImRpZW5hIEJFVFdFRU4gJXMgQU5EICVzIEFORCAodGVzdGluaXM9MCBPUiB0ZXN0aW5pcyBJUyBOVUxMKSBBTkQgbGFua3l0b2phc19kIE5PVCBJTiAoU0VMRUNUIGwgRlJPTSBwc190bXBfYm90KSIsJG51bywkaWtpKTsKICAgIC8vIGl2eWtpdSB0aXBhaSBwcmVrZXMgcHVzbGFweWplIHBhZ2FsIGlyZW5naW5pCiAgICAkclsndGlwYWlfcHJla2VqZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlyZW5naW55cywgdGlwYXMsIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgbGFuaywgQ09VTlQoKikgbiBGUk9NICRUIFdIRVJFICRXIEFORCBwdXNsX3RpcGFzPSdwcmVrZScgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsbGFuayBERVNDIixBUlJBWV9BKTsKICAgIC8vIHByZWtpdSBwdXNsYXBpdSBsYW5reXRvamFpIGlyIEFUQyBwYWdhbCBrYW5hbGEgKHRlbGVmb25hcykKICAgICRyWydrYW5hbGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FuYWxhcywgaXJlbmdpbnlzLCBDT1VOVChESVNUSU5DVCBDQVNFIFdIRU4gdGlwYXM9J3BhZ2V2aWV3JyBUSEVOIGxhbmt5dG9qYXNfZCBFTkQpIGxhbmssIENPVU5UKERJU1RJTkNUIENBU0UgV0hFTiB0aXBhcz0nYWRkX3RvX2NhcnQnIFRIRU4gbGFua3l0b2phc19kIEVORCkgYXRjIEZST00gJFQgV0hFUkUgJFcgQU5EIHB1c2xfdGlwYXM9J3ByZWtlJyBHUk9VUCBCWSAxLDIgSEFWSU5HIGxhbms+PTE1IE9SREVSIEJZIGxhbmsgREVTQyIsQVJSQVlfQSk7CiAgICAvLyB0b3AgcHJla2VzIHRlbGVmb25lCiAgICAkclsndG9wX3RlbGVmb25hcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHVybF9rZWxpYXMgdSwgQ09VTlQoRElTVElOQ1QgQ0FTRSBXSEVOIHRpcGFzPSdwYWdldmlldycgVEhFTiBsYW5reXRvamFzX2QgRU5EKSBsYW5rLCBDT1VOVChESVNUSU5DVCBDQVNFIFdIRU4gdGlwYXM9J2FkZF90b19jYXJ0JyBUSEVOIGxhbmt5dG9qYXNfZCBFTkQpIGF0YyBGUk9NICRUIFdIRVJFICRXIEFORCBwdXNsX3RpcGFzPSdwcmVrZScgQU5EIGlyZW5naW55cyBJTiAoJ21vYmlsZScsJ3RlbGVmb25hcycsJ3Bob25lJykgR1JPVVAgQlkgMSBPUkRFUiBCWSBsYW5rIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICAgLy8ga2llayBsYW5reXRvanUgbWF0byA+MSBwcmVrZSwgYXIgQVRDIGlzIHNhcmFzbyAoa2F0ZWdvcmlqYS9wYWllc2thKQogICAgJHJbJ2F0Y19wYWdhbF9wdXNsYXBpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXJlbmdpbnlzLCBwdXNsX3RpcGFzLCBDT1VOVChESVNUSU5DVCBsYW5reXRvamFzX2QpIGxhbmssIENPVU5UKCopIG4gRlJPTSAkVCBXSEVSRSAkVyBBTkQgdGlwYXM9J2FkZF90b19jYXJ0JyBHUk9VUCBCWSAxLDIgT1JERVIgQlkgMSxsYW5rIERFU0MiLEFSUkFZX0EpOwogICAgLy8gbGFuZGluZyBpIHByZWtlIChwaXJtYXMgcHVzbGFwaXMgeXJhIHByZWtlKSDigJQgacWhIGt1ciBhdGVpbmEgaXIgYXIgQVRDCiAgICAkclsnbGFuZGluZ19wcmVrZSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgbGFua3l0b2phc19kKSBsYW5rIEZST00gJFQgV0hFUkUgJFcgQU5EIHRpcGFzPSdwYWdldmlldycgQU5EIHB1c2xfdGlwYXM9J3ByZWtlJyBBTkQgbGFuZGluZyBMSUtFICclL3Byb2R1Y3QvJSciLEFSUkFZX0EpOwogICAgJHJbJ3N0dWxwZWxpYWlfcHZ6J109JHdwZGItPmdldF9yb3coIlNFTEVDVCB0aXBhcyxwdXNsX3RpcGFzLHVybF9rZWxpYXMscmFrdGFzLHJha3RhczIscmVpa3NtZSxsYW5kaW5nLGthbmFsYXMsaXJlbmdpbnlzIEZST00gJFQgV0hFUkUgJFcgQU5EIHB1c2xfdGlwYXM9J3ByZWtlJyBBTkQgdGlwYXMgTk9UIElOICgncGFnZXZpZXcnLCdhZGRfdG9fY2FydCcpIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-182517';
const GKEY='ps_s1740d';
const PHASES=["1"];
const OUT='analize/s1740d.json';
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
