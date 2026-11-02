process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2YyBza2VsYmltdSBudW9yb2RvcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MTZjJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODE2YyddOwogICR1cmxzPVsnL3N1bmltcy9mYXJtaW5hJywnL3N1bmltcy9leGNsdXNpb24nLCcva2F0ZW1zL2FuaW1vbmRhJywnL3N1bmltcy9hbWJyb3NpYScsJy9zdW5pbXMvZXVrYW51YmEnLCcva2F0ZW1zL2NodXJ1JywnL2thdGVtcy9tb25nZScsJy9zdW5pbXMvbW9uZ2UnLCcvc3VuaW1zL2pvc2VyYScsJy9rYXRlbXMvbWlhbW9yJywnL3N1bmltcy9yZWFsLWRvZycsJy9rYXRlbXMvZXhjbHVzaW9uJywnL2thdGVtcy9mYXJtaW5hJywnL2thdGVtcy9qb3NlcmEnXTsKICBmb3JlYWNoKCR1cmxzIGFzICR1KXsgJHg9d3BfcmVtb3RlX2hlYWQoaG9tZV91cmwoJHUpLFsncmVkaXJlY3Rpb24nPT4wLCd0aW1lb3V0Jz0+MTVdKTsgJGM9d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyAkbD13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCR4LCdsb2NhdGlvbicpOyAkYnk9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkeCwneC1yZWRpcmVjdC1ieScpOyAkclsndXJsJ11bJHVdPVskYyxzdHJfcmVwbGFjZShob21lX3VybCgpLCcnLCRsKSwkYnldOyB9CiAgLy8gYXIgeXJhIHplbmtsbytneXZ1bm8ga2F0ZWdvcmlqb3MgLyBwdXNsYXBpYWkKICBmb3JlYWNoKFsnZmFybWluYScsJ2V4Y2x1c2lvbicsJ2FuaW1vbmRhJywnYW1icm9zaWEnLCdldWthbnViYScsJ2NodXJ1JywnbW9uZ2UnLCdqb3NlcmEnLCdtaWFtb3InLCdyZWFsLWRvZyddIGFzICRiKXsKICAgICR0PWdldF90ZXJtX2J5KCdzbHVnJywkYiwncHJvZHVjdF9icmFuZCcpOyAkaWRzPSR0P2dldF9vYmplY3RzX2luX3Rlcm0oJHQtPnRlcm1faWQsJ3Byb2R1Y3RfYnJhbmQnKTpbXTsgJGlkcz1hcnJheV9maWx0ZXIoJGlkcyxmbigkaSk9PmdldF9wb3N0X3N0YXR1cygkaSk9PT0ncHVibGlzaCcpOwogICAgJGthdD0wOyRzdW49MDsgZm9yZWFjaCgkaWRzIGFzICRpKXsgJHR0PXdwX2dldF9vYmplY3RfdGVybXMoJGksJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKTsgJHM9aW1wbG9kZSgnICcsJHR0KTsgaWYoc3RycG9zKCRzLCdrYXRlbXMnKSE9PWZhbHNlfHxzdHJwb3MoJHMsJ2thdCcpIT09ZmFsc2UpICRrYXQrKzsgaWYoc3RycG9zKCRzLCdzdW5pbXMnKSE9PWZhbHNlfHxzdHJwb3MoJHMsJ3N1bicpIT09ZmFsc2UpICRzdW4rKzsgfQogICAgJHJbJ3plbmtsYWknXVskYl09Wyd2aXNvJz0+Y291bnQoJGlkcyksJ2thdGVtcyc9PiRrYXQsJ3N1bmltcyc9PiRzdW5dOwogIH0KICAvLyBhciBnYW1pbnRvam8gcHVzbGFwaXMgdHVyaSBmaWx0cmEgcGFnYWwgZ3l2dW5hPyBwYXRpa3JpbnRpIHF1ZXJ5IHZhcgogICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9nYW1pbnRvamFzL2FuaW1vbmRhLz9neXZ1bmFzPWthdGVtcycpLFsndGltZW91dCc9PjIwXSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KTsgJHJbJ2ZpbHRyb190ZXN0YXMnXT1bJ2h0dHAnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksJ3ByZWtpdV9odG1sJz0+c3Vic3RyX2NvdW50KCRiLCdwcm9kdWN0LXNtYWxsJyksJ3lyYV9zdW51Jz0+c3RyaXBvcygkYiwnR3JhbkNhcm5vJykhPT1mYWxzZV07CiAgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnL2dhbWludG9qYXMvYW5pbW9uZGEvJyksWyd0aW1lb3V0Jz0+MjBdKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpOyAkclsnZ2FtaW50b2pvX3BzbCddPVsncHJla2l1X2h0bWwnPT5zdWJzdHJfY291bnQoJGIsJ3Byb2R1Y3Qtc21hbGwnKSwncGlybW9zXzMnPT5hcnJheV9zbGljZShhcnJheV9tYXAoZm4oJG0pPT5odG1sX2VudGl0eV9kZWNvZGUoJG0pLHByZWdfbWF0Y2hfYWxsKCcjY2xhc3M9Im5hbWUgcHJvZHVjdC10aXRsZVtePl0qPlxzKjxhW14+XSo+KFtePF0rKSMnLCRiLCRtKT8kbVsxXTpbXSksMCw0KV07CiAgLy8gYXIgeXJhIGthdGVnb3JpamEgdGlwbyBrYXRlbXMrYnJhbmQgKHB2ei4gcGVyIHRheG9ub215IHByb2R1Y3RfY2F0IHN1IGJyYW5kIHNsdWcpCiAgJHJbJ2thdF9zdV96ZW5rbHUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnNsdWcsdC5uYW1lLHR0LmNvdW50IEZST00geyRQfXRlcm1zIHQgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZCBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCAodC5zbHVnIExJS0UgJyVhbmltb25kYSUnIE9SIHQuc2x1ZyBMSUtFICclZmFybWluYSUnIE9SIHQuc2x1ZyBMSUtFICclZXhjbHVzaW9uJScgT1IgdC5zbHVnIExJS0UgJyVqb3NlcmElJykiLEFSUkFZX0EpOwogIC8vIDMwMSB6ZW1lbGFwaW8gaXJhc2FpIHNpZW1zCiAgJG09anNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJyksdHJ1ZSk7IGZvcmVhY2goJHVybHMgYXMgJHUpeyAkaz1sdHJpbSgkdSwnLycpOyBpZihpc3NldCgkbVska10pKSAkclsnbWFwJ11bJGtdPSRtWyRrXTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-095025';
const GKEY='ps_s1816c';
const PHASES=["1"];
const OUT='analize/s1816_c.json';
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
