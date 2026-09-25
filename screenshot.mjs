process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE4ZjIg4oCUIGZpbHRybyBVUkwgdnMga2XFoWFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxOGYyJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcxOGYyJ107CiAgJHU9Jy9rYXRlZ29yaWphL2thdGVtcy9tYWlzdGFzLWthdGVtcy8nOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCR1KSxbJ3RpbWVvdXQnPT4zMF0pKTsKICBwcmVnX21hdGNoX2FsbCgnI2hyZWY9IihbXiJdKlw/W14iXSpmaWx0ZXJfW14iXSopIiMnLCRoLCRtKTsgJGxpbmtzPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWFwKCdodG1sX2VudGl0eV9kZWNvZGUnLCRtWzFdKSkpOyAkclsnZmlsdHJ1X251b3JvZG9zJ109YXJyYXlfc2xpY2UoJGxpbmtzLDAsNSk7CiAgJGNudD1mdW5jdGlvbigkaHRtbCl7IHJldHVybiBbJ3ByZWtpdSc9PnN1YnN0cl9jb3VudCgkaHRtbCwnY2xhc3M9InByb2R1Y3Qtc21hbGwnKSwnc3VwZXJjYWNoZSc9PnByZWdfbWF0Y2goJyNDYWNoZWQgcGFnZSBnZW5lcmF0ZWQgYnkgV1AtU3VwZXItQ2FjaGUgb24gKFteXG5dKikjJywkaHRtbCwkbW0pP3RyaW0oJG1tWzFdKTooc3RycG9zKCRodG1sLCdEeW5hbWljIHBhZ2UgZ2VuZXJhdGVkJykhPT1mYWxzZT8nRElOQU1JTklTJzonPycpLCdsZW4nPT5zdHJsZW4oJGh0bWwpXTsgfTsKICAkclsnYmVfZmlsdHJvJ109JGNudCgkaCk7CiAgaWYoJGxpbmtzKXsgJGw9JGxpbmtzWzBdOyAkclsnc3VfZmlsdHJ1X3VybCddPSRsOyAkaDI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgoc3RycG9zKCRsLCdodHRwJyk9PT0wPyRsOmhvbWVfdXJsKCRsKSksWyd0aW1lb3V0Jz0+MzBdKSk7ICRyWydzdV9maWx0cnUnXT0kY250KCRoMik7CiAgICAkaDM9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgoc3RycG9zKCRsLCdodHRwJyk9PT0wPyRsOmhvbWVfdXJsKCRsKSkuJyZwc194PScudGltZSgpLFsndGltZW91dCc9PjMwXSkpOyAkclsnc3VfZmlsdHJ1X25vY2FjaGUnXT0kY250KCRoMyk7IH0KICAkYz1maWxlX2dldF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4nL3dwLWNhY2hlLWNvbmZpZy5waHAnKTsgcHJlZ19tYXRjaF9hbGwoJyNcJCh3cF9jYWNoZV9ub19jYWNoZV9mb3JfZ2V0fHdwX3N1cGVyX2NhY2hlX2xhdGVfaW5pdHxjYWNoZV9yZWJ1aWxkX2ZpbGVzfHdwX2NhY2hlX21vZF9yZXdyaXRlfHdwX2NhY2hlX2lnbm9yZV9xdWVyeXx3cF9jYWNoZV9jbGVhcl9vbl9wb3N0X2VkaXR8Y2FjaGVfZW5hYmxlZHxzdXBlcl9jYWNoZV9lbmFibGVkfHdwX2NhY2hlX21vYmlsZV9lbmFibGVkfHdwX2NhY2hlX3BhZ2VzKVteO10qOyMnLCRjLCRtbSk7ICRyWydjb25maWcnXT1hcnJheV9zbGljZSgkbW1bMF0sMCwyMCk7CiAgcHJlZ19tYXRjaCgnI1wkd3BfY2FjaGVfbm9fY2FjaGVfZm9yX2dldFxzKj1ccyooW147XSopOyMnLCRjLCRnKTsgJHJbJ25vX2NhY2hlX2Zvcl9nZXQnXT0kZ1sxXT8/Jz8nOwogIHByZWdfbWF0Y2goJyNcJGNhY2hlX2FjY2VwdGFibGVfZmlsZXNccyo9XHMqKFteO10qKTsjJywkYywkZyk7ICRyWydhY2NlcHRhYmxlJ109JGdbMV0/Pyc/JzsKICBwcmVnX21hdGNoKCcjXCRjYWNoZV9yZWplY3RlZF91cmlccyo9XHMqKFteO10qKTsjJywkYywkZyk7ICRyWydyZWplY3RlZF91cmknXT0kZ1sxXT8/Jz8nOwogIHByZWdfbWF0Y2goJyNcJHdwX2NhY2hlX2lnbm9yZV9xdWVyeV9wYXJhbXNccyo9XHMqKFteO10qKTsjJywkYywkZyk7ICRyWydpZ25vcmVfcXVlcnknXT0kZ1sxXT8/Jz8nOwogIHdwX3NlbmRfanNvbigkcik7Cn0sMSk7Cg==';
const VER='dep-130228';
const GKEY='ps_s1718f2';
const PHASES=["1"];
const OUT='analize/s1718_f2.json';
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
