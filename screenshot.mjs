process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3bCByZWNvbiByZWFkLW9ubHk6IGthcyB0cmluYS9yYXNvIGVpbHVjaXUgX3BzX3NvdXJjZTsgMzYyOTYgaXZ5a2lhaTsga2Vpc3RpX2tlbGlhL3J1c2l1b3RpIGtvZGFzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxN2wnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MTdsJ107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTcxN2wnLCdmYXplJz0+JGZdOyAkSUQ9MzYyOTY7CiAgJGZpbGVzPWFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovaW5jbHVkZXMvKi5waHAnKSxnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5waHAnKSk7CiAgJGJvZHk9ZnVuY3Rpb24oJHMsJG5hbWUsJG1heD01MDAwKXsgaWYoIXByZWdfbWF0Y2goJyMocHVibGljfHByaXZhdGV8cHJvdGVjdGVkKT9ccypzdGF0aWNccytmdW5jdGlvblxzKycuJG5hbWUuJ1xzKlwoW14pXSpcKVxzKlx7IycsJHMsJG0sUFJFR19PRkZTRVRfQ0FQVFVSRSkpIHJldHVybiBudWxsOyAkc3Q9JG1bMF1bMV07ICRpPSRzdCtzdHJsZW4oJG1bMF1bMF0pOyAkZD0xOyAkbj1zdHJsZW4oJHMpOyB3aGlsZSgkaTwkbiAmJiAkZD4wKXsgJGM9JHNbJGldOyBpZigkYz09PSd7JykgJGQrKzsgZWxzZWlmKCRjPT09J30nKSAkZC0tOyAkaSsrOyB9ICRiPXN1YnN0cigkcywkc3QsJGktJHN0KTsgcmV0dXJuIHN0cmxlbigkYik+JG1heD9zdWJzdHIoJGIsMCwkbWF4KS4n4oCmWysnLihzdHJsZW4oJGIpLSRtYXgpLiddJzokYjsgfTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgZm9yZWFjaCgkZmlsZXMgYXMgJGcpeyAkcz1maWxlX2dldF9jb250ZW50cygkZyk7IGlmKHByZWdfbWF0Y2hfYWxsKCIjW15cbl17MCwyMjB9KGRlbGV0ZV9tZXRhX2RhdGFcKFxzKidfcHNfc291cmNlfGRlbGV0ZV9tZXRhXChccyonX3BzX3NvdXJjZXx3Y19kZWxldGVfb3JkZXJfaXRlbV9tZXRhXChbXlxuXXswLDYwfV9wc19zb3VyY2V8J19wc19zb3VyY2UnXHMqXClccyo7fF9wc19zb3VyY2VfYXQpW15cbl17MCwyMjB9IyIsJHMsJG1tKSl7ICRyWyd0cmluYSddW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGcpXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIodHJpbSgkeCksMCw0NTApO30sYXJyYXlfdW5pcXVlKCRtbVswXSkpLDAsOCk7IH0gfQogICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc191enNha3ltdV9pdnlraWFpJyIpKXsgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc191enNha3ltdV9pdnlraWFpIik7ICRyWydpdl9jb2xzJ109JGNvbHM7ICRvYz1pbl9hcnJheSgndXpzYWt5bWFzJywkY29scyk/J3V6c2FreW1hcyc6KGluX2FycmF5KCd1enNha3ltYXNfaWQnLCRjb2xzKT8ndXpzYWt5bWFzX2lkJzonb3JkZXJfaWQnKTsgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc191enNha3ltdV9pdnlraWFpIFdIRVJFICRvYz0kSUQgT1JERVIgQlkgaWQiLEFSUkFZX0EpOyAkclsnaXZ5a2lhaSddPWFycmF5X21hcChmdW5jdGlvbigkeCl7IGZvcmVhY2goJHggYXMgJGs9PiR2KXsgaWYoaXNfc3RyaW5nKCR2KSYmbWJfc3RybGVuKCR2KT41MDApICR4WyRrXT1tYl9zdWJzdHIoJHYsMCw1MDApLifigKYnOyB9IHJldHVybiAkeDsgfSwkcm93cyk7IH0KICAgICRyWydpdGVtX21ldGFfZGInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcmRlcl9pdGVtX2lkLCBtZXRhX2tleSwgTEVGVChtZXRhX3ZhbHVlLDYwKSB2LCBtZXRhX2lkIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIFdIRVJFIG9yZGVyX2l0ZW1faWQgSU4gKDI1NzgsMjU3OSwyNTgwKSBBTkQgbWV0YV9rZXkgTElLRSAnXF8lJyBPUkRFUiBCWSBvcmRlcl9pdGVtX2lkLCBtZXRhX2lkIixBUlJBWV9BKTsKICAgICRyWydpdGVtX21ldGFfZGJfMzYyODgnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcmRlcl9pdGVtX2lkLCBtZXRhX2tleSwgbWV0YV9pZCBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBXSEVSRSBvcmRlcl9pdGVtX2lkIElOICgyNTUyLDI1NTMpIEFORCBtZXRhX2tleSBMSUtFICdcX3BzJScgT1JERVIgQlkgb3JkZXJfaXRlbV9pZCwgbWV0YV9pZCIsQVJSQVlfQSk7CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyk7ICRyWydrZWlzdGlfa2VsaWEnXT0kYm9keSgkcywna2Vpc3RpX2tlbGlhJyw3MDAwKTsgJHJbJ3J1c2l1b3RpJ109JGJvZHkoJHMsJ3J1c2l1b3RpJyw1MDAwKTsKICB9CiAgaWYoJGY9PT0nMycpewogICAgZm9yZWFjaCgkZmlsZXMgYXMgJGcpeyBpZihzdHJwb3MoZmlsZV9nZXRfY29udGVudHMoJGcpLCdjbGFzcyBQZXRzaG9wX0FWX09yZGVyJykhPT1mYWxzZSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsgJHJbJ2ZpbGUnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRnKTsgcHJlZ19tYXRjaF9hbGwoJyMocHVibGljfHByaXZhdGV8cHJvdGVjdGVkKT9ccypzdGF0aWNccytmdW5jdGlvblxzKyhbYS16XzAtOV0rKSNpJywkcywkZm0pOyAkclsnZm4nXT0kZm1bMl07ICRyWydmaWtzdW90aSddPSRib2R5KCRzLCdmaWtzdW90aScsNjAwMCk7IGZvcmVhY2goWydrZWlzdGknLCdwZXJyYXN5dGknLCdpc3ZhbHl0aScsJ251c3RhdHl0aScsJ2lyYXN5dGlfZWlsdXRlJywncmFzeXRpJ10gYXMgJGZuKXsgJGI9JGJvZHkoJHMsJGZuLDM1MDApOyBpZigkYikgJHJbJGZuXT0kYjsgfSBicmVhazsgfSB9CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-073059';
const GKEY='ps_s1717l';
const PHASES=["2"];
const OUT='analize/s1717_l2.json';
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
