process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTIgYyDigJQgemItaW1wb3J0LmxvZyDFoWlhbmRpZW46IFpCLUJMT0NLLUNSRUFURSBwYWdhbCByZWFzb24sIOKAnkFycmF5IiBsaWt1xI1pYWk7IGJhdGNoL3YxIHXFvmtsYXVzxbMgxaFhbHRpbmlzIChhY2Nlc3MgbG9nIG7El3JhIOKAlCB0aWsgbGFpa2FzKS4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5MmMnXSkpIHJldHVybjsgJG89YXJyYXkoKTsKICAkZj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcGV0c2hvcC1wcml2YXRlLWxvZ3MvemItaW1wb3J0LmxvZyc7ICRvWydkeWRpcyddPWZpbGVfZXhpc3RzKCRmKT9maWxlc2l6ZSgkZik6bnVsbDsgJG9bJ3Bhc2snXT1maWxlX2V4aXN0cygkZik/ZGF0ZSgnbS1kIEg6aScsZmlsZW10aW1lKCRmKSk6bnVsbDsKICBpZiAoZmlsZV9leGlzdHMoJGYpKXsgJHN6PWZpbGVzaXplKCRmKTsgJGZoPWZvcGVuKCRmLCdyJyk7IGZzZWVrKCRmaCxtYXgoMCwkc3otMTUwMDAwMCkpOyAkdD1mcmVhZCgkZmgsMTUwMDAwMCk7IGZjbG9zZSgkZmgpOyAkbGluZXM9ZXhwbG9kZSgiXG4iLCR0KTsKICAgICR0b2RheT1hcnJheSgpOyBmb3JlYWNoICgkbGluZXMgYXMgJGwpeyBpZiAoc3RycG9zKCRsLCcyMDI2LTA5LTE5JykhPT1mYWxzZSB8fCBzdHJwb3MoJGwsJzE5LVNlcC0yMDI2JykhPT1mYWxzZSkgJHRvZGF5W109JGw7IH0KICAgICRvWydzaWFuZGllbl9laWwnXT1jb3VudCgkdG9kYXkpOyAkcmVhc29ucz1hcnJheSgpOyAkYXJyPTA7ICRicmFuZHM9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCR0b2RheSBhcyAkbCl7IGlmIChwcmVnX21hdGNoKCcvcmVhc29uPShbYS16X10rKS8nLCRsLCRtKSkgJHJlYXNvbnNbJG1bMV1dPSgkcmVhc29uc1skbVsxXV0/PzApKzE7IGlmIChzdHJwb3MoJGwsJ2JyYW5kPUFycmF5JykhPT1mYWxzZXx8c3RycG9zKCRsLCdjYXRlZ29yeT1BcnJheScpIT09ZmFsc2UpICRhcnIrKzsgaWYgKHByZWdfbWF0Y2goJy9yZWFzb249ZXhjbHVkZWRfYnJhbmQuKj9icmFuZD0oW158XSspLycsJGwsJG0pKSAkYnJhbmRzW3RyaW0oJG1bMV0pXT0oJGJyYW5kc1t0cmltKCRtWzFdKV0/PzApKzE7IH0KICAgICRvWydyZWFzb25zJ109JHJlYXNvbnM7ICRvWydBcnJheV9zaWFuZGllbiddPSRhcnI7ICRvWydleGNsdWRlZF9icmFuZHMnXT0kYnJhbmRzOyAkb1sncHZ6J109YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkdG9kYXksZnVuY3Rpb24oJGwpe3JldHVybiBzdHJwb3MoJGwsJ1pCLUJMT0NLLUNSRUFURScpIT09ZmFsc2U7fSkpLDAsMyk7CiAgICAkb1sncGFzazMnXT1hcnJheV9zbGljZSgkdG9kYXksLTMpOwogICAgJHZha2FyPWFycmF5X2ZpbHRlcigkbGluZXMsZnVuY3Rpb24oJGwpe3JldHVybiBzdHJwb3MoJGwsJzIwMjYtMDktMTgnKSE9PWZhbHNlICYmIHN0cnBvcygkbCwnYnJhbmQ9QXJyYXknKSE9PWZhbHNlO30pOyAkb1snQXJyYXlfdmFrYXInXT1jb3VudCgkdmFrYXIpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-163900';
const GKEY='ps_s1692c';
const PHASES=["1"];
const OUT='analize/s1692_c.json';
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
