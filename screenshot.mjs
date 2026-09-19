process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTQgZCDigJQgL215LWFjY291bnQvYXVnaW50aW5pcy8gaXIgL3Bhc2t5cmEvYXVnaW50aW5pcy8ga2FpcCBzdmXEjWlhczsgbGFpc2thaS5waHAga29udGVrc3RhczsgV0MgbXlhY2NvdW50IHNsdWcgKyBlbmRwb2ludCdhaTsgcmVmaWxsIGVuZ2luZSBmZWVkYmFjay4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5NGQnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkcD0kd3BkYi0+cHJlZml4OwogIGZvcmVhY2ggKGFycmF5KCcvbXktYWNjb3VudC9hdWdpbnRpbmlzLycsJy9wYXNreXJhL2F1Z2ludGluaXMvJywnL3Bhc2t5cmEvYXVnaW50aW5pYWkvJywnL3Bhc2t5cmEvJykgYXMgJHUpeyAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCR1KSxhcnJheSgndGltZW91dCc9PjIwLCdyZWRpcmVjdGlvbic9PjApKTsgaWYgKGlzX3dwX2Vycm9yKCRyKSl7JG9bJ3VybCddWyR1XT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTtjb250aW51ZTt9ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgcHJlZ19tYXRjaCgnLzx0aXRsZT4oLio/KTxcL3RpdGxlPi9zaScsJGIsJG10KTsgJHQ9cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKHByZWdfcmVwbGFjZSgnIzwoc2NyaXB0fHN0eWxlKVtePl0qPi4qPzwvXDE+I3NpJywnJywkYikpKTsgJG9bJ3VybCddWyR1XT1hcnJheSgna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJ2xvY2F0aW9uJz0+d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnbG9jYXRpb24nKSwndGl0bGUnPT4kbXRbMV0/P251bGwsJ3Rla3N0YXMnPT5tYl9zdWJzdHIoJHQsMCw0MDApKTsgfQogICRmPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wZXRzaG9wLWxhaXNrYWkucGhwJzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyAkb1snbGFpc2thaV9tZDUnXT1tZDUoJHMpOyAkb1snbGFpc2thaV9keWRpcyddPXN0cmxlbigkcyk7CiAgJHBvcz1zdHJwb3MoJHMsIidmZWVkYmFja191cmwnICAgID0+IGhvbWVfdXJsIik7ICRvWydsYWlza2FpX2tvbnRla3N0YXMnXT1zdWJzdHIoJHMsbWF4KDAsJHBvcy0xNTAwKSwyMjAwKTsKICAkb1snbXlhY2NvdW50X3BhZ2UnXT1nZXRfcGVybWFsaW5rKHdjX2dldF9wYWdlX2lkKCdteWFjY291bnQnKSk7ICRvWydlbmRwb2ludHMnXT1hcnJheV9rZXlzKChhcnJheSlXQygpLT5xdWVyeS0+Z2V0X3F1ZXJ5X3ZhcnMoKSk7CiAgJG9bJ3BzX2VuZHBvaW50YWknXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnd29vY29tbWVyY2VfbXlhY2NvdW50XyVlbmRwb2ludCciKTsKICAvLyBrdXIgcmVnaXN0cnVvamFtYXMgYXVnaW50aW5pbyBwdXNsYXBpcwogICRoaXRzPWFycmF5KCk7IGZvcmVhY2ggKGFycmF5X21lcmdlKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zLyoucGhwJyksZ2xvYihXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwJyksZ2xvYihXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMvcGV0c2hvcC1jb3JlLyoucGhwJykpIGFzICRmZil7ICRzcz1maWxlX2dldF9jb250ZW50cygkZmYpOyBpZiAocHJlZ19tYXRjaCgnL2FkZF9yZXdyaXRlX2VuZHBvaW50XHMqXChccypbXCciXShbYS16XC1dKykvJywkc3MsJG0pfHxzdHJwb3MoJHNzLCcvYXVnaW50aW4nKSE9PWZhbHNlKXsgcHJlZ19tYXRjaF9hbGwoJy8uezAsODB9KGFkZF9yZXdyaXRlX2VuZHBvaW50fFwvYXVnaW50aW5bYS16XSpcLz98bWFuby1hdWdpbnRpbikuezAsMTIwfS8nLCRzcywkbW0pOyAkaGl0c1tzdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkZmYpXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1tWzBdKSwwLDUpO30gfQogICRvWydhdWdpbnRpbmlvX3B1c2xhcGlzX2tvZGUnXT0kaGl0czsKICAkb1sncHVzbGFwaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF9uYW1lLHBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncGFnZScgQU5EIChwb3N0X25hbWUgTElLRSAnJWF1Z2ludGluJScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVwZXRfcHJvZmlsZSUnIE9SIHBvc3RfY29udGVudCBMSUtFICclcHNfcGV0JScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVza2FpY2l1b2tsJScpIExJTUlUIDEwIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-195022';
const GKEY='ps_s1694d';
const PHASES=["1"];
const OUT='analize/s1694_d.json';
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
