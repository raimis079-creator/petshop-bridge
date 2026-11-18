process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkzYiBhZHZlbnRvIGp1b2RyYcWhxI1pYWkg4oCTIG1ldGEsIHBpbG5hcyB0dXJpbnlzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg5M2InXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxODkzYiddOwogIHRyeXsKICAgIGZvcmVhY2goWzM4NzA3LDM4NzA5LDM4NzM3XSBhcyAkaWQpeyAkcG89Z2V0X3Bvc3QoJGlkKTsgJG09W107CiAgICAgIGZvcmVhY2goZ2V0X3Bvc3RfbWV0YSgkaWQpIGFzICRrPT4kdil7IGlmKHByZWdfbWF0Y2goJy9eXyh6YnxwcylfLycsJGspfHxpbl9hcnJheSgkayxbJ19zdG9jaycsJ19zdG9ja19zdGF0dXMnLCdfcmVndWxhcl9wcmljZScsJ19wcmljZScsJ19iYWNrb3JkZXJzJywnX3NrdScsJ19nbG9iYWxfdW5pcXVlX2lkJywnX3RheF9jbGFzcycsJ190YXhfc3RhdHVzJ10pKSAkbVska109bWJfc3Vic3RyKChzdHJpbmcpJHZbMF0sMCwyMDApOyB9CiAgICAgICRyWydwJ11bJGlkXT1bJ3QnPT4kcG8tPnBvc3RfdGl0bGUsJ3N0Jz0+JHBvLT5wb3N0X3N0YXR1cywnZGF0ZSc9PiRwby0+cG9zdF9kYXRlLCdtb2QnPT4kcG8tPnBvc3RfbW9kaWZpZWQsJ2NvbnRlbnQnPT4kcG8tPnBvc3RfY29udGVudCwnZXhjZXJwdCc9PiRwby0+cG9zdF9leGNlcnB0LCdtJz0+JG0sCiAgICAgICAgJ3Jldic9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElELHBvc3RfbW9kaWZpZWQscG9zdF9hdXRob3IscG9zdF9zdGF0dXMscG9zdF90aXRsZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfcGFyZW50PSVkIEFORCBwb3N0X3R5cGU9J3JldmlzaW9uJyBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDUiLCRpZCksQVJSQVlfQSksCiAgICAgICAgJ3RhZ3MnPT53cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfdGFnJyxbJ2ZpZWxkcyc9PiduYW1lcyddKSwnYnJhbmQnPT50YXhvbm9teV9leGlzdHMoJ3Byb2R1Y3RfYnJhbmQnKT93cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pOm51bGwsCiAgICAgICAgJ2F0dHJzJz0+YXJyYXlfa2V5cygoYXJyYXkpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wcm9kdWN0X2F0dHJpYnV0ZXMnLHRydWUpKV07CiAgICB9CiAgICAvLyBwYWx5Z2luaW11aTogMyBwdWJsaWt1b3RvcyBaQiBUcml4aWUgcHJla8SXcyAocGF2YWRpbmltbyBpciBrYXRlZ29yaWrFsyBzdGlsaXVzKQogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3piX2JyYW5kJyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJyVUUklYSUUlJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIHAucG9zdF9tb2RpZmllZCBERVNDIExJTUlUIDYiKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkclsncHZ6J11bXT1bKGludCkkaWQsZ2V0X3RoZV90aXRsZSgkaWQpLGdldF9wb3N0X2ZpZWxkKCdwb3N0X25hbWUnLCRpZCksd3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nbmFtZXMnXSksZ2V0X3Bvc3RfbWV0YSgkaWQsJ19za3UnLHRydWUpXTsgfQogICAgLy8ga2FzIHJhxaFvIF9wc19yYW5rYV9pc2ltdGEKICAgICRoaXRzPVtdOyBmb3JlYWNoKFsnL3BldHNob3AtZGFyYmFsYXVraXMnLCcvcGV0c2hvcC14bWwnLCcvcGV0c2hvcC1jb3JlJ10gYXMgJGQpeyAkZGlyPVdQX1BMVUdJTl9ESVIuJGQ7IGlmKCFpc19kaXIoJGRpcikpIGNvbnRpbnVlOyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsgZm9yZWFjaCgkaXQgYXMgJGYpeyBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsgJGxuPWZpbGUoJGYpOyBmb3JlYWNoKCRsbiBhcyAkaT0+JGwpeyBpZihzdHJwb3MoJGwsJ19wc19yYW5rYV9pc2ltdGEnKSE9PWZhbHNlfHxzdHJwb3MoJGwsJ19wc19pc2ltdGlzX2xhdWtpYV9wZXJ6aXVyb3MnKSE9PWZhbHNlKSAkaGl0c1tdPXN0cl9yZXBsYWNlKFdQX1BMVUdJTl9ESVIsJycsJGYpLic6Jy4oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwyMjApOyBpZihjb3VudCgkaGl0cyk+NDApIGJyZWFrIDM7IH0gfSB9CiAgICAkclsnaGl0cyddPSRoaXRzOwogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclX3BzX3JhbmthX2lzaW10YSUnIE9SIGNvZGUgTElLRSAnJV9wc19pc2ltdGlzX2xhdWtpYV9wZXJ6aXVyb3MlJyIsQVJSQVlfQSk7ICRyWydzbmlwJ109JHNuOwogICAgZm9yZWFjaCgkc24gYXMgJHMpeyAkY29kZT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBpZD0lZCIsJHNbJ2lkJ10pKTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGNvZGUpIGFzICRpPT4kbCl7IGlmKHN0cnBvcygkbCwnX3BzX3JhbmthX2lzaW10YScpIT09ZmFsc2UpICRyWydzbmlwbGluZXMnXVskc1snaWQnXV1bXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwyNjApOyB9IH0KICAgICRyWyd1c2VycyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHVzZXJfbG9naW4gRlJPTSB7JHdwZGItPnVzZXJzfSBXSEVSRSBJRCBJTiAoU0VMRUNUIERJU1RJTkNUIHBvc3RfYXV0aG9yIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9wYXJlbnQgSU4gKDM4NzA3LDM4NzA5LDM4NzM3KSkiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-205842';
const GKEY='ps_s1893b';
const PHASES=["1"];
const OUT='analize/s1893b.json';
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
