process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3ZGcgdcW+c2FreW3FsyBkaWFnbm9zdGlrYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MDdkZyddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTYwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nZGcnLCdkYWJhcic9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgJHJbJ3V6c19wYWdhbF9kJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShDT05WRVJUX1RaKGRhdGVfY3JlYXRlZF9nbXQsJyswMDowMCcsJyswMjowMCcpKSBkLHN0YXR1cyxDT1VOVCgqKSBuIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49REFURV9TVUIoVVRDX1RJTUVTVEFNUCgpLElOVEVSVkFMIDMgREFZKSBHUk9VUCBCWSBkLHN0YXR1cyBPUkRFUiBCWSBkIixBUlJBWV9BKTsKICAkclsnc2lhbmRpZW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdGF0dXMscGF5bWVudF9tZXRob2QsdG90YWxfYW1vdW50LGRhdGVfY3JlYXRlZF9nbXQgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0xMC0yOCAyMjowMDowMCcgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICRUPSRQLidwc193ZWJfaXZ5a2lhaSc7ICRyWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEsdGlwYXMsQ09VTlQoKikgbiBGUk9NICRUIFdIRVJFIGRpZW5hPj1EQVRFX1NVQihDVVJEQVRFKCksSU5URVJWQUwgMiBEQVkpIEFORCB0aXBhcyBJTigncGFnZXZpZXcnLCd2aWV3X2l0ZW0nLCdhZGRfdG9fY2FydCcsJ2JlZ2luX2NoZWNrb3V0JywncHVyY2hhc2UnLCdjaGVja291dF92aWV3JywnY2hlY2tvdXRfZXJyb3InKSBHUk9VUCBCWSBkaWVuYSx0aXBhcyBPUkRFUiBCWSBkaWVuYSx0aXBhcyIsQVJSQVlfQSk7CiAgJHJbJ2l2eWtpYWlfdGlwYWlfc2lhbmRpZW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aXBhcyxDT1VOVCgqKSBuIEZST00gJFQgV0hFUkUgZGllbmE9Q1VSREFURSgpIEdST1VQIEJZIHRpcGFzIE9SREVSIEJZIG4gREVTQyBMSU1JVCAyNSIsQVJSQVlfQSk7CiAgJHJbJ3ZhbGFuZG9zX3NpYW5kaWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSE9VUihsYWlrYXMpIGgsQ09VTlQoKikgbixTVU0odGlwYXM9J2FkZF90b19jYXJ0JykgYXRjIEZST00gJFQgV0hFUkUgZGllbmE9Q1VSREFURSgpIEdST1VQIEJZIGgiLEFSUkFZX0EpOwogICRyWyd2YWxhbmRvc192YWthciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIEhPVVIobGFpa2FzKSBoLENPVU5UKCopIG4sU1VNKHRpcGFzPSdhZGRfdG9fY2FydCcpIGF0YyBGUk9NICRUIFdIRVJFIGRpZW5hPURBVEVfU1VCKENVUkRBVEUoKSxJTlRFUlZBTCAxIERBWSkgR1JPVVAgQlkgaCIsQVJSQVlfQSk7CiAgJEM9JFAuJ3BzX2NhcnRzJzsgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRDJyIpKXsgJGNjPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkQyIpOyAkZGM9aW5fYXJyYXkoJ2NyZWF0ZWRfYXQnLCRjYyk/J2NyZWF0ZWRfYXQnOiRjY1sxXTsgJHJbJ2NhcnRzX2NvbHMnXT0kY2M7ICRyWydjYXJ0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoJGRjKSBkLENPVU5UKCopIG4gRlJPTSAkQyBXSEVSRSAkZGM+PURBVEVfU1VCKFVUQ19USU1FU1RBTVAoKSxJTlRFUlZBTCAzIERBWSkgR1JPVVAgQlkgZCIsQVJSQVlfQSk7IH0KICAkZ3c9V0MoKS0+cGF5bWVudF9nYXRld2F5cygpLT5wYXltZW50X2dhdGV3YXlzKCk7IGZvcmVhY2goJGd3IGFzICRpZD0+JGcpeyBpZigkZy0+ZW5hYmxlZD09PSd5ZXMnKSAkclsnZ2F0ZXdheXMnXVtdPSRpZDsgfQogICRmPWluaV9nZXQoJ2Vycm9yX2xvZycpOyBpZigkZiYmaXNfZmlsZSgkZikpeyAkcz1maWxlX2dldF9jb250ZW50cygkZixmYWxzZSxudWxsLG1heCgwLGZpbGVzaXplKCRmKS00MDAwMDApKTsgJGw9YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJHMpLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RycG9zKCR4LCcyOS1PY3QtMjAyNicpIT09ZmFsc2UmJihzdHJpcG9zKCR4LCdmYXRhbCcpIT09ZmFsc2V8fHN0cmlwb3MoJHgsJ3VuY2F1Z2h0JykhPT1mYWxzZSk7fSkpOyAkclsnZmF0YWxfc2lhbmRpZW5fbiddPWNvdW50KCRsKTsgJHJbJ2ZhdGFsX3B2eiddPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cigkeCwwLDI2MCk7fSwkbCksLTYpOyB9CiAgJGdldD1mdW5jdGlvbigkcCl7ICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJHApLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wLCdoZWFkZXJzJz0+WydVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIFBTLWRpYWcnXV0pOyByZXR1cm4gaXNfd3BfZXJyb3IoJHgpP1swLCR4LT5nZXRfZXJyb3JfbWVzc2FnZSgpXTpbd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLHN0cmxlbih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCkpLChpbnQpKHN0cmlwb3Mod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLCdrcml0aW7ElyBrbGFpZGEnKSE9PWZhbHNlfHxzdHJpcG9zKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSwnY3JpdGljYWwgZXJyb3InKSE9PWZhbHNlKV07IH07CiAgZm9yZWFjaChbJy8nLCcva3JlcHNlbGlzLycsJy9rYXNhLycsJy9wcm9kdWN0L2pvc2VyYS1zZW5zaXBsdXMtMTI1LWtnLXNhdXNhcy1tYWlzdGFzLXN1bmltcy1zdS1qYXV0cmlhLXZpcnNraW5pbW8tc2lzdGVtYS8nLCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvc2F1c2FzLW1haXN0YXMtc3VuaW1zLyddIGFzICRwKSAkclsncHVzbGFwaWFpJ11bJHBdPSRnZXQoJHApOwogICRyWydtdV9wYWtlaXN0aV8yNGgnXT1bXTsgZm9yZWFjaChnbG9iKFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy8qLnBocCcpIGFzICRwKXsgaWYoZmlsZW10aW1lKCRwKT50aW1lKCktMzYqMzYwMCkgJHJbJ211X3Bha2Vpc3RpXzI0aCddW2Jhc2VuYW1lKCRwKV09ZGF0ZSgnbS1kIEg6aScsZmlsZW10aW1lKCRwKSs3MjAwKTsgfQogICRyWydwbHVnaW5haV9wYWtlaXN0aSddPVtdOyBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zLyonLEdMT0JfT05MWURJUikgYXMgJGQpeyBpZihmaWxlbXRpbWUoJGQpPnRpbWUoKS0zNiozNjAwKSAkclsncGx1Z2luYWlfcGFrZWlzdGknXVtiYXNlbmFtZSgkZCldPWRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZCkrNzIwMCk7IH0KICAkclsnc25pcHBldHNfYWt0eXZ1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsbW9kaWZpZWQgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG1vZGlmaWVkPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzIERBWSkiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwxKTsK';
const VER='dep-161348';
const GKEY='ps_s1807dg';
const PHASES=["1"];
const OUT='analize/s1807_dg.json';
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
