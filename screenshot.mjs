process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjMgcjIg4oCUIFJFQ09OICh0aWsgc2thaXR5bWFzKTogcHJla2nFsyDFvmVua2xvIHRha3Nvbm9taWphLCBQcmVracWzIGF0YXNrYWl0b3MgKOKAnnJlaWtpYSB1xb5zYWt5dGnigJwpIGR1b21lbsWzIGxhdWthaSwgSm9zZXJhIHBhdnl6ZHlzIHBhZ2FsIHRpZWvEl2rEhS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcjQnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYyMyByMicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwoKICAkb1sndGF4J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGF4b25vbXksQ09VTlQoKikgbiBGUk9NIHskcH10ZXJtX3RheG9ub215IFdIRVJFIHRheG9ub215IExJS0UgJyVicmFuZCUnIE9SIHRheG9ub215IExJS0UgJ3BhX2dhbSUnIE9SIHRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBHUk9VUCBCWSB0YXhvbm9teSIsQVJSQVlfQSk7CiAgJG9bJ2pvc2VyYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQubmFtZSx0dC50YXhvbm9teSx0dC5jb3VudCBGUk9NIHskcH10ZXJtcyB0IEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdC5uYW1lIExJS0UgJ0pvc2VyYSUnIExJTUlUIDYiLEFSUkFZX0EpOwogICRvWydqb3NlcmFfdmYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELExFRlQocC5wb3N0X3RpdGxlLDYwKSBuLG0ubWV0YV92YWx1ZSBzYW5kLHEubWV0YV92YWx1ZSB2ZiBGUk9NIHskcH1wb3N0cyBwIEpPSU4geyRwfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBxIE9OIHEucG9zdF9pZD1wLklEIEFORCBxLm1ldGFfa2V5PSdfdmZfcXR5JyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdGl0bGUgTElLRSAnSm9zZXJhJScgT1JERVIgQlkgcC5wb3N0X3RpdGxlIExJTUlUIDQ1IixBUlJBWV9BKTsKICAkb1snam9zZXJhX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3RpdGxlIExJS0UgJ0pvc2VyYSUnIik7CiAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdGFza2FpdGEtcHJla2VzLnBocCc7ICRMPWV4cGxvZGUoIlxuIiwoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk7ICRnPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJGs9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3JlaWtpYXx1enNha3l0aXxwYXJkdW90YXxncmVpdGlzfGRpZW58cmliYXxmdW5jdGlvbiBzdXJpbmt0aXxmdW5jdGlvbiBlaWxlc3xcJ2F2XCd8X3BzX3NhbmRlbGlzfGJyYW5kfHplbmtsL2knLCRsKSkgJGdbXT0oJGsrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwxNTApOyBpZihjb3VudCgkZyk+NDUpIGJyZWFrOyB9ICRvWydhdGFza2FpdGEnXT0kZzsgJG9bJ2F0YXNrYWl0YV9keWRpcyddPXN0cmxlbihpbXBsb2RlKCJcbiIsJEwpKTsKICAkb1snanVvc3RhX3JlaWtpYSddPWdldF9vcHRpb24oJ3BzX2p1b3N0YV9yZWlraWEnKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-132022';
const GKEY='ps_r4';
const PHASES=["R"];
const OUT='analize/s1623_r2.json';
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
