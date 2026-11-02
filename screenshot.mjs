process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2eiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MTZ6J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgxNnonXTsgJHE9Zm4oJHMpPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHMsQVJSQVlfQSk7CiAgJEY9InskUH1wc19mYWt0X3V6c2FreW1haSI7ICRvaz0idGVzdGluaXM9MCBBTkQgc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykiOwogICRnPSIoZ2NsaWQ8PicnIE9SIHV0bV9jYW1wYWlnbiBSRUdFWFAgJ15bMC05XSskJyBPUiAodXRtX3NvdXJjZT0nZ29vZ2xlJyBBTkQgdXRtX21lZGl1bT0nY3BjJykpIjsKICAkclsnaWRfdGlwYWknXT0kcSgiU0VMRUNUIChrbGllbnRhc19pZD4wKSBzdV9pZCwgKGtsaWVudGFzX2VtYWlsX2hhc2g8PicnKSBzdV9oYXNoLCBDT1VOVCgqKSBuIEZST00gJEYgV0hFUkUgJG9rIEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0wOScgR1JPVVAgQlkgMSwyIik7CiAgJHJbJ2tvaG9ydGEnXT0kcSgiU0VMRUNUIERBVEVfRk9STUFUKGYxLnN1a3VydGFfYXQsJyVZLSVtJykgbSwgQ09VTlQoRElTVElOQ1QgZjEua2xpZW50YXNfZW1haWxfaGFzaCkga2xpZW50YWksIENPVU5UKERJU1RJTkNUIGYyLmtsaWVudGFzX2VtYWlsX2hhc2gpIHBha2FydG9qbywgQ09VTlQoZjIudXpzYWt5bWFzX2lkKSBwYWtfdXpzLCBST1VORChTVU0oZjIua29udHJpYnVjaWphX2N0KS8xMDApIHBha19rb250ciwgU1VNKGYyLmdjbGlkPD4nJyBPUiBmMi51dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcpIHBha19wZXJfZ29vZ2xlLCBTVU0oZjIua2FuYWxhc19wYXNrdXRpbmlzIElOKCdkaXJlY3QnLCdvcmdhbmlrYScsJ2VtYWlsJywnbGFpc2thcycpKSBwYWtfbmVtb2thbWFpIEZST00gJEYgZjEgTEVGVCBKT0lOICRGIGYyIE9OIGYyLmtsaWVudGFzX2VtYWlsX2hhc2g9ZjEua2xpZW50YXNfZW1haWxfaGFzaCBBTkQgZjIudXpzYWt5bWFzX2lkPmYxLnV6c2FreW1hc19pZCBBTkQgZjIudGVzdGluaXM9MCBBTkQgZjIuc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgV0hFUkUgZjEuJG9rIEFORCBmMS5rbGllbnRhc19uYXVqYXM9MSBBTkQgKGYxLmdjbGlkPD4nJyBPUiBmMS51dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcgT1IgKGYxLnV0bV9zb3VyY2U9J2dvb2dsZScgQU5EIGYxLnV0bV9tZWRpdW09J2NwYycpKSBBTkQgZjEuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDEnIEFORCBmMS5zdWt1cnRhX2F0PCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxIik7CiAgJHJbJ2tvaG9ydGFfa2FtcCddPSRxKCJTRUxFQ1QgQ09BTEVTQ0UoTlVMTElGKGYxLnV0bV9jYW1wYWlnbiwnJyksJ2djbGlkX2JlX2lkJykgYywgQ09VTlQoRElTVElOQ1QgZjEua2xpZW50YXNfZW1haWxfaGFzaCkga2xpZW50YWksIENPVU5UKERJU1RJTkNUIGYyLmtsaWVudGFzX2VtYWlsX2hhc2gpIHBha2FydG9qbywgQ09VTlQoZjIudXpzYWt5bWFzX2lkKSBwYWtfdXpzLCBST1VORChTVU0oZjIua29udHJpYnVjaWphX2N0KS8xMDApIHBha19rb250ciBGUk9NICRGIGYxIExFRlQgSk9JTiAkRiBmMiBPTiBmMi5rbGllbnRhc19lbWFpbF9oYXNoPWYxLmtsaWVudGFzX2VtYWlsX2hhc2ggQU5EIGYyLnV6c2FreW1hc19pZD5mMS51enNha3ltYXNfaWQgQU5EIGYyLnRlc3RpbmlzPTAgQU5EIGYyLnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycpIFdIRVJFIGYxLiRvayBBTkQgZjEua2xpZW50YXNfbmF1amFzPTEgQU5EIChmMS5nY2xpZDw+JycgT1IgZjEudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnKSBBTkQgZjEuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIEFORCBmMS5zdWt1cnRhX2F0PCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxIik7CiAgJHJbJ3Bha19kaWVub3MnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGYyLmRpZW5vc19udW9fYW5rc3Rlc25pbyBGUk9NICRGIGYxIEpPSU4gJEYgZjIgT04gZjIua2xpZW50YXNfZW1haWxfaGFzaD1mMS5rbGllbnRhc19lbWFpbF9oYXNoIEFORCBmMi51enNha3ltYXNfaWQ+ZjEudXpzYWt5bWFzX2lkIEFORCBmMi5rbGllbnRhc191enNha3ltb19ucj0yIEFORCBmMi50ZXN0aW5pcz0wIFdIRVJFIGYxLiRvayBBTkQgZjEua2xpZW50YXNfbmF1amFzPTEgQU5EIChmMS5nY2xpZDw+JycgT1IgZjEudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnKSBBTkQgZjEuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIik7CiAgLy8gbWFpc3RhcyBnb29nbGUgdXpzYWt5bXVvc2UgcGFnYWwgZ3l2dW5hL2thdGVnb3JpamEgc3BhbGlzCiAgJHJbJ2d5dnVuYXMnXT0kcSgiU0VMRUNUIERBVEVfRk9STUFUKGUuZGllbmEsJyVZLSVtJykgbSwgZS5neXZ1bmFzLCBDT1VOVChESVNUSU5DVCBlLnV6c2FreW1hc19pZCkgdXpzLCBST1VORChTVU0oZS5rYWluYV9jdC1lLnNhdmlrYWluYV9jdCkvMTAwKSBtYXJ6YSBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBKT0lOICRGIHUgT04gdS51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgV0hFUkUgdS4kb2sgQU5EIHUuJGcgQU5EIGUuZGllbmE+PScyMDI2LTA5LTA5JyBBTkQgZS5kaWVuYTwnMjAyNi0xMS0wMScgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMyBERVNDIik7CiAgJHJbJ2JyZW5kYWlfc3BhbGlzJ109JHEoIlNFTEVDVCBlLmJyZW5kYXNfc2x1ZyBiLCBDT1VOVChESVNUSU5DVCBlLnV6c2FreW1hc19pZCkgdXpzLCBST1VORChTVU0oZS5rYWluYV9jdCkvMTAwKSBldXIsIFJPVU5EKFNVTShlLmthaW5hX2N0LWUuc2F2aWthaW5hX2N0KS8xMDApIG1hcnphIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIEpPSU4gJEYgdSBPTiB1LnV6c2FreW1hc19pZD1lLnV6c2FreW1hc19pZCBXSEVSRSB1LiRvayBBTkQgdS4kZyBBTkQgZS5kaWVuYT49JzIwMjYtMTAtMDEnIEFORCBlLmRpZW5hPCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxIE9SREVSIEJZIDMgREVTQyBMSU1JVCAxMiIpOwogIC8vIHdlYiBkaWVub3M6IHBqdXZpYWkKICAkclsncGp1dmlhaSddPSRxKCJTRUxFQ1QgcGp1dmlzLCBDT1VOVCgqKSBuLCBNSU4oZGF0YSkgYSwgTUFYKGRhdGEpIGIgRlJPTSB7JFB9cHNfd2ViX2RpZW5vcyBHUk9VUCBCWSAxIik7CiAgJHJbJ3dlYl9rYW5hbGFzJ109JHEoIlNFTEVDVCBEQVRFX0ZPUk1BVChkYXRhLCclWS0lbScpIG0sIHJha3RhcywgU1VNKGFwc2lsYW5reW1haSkgYXBzLCBTVU0odmlld19pdGVtKSB2aSwgU1VNKGFkZF90b19jYXJ0KSBhdGMsIFNVTShiZWdpbl9jaGVja291dCkgYmMsIFNVTSh1enNha3ltYWkpIHV6cyBGUk9NIHskUH1wc193ZWJfZGllbm9zIFdIRVJFIHBqdXZpcz0na2FuYWxhcycgQU5EIGRhdGE+PScyMDI2LTA5LTA5JyBBTkQgZGF0YTwnMjAyNi0xMS0wMScgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMyBERVNDIik7CiAgJHJbJ3dlYl9rYW1wJ109JHEoIlNFTEVDVCBEQVRFX0ZPUk1BVChkYXRhLCclWS0lbScpIG0sIHJha3RhcywgcmFrdGFzMiwgU1VNKGFwc2lsYW5reW1haSkgYXBzLCBTVU0oYWRkX3RvX2NhcnQpIGF0YywgU1VNKHV6c2FreW1haSkgdXpzIEZST00geyRQfXBzX3dlYl9kaWVub3MgV0hFUkUgcGp1dmlzIElOKCdrYW1wYW5pamEnLCd1dG1fY2FtcGFpZ24nLCd1dG0nKSBBTkQgZGF0YT49JzIwMjYtMDktMDknIEFORCBkYXRhPCcyMDI2LTExLTAxJyBHUk9VUCBCWSAxLDIsMyBPUkRFUiBCWSAxLDQgREVTQyBMSU1JVCAyMCIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-091520';
const GKEY='ps_s1816z';
const PHASES=["1"];
const OUT='analize/s1816_z.json';
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
