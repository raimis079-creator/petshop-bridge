process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTEgbiDigJQgcG8gcGVya8SXbGltbzogKDEpIDM0ODg5IF9wc19zYW5kZWxpcyBhdHN0YXR5bWFzOyAoMikgU3VwZXIgQ2FjaGUgacWhdmFseW1hczsgKDMpIGFyIHBhc2zEl3B0YSBwcmVrxJcgdGlrcmFpIGnFoWtyZW50YSBpxaEga2F0YWxvZ28gKFdDX1Byb2R1Y3RfUXVlcnkpIGlyIGthdGVnb3Jpam9zIHB1c2xhcGlvOyAoNCkg4oCeUHJhbmXFoXRpIGthaSBidXMiIGZvcm1hIHBhc2zEl3B0b3MgcHJla8SXcyBwdXNsYXB5amUgKGJlIGNhY2hlKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2OTFuJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICBkZWxldGVfcG9zdF9tZXRhKDM0ODg5LCdfcHNfc2FuZGVsaXMnKTsgY2xlYW5fcG9zdF9jYWNoZSgzNDg4OSk7ICRvWyd0MzQ4ODknXT1hcnJheSgnc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKDM0ODg5LCdfcHNfc2FuZGVsaXMnLHRydWUpLCdzdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoMzQ4ODkpLCd2aXMnPT53Y19nZXRfcHJvZHVjdCgzNDg4OSktPmdldF9jYXRhbG9nX3Zpc2liaWxpdHkoKSk7CiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgeyB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkb1snc3VwZXJjYWNoZSddPSdpxaF2YWx5dGEnOyB9IGVsc2UgJG9bJ3N1cGVyY2FjaGUnXT0nZnVua2Npam9zIG7El3JhJzsKICAkaGlkPTEyNDUzOyAkcT1uZXcgV0NfUHJvZHVjdF9RdWVyeShhcnJheSgnaW5jbHVkZSc9PmFycmF5KCRoaWQpLCd2aXNpYmlsaXR5Jz0+J2NhdGFsb2cnLCdsaW1pdCc9PjUsJ3JldHVybic9PidpZHMnKSk7ICRvWyd3Y19xdWVyeV9jYXRhbG9nJ109JHEtPmdldF9wcm9kdWN0cygpOwogICRxPW5ldyBXQ19Qcm9kdWN0X1F1ZXJ5KGFycmF5KCdpbmNsdWRlJz0+YXJyYXkoJGhpZCksJ3Zpc2liaWxpdHknPT4naGlkZGVuJywnbGltaXQnPT41LCdyZXR1cm4nPT4naWRzJykpOyAkb1snd2NfcXVlcnlfaGlkZGVuJ109JHEtPmdldF9wcm9kdWN0cygpOwogICRjYXRzPXdwX2dldF9vYmplY3RfdGVybXMoJGhpZCwncHJvZHVjdF9jYXQnKTsgJG9bJ2thdGVnb3JpamEnXT0kY2F0cz8kY2F0c1swXS0+c2x1ZzpudWxsOwogIGlmICgkY2F0cyl7ICRjdT1nZXRfdGVybV9saW5rKCRjYXRzWzBdKTsgJHI9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc19ub2NhY2hlJyx0aW1lKCksJGN1KSxhcnJheSgndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkYj1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOyAkb1sna2F0ZWdvcmlqb3NfcHVzbCddPWFycmF5KCd1cmwnPT4kY3UsJ2h0dHAnPT5pc193cF9lcnJvcigkcik/MDp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJ3lyYV9wcmVrZSc9PnN0cnBvcygkYiwncG9zdC0nLiRoaWQpIT09ZmFsc2V8fHN0cnBvcygkYiwnZXVrYW51YmEtbWVkaXVtLWFkdWx0LXZpc2F2ZXJ0aXMnKSE9PWZhbHNlKTsgfQogICRsZj1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF0c2FyZ3UtbGF1a2ltYXMucGhwJyk7IHByZWdfbWF0Y2hfYWxsKCcvKGlkfGNsYXNzKT0iKFteIl0qKHN0b2NrfGxhdWt8cHJhbmUpW14iXSopIi9pJywkbGYsJG0pOyAkb1snZm9ybW9zX3p5bWVzJ109YXJyYXlfdW5pcXVlKCRtWzJdKTsKICAkdT1nZXRfcGVybWFsaW5rKCRoaWQpOyAkcj13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX25vY2FjaGUnLHRpbWUoKSwkdSksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAkb1sncHJla2VfcHVzbCddPWFycmF5KCdodHRwJz0+aXNfd3BfZXJyb3IoJHIpPzA6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCdkeWRpcyc9PnN0cmxlbigkYiksJ25lcmFfc2FuZGVseWplJz0+c3RyaXBvcygkYiwnbsSXcmEgc2FuZMSXbHlqZScpIT09ZmFsc2V8fHN0cmlwb3MoJGIsJ291dC1vZi1zdG9jaycpIT09ZmFsc2UsJ3p5bWVzX3Jhc3Rvcyc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJG9bJ2Zvcm1vc196eW1lcyddLGZ1bmN0aW9uKCR6KSB1c2UgKCRiKXsgcmV0dXJuIHN0cnBvcygkYiwkeikhPT1mYWxzZTsgfSkpLCdub2luZGV4Jz0+c3RyaXBvcygkYiwnbm9pbmRleCcpIT09ZmFsc2UpOwogICRvWydoaWRkZW5fdmlzbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19kcm9wc2hpcF9wYXNsZXB0YScgQU5EIG1ldGFfdmFsdWU9JzEnIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-183529';
const GKEY='ps_s1691n';
const PHASES=["1"];
const OUT='analize/s1691_n.json';
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
