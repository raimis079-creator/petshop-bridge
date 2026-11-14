process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY3aiBiZXN0c2VsZXJpYWkgYmUgbGlrdWNpbyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjdqJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg2N2onXTsKICAkdGU9JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc19mYWt0X2VpbHV0ZXMnIik7IGlmKCEkdGUpeyAkclsndGFibGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc19mYWt0JSciKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KICAkdG9wPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUucHJla2VfaWQgcGlkLCBlLnZhcmlhY2lqYV9pZCB2aWQsIENPVU5UKERJU1RJTkNUIGUudXpzYWt5bWFzX2lkKSB1enMsIE1BWChlLmRpZW5hKSBwYXNrIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIEpPSU4geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgT04gdS51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgQU5EIHUuc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgQU5EIHUudGVzdGluaXM9MCBXSEVSRSBlLmRpZW5hPj1DVVJEQVRFKCktSU5URVJWQUwgNjAgREFZIEdST1VQIEJZIDEsMiBPUkRFUiBCWSB1enMgREVTQyBMSU1JVCAxNTAiLEFSUkFZX0EpOwogIGZvcmVhY2goJHRvcCBhcyAkeCl7ICRpZD0oaW50KSgkeFsndmlkJ10/OiR4WydwaWQnXSk7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7IGlmKGdldF9wb3N0X21ldGEoKGludCkkeFsncGlkJ10sJ19wc19zYW5kZWxpcycsdHJ1ZSkhPT0nYXYnKSBjb250aW51ZTsKICAgIGlmKCRwLT5nZXRfc3RvY2tfc3RhdHVzKCk9PT0naW5zdG9jaycgJiYgZ2V0X3Bvc3Rfc3RhdHVzKChpbnQpJHhbJ3BpZCddKT09PSdwdWJsaXNoJyAmJiAkcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpIT09J2hpZGRlbicpIGNvbnRpbnVlOwogICAgJG5tPSRwLT5nZXRfbmFtZSgpOyAkcmFrdGFzPW1iX3N1YnN0cigkbm0sMCwyNik7CiAgICAkYWx0PSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDYwKSB0LCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3N0b2NrJykgc3QsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnKSBzIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIG0ubWV0YV92YWx1ZT0naW5zdG9jaycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcC5JRDw+JWQgQU5EIHAucG9zdF90aXRsZSBMSUtFICVzIEFORCBOT1QgRVhJU1RTKFNFTEVDVCAxIEZST00geyRQfXBvc3RtZXRhIGQgV0hFUkUgZC5wb3N0X2lkPXAuSUQgQU5EIGQubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnKSBMSU1JVCA0IiwoaW50KSR4WydwaWQnXSwkd3BkYi0+ZXNjX2xpa2UoJHJha3RhcykuJyUnKSxBUlJBWV9BKTsKICAgICRzYWxlczMwPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdXpzYWt5bWFzX2lkKSBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgcHJla2VfaWQ9JWQgQU5EIGRpZW5hPj1DVVJEQVRFKCktSU5URVJWQUwgMzAgREFZIiwoaW50KSR4WydwaWQnXSkpOwogICAgJHJbJ2JlJ11bXT1bJ3BpZCc9PihpbnQpJHhbJ3BpZCddLCd2aWQnPT4oaW50KSR4Wyd2aWQnXSwnbmFtZSc9Pm1iX3N1YnN0cigkbm0sMCw4MCksJ3V6czYwJz0+KGludCkkeFsndXpzJ10sJ3V6czMwJz0+KGludCkkc2FsZXMzMCwncGFza19wYXJkJz0+JHhbJ3Bhc2snXSwnc3RvY2snPT4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3NzJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKSwncHMnPT5nZXRfcG9zdF9zdGF0dXMoKGludCkkeFsncGlkJ10pLCd2aXMnPT4kcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLCdtb2QnPT5nZXRfcG9zdF9maWVsZCgncG9zdF9tb2RpZmllZCcsKGludCkkeFsncGlkJ10pLCdza3UnPT4kcC0+Z2V0X3NrdSgpLCdvd24nPT5nZXRfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCdhbHQnPT4kYWx0XTsgfQogICRyWyduJ109Y291bnQoJHJbJ2JlJ10/P1tdKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-091246';
const GKEY='ps_s1867j';
const PHASES=["1"];
const OUT='analize/s1867_j.json';
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
