process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2YiBjb3VyaWVyLW9ubHkga29kYXMgKyBQYXlzZXJhIG51c3RhdHltdSByYWt0YWkgKHRpayBwYXZhZGluaW1haSkgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxNmInXSkpIHJldHVybjsKICBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3MTZiJ107ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGcpeyAkcz1maWxlX2dldF9jb250ZW50cygkZyk7IGlmKHByZWdfbWF0Y2goJyNoaWRlX3BhcmNlbF9pZl9jb3VyaWVyX29ubHkjJywkcykpeyBwcmVnX21hdGNoKCcjZnVuY3Rpb24gcGV0c2hvcF9oaWRlX3BhcmNlbF9pZl9jb3VyaWVyX29ubHkuKj9cblx9I3MnLCRzLCRtKTsgJHJbJ2hpZGVfcGFyY2VsJ11bYmFzZW5hbWUoJGcpXT1zdWJzdHIoJG1bMF0/PycnLDAsMjUwMCk7IHByZWdfbWF0Y2hfYWxsKCcjL1wqXCouezAsNjAwfWNvdXJpZXIuezAsNjAwfVwqLyNzJywkcywkYyk7ICRyWydoaWRlX3BhcmNlbF9rb21lbnRhcmFzJ109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3Vic3RyKCR4LDAsODAwKTt9LCRjWzBdKSwwLDIpOyB9IH0KICAgICRyWydwc19zb3VyY2VzX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX3NvdXJjZXMiKTsKICAgICRyWydjb3VyaWVyX29ubHlfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBtZXRhX3ZhbHVlLCBDT1VOVCgqKSBuIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXkgSU4gKCdfcHNfY291cmllcl9vbmx5JywnX3BzX2NhcnJpZXInLCdfcHNfdGlrX2t1cmplcml1JywnX2NvdXJpZXJfb25seScpIEdST1VQIEJZIG1ldGFfa2V5LCBtZXRhX3ZhbHVlIixBUlJBWV9BKTsKICAgIGZvcmVhY2goV0MoKS0+cGF5bWVudF9nYXRld2F5cygpLT5wYXltZW50X2dhdGV3YXlzKCkgYXMgJGcpeyBpZigkZy0+aWQhPT0ncGF5c2VyYScpIGNvbnRpbnVlOyAkclsncGF5c2VyYV9yYWt0YWknXT1hcnJheV9rZXlzKChhcnJheSkkZy0+c2V0dGluZ3MpOyBmb3JlYWNoKChhcnJheSkkZy0+c2V0dGluZ3MgYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnI2NvdW50ciNpJywkaykmJiFwcmVnX21hdGNoKCcjcGFzc3xzaWdufHNlY3JldHxrZXl8dG9rZW4jaScsJGspKSAkclsncGF5c2VyYV9jb3VudHJpZXMnXVska109aXNfYXJyYXkoJHYpPyR2Om1iX3N1YnN0cigoc3RyaW5nKSR2LDAsMzAwKTsgfSB9CiAgICAkclsncGF5c2VyYV9kZWxpdmVyeV9vcGNpam9zJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXBheXNlcmElJyBBTkQgb3B0aW9uX25hbWUgTk9UIExJS0UgJyVzZXR0aW5ncyUnIik7CiAgICAvLyBWZW5pcGFrIHBpY2t1cCDigJ5wcm9kdWN0IGluY2x1ZGVkIGluIGxvY2tlciIgbnVzdGF0eW1hcwogICAgJG89Z2V0X29wdGlvbignd29vY29tbWVyY2Vfc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfcGlja3VwX21ldGhvZF8zX3NldHRpbmdzJyk7IGlmKGlzX2FycmF5KCRvKSkgJHJbJ3ZlbmlwYWtfcGlja3VwXzMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHYpe3JldHVybiBpc19zY2FsYXIoJHYpP21iX3N1YnN0cigoc3RyaW5nKSR2LDAsODApOiR2O30sYXJyYXlfZmlsdGVyKCRvLGZ1bmN0aW9uKCRrKXtyZXR1cm4gIXByZWdfbWF0Y2goJyNwYXNzfGtleXx0b2tlbnxzZWNyZXQjaScsJGspO30sQVJSQVlfRklMVEVSX1VTRV9LRVkpKTsKICAgICRvPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2NvdXJpZXJfbWV0aG9kXzJfc2V0dGluZ3MnKTsgaWYoaXNfYXJyYXkoJG8pKSAkclsndmVuaXBha19jb3VyaWVyXzInXT1hcnJheV9tYXAoZnVuY3Rpb24oJHYpe3JldHVybiBpc19zY2FsYXIoJHYpP21iX3N1YnN0cigoc3RyaW5nKSR2LDAsODApOiR2O30sYXJyYXlfZmlsdGVyKCRvLGZ1bmN0aW9uKCRrKXtyZXR1cm4gIXByZWdfbWF0Y2goJyNwYXNzfGtleXx0b2tlbnxzZWNyZXQjaScsJGspO30sQVJSQVlfRklMVEVSX1VTRV9LRVkpKTsKICAgIGZvcmVhY2goWzYsNyw4XSBhcyAkaSl7ICRvPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2NvdXJpZXJfbWV0aG9kXycuJGkuJ19zZXR0aW5ncycpOyBpZihpc19hcnJheSgkbykpICRyWyd2ZW5pcGFrX2NvdXJpZXJfJy4kaV09YXJyYXlfaW50ZXJzZWN0X2tleSgkbyxhcnJheV9mbGlwKFsndGl0bGUnLCdlbmFibGVkJywncHJpY2UnLCdmcmVlX2Zyb20nLCdtaW5fd2VpZ2h0JywnbWF4X3dlaWdodCcsJ3dlaWdodF9mcm9tJywnd2VpZ2h0X3RvJywnc2hpcHBpbmdfY2xhc3MnLCdjbGFzc2VzJywnY29zdCddKSk7IH0KICAgIC8vIGthYmxpYWksIGt1cmllIHNsZXBpYSBtZXRvZHVzIHBhZ2FsIHByZWtlcyAoc25pcHBldCBwcmlvIDIwKQogICAgZ2xvYmFsICR3cF9maWx0ZXI7IGZvcmVhY2goJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcyddLT5jYWxsYmFja3NbMjBdPz9bXSBhcyAkY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyBpZigkZm4gaW5zdGFuY2VvZiBDbG9zdXJlKXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGZuKTsgJHJbJ3NuaXBwZXQyMCddPVskcmYtPmdldEZpbGVOYW1lKCksJHJmLT5nZXRTdGFydExpbmUoKSwkcmYtPmdldEVuZExpbmUoKV07IH0gfQogICAgJHJbJ3NuaXBwZXQyMF9rb2RhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBuYW1lLCBMRUZUKGNvZGUsMTUwMCkgayBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyV3b29jb21tZXJjZV9wYWNrYWdlX3JhdGVzJScgQU5EIGFjdGl2ZT0xIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-202208';
const GKEY='ps_s1716b';
const PHASES=["1"];
const OUT='analize/s1716_b1.json';
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
