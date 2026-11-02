process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2eCBBZHMgcnVnc2VqaXMgdnMgc3BhbGlzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgxNngnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDI1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODE2eCddOyAkcT1mbigkcyk9PiR3cGRiLT5nZXRfcmVzdWx0cygkcyxBUlJBWV9BKTsKICAkRj0ieyRQfXBzX2Zha3RfdXpzYWt5bWFpIjsgJFI9InskUH1wc19mYWt0X3Jla2xhbWEiOwogICRiYXNlPSJ1LnRlc3RpbmlzPTAgQU5EIHUuc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgQU5EIHUuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDEnIEFORCB1LnN1a3VydGFfYXQ8JzIwMjYtMTEtMDEnIjsKICAkZz0iKHUuZ2NsaWQ8PicnIE9SIHUudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnIE9SICh1LnV0bV9zb3VyY2U9J2dvb2dsZScgQU5EIHUudXRtX21lZGl1bT0nY3BjJykpIjsKICAkc2l1bnRhPSJDT0FMRVNDRSgoU0VMRUNUIFNVTShzLmthaW5hX3ZlemVqb19jdCkgRlJPTSB7JFB9cHNfZmFrdF9zaXVudG9zIHMgV0hFUkUgcy51enNha3ltYXNfaWQ9dS51enNha3ltYXNfaWQgQU5EIChzLnRlc3RpbmlzPTAgT1Igcy50ZXN0aW5pcyBJUyBOVUxMKSksMCkiOwogICRzZWw9IkNPVU5UKCopIG4sIFJPVU5EKFNVTSh1LnZpc29fY3QpLzEwMCkgZXVyLCBST1VORChTVU0odS5tYXJ6YV9jdCkvMTAwKSBtYXJ6YSwgUk9VTkQoU1VNKHUua29udHJpYnVjaWphX2N0KS8xMDApIGtvbnRyLCBST1VORChTVU0oJHNpdW50YSkvMTAwKSBzaXVudGEsIFNVTSh1LmtsaWVudGFzX25hdWphcykgbmF1amksIFNVTSh1LmtsaWVudGFzX25hdWphcz0wKSBncml6ZSwgUk9VTkQoQVZHKHUudmlzb19jdCkvMTAwLDEpIHZpZCI7CiAgLy8gMS4gbWVuZXNpcyB4IGdvb2dsZS9uZQogICRyWydtZW4nXT0kcSgiU0VMRUNUIERBVEVfRk9STUFUKHUuc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCBJRigkZywnZ29vZ2xlJywna2l0YScpIGssICRzZWwgRlJPTSAkRiB1IFdIRVJFICRiYXNlIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAxLDIiKTsKICAvLyAyLiBtZW5lc2lzIHgga2FtcGFuaWphIChnb29nbGUpCiAgJHJbJ2thbXAnXT0kcSgiU0VMRUNUIERBVEVfRk9STUFUKHUuc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCBDT0FMRVNDRShOVUxMSUYodS51dG1fY2FtcGFpZ24sJycpLCdnY2xpZF9iZV9pZCcpIGMsICRzZWwgRlJPTSAkRiB1IFdIRVJFICRiYXNlIEFORCAkZyBHUk9VUCBCWSAxLDIgT1JERVIgQlkgMSwyIik7CiAgLy8gMy4gYWRzIGlzbGFpZG9zIG1lbmVzaXMgeCBrYW1wYW5pamEKICAkclsnYWRzJ109JHEoIlNFTEVDVCBEQVRFX0ZPUk1BVChkaWVuYSwnJVktJW0nKSBtLCBrYW1wYW5pamFfaWQgYywgTEVGVChrYW1wYW5pamEsNDApIGssIFNVTShwYXJvZHltYWkpIHBhciwgU1VNKHBhc3BhdWRpbWFpKSBwYXNwLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIsIFJPVU5EKFNVTShrb252ZXJzaWpvcyksMSkga29udiwgUk9VTkQoU1VNKGtvbnZfdmVydGVfY3QpLzEwMCkga3YgRlJPTSAkUiBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBBTkQgZGllbmE+PScyMDI2LTA5LTAxJyBBTkQgZGllbmE8JzIwMjYtMTEtMDEnIEdST1VQIEJZIDEsMiwzIE9SREVSIEJZIDEsMiIpOwogIC8vIDQuIHNhdmFpdGVzOiBhZHMgKyBnb29nbGUgdXpzCiAgJHJbJ3Nhdl9hZHMnXT0kcSgiU0VMRUNUIFlFQVJXRUVLKGRpZW5hLDMpIHcsIE1JTihkaWVuYSkgbnVvLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIsIFNVTShwYXNwYXVkaW1haSkgcGFzcCwgU1VNKHBhcm9keW1haSkgcGFyIEZST00gJFIgV0hFUkUga2FuYWxhcz0nZ29vZ2xlX2FkcycgQU5EIGRpZW5hPj0nMjAyNi0wOS0wMScgQU5EIGRpZW5hPCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxIE9SREVSIEJZIDEiKTsKICAkclsnc2F2X3V6cyddPSRxKCJTRUxFQ1QgWUVBUldFRUsodS5zdWt1cnRhX2F0LDMpIHcsICRzZWwgRlJPTSAkRiB1IFdIRVJFICRiYXNlIEFORCAkZyBHUk9VUCBCWSAxIE9SREVSIEJZIDEiKTsKICAkclsnc2F2X3Zpc2knXT0kcSgiU0VMRUNUIFlFQVJXRUVLKHUuc3VrdXJ0YV9hdCwzKSB3LCBDT1VOVCgqKSBuLCBST1VORChTVU0odS52aXNvX2N0KS8xMDApIGV1ciwgUk9VTkQoU1VNKHUua29udHJpYnVjaWphX2N0KS8xMDApIGtvbnRyIEZST00gJEYgdSBXSEVSRSAkYmFzZSBHUk9VUCBCWSAxIE9SREVSIEJZIDEiKTsKICAvLyA1LiBrYW5hbGFpIHNwYWxpcyB2cyBydWdzZWppcyAodmlzaSkKICAkclsna2FuYWxhaSddPSRxKCJTRUxFQ1QgREFURV9GT1JNQVQodS5zdWt1cnRhX2F0LCclWS0lbScpIG0sIHUua2FuYWxhc19wYXNrdXRpbmlzIGthbiwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHUudmlzb19jdCkvMTAwKSBldXIsIFJPVU5EKFNVTSh1LmtvbnRyaWJ1Y2lqYV9jdCkvMTAwKSBrb250ciwgU1VNKHUua2xpZW50YXNfbmF1amFzKSBuYXVqaSBGUk9NICRGIHUgV0hFUkUgJGJhc2UgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMyBERVNDIik7CiAgLy8gNi4gYWRzIGRpZW5vcyAoc3BhbGlzKSBrYWNpxbMgcG1heCBpciBwZXRzaG9wIHBtYXggQ1BDCiAgJHJbJ2RpZW5vcyddPSRxKCJTRUxFQ1QgZGllbmEgZCwga2FtcGFuaWphX2lkIGMsIHBhc3BhdWRpbWFpIHBhc3AsIFJPVU5EKGlzbGFpZG9zX2N0LzEwMCwyKSBldXIgRlJPTSAkUiBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBBTkQgZGllbmE+PScyMDI2LTEwLTAxJyBBTkQgZGllbmE8JzIwMjYtMTEtMDEnIEFORCBrYW1wYW5pamFfaWQgSU4oJzIxNTY1NDUwOTkwJywnMjE0NzIwMTc1NDInKSBPUkRFUiBCWSAxLDIiKTsKICAvLyA3LiBrb2hvcnRvczoga2xpZW50YWksIGt1cml1IHBpcm1hcyB1enMgaXMgZ29vZ2xlLCB2ZWxpYXUgcGlya28KICAkclsna29ob3J0YSddPSRxKCJTRUxFQ1QgREFURV9GT1JNQVQoZjEuc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCBDT1VOVChESVNUSU5DVCBmMS5rbGllbnRhc19yYWt0YXMpIGtsaWVudGFpLCBDT1VOVChESVNUSU5DVCBmMi5rbGllbnRhc19yYWt0YXMpIHBha2FydG9qbywgQ09VTlQoZjIudXpzYWt5bWFzX2lkKSBwYWtfdXpzLCBST1VORChTVU0oZjIua29udHJpYnVjaWphX2N0KS8xMDApIHBha19rb250ciwgU1VNKGYyLmdjbGlkPD4nJyBPUiBmMi51dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcpIHBha19wZXJfZ29vZ2xlIEZST00gJEYgZjEgTEVGVCBKT0lOICRGIGYyIE9OIGYyLmtsaWVudGFzX3Jha3Rhcz1mMS5rbGllbnRhc19yYWt0YXMgQU5EIGYyLnV6c2FreW1hc19pZD5mMS51enNha3ltYXNfaWQgQU5EIGYyLnRlc3RpbmlzPTAgQU5EIGYyLnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycpIFdIRVJFIGYxLnRlc3RpbmlzPTAgQU5EIGYxLnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycpIEFORCBmMS5rbGllbnRhc19uYXVqYXM9MSBBTkQgKGYxLmdjbGlkPD4nJyBPUiBmMS51dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcgT1IgKGYxLnV0bV9zb3VyY2U9J2dvb2dsZScgQU5EIGYxLnV0bV9tZWRpdW09J2NwYycpKSBBTkQgZjEuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDEnIEFORCBmMS5zdWt1cnRhX2F0PCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxIik7CiAgJHJbJ2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJEYiKTsgJHJbJ2NvbHNfciddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkUiIpOwogIC8vIDguIGFkcyBiZSBrYW1wYW5pam9zIGlkIChwYXNrdXRpbmUgZGllbmEgaXJhc3UpCiAgJHJbJ2Fkc19udW9faWtpJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNSU4oZGllbmEpIGEsIE1BWChkaWVuYSkgYiBGUk9NICRSIFdIRVJFIGthbmFsYXM9J2dvb2dsZV9hZHMnIixBUlJBWV9BKTsKICAvLyA5LiBtYWlzdG8gZGFsaXMgZ29vZ2xlIHV6c2FreW11b3NlCiAgJHJbJ21haXN0YXMnXT0kcSgiU0VMRUNUIERBVEVfRk9STUFUKHUuc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCBTVU0odS50dXJpX21haXN0bykgc3VfbWFpc3R1LCBDT1VOVCgqKSBuIEZST00gJEYgdSBXSEVSRSAkYmFzZSBBTkQgJGcgR1JPVVAgQlkgMSIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-091114';
const GKEY='ps_s1816x';
const PHASES=["1"];
const OUT='analize/s1816_x.json';
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
