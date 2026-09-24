process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE1YyBpbnN0b2NrIHN1IGxpa3VjaXUgMCBza2VuYXMgKDEgc2tlbmFzIC8gMiB0YWlzeXRpIC8gOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxNWMnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MTVjJ107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTcxNWMnLCdmYXplJz0+JGZdOyAkUD0kd3BkYi0+cHJlZml4OwogICRzcWw9IlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIHAucG9zdF9zdGF0dXMsIHNzLm1ldGFfdmFsdWUgc3RvY2tfc3RhdHVzLCBzdC5tZXRhX3ZhbHVlIHN0b2NrLCBiby5tZXRhX3ZhbHVlIGJhY2tvcmRlcnMsIHNhLm1ldGFfdmFsdWUgc2FuZGVsaXMsIG93bi5tZXRhX3ZhbHVlIG93biwgcC5wb3N0X21vZGlmaWVkIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG1zIE9OIG1zLnBvc3RfaWQ9cC5JRCBBTkQgbXMubWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIEFORCBtcy5tZXRhX3ZhbHVlPSd5ZXMnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc3MgT04gc3MucG9zdF9pZD1wLklEIEFORCBzcy5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIHNzLm1ldGFfdmFsdWU9J2luc3RvY2snIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc3QgT04gc3QucG9zdF9pZD1wLklEIEFORCBzdC5tZXRhX2tleT0nX3N0b2NrJyBBTkQgQ0FTVChzdC5tZXRhX3ZhbHVlIEFTIFNJR05FRCk8PTAgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGJvIE9OIGJvLnBvc3RfaWQ9cC5JRCBBTkQgYm8ubWV0YV9rZXk9J19iYWNrb3JkZXJzJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc2EgT04gc2EucG9zdF9pZD1wLklEIEFORCBzYS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gb3duIE9OIG93bi5wb3N0X2lkPXAuSUQgQU5EIG93bi5tZXRhX2tleT0nX293bl9zdG9ja19xdHknIFdIRVJFIHAucG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAoYm8ubWV0YV92YWx1ZSBJUyBOVUxMIE9SIGJvLm1ldGFfdmFsdWU9J25vJykiOwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgJHJbJ24nXT1jb3VudCgkcm93cyk7CiAgICAkZz1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCl7ICRrPSR4WydzYW5kZWxpcyddPzonKG5lcmEpJzsgJGdbJGtdPSgkZ1ska10/PzApKzE7IH0gJHJbJ3BhZ2FsX3NhbmRlbGknXT0kZzsKICAgICRyWydwYWdhbF9tb2RpZmllZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUocG9zdF9tb2RpZmllZCkgZCwgQ09VTlQoKikgbiBGUk9NICgkc3FsKSB4IEdST1VQIEJZIERBVEUocG9zdF9tb2RpZmllZCkgT1JERVIgQlkgbiBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAgIC8vIGFyIHJlYWxpYWkgV0MgYXRtZXRhOiBoYXNfZW5vdWdoX3N0b2NrKDEpIHBhdnl6ZHppYW1zCiAgICAkclsncHZ6J109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHhbJ0lEJ10pOyByZXR1cm4gWyR4WydJRCddLG1iX3N1YnN0cigkeFsncG9zdF90aXRsZSddLDAsNTUpLCR4Wydwb3N0X3N0YXR1cyddLCR4WydzdG9jayddLCR4WydzYW5kZWxpcyddLCR4Wydvd24nXSwkcD8oJHAtPmlzX2luX3N0b2NrKCk/J2luJzonb3V0Jyk6Jz8nLCRwPygkcC0+aGFzX2Vub3VnaF9zdG9jaygxKT8nZW5vdWdoJzonTk9UJyk6Jz8nLCRwPyRwLT5nZXRfdHlwZSgpOic/J107IH0sYXJyYXlfc2xpY2UoJHJvd3MsMCw0MCkpOwogICAgLy8gcGFyZGF2aW1haSAzNjUgZC4gKGlzdG9yaWphKSDigJQgYXIgdGFpIHBlcmthbW9zIHByZWtlcwogICAgJGlkcz1pbXBsb2RlKCcsJyxhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAoaW50KSR4WydJRCddO30sJHJvd3MpPzpbMF0pOwogICAgJHJbJ3BhcmR1b3RhXzM2NSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsIFNVTShraWVraXMpIGsgRlJPTSAoU0VMRUNUIHByb2R1Y3RfaWQsIGtpZWtpcyBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgcHJvZHVjdF9pZCBJTiAoJGlkcykgVU5JT04gQUxMIFNFTEVDVCBwcm9kdWN0X2lkLCBraWVraXMgRlJPTSB7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSBwcm9kdWN0X2lkIElOICgkaWRzKSBBTkQgc3VrdXJ0YV9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMzY1IERBWSkpIHggR1JPVVAgQlkgcHJvZHVjdF9pZCBPUkRFUiBCWSBrIERFU0MgTElNSVQgMjUiLEFSUkFZX0EpOwogICAgJHJbJ2Z1bmtjaWpvcyddPVsncHNfc291cmNlc19zeW5jX3NhdWdpYWknPT5mdW5jdGlvbl9leGlzdHMoJ3BzX3NvdXJjZXNfc3luY19zYXVnaWFpJyksJ3djX3VwZGF0ZV9wcm9kdWN0X3N0b2NrX3N0YXR1cyc9PmZ1bmN0aW9uX2V4aXN0cygnd2NfdXBkYXRlX3Byb2R1Y3Rfc3RvY2tfc3RhdHVzJyldOwogIH0KICBpZigkZj09PScyJyl7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgJGJhaz1nZXRfb3B0aW9uKCdwc19zMTcxNV9pbnN0b2NrMF9iYWsnLFtdKTsgJGRvbmU9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJGlkPShpbnQpJHhbJ0lEJ107ICRiYWtbJGlkXT1bJ3N0b2NrX3N0YXR1cyc9PiR4WydzdG9ja19zdGF0dXMnXSwnc3RvY2snPT4keFsnc3RvY2snXSwndCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07IHdjX3VwZGF0ZV9wcm9kdWN0X3N0b2NrX3N0YXR1cygkaWQsJ291dG9mc3RvY2snKTsgJGRvbmVbXT0kaWQ7IH0KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzE1X2luc3RvY2swX2JhaycsJGJhayxmYWxzZSk7ICRyWydwYWtlaXN0YSddPWNvdW50KCRkb25lKTsgJHJbJ2lkcyddPSRkb25lOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIGZvcmVhY2goJGRvbmUgYXMgJGlkKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpeyB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkclsnY2FjaGUnXT0naXN2YWx5dGFzJzsgfQogICAgJHJbJ2xpa28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAoJHNxbCkgeCIpOwogIH0KICBpZigkZj09PSc5Jyl7ICRiYWs9Z2V0X29wdGlvbigncHNfczE3MTVfaW5zdG9jazBfYmFrJyxbXSk7ICRuPTA7IGZvcmVhY2goJGJhayBhcyAkaWQ9PiRiKXsgd2NfdXBkYXRlX3Byb2R1Y3Rfc3RvY2tfc3RhdHVzKChpbnQpJGlkLCRiWydzdG9ja19zdGF0dXMnXSk7ICRuKys7IH0gJHJbJ2F0c3RhdHl0YSddPSRuOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-195311';
const GKEY='ps_s1715c';
const PHASES=["1"];
const OUT='analize/s1715_c1.json';
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
