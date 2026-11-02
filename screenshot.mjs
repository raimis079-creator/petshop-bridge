process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2eSBBZHMgcGFwaWxkb21pIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgxNnknXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDI1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODE2eSddOyAkcT1mbigkcyk9PiR3cGRiLT5nZXRfcmVzdWx0cygkcyxBUlJBWV9BKTsKICAkRj0ieyRQfXBzX2Zha3RfdXpzYWt5bWFpIjsgJFI9InskUH1wc19mYWt0X3Jla2xhbWEiOwogICRvaz0idGVzdGluaXM9MCBBTkQgc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykiOwogICRnPSIoZ2NsaWQ8PicnIE9SIHV0bV9jYW1wYWlnbiBSRUdFWFAgJ15bMC05XSskJyBPUiAodXRtX3NvdXJjZT0nZ29vZ2xlJyBBTkQgdXRtX21lZGl1bT0nY3BjJykpIjsKICAvLyBydWdzZWppcyBpa2kgbWlncmFjaWpvcyAoMDktMDEuLjA5LTA4KSB2cyBwbwogICRyWydydWdzX2RhbHlzJ109JHEoIlNFTEVDVCBJRihzdWt1cnRhX2F0PCcyMDI2LTA5LTA5JywnaWtpX21pZ3InLCdwb19taWdyJykgZCwgSUYoJGcsJ2dvb2dsZScsJ2tpdGEnKSBrLCBDT1VOVCgqKSBuLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIsIFJPVU5EKFNVTShrb250cmlidWNpamFfY3QpLzEwMCkga29udHIsIFNVTShrbGllbnRhc19uYXVqYXMpIG5hdWppIEZST00gJEYgV0hFUkUgJG9rIEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0wMScgQU5EIHN1a3VydGFfYXQ8JzIwMjYtMTAtMDEnIEdST1VQIEJZIDEsMiIpOwogICRyWydhZHNfcnVnc19kYWx5cyddPSRxKCJTRUxFQ1QgSUYoZGllbmE8JzIwMjYtMDktMDknLCdpa2lfbWlncicsJ3BvX21pZ3InKSBkLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIsIFNVTShwYXNwYXVkaW1haSkgcGFzcCBGUk9NICRSIFdIRVJFIGthbmFsYXM9J2dvb2dsZV9hZHMnIEFORCBkaWVuYT49JzIwMjYtMDktMDEnIEFORCBkaWVuYTwnMjAyNi0xMC0wMScgR1JPVVAgQlkgMSIpOwogIC8vIGtvaG9ydGEgcGFnYWwga2xpZW50YXNfaWQKICAkclsna29ob3J0YSddPSRxKCJTRUxFQ1QgREFURV9GT1JNQVQoZjEuc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCBDT1VOVChESVNUSU5DVCBmMS5rbGllbnRhc19pZCkga2xpZW50YWksIENPVU5UKERJU1RJTkNUIGYyLmtsaWVudGFzX2lkKSBwYWthcnRvam8sIENPVU5UKGYyLnV6c2FreW1hc19pZCkgcGFrX3V6cywgUk9VTkQoU1VNKGYyLmtvbnRyaWJ1Y2lqYV9jdCkvMTAwKSBwYWtfa29udHIsIFNVTShmMi5nY2xpZDw+JycgT1IgZjIudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnKSBwYWtfcGVyX2dvb2dsZSBGUk9NICRGIGYxIExFRlQgSk9JTiAkRiBmMiBPTiBmMi5rbGllbnRhc19pZD1mMS5rbGllbnRhc19pZCBBTkQgZjIua2xpZW50YXNfaWQ+MCBBTkQgZjIudXpzYWt5bWFzX2lkPmYxLnV6c2FreW1hc19pZCBBTkQgZjIudGVzdGluaXM9MCBBTkQgZjIuc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgV0hFUkUgZjEuJG9rIEFORCBmMS5rbGllbnRhc19uYXVqYXM9MSBBTkQgKGYxLmdjbGlkPD4nJyBPUiBmMS51dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcgT1IgKGYxLnV0bV9zb3VyY2U9J2dvb2dsZScgQU5EIGYxLnV0bV9tZWRpdW09J2NwYycpKSBBTkQgZjEuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDEnIEFORCBmMS5zdWt1cnRhX2F0PCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxIik7CiAgLy8gZGllbm9zIG51byBhbmtzdGVzbmlvIHBpcmtpbW8gKHBha2FydG9qaW11IGdyZWl0aXMpIGdvb2dsZSBuYXVqaWVtcwogICRyWydwYWtfZGllbm9zJ109JHEoIlNFTEVDVCBmMi5kaWVub3NfbnVvX2Fua3N0ZXNuaW8gZCBGUk9NICRGIGYxIEpPSU4gJEYgZjIgT04gZjIua2xpZW50YXNfaWQ9ZjEua2xpZW50YXNfaWQgQU5EIGYyLmtsaWVudGFzX2lkPjAgQU5EIGYyLnV6c2FreW1hc19pZD5mMS51enNha3ltYXNfaWQgQU5EIGYyLmtsaWVudGFzX3V6c2FreW1vX25yPTIgQU5EIGYyLnRlc3RpbmlzPTAgV0hFUkUgZjEuJG9rIEFORCBmMS5rbGllbnRhc19uYXVqYXM9MSBBTkQgKGYxLmdjbGlkPD4nJyBPUiBmMS51dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcpIEFORCBmMS5zdWt1cnRhX2F0Pj0nMjAyNi0wOS0wOSciKTsKICAvLyBrYWluYTI0IGlyIGtpdGkgbW9rYW1pCiAgJHJbJ21va2FtYXNfa2l0aSddPSRxKCJTRUxFQ1QgREFURV9GT1JNQVQoc3VrdXJ0YV9hdCwnJVktJW0nKSBtLCB1dG1fc291cmNlLCBDT1VOVCgqKSBuLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIsIFJPVU5EKFNVTShrb250cmlidWNpamFfY3QpLzEwMCkga29udHIgRlJPTSAkRiBXSEVSRSAkb2sgQU5EIGthbmFsYXNfcGFza3V0aW5pcz0nbW9rYW1hcycgQU5EIE5PVCAkZyBBTkQgc3VrdXJ0YV9hdD49JzIwMjYtMDktMDEnIEFORCBzdWt1cnRhX2F0PCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxLDIiKTsKICAkclsna2FpbmEyNF9pc2xhaWRvcyddPSRxKCJTRUxFQ1QgREFURV9GT1JNQVQoZGllbmEsJyVZLSVtJykgbSwga2FuYWxhcywgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AgRlJPTSAkUiBXSEVSRSBrYW5hbGFzPD4nZ29vZ2xlX2FkcycgQU5EIGRpZW5hPj0nMjAyNi0wOS0wMScgQU5EIGRpZW5hPCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxLDIiKTsKICAvLyBtYWlzdGFzOiBlaWx1dGVzIHN1IGthdGVnb3JpamEKICAkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyIpOyAkclsnZWlsX2NvbHMnXT0kY29sczsKICAvLyBwaXJtYXMga2FuYWxhcyBnb29nbGUsIHBhc2t1dGluaXMga2l0YXMgKGFzc2lzdCkKICAkclsnYXNzaXN0J109JHEoIlNFTEVDVCBEQVRFX0ZPUk1BVChzdWt1cnRhX2F0LCclWS0lbScpIG0sIGthbmFsYXNfcGFza3V0aW5pcyBrYW4sIENPVU5UKCopIG4sIFJPVU5EKFNVTShrb250cmlidWNpamFfY3QpLzEwMCkga29udHIgRlJPTSAkRiBXSEVSRSAkb2sgQU5EIGthbmFsYXNfcGlybWFzPSdtb2thbWFzJyBBTkQgTk9UICRnIEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0wMScgQU5EIHN1a3VydGFfYXQ8JzIwMjYtMTEtMDEnIEdST1VQIEJZIDEsMiIpOwogIC8vIGlyZW5naW55cyBnb29nbGUKICAkclsnaXJlbmdpbnlzJ109JHEoIlNFTEVDVCBEQVRFX0ZPUk1BVChzdWt1cnRhX2F0LCclWS0lbScpIG0sIGlyZW5naW55cywgQ09VTlQoKikgbiwgUk9VTkQoQVZHKHZpc29fY3QpLzEwMCwxKSB2aWQgRlJPTSAkRiBXSEVSRSAkb2sgQU5EICRnIEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0wMScgQU5EIHN1a3VydGFfYXQ8JzIwMjYtMTEtMDEnIEdST1VQIEJZIDEsMiIpOwogIC8vIHNwYWxpbyBhZHMgZGllbm9zIHZpc28gaXIgZ29vZ2xlIHV6cyBwZXIgZGllbmEgKGtvcmVsaWFjaWphKQogICRyWydkaWVub3NfdmlzbyddPSRxKCJTRUxFQ1QgYS5kLCBhLmV1ciwgYS5wYXNwLCBDT0FMRVNDRSh1Lm4sMCkgbiwgQ09BTEVTQ0UodS5rb250ciwwKSBrb250ciBGUk9NIChTRUxFQ1QgZGllbmEgZCwgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AgRlJPTSAkUiBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBBTkQgZGllbmE+PScyMDI2LTEwLTAxJyBBTkQgZGllbmE8JzIwMjYtMTEtMDEnIEdST1VQIEJZIDEpIGEgTEVGVCBKT0lOIChTRUxFQ1QgREFURShzdWt1cnRhX2F0KSBkLCBDT1VOVCgqKSBuLCBST1VORChTVU0oa29udHJpYnVjaWphX2N0KS8xMDApIGtvbnRyIEZST00gJEYgV0hFUkUgJG9rIEFORCAkZyBHUk9VUCBCWSAxKSB1IE9OIHUuZD1hLmQgT1JERVIgQlkgMSIpOwogIC8vIHdlYiBpdnlraWFpOiBnb29nbGUgc2VzaWpvcyBzcGFsaXMgdnMgcnVnc2VqaXMgKGplaSB5cmEpCiAgJHJbJ3dlYl9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc193ZWJfZGllbm9zIik7CiAgJHJbJ3dlYiddPSRxKCJTRUxFQ1QgKiBGUk9NIHskUH1wc193ZWJfZGllbm9zIFdIRVJFIGRpZW5hPj0nMjAyNi0wOS0wOScgQU5EIGRpZW5hPCcyMDI2LTExLTAxJyBPUkRFUiBCWSBkaWVuYSBMSU1JVCA2MCIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-091319';
const GKEY='ps_s1816y';
const PHASES=["1"];
const OUT='analize/s1816_y.json';
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
