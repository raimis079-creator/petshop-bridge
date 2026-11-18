process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY4ZyBQcmFnbWEgMTAvMDkgZmFpbGFpIFdpbmRvd3MtMTI1NyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjhnJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg2OGcnXTsKICB0cnl7ICRyWydpbnRsJ109ZnVuY3Rpb25fZXhpc3RzKCd0cmFuc2xpdGVyYXRvcl90cmFuc2xpdGVyYXRlJyk7ICRyWydpY29udiddPWZ1bmN0aW9uX2V4aXN0cygnaWNvbnYnKTsgJHJbJ21kNSddPW1kNV9maWxlKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXByYWdtYS9wZXRzaG9wLXByYWdtYS5waHAnKTsKICAkZW5jPWZ1bmN0aW9uKCRzKXsgaWYoZnVuY3Rpb25fZXhpc3RzKCd0cmFuc2xpdGVyYXRvcl90cmFuc2xpdGVyYXRlJykpICRzPXByZWdfcmVwbGFjZV9jYWxsYmFjaygnL1tceHswNDAwfS1ceHswNEZGfV0rL3UnLGZuKCRtKT0+KHRyYW5zbGl0ZXJhdG9yX3RyYW5zbGl0ZXJhdGUoJ1J1c3NpYW4tTGF0aW4vQkdOJywkbVswXSk/OnRyYW5zbGl0ZXJhdG9yX3RyYW5zbGl0ZXJhdGUoJ0FueS1MYXRpbjsgTGF0aW4tQVNDSUknLCRtWzBdKT86Jz8nKSwkcyk7ICRvPUBpY29udignVVRGLTgnLCdXaW5kb3dzLTEyNTcvL1RSQU5TTElUJywkcyk7IHJldHVybiAkbz09PWZhbHNlP21iX2NvbnZlcnRfZW5jb2RpbmcoJHMsJ1dpbmRvd3MtMTI1NycsJ1VURi04Jyk6JG87IH07CiAgJHRtcD10ZW1wbmFtKHN5c19nZXRfdGVtcF9kaXIoKSwneicpOyAkej1uZXcgWmlwQXJjaGl2ZSgpOyAkei0+b3BlbigkdG1wLFppcEFyY2hpdmU6Ok9WRVJXUklURSk7CiAgZm9yZWFjaChbJzIwMjYtMTAnLCcyMDI2LTA5J10gYXMgJHBlcil7CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19wcmFnbWFfZWtzcG9ydHVvdGEnIEFORCBtZXRhX3ZhbHVlPSVzIiwkcGVyKSk7CiAgICAkb3JkPVtdOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKChpbnQpJGlkKTsgaWYoJG8pICRvcmRbXT0kbzsgfQogICAgdXNvcnQoJG9yZCxmbigkYSwkYik9PnN0cmNtcCgkYS0+Z2V0X21ldGEoJ19wZXRzaG9wX2F2cG5fbnVtYmVyJyksJGItPmdldF9tZXRhKCdfcGV0c2hvcF9hdnBuX251bWJlcicpKSk7CiAgICAkZj1bJ2ltb25lc18nLiRwZXIuJy50eHQnPT5wZXRzaG9wX3ByYWdtYV9nZW5lcmF0ZV9pbW9uZXMoJG9yZCksJ3BhcmRhdmltYWlfJy4kcGVyLicudHh0Jz0+cGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfcGFyZGF2aW1haSgkb3JkKSwncGFyZGF2aW1haV9zdW1fJy4kcGVyLicudHh0Jz0+cGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfcGFyZGF2aW1haV9zdW0oJG9yZCldOwogICAgZm9yZWFjaCgkZiBhcyAkZm49PiRjKXsgJGU9JGVuYygkYyk7ICR6LT5hZGRGcm9tU3RyaW5nKCRwZXIuJy8nLiRmbiwkZSk7ICRyWydmJ11bJHBlcl1bJGZuXT1bc3RybGVuKCRjKSxzdHJsZW4oJGUpLHN1YnN0cl9jb3VudCgkZSwnPycpLXN1YnN0cl9jb3VudCgkYywnPycpXTsgfQogICAgJHJbJ24nXVskcGVyXT1jb3VudCgkb3JkKTsKICAgICRzPSRlbmMocGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfaW1vbmVzKGFycmF5X3NsaWNlKCRvcmQsMCwzKSkpOyAkclsncHZ6J11bJHBlcl09bWJfY29udmVydF9lbmNvZGluZygkcywnVVRGLTgnLCdXaW5kb3dzLTEyNTcnKTsKICB9CiAgJHotPmNsb3NlKCk7ICRyWyd6aXBfYjY0J109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkdG1wKSk7IEB1bmxpbmsoJHRtcCk7CiAgLy8gcnVzaXNrYSBwYXZhcmRlCiAgJG89JHdwZGItPmdldF92YXIoIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfYXZwbl9udW1iZXInIEFORCBtZXRhX3ZhbHVlPSdBVlBOMDExNTE1JyIpOyBpZigkbyl7ICRvbz13Y19nZXRfb3JkZXIoJG8pOyAkclsncnVzJ109WyRvby0+Z2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgpLicgJy4kb28tPmdldF9iaWxsaW5nX2xhc3RfbmFtZSgpLCBtYl9jb252ZXJ0X2VuY29kaW5nKCRlbmMoJG9vLT5nZXRfYmlsbGluZ19maXJzdF9uYW1lKCkuJyAnLiRvby0+Z2V0X2JpbGxpbmdfbGFzdF9uYW1lKCkpLCdVVEYtOCcsJ1dpbmRvd3MtMTI1NycpXTsgfQogIH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-092539';
const GKEY='ps_s1868g';
const PHASES=["1"];
const OUT='analize/s1868_g.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
