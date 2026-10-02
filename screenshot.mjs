process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ2YyBkaXNwYXRjaCBlaWxlICsgcmV0cnkgKyB2YWthciByYXVkb25pIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0NmMnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzQ2YyddOwogICRyWydwcDE0X2R1ZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxDT0FMRVNDRShza2lwX3JlYXNvbiwnJykgcHIsc2NoZWR1bGVkX2F0LG5leHRfYXR0ZW1wdF9hdCxkZWNpc2lvbl9hdCxhdHRlbXB0cyBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIGZsb3c9J3Bvc3RfcHVyY2hhc2VfMTRkJyBBTkQgc3RhdHVzIElOKCdwZW5kaW5nJywnZGVmZXJyZWQnKSBBTkQgc2NoZWR1bGVkX2F0PD1VVENfVElNRVNUQU1QKCkgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICR0PWZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZW1haWwtZGlzcGF0Y2gucGhwJyk7CiAgcHJlZ19tYXRjaF9hbGwoJy9jb25zdFxzK1x3K1xzKj1ccypbXjtdKzsvJywkdCwkbSk7ICRyWydjb25zdCddPSRtWzBdOwogICRwPXN0cnBvcygkdCwncHJvdGVjdGVkIHN0YXRpYyBmdW5jdGlvbiBwcm9jZXNzX29uZScpOyAkclsncHJvY2Vzc19vbmUnXT1zdWJzdHIoJHQsJHAsNDIwMCk7CiAgJHJbJ2Nyb25fc2NoZWQnXT13cF9nZXRfc2NoZWR1bGUoJ3BzX2VtYWlsX2Rpc3BhdGNoX2Nyb24nKTsKICAkclsnZWlsZV92aXJzdWplJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMsc2NoZWR1bGVkX2F0LG5leHRfYXR0ZW1wdF9hdCxhdHRlbXB0cyBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFICggc3RhdHVzID0gJ3BlbmRpbmcnIEFORCAoIHNjaGVkdWxlZF9hdCBJUyBOVUxMIE9SIHNjaGVkdWxlZF9hdCA8PSBVVENfVElNRVNUQU1QKCkgKSApIE9SICggc3RhdHVzID0gJ2RlZmVycmVkJyBBTkQgbmV4dF9hdHRlbXB0X2F0IElTIE5PVCBOVUxMIEFORCBuZXh0X2F0dGVtcHRfYXQgPD0gVVRDX1RJTUVTVEFNUCgpICkgT1JERVIgQlkgaWQgTElNSVQgMjUiLEFSUkFZX0EpOwogICRyWydzZW5kZXJfa2xhaWRvc18yNGgnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBMRUZUKENPQUxFU0NFKGxhc3RfZXJyb3IsZXJyb3JfbWVzc2FnZSksNjApIGUsIENPVU5UKCopIG4sIE1BWCh1cGRhdGVkX2F0KSBwYXNrIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgdXBkYXRlZF9hdD49VVRDX1RJTUVTVEFNUCgpLUlOVEVSVkFMIDI0IEhPVVIgQU5EIENPQUxFU0NFKGxhc3RfZXJyb3IsZXJyb3JfbWVzc2FnZSwnJyk8PicnIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWyd2YWthcl9yYXVkb25pJ109W107IGZvcmVhY2god2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+NjAsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ2RhdGVfY3JlYXRlZCc9PnN0cnRvdGltZSgnMjAyNi0wOS0yOCAwMDowMCBVVEMnKS4nLi4uJy5zdHJ0b3RpbWUoJzIwMjYtMDktMjkgMTI6MDAgVVRDJyldKSBhcyAkbyl7IGlmKGluX2FycmF5KCRvLT5nZXRfb3JkZXJfbnVtYmVyKCksWycxMjA3JywnMTIxNCcsJzEyMTYnXSx0cnVlKSl7ICRsPVtdOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JG8tPmdldF9pZCgpLCdvcmRlcic9PidERVNDJywnbGltaXQnPT4zXSkgYXMgJG5uKXsgJGxbXT0kbm4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG5uLT5jb250ZW50KSwwLDcwKTsgfSAkclsndmFrYXJfcmF1ZG9uaSddWyRvLT5nZXRfb3JkZXJfbnVtYmVyKCldPVskby0+Z2V0X3N0YXR1cygpLCRsXTsgfSB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-065722';
const GKEY='ps_s1746c';
const PHASES=["1"];
const OUT='out/s1746_c.json';
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
