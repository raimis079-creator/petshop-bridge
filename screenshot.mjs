process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzcwYSBKb3NlcmEgcHJla2VzOiBrYWluYSwgc2F2aWthaW5hLCBsaWt1dGlzLCBwYXJkYXZpbWFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc3MGEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc3MGEnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVqb3NlcmElJyBPUkRFUiBCWSBJRCIpOwogICRvbmU9JGlkc1swXT8/MDsgJHJbJ21ldGFfcmFrdGFpJ109JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkIElOICgiLmltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJyxhcnJheV9zbGljZSgkaWRzLDAsNDApKSkuIikgQU5EIChtZXRhX2tleSBMSUtFICclJWNvc3QlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVzYXZpayUlJyBPUiBtZXRhX2tleSBMSUtFICclJXRpZWslJScgT1IgbWV0YV9rZXkgTElLRSAnJSVzYW5kZWwlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVzb3VyY2UlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVlYW4lJScgT1IgbWV0YV9rZXkgTElLRSAnJSVndGluJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlZHBfJSUnKSIsMCkpOwogICRzb2xkPVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGltLm1ldGFfdmFsdWUgcGlkLCBTVU0ocS5tZXRhX3ZhbHVlKSBuIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIGkgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1pLm9yZGVyX2lkIEFORCBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCcgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgaW0gT04gaW0ub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIGltLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgcSBPTiBxLm9yZGVyX2l0ZW1faWQ9aS5vcmRlcl9pdGVtX2lkIEFORCBxLm1ldGFfa2V5PSdfcXR5JyBXSEVSRSBpLm9yZGVyX2l0ZW1fbmFtZSBMSUtFICclam9zZXJhJScgR1JPVVAgQlkgaW0ubWV0YV92YWx1ZSIsQVJSQVlfQSkgYXMgJHgpICRzb2xkWyR4WydwaWQnXV09KGludCkkeFsnbiddOwogICRyb3dzPVtdOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsgJG09Z2V0X3Bvc3RfbWV0YSgkaWQpOwogICAgJGc9ZnVuY3Rpb24oJGspIHVzZSgkbSl7IHJldHVybiBpc3NldCgkbVska11bMF0pPyRtWyRrXVswXTonJzsgfTsKICAgICRlYW49Jyc7IGZvcmVhY2goWydfZ2xvYmFsX3VuaXF1ZV9pZCcsJ19lYW4nLCdfcHNfZWFuJywnX2d0aW4nLCdlYW4nLCdfYWxnX2VhbicsJ2h3cF9wcm9kdWN0X2d0aW4nLCdfd3BtX2d0aW5fY29kZScsJ19iYXJjb2RlJ10gYXMgJGspeyBpZigkZygkaykhPT0nJyl7ICRlYW49JGcoJGspOyBicmVhazsgfSB9CiAgICAkY29zdD1bXTsgZm9yZWFjaCgkbSBhcyAkaz0+JHYpeyBpZihwcmVnX21hdGNoKCcjY29zdHxzYXZpayNpJywkaykgJiYgJHZbMF0hPT0nJykgJGNvc3RbJGtdPSR2WzBdOyB9CiAgICAkcm93c1tdPVskaWQsJHAtPmdldF9zbHVnKCksaHRtbF9lbnRpdHlfZGVjb2RlKCRwLT5nZXRfbmFtZSgpKSwoZmxvYXQpJHAtPmdldF9wcmljZSgpLChmbG9hdCkkcC0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSwkcC0+aXNfb25fc2FsZSgpPzE6MCwkY29zdCwkcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwkZWFuLCRzb2xkWyRpZF0/PzAsJGcoJ19kcF9udW9sYWlkYV9wcm9jJyksJGcoJ19wc19zYW5kZWxpcycpXTsKICB9CiAgJHJbJ3N0dWxwZWxpYWknXT1bJ2lkJywnc2x1ZycsJ3BhdicsJ2thaW5hJywncmVnJywnYWtjaWphJywnc2F2aWthaW5vcycsJ2J1c2VuYScsJ2tpZWtpcycsJ2VhbicsJ3BhcmR1b3RhX251b18wOTA4JywnZHBfcHJvYycsJ3NhbmRlbGlzJ107CiAgJHJbJ24nXT1jb3VudCgkcm93cyk7ICRyWydwcmVrZXMnXT0kcm93czsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-102631';
const GKEY='ps_s1770a';
const PHASES=["1"];
const OUT='out/s1770a.json';
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
