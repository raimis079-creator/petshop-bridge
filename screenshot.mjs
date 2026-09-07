process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdnQyIOKAlCAoMSkgcmFzdGkgJ1VuZm9ydHVuYXRlbHknIMWhYWJsb27EhTsgKDIpIExUIGhlYWRpbmcvc3ViamVjdCBhZG1pbiBsYWnFoWthbXMgcGVyIG51c3RhdHltdXM7IHBhdGlrcmEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM1dnQyJ10pKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTYzNSB2dDInKTsKICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAvLyAxKSDFoWFibG9uxbMgcGFpZcWha2EKICAka2VsPWFycmF5KGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLGdldF90ZW1wbGF0ZV9kaXJlY3RvcnkoKSk7CiAgZm9yZWFjaChhcnJheV91bmlxdWUoJGtlbCkgYXMgJGRpcil7CiAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgIGZvcmVhY2goJGl0IGFzICRmKXsgaWYoc3Vic3RyKCRmLC00KSE9PScucGhwJykgY29udGludWU7ICRzPUBmaWxlX2dldF9jb250ZW50cygkZixmYWxzZSxudWxsLDAsMjAwMDAwKTsKICAgICAgaWYoJHMhPT1mYWxzZSAmJiBzdHJwb3MoJHMsJ1VuZm9ydHVuYXRlbHknKSE9PWZhbHNlKSAkb1sncmFzdGEnXVtdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYtPmdldFBhdGhuYW1lKCkpOyB9CiAgfQogICR3Y3RlPVdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS90ZW1wbGF0ZXMvZW1haWxzL2FkbWluLWZhaWxlZC1vcmRlci5waHAnOwogIGlmKGZpbGVfZXhpc3RzKCR3Y3RlKSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCR3Y3RlKTsgJG9bJ3djX3NhYmxfdW5mb3J0J109c3RycG9zKCRzLCdVbmZvcnR1bmF0ZWx5JykhPT1mYWxzZT8xOjA7IH0KICAvLyAyKSBMVCBoZWFkaW5nL3N1YmplY3QKICAkc2V0PWFycmF5KAogICAgJ3dvb2NvbW1lcmNlX2ZhaWxlZF9vcmRlcl9zZXR0aW5ncyc9PmFycmF5KCdzdWJqZWN0Jz0+J1tQZXRzaG9wLmx0XTogVcW+c2FreW1vICN7b3JkZXJfbnVtYmVyfSBhcG1va8SXdGkgbmVwYXZ5a28nLCdoZWFkaW5nJz0+J1XFvnNha3ltbyAje29yZGVyX251bWJlcn0gYXBtb2vEl3RpIG5lcGF2eWtvJyksCiAgICAnd29vY29tbWVyY2VfY2FuY2VsbGVkX29yZGVyX3NldHRpbmdzJz0+YXJyYXkoJ3N1YmplY3QnPT4nW1BldHNob3AubHRdOiBVxb5zYWt5bWFzICN7b3JkZXJfbnVtYmVyfSBhdMWhYXVrdGFzJywnaGVhZGluZyc9PidVxb5zYWt5bWFzICN7b3JkZXJfbnVtYmVyfSBhdMWhYXVrdGFzJyksCiAgICAnd29vY29tbWVyY2VfbmV3X29yZGVyX3NldHRpbmdzJz0+YXJyYXkoJ2hlYWRpbmcnPT4nTmF1amFzIHXFvnNha3ltYXMgTnIuIHtvcmRlcl9udW1iZXJ9JyksCiAgKTsKICBpZihmYWxzZT09PWdldF9vcHRpb24oJ3BzX3MxNjM1X2VtYWlsX2JhaycpKXsgJGJhaz1hcnJheSgpOyBmb3JlYWNoKCRzZXQgYXMgJGs9PiRfKXsgJGJha1ska109Z2V0X29wdGlvbigkayk7IH0gYWRkX29wdGlvbigncHNfczE2MzVfZW1haWxfYmFrJywkYmFrLCcnLCdubycpOyB9CiAgZm9yZWFjaCgkc2V0IGFzICRrPT4kbmF1amkpeyAkdj0oYXJyYXkpZ2V0X29wdGlvbigkayxhcnJheSgpKTsgZm9yZWFjaCgkbmF1amkgYXMgJGtrPT4kdnYpICR2WyRra109JHZ2OyB1cGRhdGVfb3B0aW9uKCRrLCR2KTsgfQogIHdwX2NhY2hlX2ZsdXNoKCk7CiAgZm9yZWFjaCgkc2V0IGFzICRrPT4kXyl7ICR2PWdldF9vcHRpb24oJGspOyAkb1sncG8nXVska109YXJyYXlfaW50ZXJzZWN0X2tleSgoYXJyYXkpJHYsYXJyYXlfZmxpcChhcnJheSgnc3ViamVjdCcsJ2hlYWRpbmcnKSkpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-083740';
const GKEY='ps_s1635vt2';
const PHASES=["V2"];
const OUT='analize/s1635_vt2.json';
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
