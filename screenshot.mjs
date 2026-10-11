process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzcxYSBTRU8gc3RyYWlwc25pYWkgLT4gdXpzYWt5bWFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc3MWEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7ICRyPVsndic9PidTMTc3MWEnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRwb3N0cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCwgcG9zdF9uYW1lLCBwb3N0X3RpdGxlLCBwb3N0X2RhdGUgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwb3N0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIixBUlJBWV9BKTsKICAgICRyWydzdHJhaXBzbml1J109Y291bnQoJHBvc3RzKTsgJHNsdWdzPVtdOyBmb3JlYWNoKCRwb3N0cyBhcyAkcCl7ICRwYXRoPXRyaW0od3BfcGFyc2VfdXJsKGdldF9wZXJtYWxpbmsoJHBbJ0lEJ10pLFBIUF9VUkxfUEFUSCksJy8nKTsgJHNsdWdzWyRwYXRoXT0kcFsncG9zdF90aXRsZSddOyB9CiAgICAkclsncHZ6X2tlbGlhaSddPWFycmF5X3NsaWNlKGFycmF5X2tleXMoJHNsdWdzKSwwLDUpOwogICAgJFNUPSInd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCciOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgby50b3RhbF9hbW91bnQgdCwgby5kYXRlX2NyZWF0ZWRfZ210IGQsIExPV0VSKG8uYmlsbGluZ19lbWFpbCkgZW0sCiAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3djX29yZGVyX2F0dHJpYnV0aW9uX3Nlc3Npb25fZW50cnknIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgZW50cnksCiAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3djX29yZGVyX2F0dHJpYnV0aW9uX3NvdXJjZV90eXBlJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHN0LAogICAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J193Y19vcmRlcl9hdHRyaWJ1dGlvbl91dG1fc291cmNlJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHNyYywKICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfd2Nfb3JkZXJfYXR0cmlidXRpb25fcmVmZXJyZXInIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgcmVmCiAgICAgIEZST00geyRQfXdjX29yZGVycyBvIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgbSBPTiBtLm9yZGVyX2lkPW8uaWQgQU5EIG0ubWV0YV9rZXkgTElLRSAnX3djX29yZGVyX2F0dHJpYnV0aW9uXyUnCiAgICAgIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOKCRTVCkgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDgnIEdST1VQIEJZIG8uaWQiLEFSUkFZX0EpOwogICAgJHJbJ3V6c192aXNvJ109Y291bnQoJHJvd3MpOyAkaGl0PVtdOyAka2FuYWxhaT1bXTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkaz0oJHhbJ3N0J10/Oic/JykuJy8nLigkeFsnc3JjJ10/Oic/Jyk7ICRrYW5hbGFpWyRrXT0oJGthbmFsYWlbJGtdPz8wKSsxOwogICAgICAkcGF0aD10cmltKChzdHJpbmcpd3BfcGFyc2VfdXJsKChzdHJpbmcpJHhbJ2VudHJ5J10sUEhQX1VSTF9QQVRIKSwnLycpOwogICAgICBpZigkcGF0aCE9PScnICYmIGlzc2V0KCRzbHVnc1skcGF0aF0pKSAkaGl0W109Wyd1enMnPT4keFsnaWQnXSwnc3VtYSc9PiR4Wyd0J10sJ2RhdGEnPT5zdWJzdHIoJHhbJ2QnXSwwLDEwKSwnc3RyYWlwc25pcyc9PiRzbHVnc1skcGF0aF0sJ2thbmFsYXMnPT4ka107CiAgICB9CiAgICBhcnNvcnQoJGthbmFsYWkpOyAkclsna2FuYWxhaSddPSRrYW5hbGFpOyAkclsnaXNfc3RyYWlwc25pdSddPSRoaXQ7CiAgICAkclsnc3VfZW50cnknXT1jb3VudChhcnJheV9maWx0ZXIoJHJvd3MsZm4oJHgpPT4hZW1wdHkoJHhbJ2VudHJ5J10pKSk7CiAgICAvLyBzdHJhaXBzbml1IGxhbmtvbXVtYXMgKHdlYiBzdGF0aXN0aWthIGplaSB5cmEpCiAgICBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzX3dlYl9kaWVub3MnIikpeyAkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX3dlYl9kaWVub3MiKTsgJHJbJ3dlYl9jb2xzJ109JGNvbHM7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-130919';
const GKEY='ps_s1771a';
const PHASES=["1"];
const OUT='out/s1771a.json';
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
