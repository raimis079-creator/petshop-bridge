process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQweSB3ZWxjb21lIG1vZGFsbyBvdmVybGF5IHJlY29uICgxIHJlYWQtb25seSArIHNob3RzKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDB5J10pKSByZXR1cm47ICRyPVsndic9PidTMTc0MHknXTsKICB0cnl7CiAgICAkZj1XUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXdlbGNvbWUtbW9kYWwucGhwJzsgJHM9KHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJGYpOyAkclsnbWQ1J109bWQ1KCRzKTsgJHJbJ2R5ZGlzJ109c3RybGVuKCRzKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcvW15cbl0qcHN3LW92W15cbl0qLycsJHMsJG0pOyAkclsncHN3X292X2VpbHV0ZXMnXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIodHJpbSgkeCksMCw0MDApO30sJG1bMF0pLDAsMTQpOwogICAgcHJlZ19tYXRjaF9hbGwoJy9bXlxuXSoocG9pbnRlci1ldmVudHN8b3BhY2l0eXx2aXNpYmlsaXR5fGRpc3BsYXlccyo6KVteXG5dKi8nLCRzLCRtMik7ICRyWydjc3NfZWlsJ109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKHRyaW0oJHgpLDAsMzAwKTt9LCRtMlswXSksMCwxNCk7CiAgICAkZXYgPSA8PDwnSlMnCihhc3luYygpPT57Y29uc3Qgdz1tcz0+bmV3IFByb21pc2Uocj0+c2V0VGltZW91dChyLG1zKSk7Y29uc3Qgc3Q9KCk9Pntjb25zdCBvPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wc3ctb3YnKTtpZighbylyZXR1cm4gJ25lcmEnO2NvbnN0IGM9Z2V0Q29tcHV0ZWRTdHlsZShvKTtjb25zdCByPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7Y29uc3QgeD1pbm5lcldpZHRoLzIseT1pbm5lckhlaWdodC8yO2NvbnN0IGVsPWRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCx5KTtyZXR1cm4ge2tsOm8uY2xhc3NOYW1lLnRvU3RyaW5nKCksZDpjLmRpc3BsYXksb3A6Yy5vcGFjaXR5LHZpczpjLnZpc2liaWxpdHkscGU6Yy5wb2ludGVyRXZlbnRzLHo6Yy56SW5kZXgsaDpNYXRoLnJvdW5kKHIuaGVpZ2h0KSxjZW50cmU6ZWw/KGVsLmNsYXNzTmFtZXx8ZWwudGFnTmFtZSkudG9TdHJpbmcoKS5zbGljZSgwLDQwKTpudWxsLGNvb2tpZTpkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKS5tYXAoeD0+eC50cmltKCkuc3BsaXQoJz0nKVswXSkuZmlsdGVyKG49Pi9jbXBsenxwc3cvLnRlc3QobikpLmpvaW4oJywnKX07fTtjb25zdCBhPXN0KCk7YXdhaXQgdyg1NTAwKTtjb25zdCBiPXN0KCk7YXdhaXQgdyg5MDAwKTtjb25zdCBjPXN0KCk7cmV0dXJuIHt0MV81OmEsdDc6Yix0MTY6Y319KSgpCkpTOwogICAgJHJbJ3Nob3RzJ109WwogICAgICBbJ24nPT4neTFfbmF1amFzJywndSc9PmhvbWVfdXJsKCcvJyksJ3cnPT4zOTAsJ2gnPT44NDQsJ2V2YWwnPT4kZXZdLAogICAgICBbJ24nPT4neTJfYXRtZXN0aScsJ3UnPT5ob21lX3VybCgnLycpLCd3Jz0+MzkwLCdoJz0+ODQ0LCdjbGljayc9PicuY21wbHotYnRuLmNtcGx6LWRlbnknXSwKICAgICAgWyduJz0+J3kzX3BvX2F0bWV0aW1vJywndSc9PmdldF9wZXJtYWxpbmsoMTg1ODcpLCd3Jz0+MzkwLCdoJz0+ODQ0LCdldmFsJz0+JGV2XSwKICAgIF07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-200346';
const GKEY='ps_s1740y';
const PHASES=["1"];
const OUT='analize/s1740y.json';
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
