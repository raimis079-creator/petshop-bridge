process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzc5ZCBha2Npam9zL25hdWpvcyBrYWlub3MsIGtyZXBzZWxpbyBwcmltaW5pbWFpLCBsYWlza3UgdXRtIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc3OWQnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc3OWQnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkRUo9JFAuJ3BzX2VtYWlsX2pvYnMnOwogIHRyeXsKICAgICRBPVsxNDY3NSwxNDY3MSwxNDY0MiwxNDYzMCwxNDYzNCwxNDYzOCwzNjQ3OSwzNjQ3NywyMDUzNywyMTExOSwyMTE0MywyMTE0NywyMTEzMywyMTExNV07CiAgICBmb3JlYWNoKCRBIGFzICRwaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHJbJ2thaW5vcyddWyRwaWRdPVttYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw0MCksJHAtPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0JyksJHAtPmdldF9zYWxlX3ByaWNlKCdlZGl0JyksJHAtPmdldF9wcmljZSgpLCRwLT5nZXRfc3RvY2tfc3RhdHVzKCksZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfZHBfbnVvbGFpZGFfcHJvYycsdHJ1ZSldOyB9CiAgICAkcT1mdW5jdGlvbigkaWRzLCRudW8pIHVzZSgkd3BkYiwkUCl7ICRpbj1pbXBsb2RlKCcsJywkaWRzKTsgcmV0dXJuICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsIG8uc3RhdHVzLCBvLmRhdGVfY3JlYXRlZF9nbXQsIGltLm1ldGFfdmFsdWUgcGlkLCBxLm1ldGFfdmFsdWUgcXR5LCB0Lm1ldGFfdmFsdWUgc3VtYSBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9aS5vcmRlcl9pZCBBTkQgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nJG51bycgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgaW0gT04gaW0ub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIGltLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgQU5EIGltLm1ldGFfdmFsdWUgSU4gKCRpbikgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgcSBPTiBxLm9yZGVyX2l0ZW1faWQ9aS5vcmRlcl9pdGVtX2lkIEFORCBxLm1ldGFfa2V5PSdfcXR5JyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSB0IE9OIHQub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIHQubWV0YV9rZXk9J19saW5lX3RvdGFsJyIsQVJSQVlfQSk7IH07CiAgICAkclsndmV0bGlmZV91enMnXT0kcShbMTQ2NzUsMTQ2NzEsMTQ2NDIsMTQ2MzAsMTQ2MzQsMTQ2MzgsMzY0NzksMzY0NzddLCcyMDI2LTEwLTEwIDE5OjQ0OjAwJyk7CiAgICAkclsnbWVkaXRlcnJhbmVvX3V6cyddPSRxKFsyMDUzNywyMTExOSwyMTE0MywyMTE0NywyMTEzMywyMTExNV0sJzIwMjYtMTAtMTEgMTk6MTE6MDAnKTsKICAgICRyWydrcmVwc2VsaXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgZmxvdywgZmxvd19jbGFzcywgc3RhdHVzLCBDT0FMRVNDRShza2lwX3JlYXNvbiwnJykgc3IsIGNyZWF0ZWRfYXQsIHNlbnRfYXQsIExFRlQoTUQ1KExPV0VSKHJlY2lwaWVudF9lbWFpbCkpLDYpIGVsIEZST00gJEVKIFdIRVJFIGZsb3cgSU4oJ2NhcnRfYWJhbmRvbmVkJywnY2FydF9hYmFuZG9uZWRfMicpIEFORCBjcmVhdGVkX2F0Pj0nMjAyNi0xMC0xMiAwNzowMDowMCcgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICAgJHJbJ2xhaXNrYWlfMjRoJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdywgc3RhdHVzLCBDT0FMRVNDRShza2lwX3JlYXNvbiwnJykgc3IsIENPVU5UKCopIG4gRlJPTSAkRUogV0hFUkUgQ09BTEVTQ0Uoc2VudF9hdCx1cGRhdGVkX2F0KT49JzIwMjYtMTAtMTIgMDc6MDA6MDAnIEdST1VQIEJZIDEsMiwzIE9SREVSIEJZIDEiLEFSUkFZX0EpOwogICAgJHJbJ3V0bV9sYWlza2FpX3V6cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsIG8udG90YWxfYW1vdW50LCBjLm1ldGFfdmFsdWUgY2FtcCBGUk9NIHskUH13Y19vcmRlcnMgbyBKT0lOIHskUH13Y19vcmRlcnNfbWV0YSBzIE9OIHMub3JkZXJfaWQ9by5pZCBBTkQgcy5tZXRhX2tleT0nX3djX29yZGVyX2F0dHJpYnV0aW9uX3V0bV9zb3VyY2UnIEFORCBzLm1ldGFfdmFsdWUgSU4oJ3BldHNob3BfbGFpc2thaScsJ25ld3NsZXR0ZXInKSBMRUZUIEpPSU4geyRQfXdjX29yZGVyc19tZXRhIGMgT04gYy5vcmRlcl9pZD1vLmlkIEFORCBjLm1ldGFfa2V5PSdfd2Nfb3JkZXJfYXR0cmlidXRpb25fdXRtX2NhbXBhaWduJyBXSEVSRSBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTEwLTEyIDA3OjAwOjAwJyIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKHdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjEwLCd0eXBlJz0+J3Nob3Bfb3JkZXInLCdzdGF0dXMnPT4nYW55JywnZGF0ZV9jcmVhdGVkJz0+Jz49Jy5zdHJ0b3RpbWUoJzIwMjYtMTAtMTEgMTI6MDA6MDAgVVRDJyldKSBhcyAkbyl7IGlmKGluX2FycmF5KCRvLT5nZXRfb3JkZXJfbnVtYmVyKCksWycxMzU5JywnMTM2MCcsJzEzNjEnXSx0cnVlKSl7ICRudD1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRvLT5nZXRfaWQoKSwnbGltaXQnPT4zXSkgYXMgJG4pICRudFtdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDEyMCk7ICRyWydhdHNhdWt0aSddWyRvLT5nZXRfb3JkZXJfbnVtYmVyKCldPSRudDsgfSB9CiAgICBmb3JlYWNoKHdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjUsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ3N0YXR1cyc9PidhbnknLCdkYXRlX2NyZWF0ZWQnPT4nPj0nLnN0cnRvdGltZSgnMjAyNi0xMC0xMCAxMjowMDowMCBVVEMnKSwnZGF0ZV9jcmVhdGVkX2VuZCc9PicnXSkgYXMgJG8pe30KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-062200';
const GKEY='ps_s1779d';
const PHASES=["1"];
const OUT='out/s1779d.json';
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
