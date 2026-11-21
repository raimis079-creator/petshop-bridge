process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTIweCByeXRvIHR5cmltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxOTIweCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE5MjB4J107ICR0ej1uZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpOwogIC8vIDEuIHV6c2FreW1haQogICR3YW50PVsnMTczOCcsJzE3NDEnLCcxODQwJywnMTYzOCddOyAkclsndXpzJ109W107CiAgJG9zPXdjX2dldF9vcmRlcnMoWydsaW1pdCc9Pi0xLCd0eXBlJz0+J3Nob3Bfb3JkZXInLCdkYXRlX2NyZWF0ZWQnPT4nPj0nLihuZXcgRGF0ZVRpbWUoJzIwMjYtMTEtMTIgMDA6MDA6MDAnLCR0eikpLT5nZXRUaW1lc3RhbXAoKV0pOwogIGZvcmVhY2goJG9zIGFzICRvKXsgJG49JG8tPmdldF9vcmRlcl9udW1iZXIoKTsgaWYoIWluX2FycmF5KCRuLCR3YW50LHRydWUpICYmICRvLT5nZXRfc3RhdHVzKCkhPT0nY2FuY2VsbGVkJykgY29udGludWU7CiAgICAkbT0kby0+Z2V0X2RhdGVfbW9kaWZpZWQoKTsgJG5vdGVzPXdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JG8tPmdldF9pZCgpLCdsaW1pdCc9PjZdKTsKICAgICRyWyd1enMnXVtdPVsnbnInPT4kbiwnaWQnPT4kby0+Z2V0X2lkKCksJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwnc3VtYSc9PiRvLT5nZXRfdG90YWwoKSwncG0nPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJ3N1a3VydGEnPT4kby0+Z2V0X2RhdGVfY3JlYXRlZCgpPyRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPnNldFRpbWV6b25lKCR0eiktPmZvcm1hdCgnbS1kIEg6aScpOicnLCdrZWlzdGEnPT4kbT8kbS0+c2V0VGltZXpvbmUoJHR6KS0+Zm9ybWF0KCdtLWQgSDppJyk6JycsJ2FwbSc9PiRvLT5nZXRfZGF0ZV9wYWlkKCk/JG8tPmdldF9kYXRlX3BhaWQoKS0+c2V0VGltZXpvbmUoJHR6KS0+Zm9ybWF0KCdtLWQgSDppJyk6JycsJ3Bhc3RhYm9zJz0+YXJyYXlfbWFwKGZuKCR4KT0+JHgtPmRhdGVfY3JlYXRlZC0+c2V0VGltZXpvbmUoJHR6KS0+Zm9ybWF0KCdtLWQgSDppJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkeC0+Y29udGVudCksMCwxNjApLCRub3RlcyldOyB9CiAgLy8gMi4gWkIgIzMgaXN0b3JpamEKICAkclsnemIzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGF0ZSwgTEVGVChzdW1tYXJ5LDkwKSBzIEZST00geyRQfXBteGlfaGlzdG9yeSBXSEVSRSBpbXBvcnRfaWQ9MyBBTkQgZGF0ZT49VVRDX0RBVEUoKS1JTlRFUlZBTCAzIERBWSBBTkQgc3VtbWFyeSBMSUtFICclZmluaXNoZWQlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYwIixBUlJBWV9BKTsKICAkclsnemIzX3N1X3BvayddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGRhdGUsIExFRlQoc3VtbWFyeSw5MCkgcyBGUk9NIHskUH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTMgQU5EIHN1bW1hcnkgTElLRSAnJWZpbmlzaGVkJScgQU5EIHN1bW1hcnkgTk9UIExJS0UgJyUwIHVwZGF0ZWQlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDUiLEFSUkFZX0EpOwogICRyWyd6Yl9zdG9ja19tb2QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKHBtLm1ldGFfdmFsdWUpIGQsIENPVU5UKCopIG4gRlJPTSB7JFB9cG9zdG1ldGEgcG0gV0hFUkUgcG0ubWV0YV9rZXk9J19wc196Yl9zdG9ja19hdCcgR1JPVVAgQlkgMSBPUkRFUiBCWSAxIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgJHU9J2h0dHBzOi8vemFsaW9qaWJhbmdhLmx0L2ludGVncmF0aW9ucy9zZXJ2aWNlcy9zdG9ja3MucGhwJzsgJGltcDM9JHdwZGItPmdldF9yb3coIlNFTEVDVCBwYXRoIEZST00geyRQfXBteGlfaW1wb3J0cyBXSEVSRSBpZD0zIixBUlJBWV9BKTsgJHJbJ3piM19wYXRoX2hvc3QnXT1wYXJzZV91cmwoJGltcDNbJ3BhdGgnXT8/JycsUEhQX1VSTF9IT1NUKTsKICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZnM9Z2xvYigkdXBbJ2Jhc2VkaXInXS4nL3dwYWxsaW1wb3J0L2ZpbGVzLypzdG9jayonKT86W107ICRyWyd6YjNfZmFpbGFpJ109YXJyYXlfbWFwKGZuKCRmKT0+W2Jhc2VuYW1lKCRmKSxmaWxlc2l6ZSgkZiksKG5ldyBEYXRlVGltZSgnQCcuZmlsZW10aW1lKCRmKSkpLT5zZXRUaW1lem9uZSgkdHopLT5mb3JtYXQoJ20tZCBIOmknKSxtZDVfZmlsZSgkZildLGFycmF5X3NsaWNlKCRmcywtNCkpOwogIC8vIDMuIHBocCBsb2cgcmVzdC1zZXJ2ZXIKICAkbGY9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRzej1maWxlc2l6ZSgkbGYpOyAkZmg9Zm9wZW4oJGxmLCdyJyk7IGZzZWVrKCRmaCxtYXgoMCwkc3otNDAwMDAwMCkpOyAkdHg9ZnJlYWQoJGZoLDQwMDAwMDApOyBmY2xvc2UoJGZoKTsgJEw9ZXhwbG9kZSgiXG4iLCR0eCk7CiAgJHJbJ3Jlc3QnXT1bJ2RpZW5vcyc9PltdLCdwdnonPT5bXV07IGZvcmVhY2goJEwgYXMgJGk9PiRsbil7IGlmKHN0cnBvcygkbG4sJ2NsYXNzLXdwLXJlc3Qtc2VydmVyLnBocCcpPT09ZmFsc2UpIGNvbnRpbnVlOyBpZighcHJlZ19tYXRjaCgnI15cWyhcZFxkLVx3ezN9LVxkezR9KSAoXGRcZDpcZFxkKSMnLCRsbiwkbSkpIGNvbnRpbnVlOyAkclsncmVzdCddWydkaWVub3MnXVskbVsxXV09KCRyWydyZXN0J11bJ2RpZW5vcyddWyRtWzFdXT8/MCkrMTsgaWYoY291bnQoJHJbJ3Jlc3QnXVsncHZ6J10pPDYgfHwgJG1bMV09PScyMS1Ob3YtMjAyNicpICRyWydyZXN0J11bJ3B2eiddW109bWJfc3Vic3RyKCRsbiwwLDI2MCkuJyB8fCBQUklFUzogJy5tYl9zdWJzdHIoJExbJGktMV0/PycnLDAsMjAwKTsgfQogICRyWydyZXN0J11bJ3B2eiddPWFycmF5X3NsaWNlKCRyWydyZXN0J11bJ3B2eiddLC0xMCk7CiAgLy8gNC4gNTAwIHBlciBwYXJhIGFjY2VzcyBsb2cKICAkZG9tPWRpcm5hbWUoQUJTUEFUSCk7ICRlNT1bXTsgZm9yZWFjaChbJ05vdi0yMDI2LnRhci5neicsJ05vdi0yMDI2LnRhci5nei4xJywnTm92LTIwMjYudGFyLmd6LjInXSBhcyAkYil7ICRmeD0kZG9tLicvbG9ncy8nLiRiOyBpZighaXNfZmlsZSgkZngpKSBjb250aW51ZTsgJGg9Z3pvcGVuKCRmeCwncmInKTsgd2hpbGUoKCRsbj1nemdldHMoJGgsMTYzODQpKSE9PWZhbHNlKXsgaWYoIXByZWdfbWF0Y2goJyNcWyhcZFxkL1x3ezN9L1xkezR9OlxkXGQ6XGRcZDpcZFxkKSBbXlxdXStcXSAiKFxTKykgKFxTKylbXiJdKiIgNTAwIFxTKyAiW14iXSoiICIoW14iXSopIiMnLCRsbiwkbSkpIGNvbnRpbnVlOyAkZTVbXT0kbVsxXS4nICcuJG1bMl0uJyAnLm1iX3N1YnN0cigkbVszXSwwLDExMCkuJyB8ICcubWJfc3Vic3RyKCRtWzRdLDAsNTApOyB9IGd6Y2xvc2UoJGgpOyB9CiAgJHJbJ2U1MDAnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRlNSxmbigkeCk9PnN0cnBvcygkeCwnYWRtaW4tYWpheC5waHA/YWN0aW9uPWFzX2FzeW5jJyk9PT1mYWxzZSAmJiBzdHJwb3MoJHgsJ3dwLWNyb24ucGhwJyk9PT1mYWxzZSkpOyAkclsnZTUwMF92aXNvJ109Y291bnQoJGU1KTsKICAvLyA1LiBhZHZlbnRvCiAgZm9yZWFjaChbMzg3MDcsMzg3MDldIGFzICRwaWQpeyAkcD1nZXRfcG9zdCgkcGlkKTsgJHJbJ2FkdiddWyRwaWRdPVskcC0+cG9zdF9zdGF0dXMsJHAtPnBvc3RfbW9kaWZpZWQsZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpLGdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3JhbmthX2lzaW10YScsdHJ1ZSksKGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVyX3Byb2R1Y3RfbG9va3VwIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRwaWQpKV07IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-075336';
const GKEY='ps_s1920x';
const PHASES=["1"];
const OUT='analize/s1920_x.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
