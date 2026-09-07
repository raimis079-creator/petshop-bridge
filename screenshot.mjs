process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdnQ1IOKAlCB0ZXN0YXMgdjI6IMW+dXJuYWxvIHJha3RhaSwgZmFpbGVkK2NhbmNlbGxlZCB0ZWtzdGFpLCBIUE9TIHRyeW5pbWFzICgzNTgzNiArIG5hdWphcykuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM1dnQ1J10pKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTYzNSB2dDUnKTsKICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkeD13Y19nZXRfb3JkZXIoMzU4MzYpOyBpZigkeCl7ICR4LT5kZWxldGUodHJ1ZSk7IH0gJG9bJzM1ODM2X2lzdHJpbnRhcyddPXdjX2dldF9vcmRlcigzNTgzNik/MDoxOwogICRuPXdjX2NyZWF0ZV9vcmRlcihhcnJheSgnY3VzdG9tZXJfaWQnPT4wKSk7ICRuLT5hZGRfcHJvZHVjdCh3Y19nZXRfcHJvZHVjdCgzNTM1NyksMSk7CiAgJG4tPnNldF9iaWxsaW5nX2VtYWlsKCd2dEBkZXYuYXZlc2EubHQnKTsgJG4tPnNldF9iaWxsaW5nX2ZpcnN0X25hbWUoJ1ZUMicpOyAkbi0+Y2FsY3VsYXRlX3RvdGFscygpOyAkbi0+c2F2ZSgpOyAkaWQ9JG4tPmdldF9pZCgpOyAkb1snaWQnXT0kaWQ7CiAgJG4tPnVwZGF0ZV9zdGF0dXMoJ2ZhaWxlZCcsJ3Z0Jyk7IAogICRuMj13Y19nZXRfb3JkZXIoJGlkKTsgJG4yLT51cGRhdGVfc3RhdHVzKCdvbi1ob2xkJywndnQnKTsgJG4zPXdjX2dldF9vcmRlcigkaWQpOyAkbjMtPnVwZGF0ZV9zdGF0dXMoJ2NhbmNlbGxlZCcsJ3Z0Jyk7CiAgd3BfY2FjaGVfZmx1c2goKTsKICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7CiAgJG9bJ3Jha3RhaSddPWFycmF5X2tleXMoKGFycmF5KWVuZCgkeikpOwogIGZvcmVhY2goYXJyYXlfc2xpY2UoJHosLTMpIGFzICRlKXsKICAgICR0PXdwX3N0cmlwX2FsbF90YWdzKGltcGxvZGUoJyAnLGFycmF5X2ZpbHRlcihhcnJheV9tYXAoZnVuY3Rpb24oJHYpe3JldHVybiBpc19zdHJpbmcoJHYpPyR2OicnO30sKGFycmF5KSRlKSkpKTsKICAgICRsdD0oc3RycG9zKCR0LCdEZWphLCB1xb5zYWt5bW8nKSE9PWZhbHNlfHxzdHJwb3MoJHQsJ1ByYW5lxaFhbWUsIGthZCcpIT09ZmFsc2UpPydMVCDinJMnOigoc3RycG9zKCR0LCdVbmZvcnR1bmF0ZWx5JykhPT1mYWxzZXx8c3RycG9zKCR0LCdnZXR0aW5nIGluIHRvdWNoJykhPT1mYWxzZSk/J0VOICEnOic/Jyk7CiAgICAkb1snbGFpc2thaSddW109YXJyYXkoJ3RlbWEnPT5tYl9zdWJzdHIoJGVbJ3RlbWEnXT8/JycsMCw2MCksJ2x0Jz0+JGx0KTsKICB9CiAgJG4zLT5kZWxldGUodHJ1ZSk7ICRvWydpc3RyaW50YXMnXT13Y19nZXRfb3JkZXIoJGlkKT8wOjE7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-084319';
const GKEY='ps_s1635vt5';
const PHASES=["V5"];
const OUT='analize/s1635_vt5.json';
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
