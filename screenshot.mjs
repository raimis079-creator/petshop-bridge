process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM4YSBoaWthcmkgbG9va3VwIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfbDEnXSk/JF9HRVRbJ3BzX2wxJ106JycpOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjM4YScsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJGVpbD1hcnJheSgKICAgICAgYXJyYXkoJ0hJQSAwMTEyMCcsJzA0MjA1NTAxMTIwNCcsJ1NUQVBMRSBCQUJZIDEwMEcnLDUsJzcuOTAnKSwKICAgICAgYXJyYXkoJ0hJQSAwMzExMScsJzA0MjA1NTAzMTExMCcsJ0NJQ0hMSUQgU1RBUExFIEJBQlkgNTdHUicsNSwnNS40MycpLAogICAgICBhcnJheSgnSElBIDA0NjMzJywnMDQyMDU1MDQ2MzM2JywnQ0lDSExJRCBHT0xEIFNJTktJTkcgTUlOSSAzNDJHJyw1LCcyMS4xNScpLAogICAgICBhcnJheSgnSElBIDA0NzMzJywnMDQyMDU1MDQ3MzMzJywnQ0lDSExJRCBHT0xEIFNJTktJTkcgTUVESVVNIDM0MkcnLDUsJzIxLjE1JyksCiAgICAgIGFycmF5KCdISUEgMjEzMTYnLCcwNDIwNTUyMTMxNjUnLCdBTEdBRSBXQUZFUlMgODJHIDIwME1MJyw2LCcxMy44NCcpLAogICAgICBhcnJheSgnSElQIDAxNDgyJywnMDQyMDU1MDE0ODIzJywnU1RBUExFIExBUkdFIDVLRycsMSwnMTI3LjgzJyksCiAgICApOwogICAgZm9yZWFjaCgkZWlsIGFzICRlKXsKICAgICAgbGlzdCgkc3ltLCRiYXIsJHBhdiwkcSwkayk9JGU7CiAgICAgICR2YXI9YXJyYXkoJHN5bSxzdHJfcmVwbGFjZSgnICcsJycsJHN5bSksJGJhcik7CiAgICAgICRwaD1pbXBsb2RlKCcsJyxhcnJheV9maWxsKDAsY291bnQoJHZhciksJyVzJykpOwogICAgICAkaGl0cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgICAgICAgIlNFTEVDVCBwbS5wb3N0X2lkLHBtLm1ldGFfa2V5LHBtLm1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBwbQogICAgICAgICBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD1wbS5wb3N0X2lkIEFORCBwLnBvc3RfdHlwZSBJTigncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykKICAgICAgICAgV0hFUkUgcG0ubWV0YV92YWx1ZSBJTiAoJHBoKSIsJHZhciksQVJSQVlfQSk7CiAgICAgICRyPWFycmF5KCdzeW0nPT4kc3ltLCdiYXInPT4kYmFyLCdxJz0+JHEsJ2thaW5hX3Bsbic9PiRrLCdyYXN0YSc9PmFycmF5KCkpOwogICAgICAkaWRzPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJGhpdHMgYXMgJGgpeyAkaWRzWyRoWydwb3N0X2lkJ11dW109JGhbJ21ldGFfa2V5J10uJz0nLiRoWydtZXRhX3ZhbHVlJ107IH0KICAgICAgZm9yZWFjaCgkaWRzIGFzICRwaWQ9PiRtayl7CiAgICAgICAgJHJbJ3Jhc3RhJ11bXT1hcnJheSgnaWQnPT4oaW50KSRwaWQsJ3RpdGxlJz0+Z2V0X3RoZV90aXRsZSgkcGlkKSwKICAgICAgICAgICdzdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoJHBpZCksJ2F0aXRpa28nPT4kbWssCiAgICAgICAgICAnc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc2t1Jyx0cnVlKSwKICAgICAgICAgICdzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwKICAgICAgICAgICdzdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwKICAgICAgICAgICdvd24nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwKICAgICAgICAgICdtYW5hZ2UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19tYW5hZ2Vfc3RvY2snLHRydWUpKTsKICAgICAgfQogICAgICBpZighJGlkcyl7CiAgICAgICAgJGxpa2U9JyUnLiR3cGRiLT5lc2NfbGlrZShzdWJzdHIoJHBhdiwwLDE0KSkuJyUnOwogICAgICAgICR0PSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgICAgICJTRUxFQ1QgSUQscG9zdF90aXRsZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICVzIExJTUlUIDUiLCRsaWtlKSxBUlJBWV9BKTsKICAgICAgICAkclsncGFnYWxfcGF2YWRpbmltYSddPSR0OwogICAgICB9CiAgICAgICRvWydlaWx1dGVzJ11bXT0kcjsKICAgIH0KICAgICRvWydiYXJrb2RvX21ldGFfcmFrdGFpJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfdmFsdWU9JzA0MjA1NTAxMTIwNCciKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-210435';
const GKEY='ps_l1';
const PHASES=["GO"];
const OUT='analize/s1638_a.json';
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
