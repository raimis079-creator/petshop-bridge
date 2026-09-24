process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2YTIga2FzYSByZWNvbiByZWFkLW9ubHkgKGJlIHNsYXB0dSByYWt0dSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE2YSddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxNmEnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzE2YTInLCdmYXplJz0+JGZdOyAkUD0kd3BkYi0+cHJlZml4OwogICRzbGFwdGE9ZnVuY3Rpb24oJGspeyByZXR1cm4gKGJvb2wpcHJlZ19tYXRjaCgnI3Bhc3N8c2lnbnxzZWNyZXR8a2V5fHRva2VufHNhbHR8aGFzaHxhcGkjaScsJGspOyB9OwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkclsnem9ub3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB6b25lX2lkLCB6b25lX25hbWUsIHpvbmVfb3JkZXIgRlJPTSB7JFB9d29vY29tbWVyY2Vfc2hpcHBpbmdfem9uZXMgT1JERVIgQlkgem9uZV9vcmRlciIsQVJSQVlfQSk7CiAgICAkclsnem9udV92aWV0b3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB6b25lX2lkLCBsb2NhdGlvbl9jb2RlLCBsb2NhdGlvbl90eXBlIEZST00geyRQfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVfbG9jYXRpb25zIixBUlJBWV9BKTsKICAgICRyWydtZXRvZGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgem9uZV9pZCwgaW5zdGFuY2VfaWQsIG1ldGhvZF9pZCwgbWV0aG9kX29yZGVyLCBpc19lbmFibGVkIEZST00geyRQfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVfbWV0aG9kcyBPUkRFUiBCWSB6b25lX2lkLCBtZXRob2Rfb3JkZXIiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkclsnbWV0b2RhaSddIGFzICRtKXsgJG89Z2V0X29wdGlvbignd29vY29tbWVyY2VfJy4kbVsnbWV0aG9kX2lkJ10uJ18nLiRtWydpbnN0YW5jZV9pZCddLidfc2V0dGluZ3MnKTsgaWYoaXNfYXJyYXkoJG8pKSAkclsnbWV0b2R1X251c3QnXVskbVsnaW5zdGFuY2VfaWQnXV09YXJyYXlfaW50ZXJzZWN0X2tleSgkbyxhcnJheV9mbGlwKFsndGl0bGUnLCdjb3N0JywnbWluX2Ftb3VudCcsJ3JlcXVpcmVzJywndHlwZScsJ2VuYWJsZWQnLCdmcmVlX3NoaXBwaW5nX3RocmVzaG9sZCcsJ3ByaWNlJywnZnJlZV9mcm9tJywndGF4X3N0YXR1cyddKSk7IH0KICAgICRyWydzYWx5cyddPVsnYWxsb3dlZCc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2FsbG93ZWRfY291bnRyaWVzJyksJ3NwZWNpZmljJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2Vfc3BlY2lmaWNfYWxsb3dlZF9jb3VudHJpZXMnKSwnc2hpcF90byc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3NoaXBfdG9fY291bnRyaWVzJyksJ3NwZWNpZmljX3NoaXAnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9zcGVjaWZpY19zaGlwX3RvX2NvdW50cmllcycpLCdkZWZhdWx0X2NvdW50cnknPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9kZWZhdWx0X2NvdW50cnknKV07CiAgICBmb3JlYWNoKFdDKCktPnBheW1lbnRfZ2F0ZXdheXMoKS0+cGF5bWVudF9nYXRld2F5cygpIGFzICRnKXsgJHN0PVtdOyBmb3JlYWNoKChhcnJheSkkZy0+c2V0dGluZ3MgYXMgJGs9PiR2KXsgaWYoJHNsYXB0YSgkaykpIGNvbnRpbnVlOyBpZihwcmVnX21hdGNoKCcjY291bnRyfHNhbGl8cmVnaW9ufGVuYWJsZWR8dGl0bGUjaScsJGspKSAkc3RbJGtdPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCwxMjApOiR2OyB9ICRyWydnYXRld2F5cyddWyRnLT5pZF09WydlbmFibGVkJz0+JGctPmVuYWJsZWQsJ3RpdGxlJz0+JGctPmdldF90aXRsZSgpLCdudXN0Jz0+JHN0XTsgfQogICAgZ2xvYmFsICR3cF9maWx0ZXI7IGZvcmVhY2goWyd3b29jb21tZXJjZV9zaGlwcGluZ19jaG9zZW5fbWV0aG9kJywnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcycsJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X2ZpZWxkcycsJ3dvb2NvbW1lcmNlX2RlZmF1bHRfYWRkcmVzc19maWVsZHMnLCd3b29jb21tZXJjZV9jb3VudHJpZXNfYWxsb3dlZF9jb3VudHJpZXMnLCd3b29jb21tZXJjZV9jb3VudHJpZXNfc2hpcHBpbmdfY291bnRyaWVzJ10gYXMgJGgpeyBpZighaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBjb250aW51ZTsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcmlvPT4kY2JzKXsgZm9yZWFjaCgkY2JzIGFzICRjYil7ICRmbj0kY2JbJ2Z1bmN0aW9uJ107ICRubT1pc19hcnJheSgkZm4pPyhpc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF0pLic6OicuJGZuWzFdOihpc19zdHJpbmcoJGZuKT8kZm46J2Nsb3N1cmUnKTsgaWYoJGZuIGluc3RhbmNlb2YgQ2xvc3VyZSl7ICRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmbik7ICRubS49JyBAJy5iYXNlbmFtZSgkcmYtPmdldEZpbGVOYW1lKCkpLic6Jy4kcmYtPmdldFN0YXJ0TGluZSgpOyB9ICRyWydrYWJsaWFpJ11bJGhdW109JHByaW8uJzogJy4kbm07IH0gfSB9CiAgICAkcD13Y19nZXRfcHJvZHVjdCgxMjQ2Nik7IGlmKCRwKXsgJG09Z2V0X3Bvc3RfbWV0YSgxMjQ2Nik7ICRyWydwMTI0NjYnXT1bJ3Bhdic9PiRwLT5nZXRfbmFtZSgpLCdzYW5kZWxpcyc9PiRtWydfcHNfc2FuZGVsaXMnXVswXT8/bnVsbCwnb3duJz0+JG1bJ19vd25fc3RvY2tfcXR5J11bMF0/P251bGwsJ3N2b3Jpcyc9PiRwLT5nZXRfd2VpZ2h0KCksJ3NoaXBwaW5nX2NsYXNzJz0+JHAtPmdldF9zaGlwcGluZ19jbGFzcygpLCdzb3VyY2VzJz0+JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9MTI0NjYiLEFSUkFZX0EpLCdyZXNvbHZlJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpP1BldHNob3BfQVZfU291cmNlOjpyZXNvbHZlKDEyNDY2LDEpOm51bGxdOyB9CiAgICBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi5waHAnKSxnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5waHAnKSkgYXMgJGcpeyAkcz1maWxlX2dldF9jb250ZW50cygkZyk7IHByZWdfbWF0Y2hfYWxsKCcjW15cbl17MCwxMjB9KG5lbW9rYW1bXlxuXXswLDgwfXBhxaF0b21hdHxwYcWhdG9tYXRbXlxuXXswLDgwfW5lbW9rYW0pW15cbl17MCwxMjB9I2l1JywkcywkbW0pOyBpZigkbW1bMF0pICRyWydwcmFuZXNpbW9fc2FsdGluaXMnXVtzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRnKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19yZXBsYWNlKCcjXHMrIycsJyAnLHN1YnN0cigkeCwwLDMwMCkpO30sJG1tWzBdKSwwLDMpOyB9CiAgfQogIGlmKCRmPT09JzInKXsKICAgIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRnKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBpZihwcmVnX21hdGNoKCcjY291cmllcl9vbmx5fGhpZGVfcGFyY2VsX2lmX2NvdXJpZXJfb25seXxwYXN0b21hdG9fc2FyZ2FzIycsJHMpKXsgcHJlZ19tYXRjaF9hbGwoJyMuezAsMzAwfShjb3VyaWVyX29ubHl8aGlkZV9wYXJjZWxfaWZfY291cmllcl9vbmx5fHBhc3RvbWF0b19zYXJnYXMpLnswLDkwMH0jcycsJHMsJG0pOyAkclsna29kYXMnXVtiYXNlbmFtZSgkZyldPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHN1YnN0cigkeCwwLDEyMDApO30sYXJyYXlfc2xpY2UoJG1bMF0sMCwzKSk7IH0gfQogICAgJHJbJ3BzX3NvdXJjZXNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfc291cmNlcyIpOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-201941';
const GKEY='ps_s1716a';
const PHASES=["1"];
const OUT='analize/s1716_a1.json';
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
