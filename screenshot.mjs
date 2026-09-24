process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2ZSBrYXMgaXNtZXRhIHBhc3RvbWF0YSAxMjQ2NiByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE2ZSddKSkgcmV0dXJuOwogIEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGIsICR3cF9maWx0ZXI7ICRyPVsndic9PidTMTcxNmUnXTsKICB0cnl7CiAgICBmb3JlYWNoKFsxMjQ2NiwxNzk3OF0gYXMgJHBpZCl7ICRyWydtZXRhJ11bJHBpZF09JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksIExFRlQobWV0YV92YWx1ZSw2MCkgdiBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJXZlbmlwYWslJScgT1IgbWV0YV9rZXkgTElLRSAnJSVwaWNrdXAlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVsb2NrZXIlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVwYXN0b21hdCUlJyBPUiBtZXRhX2tleSBMSUtFICclJXNoaXBwaW5nJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlZGltZW5zaW9uJSUnIE9SIG1ldGFfa2V5IElOICgnX2xlbmd0aCcsJ193aWR0aCcsJ19oZWlnaHQnLCdfd2VpZ2h0JywnX3piX2VuYWJsZWQnLCdfcHNfc2FuZGVsaXMnKSkiLCRwaWQpLEFSUkFZX0EpOyB9CiAgICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nLyp2ZW5pcGFrKi9wdWJsaWMvKi5waHAnKSBhcyAkZyl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsgaWYoc3RycG9zKCRzLCdzaG93X3BpY2t1cF9pZl9wcm9kdWN0X2luY2x1ZGVkX2luX2xvY2tlcicpIT09ZmFsc2UpeyBwcmVnX21hdGNoKCcjZnVuY3Rpb24gc2hvd19waWNrdXBfaWZfcHJvZHVjdF9pbmNsdWRlZF9pbl9sb2NrZXIuKj9cblx0XH0jcycsJHMsJG0pOyAkclsndmVuaXBha19mbiddW2Jhc2VuYW1lKCRnKV09c3Vic3RyKCRtWzBdPz8nJywwLDMwMDApOyB9IH0KICAgICRzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcmlua2luaWFpLnBocCcpOyBwcmVnX21hdGNoKCcjZnVuY3Rpb24gcGFzdG9tYXRvX3Nhcmdhcy4qP1xuXHRcfSNzJywkcywkbSk7ICRyWydwYXN0b21hdG9fc2FyZ2FzJ109c3Vic3RyKCRtWzBdPz8nJywwLDI1MDApOwogICAgLy8gcG8gdmllbsSFIGZpbHRyxIU6IGt1cmlzIGnFoW1ldGEKICAgIHdjX2xvYWRfY2FydCgpOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KGZhbHNlKTsgV0MoKS0+Y3VzdG9tZXItPnNldF9zaGlwcGluZ19jb3VudHJ5KCdMVCcpOyBXQygpLT5jdXN0b21lci0+c2V0X3NoaXBwaW5nX3Bvc3Rjb2RlKCcwMTEwMCcpOyBXQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgxMjQ2NiwxKTsgV0MoKS0+Y2FydC0+Y2FsY3VsYXRlX3RvdGFscygpOwogICAgJHBrPVdDKCktPmNhcnQtPmdldF9zaGlwcGluZ19wYWNrYWdlcygpOyAkcGtnPSRwa1swXTsgJHpvbmU9V0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lX21hdGNoaW5nX3BhY2thZ2UoJHBrZyk7ICRyYXc9W107CiAgICBmb3JlYWNoKCR6b25lLT5nZXRfc2hpcHBpbmdfbWV0aG9kcyh0cnVlKSBhcyAkbSl7ICRtLT5jYWxjdWxhdGVfc2hpcHBpbmcoJHBrZyk7IGZvcmVhY2goJG0tPnJhdGVzIGFzICRyaWQ9PiRydCl7ICRyYXdbJHJpZF09JHJ0OyB9ICRtLT5yYXRlcz1bXTsgfQogICAgJHJbJ3phbGlfdGFyaWZhaSddPWFycmF5X2tleXMoJHJhdyk7CiAgICAkY2JzPSR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnXS0+Y2FsbGJhY2tzOyBrc29ydCgkY2JzKTsgJGN1cj0kcmF3OwogICAgZm9yZWFjaCgkY2JzIGFzICRwcmlvPT4kbGlzdCl7IGZvcmVhY2goJGxpc3QgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgJG5tPWlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06KGlzX3N0cmluZygkZm4pPyRmbjonY2xvc3VyZScpOyAkcHJpZXM9YXJyYXlfa2V5cygkY3VyKTsgJGN1cj1jYWxsX3VzZXJfZnVuY19hcnJheSgkZm4sWyRjdXIsJHBrZ10pOyAkcG89YXJyYXlfa2V5cygoYXJyYXkpJGN1cik7IGlmKCRwcmllcyE9PSRwbykgJHJbJ2lzbWV0ZSddW109WyRwcmlvLCRubSwncHJpZXMnPT4kcHJpZXMsJ3BvJz0+JHBvXTsgfSB9CiAgICBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KGZhbHNlKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-202917';
const GKEY='ps_s1716e';
const PHASES=["1"];
const OUT='analize/s1716_e1.json';
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
