process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHAg4oCUIFJFQ09OIHZpc3VtYSAyOiB2ZXJzbGFzIHBvIFQtMCB2cyBwZXJuYWksIGthbmFsYWksIG1hcsW+YSwgcGlsdHV2YXMsIGF0xaFhdWtpbWFpLCB0b3AgcHJla2nFsyBwcmllaW5hbXVtYXMuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODlzcCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJEY9InskcH1wc19mYWt0X3V6c2FreW1haSI7ICRJPSJ7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIjsgJG9rPSJ0ZXN0aW5pcz0wIEFORCBhcG1va2V0YV9hdCBJUyBOT1QgTlVMTCI7CiAgJG9bJ3BvX3QwJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIsIFJPVU5EKEFWRyh2aXNvX2N0KS8xMDAsMSkgYW92LCBST1VORChTVU0obWFyemFfY3QpLzEwMCkgbWFyemEsIFJPVU5EKDEwMCpTVU0obWFyemFfY3QpL05VTExJRihTVU0ocHJla2l1X3N1bWFfY3QtcHZtX2N0KSwwKSwxKSBtYXJ6YV9wcm9jLCBTVU0oa2xpZW50YXNfbmF1amFzKSBuYXVqaSwgUk9VTkQoREFURURJRkYoTk9XKCksJzIwMjYtMDktMDcnKSkgZGllbnUgRlJPTSAkRiBXSEVSRSAkb2sgQU5EIHN1a3VydGFfYXQ+PScyMDI2LTA5LTA3IDIyOjAwJyIsQVJSQVlfQSk7CiAgJG9bJ3Blcm5haV90YXNfcGF0cyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHZpc29fY3QpLzEwMCkgZXVyLCBST1VORChBVkcodmlzb19jdCkvMTAwLDEpIGFvdiwgUk9VTkQoMTAwKlNVTShtYXJ6YV9jdCkvTlVMTElGKFNVTShwcmVraXVfc3VtYV9jdC1wdm1fY3QpLDApLDEpIG1hcnphX3Byb2MsIFNVTShrbGllbnRhc19uYXVqYXMpIG5hdWppIEZST00gJEkgV0hFUkUgYXBtb2tldGFfYXQgSVMgTk9UIE5VTEwgQU5EIHN1a3VydGFfYXQgQkVUV0VFTiAnMjAyNS0wOS0wOCcgQU5EIERBVEVfU1VCKE5PVygpLElOVEVSVkFMIDEgWUVBUikiLEFSUkFZX0EpOwogICRvWydtZW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFX0ZPUk1BVChzdWt1cnRhX2F0LCclWS0lbScpIG0sIENPVU5UKCopIG4sIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIGV1ciwgUk9VTkQoMTAwKlNVTShtYXJ6YV9jdCkvTlVMTElGKFNVTShwcmVraXVfc3VtYV9jdC1wdm1fY3QpLDApLDEpIG1wIEZST00gJEkgV0hFUkUgYXBtb2tldGFfYXQgSVMgTk9UIE5VTEwgQU5EIHN1a3VydGFfYXQ+PScyMDI0LTA5LTAxJyBHUk9VUCBCWSBtIE9SREVSIEJZIG0iLEFSUkFZX0EpOwogICRvWydrYW5hbGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FuYWxhc19wYXNrdXRpbmlzIGssIENPVU5UKCopIG4sIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIGV1ciwgU1VNKGtsaWVudGFzX25hdWphcykgbmF1amkgRlJPTSAkRiBXSEVSRSAkb2sgQU5EIHN1a3VydGFfYXQ+PScyMDI2LTA5LTA3IDIyOjAwJyBHUk9VUCBCWSBrIE9SREVSIEJZIG4gREVTQyIsQVJSQVlfQSk7CiAgJG9bJ3Jla2xhbWEnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIFJPVU5EKFNVTShpc2xhaWRvc19jdCkvMTAwKSBpc2wsIFNVTShwYXNwYXVkaW1haSkgY2wsIFJPVU5EKFNVTShrb252ZXJzaWpvcyksMSkga29udiBGUk9NIHskcH1wc19mYWt0X3Jla2xhbWEgV0hFUkUgZGllbmE+PScyMDI2LTA5LTA4JyIsQVJSQVlfQSk7CiAgJFc9InskcH1wc193ZWJfaXZ5a2lhaSI7ICRvWydpdnlraWFpXzdkJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGlwYXMsIENPVU5UKCopIG4sIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgc2VzIEZST00gJFcgV0hFUkUgdGVzdGluaXM9MCBBTkQgbGFpa2FzPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCA3IERBWSkgR1JPVVAgQlkgdGlwYXMgT1JERVIgQlkgbiBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAkb1snc2VzaWpvc183ZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlyZW5naW55cywgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzZXMgRlJPTSAkVyBXSEVSRSB0ZXN0aW5pcz0wIEFORCBsYWlrYXM+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDcgREFZKSBHUk9VUCBCWSBpcmVuZ2lueXMiLEFSUkFZX0EpOwogICRvWydhdHNhdWt0aSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8ucGF5bWVudF9tZXRob2QgcG0sIENPVU5UKCopIG4sIFJPVU5EKFNVTShvLnRvdGFsX2Ftb3VudCkpIGV1ciwgU1VNKEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskcH13Y19vcmRlcnMgbzIgV0hFUkUgbzIuYmlsbGluZ19lbWFpbD1vLmJpbGxpbmdfZW1haWwgQU5EIG8yLmlkPm8uaWQgQU5EIG8yLnN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSkpIHZlbGlhdV9waXJrbyBGUk9NIHskcH13Y19vcmRlcnMgbyBXSEVSRSBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cz0nd2MtY2FuY2VsbGVkJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNyAxOTowMCcgR1JPVVAgQlkgcG0iLEFSUkFZX0EpOwogICR0b3A9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5wcmVrZV9pZCBwaWQsIENPVU5UKERJU1RJTkNUIGUudXpzYWt5bWFzX2lkKSB1LCBST1VORChTVU0oZS5rYWluYV9jdCkvMTAwKSBldXIgRlJPTSB7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyBlIEpPSU4gJEkgZiBPTiBmLnV6c2FreW1hc19pZD1lLnV6c2FreW1hc19pZCBXSEVSRSBmLnN1a3VydGFfYXQ+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDEyIE1PTlRIKSBBTkQgZS5wcmVrZV9pZD4wIEdST1VQIEJZIGUucHJla2VfaWQgT1JERVIgQlkgZXVyIERFU0MgTElNSVQgMjAwIixBUlJBWV9BKTsKICAkc3Q9YXJyYXkoJ3B1Ymxpc2hfaW5zdG9jayc9PjAsJ3B1Ymxpc2hfb29zJz0+MCwnZHJhZnRfYXJfbmVyYSc9PjAsJ2V1cl9vb3MnPT4wLCdldXJfbmVyYSc9PjAsJ2V1cl92aXNvJz0+MCk7ICRleD1hcnJheSgpOwogIGZvcmVhY2goJHRvcCBhcyAkcil7ICRzdFsnZXVyX3Zpc28nXSs9JHJbJ2V1ciddOyAkcHN0PWdldF9wb3N0X3N0YXR1cygkclsncGlkJ10pOyBpZigkcHN0IT09J3B1Ymxpc2gnKXskc3RbJ2RyYWZ0X2FyX25lcmEnXSsrOyRzdFsnZXVyX25lcmEnXSs9JHJbJ2V1ciddOyBpZihjb3VudCgkZXgpPDEwKSRleFtdPWdldF90aGVfdGl0bGUoJHJbJ3BpZCddKS4nICgnLiRyWydldXInXS4n4oKsLCcuKCRwc3Q/OiduxJdyYScpLicpJzsgY29udGludWU7fQogICAgaWYoZ2V0X3Bvc3RfbWV0YSgkclsncGlkJ10sJ19zdG9ja19zdGF0dXMnLHRydWUpPT09J291dG9mc3RvY2snKXskc3RbJ3B1Ymxpc2hfb29zJ10rKzskc3RbJ2V1cl9vb3MnXSs9JHJbJ2V1ciddOyBpZihjb3VudCgkZXgpPDEwKSRleFtdPWdldF90aGVfdGl0bGUoJHJbJ3BpZCddKS4nICgnLiRyWydldXInXS4n4oKsLG9vcyknO30gZWxzZSAkc3RbJ3B1Ymxpc2hfaW5zdG9jayddKys7IH0KICAkb1sndG9wMjAwX3ByaWVpbmFtdW1hcyddPSRzdDsgJG9bJ3RvcDIwMF9leCddPSRleDsgJG9bJ3RvcDIwMF9pc192aXNvX2V1cl8xMm1lbiddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgUk9VTkQoU1VNKHZpc29fY3QpLzEwMCkgRlJPTSAkSSBXSEVSRSBhcG1va2V0YV9hdCBJUyBOT1QgTlVMTCBBTkQgc3VrdXJ0YV9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMTIgTU9OVEgpIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-101336';
const GKEY='ps_s1689sp';
const PHASES=["GO"];
const OUT='analize/s1689s_p.json';
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
