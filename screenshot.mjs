process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjEgcnVuIGUxciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBwcmVrxJdzIHRlc3R1aSAoR3JhbmNhcm5vIDQwMCwgSm9zZXJhIE1pbmkgTGFtYiA4MDAsIEpvc2VyYSBGZXN0aXZhbCAxMi41LCBFeGNsdXNpb24ga2lhdWxpZW5hIDQwMCksIFZGIHBhcnRpam9zLCBWRiBkcm9wc2hpcHBpbmcgbGF1a2lhbnR5cywgdGlla2ltbyB2YXJpa2xpbyBhdHNhcmfFsyBlaWx1xI1pxbMgbWVjaGFuaWthLCBlaWzEl3MuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2UxciddKSkgcmV0dXJuOwogICRmPXN0cnRvdXBwZXIoc2FuaXRpemVfa2V5KCRfR0VUWydwc19lMXInXSkpOyAkbz1hcnJheSgndic9PidTMTYyMSBlMXInLCdmJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI1MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRKPWZ1bmN0aW9uKCRvKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0OyB9OwogIHRyeXsKICBpZigkZj09PSdSJyl7CiAgICAkcT1hcnJheSgnZ3JhbmNhcm5vIDQwMCc9PiJwb3N0X3RpdGxlIExJS0UgJyVHcmFuY2Fybm8lJyBBTkQgcG9zdF90aXRsZSBMSUtFICclNDAwJSciLCdqb3NlcmEgbWluaSBsYW1iJz0+InBvc3RfdGl0bGUgTElLRSAnJUpvc2VyYSUnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVNaW5pJScgQU5EIHBvc3RfdGl0bGUgTElLRSAnJWFtYiUnIiwnam9zZXJhIGZlc3RpdmFsJz0+InBvc3RfdGl0bGUgTElLRSAnJUpvc2VyYSUnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVGZXN0aXZhbCUnIiwnZXhjbHVzaW9uIGtpYXVsIDQwMCc9PiJwb3N0X3RpdGxlIExJS0UgJyVFeGNsdXNpb24lJyBBTkQgKHBvc3RfdGl0bGUgTElLRSAnJWtpYXVsJScgT1IgcG9zdF90aXRsZSBMSUtFICclUG9yayUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJU1haWFsZSUnKSBBTkQgcG9zdF90aXRsZSBMSUtFICclNDAwJSciKTsKICAgIGZvcmVhY2goJHEgYXMgJGs9PiR3KXsgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdwcml2YXRlJywnZHJhZnQnKSBBTkQgJHcgT1JERVIgQlkgSUQgTElNSVQgMTIiKTsgJHI9YXJyYXkoKTsKICAgICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR4PXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkeCkgY29udGludWU7ICRyW109YXJyYXkoJ2lkJz0+KGludCkkaWQsJ24nPT5tYl9zdWJzdHIoJHgtPmdldF9uYW1lKCksMCw3MCksJ3NrdSc9PiR4LT5nZXRfc2t1KCksJ3N0Jz0+JHgtPmdldF9zdGF0dXMoKSwndGlwYXMnPT4keC0+Z2V0X3R5cGUoKSwnc2FuZCc9PiR4LT5nZXRfbWV0YSgnX3BzX3NhbmRlbGlzJyksJ3N0b2NrJz0+JHgtPmdldF9zdG9ja19xdWFudGl0eSgpLCdtcyc9PihpbnQpJHgtPmdldF9tYW5hZ2Vfc3RvY2soKSwnYXYnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU3RvY2snKT9QZXRzaG9wX0FWX1N0b2NrOjpxdHkoJGlkKTpudWxsLCd2Zic9PiR4LT5nZXRfbWV0YSgnX3ZmX3F0eScpLCdvd24nPT4keC0+Z2V0X21ldGEoJ19vd25fc3RvY2tfcXR5JyksJ2thaW5hJz0+JHgtPmdldF9wcmljZSgpLCdzdm9yaXMnPT4keC0+Z2V0X3dlaWdodCgpLCd0aWVrJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpJiZtZXRob2RfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScsJ3RpZWtlamFzJyk/bnVsbDpudWxsKTsgfQogICAgICAkb1sncHJla2VzJ11bJGtdPSRyOyB9CiAgICAkb1sndGlla2ltYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx0aWVrZWphcyxidXNlbmEsc3VrdXJ0YSx1enNha3l0YSxnYXV0YSxwcmlzdGF0eW1hcyxzdm9yaXMsZGV6ZXMscGFzdGFiYSBGUk9NIHskcH1wc190aWVraW1hcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEyIixBUlJBWV9BKTsKICAgICRvWyd0aWVraW1hc19laWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBlLmlkLGUucGFydGlqYV9pZCxlLnByb2R1Y3RfaWQsZS5vcmRlcl9pZCxlLnF0eSxlLnF0eV9nYXV0YSBGUk9NIHskcH1wc190aWVraW1hc19laWwgZSBPUkRFUiBCWSBlLmlkIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICAgJG9bJ3RpZWtfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfdGlla2ltYXMiKTsgJG9bJ3RpZWtfZWlsX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3RpZWtpbWFzX2VpbCIpOwogICAgJHQ9KHN0cmluZylmaWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF2LXRpZWtpbWFzLnBocCcpOyAkb1sndGlla19keWRpcyddPXN0cmxlbigkdCk7ICRMPWV4cGxvZGUoIlxuIiwkdCk7ICRnPWFycmF5KCk7CiAgICBmb3JlYWNoKCRMIGFzICRrPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9hZG1pbl9wb3N0fFwkX1BPU1RcW3xwdWJsaWMgc3RhdGljIGZ1bmN0aW9ufG9yZGVyX2lkXHMqPT5ccyowfGF0c2FyZ3xwcmlkZXRpfGlkZXRpX3ByZWt8cHJvZHVjdF9pZC9pJywkbCkpeyAkZ1tdPSgkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE3MCk7IH0gaWYoY291bnQoJGcpPjEyMCkgYnJlYWs7IH0gJG9bJ3RpZWtfZ3JlcCddPSRnOwogICAgJG9bJ3BzX3RpZWtfbGFpc2thaSddPWdldF9vcHRpb24oJ3BzX3RpZWtfbGFpc2thaScpOyAkb1sndGlla19wYXN0YWknXT1nZXRfb3B0aW9uKCdwc190aWVrX3Bhc3RhaScpOyAkb1snb3B0X3RpZWsnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncHNfdGllayUnIik7CiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfRHJvcHNoaXAnKSl7ICRtPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfQVZfRHJvcHNoaXAnKTsgJG9bJ2RzX21ldGhvZHMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeC0+bmFtZTt9LCRtLT5nZXRNZXRob2RzKFJlZmxlY3Rpb25NZXRob2Q6OklTX1NUQVRJQykpOyBpZihtZXRob2RfZXhpc3RzKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJywnbGF1a2lhbnR5c19wZXJkYXZpbW8nKSl7ICRsPVBldHNob3BfQVZfRHJvcHNoaXA6OmxhdWtpYW50eXNfcGVyZGF2aW1vKCk7ICRvWydkc19sYXVraWEnXT1pc19hcnJheSgkbCk/KGlzc2V0KCRsWyd2ZiddKT8kbDphcnJheV9zbGljZSgkbCwwLDIwLHRydWUpKTokbDsgfSB9CiAgICAkb1sndmZfcGVuZGluZ19vcmRlcnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLG8uc3RhdHVzIEZST00geyRwfXdjX29yZGVycyBvIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycpIE9SREVSIEJZIG8uaWQgREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgICAkdHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJG9bJ3Rlc3R1b3RvamFzJ109JHR1PyR0dS0+SUQ6bnVsbDsgJGluZz1nZXRfdXNlcl9ieSgnbG9naW4nLCdpbmdhJyk7ICRvWydpbmdhJ109JGluZz8kaW5nLT5JRDpudWxsOwogICAgJG9bJ3NrYWl0J109YXJyYXkoJ2F2cG4nPT5nZXRfb3B0aW9uKCdwZXRzaG9wX2F2cG5fY291bnRlcicpLCdpYXB2Jz0+Z2V0X29wdGlvbigncGV0c2hvcF9pYXB2X2NvdW50ZXInKSk7ICRvWydkZXZfcGFzdGFzX24nXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSkpOwogICAgJG9bJ3RlbXBfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOyAkSigkbyk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-110417';
const GKEY='ps_e1r';
const PHASES=["R"];
const OUT='analize/s1621_e1r.json';
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
