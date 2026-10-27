process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA0YiBUcml4aWUgc3RyaXVrZXMgZGF0YSAwOS0yNSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MDRiJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgwNGInXTsKICB0cnl7CiAgICBmb3JlYWNoKFsnMFRSMTE4XzY4MDM3NScsJzBUUjExOF82ODAzOTUnLCcwVFIxMThfNjgwMzcyJ10gYXMgJHNrdSl7ICRpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3NrdScgQU5EIG1ldGFfdmFsdWU9JXMgTElNSVQgMSIsJHNrdSkpOwogICAgICAkbT1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsMTUwKSB2IEZST00geyRQfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJXN0b2NrJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlemIlJScgT1IgbWV0YV9rZXkgTElLRSAnX3BzXyUlJyBPUiBtZXRhX2tleSBJTignX3ByaWNlJywnX3JlZ3VsYXJfcHJpY2UnLCdfY29zdF9wcmljZScsJ3BteGlfJSUnKSkiLCRpZCksQVJSQVlfQSkgYXMgJHgpICRtWyR4WydtZXRhX2tleSddXT0keFsndiddOwogICAgICAkclskc2t1XT1bJ2lkJz0+JGlkLCdwb3N0Jz0+JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X3N0YXR1cyxwb3N0X2RhdGUscG9zdF9tb2RpZmllZCBGUk9NIHskUH1wb3N0cyBXSEVSRSBJRD0lZCIsJGlkKSxBUlJBWV9BKSwnbWV0YSc9PiRtLCdzb3VyY2VzJz0+JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSksJ3BteGknPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpbXBvcnRfaWQsdW5pcXVlX2tleSxpdGVyYXRpb24sc3BlY2lmaWVkIEZST00geyRQfXBteGlfcG9zdHMgV0hFUkUgcG9zdF9pZD0lZCIsJGlkKSxBUlJBWV9BKV07IH0KICAgIC8vIGt1ciByYXNvbWEgc3luY2VkX2F0IGlyIGtva2lhIGRhdGEgcm9kbyBrYXRhbG9nYXMKICAgICRoaXRzPVtdOyAkZmlsZXM9YXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi9pbmNsdWRlcy8qLnBocCcpKTsKICAgIGZvcmVhY2goJGZpbGVzIGFzICRmKXsgZm9yZWFjaChmaWxlKCRmKSBhcyAkaT0+JGwpeyBpZihzdHJpcG9zKCRsLCdzeW5jZWRfYXQnKSE9PWZhbHNlKSAkaGl0c1tdPWJhc2VuYW1lKCRmKS4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbCwwLDIyMCkpOyB9IH0gJHJbJ3N5bmNlZF9hdF9rb2RhcyddPWFycmF5X3NsaWNlKCRoaXRzLDAsNjApOwogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIGNvZGUgTElLRSAnJXN5bmNlZF9hdCUnIixBUlJBWV9BKTsgJHJbJ3NuaXBwZXRzX3N5bmNlZCddPSRzbjsKICAgIGZvcmVhY2goJHNuIGFzICRzKXsgJGM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkc1snaWQnXSkpOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsKXsgaWYoc3RyaXBvcygkbCwnc3luY2VkX2F0JykhPT1mYWxzZSkgJHJbJ3NuX2VpbCddW109JHNbJ2lkJ10uJzonLigkaSsxKS4nICcudHJpbShtYl9zdWJzdHIoJGwsMCwyMjApKTsgfSB9CiAgICAka2Y9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsgJGs9W107IGZvcmVhY2goZmlsZSgka2YpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9zeW5jZWRfYXR8cG9zdF9tb2RpZmllZHxBdG5hdWppbnR8YXRuYXVqaW50L3UnLCRsKSkgJGtbXT0oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjIwKSk7IH0gJHJbJ2thdGFsb2dhcyddPWFycmF5X3NsaWNlKCRrLDAsNDApOwogICAgJHJbJ2ltcDNfb3B0aW9ucyddPW1iX3N1YnN0cigoc3RyaW5nKSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3B0aW9ucyBGUk9NIHskUH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MyIpLDAsMzAwMCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-194657';
const GKEY='ps_s1804b';
const PHASES=["1"];
const OUT='analize/s1804b.json';
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
