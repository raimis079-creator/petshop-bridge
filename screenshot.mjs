process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE4eiDigJQgMi4xMCBNb2RTZWN1cml0eSBBSSBib3TFsyB0YWlzeWtsacWzIGnFoWp1bmdpbWFzIC5odGFjY2VzcyAoc2VydmVyaWFpLmx0IGF0c2FreW1hcyAwOS0yNSkuIEZhesSXczogMSBixatrbMSXICsgVUEgdGVzdGFzLCAyIMSvcmHFoXl0aSAoYmFrIHBzLWFyY2h5dmFzLy5odGFjY2Vzcy5iYWtfczE3MTgpLCAzIFVBIHRlc3RhcyBwbywgOSBhdHN0YXR5dGkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE4eiddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxOHonXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7ICRyPVsndic9PidTMTcxOHonLCdmYXplJz0+JGZdOwogICRodD1BQlNQQVRILicuaHRhY2Nlc3MnOyAkYmFrZGlyPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy8nOyAkYmFrPSRiYWtkaXIuJy5odGFjY2Vzcy5iYWtfczE3MTgnOwogICRCTE9LQVM9IiMgQkVHSU4gUFMgTW9kU2VjdXJpdHkgQUkgYm90YWkgKFMxNzE4LCBzZXJ2ZXJpYWkubHQgMjAyNi0wOS0yNSk6IHByYWxlaXN0aSBDaGF0R1BULVVzZXIvR1BUQm90L0NsYXVkZUJvdFxuPElmTW9kdWxlIG1vZF9zZWN1cml0eTIuYz5cblNlY1J1bGVSZW1vdmVCeUlkIDk5OTAxNVxuU2VjUnVsZVJlbW92ZUJ5SWQgOTk5MDE2XG5TZWNSdWxlUmVtb3ZlQnlJZCA5OTkwMTdcbjwvSWZNb2R1bGU+XG4jIEVORCBQUyBNb2RTZWN1cml0eSBBSSBib3RhaVxuIjsKICAkdWE9ZnVuY3Rpb24oKSB7ICRvdXQ9W107IGZvcmVhY2goWydDaGF0R1BULVVzZXInPT4nTW96aWxsYS81LjAgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbyk7IGNvbXBhdGlibGU7IENoYXRHUFQtVXNlci8xLjA7ICtodHRwczovL29wZW5haS5jb20vYm90JywnR1BUQm90Jz0+J01vemlsbGEvNS4wIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pOyBjb21wYXRpYmxlOyBHUFRCb3QvMS4yOyAraHR0cHM6Ly9vcGVuYWkuY29tL2dwdGJvdCcsJ0NsYXVkZUJvdCc9PidNb3ppbGxhLzUuMCBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvOyBjb21wYXRpYmxlOyBDbGF1ZGVCb3QvMS4wOyArY2xhdWRlYm90QGFudGhyb3BpYy5jb20pJywnT0FJLVNlYXJjaEJvdCc9PidNb3ppbGxhLzUuMCBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKTsgY29tcGF0aWJsZTsgT0FJLVNlYXJjaEJvdC8xLjA7ICtodHRwczovL29wZW5haS5jb20vc2VhcmNoYm90JywnQ2hyb21lJz0+J01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjkuMCBTYWZhcmkvNTM3LjM2J10gYXMgJGs9PiR1KXsKICAgICAgZm9yZWFjaChbJy8nLCcva2F0ZWdvcmlqYS9zdW5pbXMvJywnL3Byb2R1Y3Qvam9zZXJhLW9wdGluZXNzLXNhdXNhcy1wYXNhcmFzLXN1bmltcy0xMi01LWtnLyddIGFzICRwKXsgJHJlcz13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCRwLic/cHNfdWE9Jy50aW1lKCkpLFsndGltZW91dCc9PjI1LCdyZWRpcmVjdGlvbic9PjAsJ3VzZXItYWdlbnQnPT4kdSwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJG91dFska11bJHBdPWlzX3dwX2Vycm9yKCRyZXMpPydFUlIgJy5tYl9zdWJzdHIoJHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKSwwLDYwKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcmVzKTsgfSB9IHJldHVybiAkb3V0OyB9OwogIHRyeXsKICBpZigkZj09PScxJyl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRodCk7ICRyWydkeWRpcyddPXN0cmxlbigkYyk7ICRyWydyYXNvbWFzJ109aXNfd3JpdGFibGUoJGh0KTsgJHJbJ2Jha195cmEnXT1pc19maWxlKCRiYWspOyAkclsnYmFrZGlyX3lyYSddPWlzX2RpcigkYmFrZGlyKTsgJHJbJ2phdV95cmEnXT1zdHJwb3MoJGMsJ1NlY1J1bGVSZW1vdmVCeUlkJykhPT1mYWxzZTsgJHJbJ21vZHNlY19ibG9rYWknXT1wcmVnX21hdGNoX2FsbCgnIzxJZk1vZHVsZSBtb2Rfc2VjdXJpdHkyLmM+IycsJGMpOyAkclsncHJhZHppYSddPW1iX3N1YnN0cigkYywwLDYwMCk7ICRyWyd1YV9wcmllcyddPSR1YSgpOwogICAgJGxvZz1kaXJuYW1lKEFCU1BBVEgpLicvbG9ncy8nOyAkclsnbG9nc19kaXInXT1pc19kaXIoJGxvZyk/YXJyYXlfc2xpY2Uoc2NhbmRpcigkbG9nKSwwLDIwKTonbmVyYSc7IH0KICBpZigkZj09PScyJyl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRodCk7IGlmKHN0cnBvcygkYywnU2VjUnVsZVJlbW92ZUJ5SWQgOTk5MDE2JykhPT1mYWxzZSl7ICRyWydrbGFpZGEnXT0namF1IHlyYSc7IHdwX3NlbmRfanNvbigkcik7IH0KICAgIGlmKCFpc19kaXIoJGJha2RpcikpIEBta2RpcigkYmFrZGlyLDA3NTAsdHJ1ZSk7IGlmKCFpc19maWxlKCRiYWspKSBjb3B5KCRodCwkYmFrKTsgJHJbJ2JhayddPWlzX2ZpbGUoJGJhaykmJm1kNV9maWxlKCRiYWspPT09bWQ1KCRjKTsKICAgIGlmKCEkclsnYmFrJ10peyAkclsna2xhaWRhJ109J2JhayBuZXBhdnlrbyc7IHdwX3NlbmRfanNvbigkcik7IH0KICAgICRuYXVqYXM9JEJMT0tBUy4kYzsgJHJbJ2lyYXN5dGEnXT0oYm9vbClmaWxlX3B1dF9jb250ZW50cygkaHQsJG5hdWphcyk7ICRyWydtZDVfcG8nXT1tZDVfZmlsZSgkaHQpOwogICAgJGhiPVtdOyBmb3JlYWNoKFsnLz9wc19oYj0nLnRpbWUoKSwnL3BhcmR1b3R1dmUvP3BzX2hiPTEnLCcva2FzYS8/cHNfaGI9MSddIGFzICR1KXsgJHJlcz13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCR1KSxbJ3RpbWVvdXQnPT4zMCwncmVkaXJlY3Rpb24nPT4yXSk7ICRoYlskdV09aXNfd3BfZXJyb3IoJHJlcyk/J0VSUiAnLiRyZXMtPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHJlcyk7IH0gJHJbJ2hlYXJ0YmVhdCddPSRoYjsKICAgICRibG9nYXM9ZmFsc2U7IGZvcmVhY2goJGhiIGFzICRjMil7IGlmKCFpc19pbnQoJGMyKXx8JGMyPj01MDApICRibG9nYXM9dHJ1ZTsgfSBpZigkYmxvZ2FzKXsgY29weSgkYmFrLCRodCk7ICRyWydBVFNUQVRZVEEnXT0naGVhcnRiZWF0IDV4eCc7IH0KICAgICRyWyd1YV9wbyddPSR1YSgpOyB9CiAgaWYoJGY9PT0nMycpeyAkclsndWEnXT0kdWEoKTsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGh0KTsgJHJbJ2Jsb2thc195cmEnXT1zdHJwb3MoJGMsJ1NlY1J1bGVSZW1vdmVCeUlkIDk5OTAxNicpIT09ZmFsc2U7ICRyWydwcmFkemlhJ109bWJfc3Vic3RyKCRjLDAsNDAwKTsgfQogIGlmKCRmPT09JzknKXsgaWYoIWlzX2ZpbGUoJGJhaykpeyAkclsna2xhaWRhJ109J2JhayBuZXJhJzsgd3Bfc2VuZF9qc29uKCRyKTsgfSBjb3B5KCRiYWssJGh0KTsgJHJbJ2F0c3RhdHl0YSddPW1kNV9maWxlKCRodCk7ICRyWyd1YSddPSR1YSgpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-123802';
const GKEY='ps_s1718z';
const PHASES=["1"];
const OUT='analize/s1718_z1.json';
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
