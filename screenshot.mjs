process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjk5IHBhaWVza29zIHJlY29uIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTY5OSddKXx8JF9HRVRbJ3BzX3MxNjk5J10hPT0nMScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjk5IG1hJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJFc9InskcH1wc193ZWJfaXZ5a2lhaSI7CiAgdHJ5ewogICAgJG9bJ3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBsYWlrYXMsIHVybF9rZWxpYXMsIHJha3RhcywgcmFrdGFzMiwgcmVpa3NtZSwgc2VzaWphLCBrYW5hbGFzIEZST00gJFcgV0hFUkUgdGlwYXM9J3NlYXJjaCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAgICRvWyduJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRXIFdIRVJFIHRpcGFzPSdzZWFyY2gnIEFORCBsYWlrYXM+PScyMDI2LTA5LTA3JyIpOwogICAgJG9bJ3NlcyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRXIFdIRVJFIHRpcGFzPSdzZWFyY2gnIEFORCBsYWlrYXM+PScyMDI2LTA5LTA3JyIpOwogICAgJG9bJ3Nlc192aXNvcyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRXIFdIRVJFIGxhaWthcz49JzIwMjYtMDktMDcnIik7CiAgICAvLyBmcmF6xJdzOiByYWt0YXMgPSB1xb5rbGF1c2E/IHJlaWtzbWUgPSByZXp1bHRhdMWzIHNrLj8KICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBzZXNpamEsIGxhaWthcywgcmFrdGFzLCByYWt0YXMyLCByZWlrc21lLCB1cmxfa2VsaWFzIEZST00gJFcgV0hFUkUgdGlwYXM9J3NlYXJjaCcgQU5EIGxhaWthcz49JzIwMjYtMDktMDcnIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAgICRmcj1hcnJheSgpOwogICAgZm9yZWFjaCgkcm93cyBhcyAkcil7CiAgICAgICRxPXRyaW0obWJfc3RydG9sb3dlcigkclsncmFrdGFzJ10hPT1udWxsPyRyWydyYWt0YXMnXTonJykpOyBpZigkcT09PScnKXsgcGFyc2Vfc3RyKChzdHJpbmcpcGFyc2VfdXJsKCRyWyd1cmxfa2VsaWFzJ10sUEhQX1VSTF9RVUVSWSksJHFzKTsgJHE9dHJpbShtYl9zdHJ0b2xvd2VyKCRxc1sncyddPz8nJykpOyB9CiAgICAgIGlmKCRxPT09JycpIGNvbnRpbnVlOwogICAgICBpZighaXNzZXQoJGZyWyRxXSkpICRmclskcV09YXJyYXkoJ24nPT4wLCdzZXMnPT5hcnJheSgpLCdyZXonPT5hcnJheSgpLCdwb192aWV3Jz0+MCwncG9fY2FydCc9PjAsJ3BvX29yZGVyJz0+MCk7CiAgICAgICRmclskcV1bJ24nXSsrOyAkZnJbJHFdWydzZXMnXVskclsnc2VzaWphJ11dPTE7IGlmKCRyWydyZWlrc21lJ10hPT1udWxsJiYkclsncmVpa3NtZSddIT09JycpICRmclskcV1bJ3JleiddW109KGludCkkclsncmVpa3NtZSddOwogICAgICAvLyBrYXMgdnlrbyBwZXIgMTAgbWluIHRvamUgcGHEjWlvamUgc2VzaWpvamUgcG8gcGFpZcWha29zCiAgICAgICRwbz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB0aXBhcyBGUk9NICRXIFdIRVJFIHNlc2lqYT0lcyBBTkQgaWQ+JWQgQU5EIGxhaWthczw9REFURV9BREQoJXMsIElOVEVSVkFMIDEwIE1JTlVURSkgQU5EIHRpcGFzIElOICgndmlld19pdGVtJywnYWRkX3RvX2NhcnQnLCdiZWdpbl9jaGVja291dCcpIiwkclsnc2VzaWphJ10sJHJbJ2lkJ10sJHJbJ2xhaWthcyddKSxBUlJBWV9BKTsKICAgICAgZm9yZWFjaCgkcG8gYXMgJHgpeyBpZigkeFsndGlwYXMnXT09PSd2aWV3X2l0ZW0nKSAkZnJbJHFdWydwb192aWV3J109MTsgaWYoJHhbJ3RpcGFzJ109PT0nYWRkX3RvX2NhcnQnKSAkZnJbJHFdWydwb19jYXJ0J109MTsgaWYoJHhbJ3RpcGFzJ109PT0nYmVnaW5fY2hlY2tvdXQnKSAkZnJbJHFdWydwb19vcmRlciddPTE7IH0KICAgIH0KICAgICRvdXQ9YXJyYXkoKTsgZm9yZWFjaCgkZnIgYXMgJHE9PiRhKXsgJG91dFtdPWFycmF5KCdxJz0+JHEsJ24nPT4kYVsnbiddLCdzZXMnPT5jb3VudCgkYVsnc2VzJ10pLCdyZXonPT5jb3VudCgkYVsncmV6J10pP21pbigkYVsncmV6J10pOm51bGwsJ3ZpZXcnPT4kYVsncG9fdmlldyddLCdjYXJ0Jz0+JGFbJ3BvX2NhcnQnXSwnY2hrJz0+JGFbJ3BvX29yZGVyJ10pOyB9CiAgICB1c29ydCgkb3V0LGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ24nXS0kYVsnbiddO30pOyAkb1snZnJhemVzJ109JG91dDsgJG9bJ3VuaWsnXT1jb3VudCgkb3V0KTsKICAgICRvWydyZWlrc21lX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHJlaWtzbWUsIENPVU5UKCopIG4gRlJPTSAkVyBXSEVSRSB0aXBhcz0nc2VhcmNoJyBBTkQgbGFpa2FzPj0nMjAyNi0wOS0wNycgR1JPVVAgQlkgcmVpa3NtZSBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-192554';
const GKEY='ps_s1699';
const PHASES=["1"];
const OUT='analize/s1699_ma.json';
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
