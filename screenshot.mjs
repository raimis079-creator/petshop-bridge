process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwZyByZWNvbiAzIOKAlCBldGFsb25pbmlhaSBhcHJhxaF5bWFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDBnJ10pPyRfR0VUWydwc19zMTgwMGcnXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE4MDBnJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgLy8gdG9wIDMga2HEjWnFsyBzYXVzbyBtYWlzdG8gcHJla8SXcyBwYWdhbCBwYXJkYXZpbXVzIDM2NSBkLiBzdSDFocSXcmltbyBsZW50ZWxlCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgZS5wcmVrZV9pZCBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgZSBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPWUucHJla2VfaWQgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRlcm1faWQ9ODEgSk9JTiB7JHB9cHNfZmVlZGluZ19tYXAgZm0gT04gZm0ucHJvZHVjdF9pZD1lLnByZWtlX2lkIEFORCBmbS5pc19hY3RpdmU9MSBXSEVSRSBlLmRpZW5hPj1EQVRFX1NVQihDVVJEQVRFKCksSU5URVJWQUwgMzY1IERBWSkgR1JPVVAgQlkgZS5wcmVrZV9pZCBPUkRFUiBCWSBTVU0oZS5raWVraXMpIERFU0MgTElNSVQgMyIpOwogICAgJGlkc1tdPTM2MjUyOyAkaWRzW109MTk3NzU7IC8vIEFtYnJvc2lhIHNlbmlvciDFoXVuaW1zOyBBbWJyb3NpYSBwdXBweQogICAgLy8ga29uc2VydmFpIGthdMSXbXMgdG9wIDEKICAgICRjPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgZS5wcmVrZV9pZCBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgZSBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPWUucHJla2VfaWQgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRlcm1faWQ9NzkgV0hFUkUgZS5kaWVuYT49REFURV9TVUIoQ1VSREFURSgpLElOVEVSVkFMIDM2NSBEQVkpIEdST1VQIEJZIGUucHJla2VfaWQgT1JERVIgQlkgU1VNKGUua2lla2lzKSBERVNDIExJTUlUIDEiKTsKICAgIGlmKCRjKSAkaWRzW109JGM7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOwogICAgICAkeD1hcnJheSgnaWQnPT4kaWQsJ25hbWUnPT4kcHItPmdldF9uYW1lKCksJ3NsdWcnPT4kcHItPmdldF9zbHVnKCksJ3NrdSc9PiRwci0+Z2V0X3NrdSgpLCd3ZWlnaHQnPT4kcHItPmdldF93ZWlnaHQoKSwnY2F0cyc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSksJ2JyYW5kJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLCdleGNlcnB0Jz0+JHByLT5nZXRfc2hvcnRfZGVzY3JpcHRpb24oKSwnY29udGVudCc9PiRwci0+Z2V0X2Rlc2NyaXB0aW9uKCksJ2ltZyc9PndwX2dldF9hdHRhY2htZW50X3VybCgkcHItPmdldF9pbWFnZV9pZCgpKSwnZ2FsbGVyeSc9PmFycmF5X21hcCgnd3BfZ2V0X2F0dGFjaG1lbnRfdXJsJywkcHItPmdldF9nYWxsZXJ5X2ltYWdlX2lkcygpKSk7CiAgICAgIGZvcmVhY2goJHByLT5nZXRfYXR0cmlidXRlcygpIGFzICRrPT4kYSl7ICR4WydhdHRycyddWyRrXT1hcnJheV9tYXAoZnVuY3Rpb24oJHQpeyByZXR1cm4gJHQtPm5hbWU7IH0sIHdwX2dldF9wb3N0X3Rlcm1zKCRpZCwkaykpOyB9CiAgICAgIGZvcmVhY2goYXJyYXkoJ19nbG9iYWxfdW5pcXVlX2lkJywnX3BzX3NhbmRlbGlzJywnX3BzX3BpbG51bWFzJywnX3BzX3BpbG51bWFzX3RydWtzdGEnLCdyYW5rX21hdGhfdGl0bGUnLCdyYW5rX21hdGhfZGVzY3JpcHRpb24nLCdfeW9hc3Rfd3BzZW9fdGl0bGUnLCdfeW9hc3Rfd3BzZW9fbWV0YWRlc2MnLCdfd3BfYXR0YWNobWVudF9pbWFnZV9hbHQnKSBhcyAkaykgJHhbJ21ldGEnXVska109Z2V0X3Bvc3RfbWV0YSgkaWQsJGssdHJ1ZSk7CiAgICAgICR4WydpbWdfYWx0J109Z2V0X3Bvc3RfbWV0YSgkcHItPmdldF9pbWFnZV9pZCgpLCdfd3BfYXR0YWNobWVudF9pbWFnZV9hbHQnLHRydWUpOwogICAgICAkZm09JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkaWQpLEFSUkFZX0EpOwogICAgICBpZigkZm0peyAkdD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHB9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQ9JWQiLCRmbVsnZmVlZGluZ190YWJsZV9pZCddKSxBUlJBWV9BKTsgdW5zZXQoJHRbJ3Jvd3NfYmFja3VwX2pzb24nXSk7ICR4WydmdGFibGUnXT0kdDsgJHhbJ2Zyb3dzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgcm93X29yZGVyLHdlaWdodF9mcm9tX2tnLHdlaWdodF90b19rZyxhbW91bnRfZnJvbV9nLGFtb3VudF90b19nLGNvbmRpdGlvbl9kaW1lbnNpb25zLGNvbmRpdGlvbl9yYXcsY2VsbF90eXBlLHNvdXJjZV9sYWJlbCBGUk9NIHskcH1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIiLCRmbVsnZmVlZGluZ190YWJsZV9pZCddKSxBUlJBWV9BKTsgfQogICAgICAkb1sncHJla2VzJ11bXT0keDsKICAgIH0KICAgICRvWydjYXRfdGFibGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsYnJhbmQsbGluZSxzY29wZSxzcGVjaWVzLHN0YXR1cyxyb3dfY291bnQsaXNfYWN0aXZlLGxvb2t1cF9tZXRob2Qscm93X2RpbWVuc2lvbixzaGFwZSBGUk9NIHskcH1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBzcGVjaWVzPSdjYXQnIEFORCBpc19hY3RpdmU9MSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-122906';
const GKEY='ps_s1800g';
const PHASES=["GO"];
const OUT='analize/s1800_g.json';
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
