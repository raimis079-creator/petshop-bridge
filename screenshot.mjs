process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ1cCBwZXJqdW5naW1vIGRhdGEgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQ1cCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc0NXAnXTsKICAkZj1udWxsOyBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfSXN0X0FkYXB0ZXJpcycpKXsgJHJmPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfSXN0X0FkYXB0ZXJpcycpOyAkZj0kcmYtPmdldEZpbGVOYW1lKCk7IH0gJHJbJ2ZhaWxhcyddPSRmP3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYpOidrbGFzZSBuZXJhc3RhJzsKICBpZigkZil7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgcHJlZ19tYXRjaCgnIy9cKlwqLio/XCovI3MnLCR0LCRtKTsgJHJbJ2hkJ109bWJfc3Vic3RyKCRtWzBdPz8nJywwLDE4MDApOwogICAgcHJlZ19tYXRjaF9hbGwoIi8oY29uc3Rccytcdytccyo9XHMqW147XSs7fGdldF9vcHRpb25cKFxzKlteKV0rXCl8dXBkYXRlX29wdGlvblwoXHMqW14pXStcKSkvIiwkdCwkbW0pOyAkclsnb3BjJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbW1bMV0pKTsKICAgICRwPXN0cnBvcygkdCwncGVyanVuZ2ltbyBkYXRhJyk7ICRyWydjdHgnXT0kcCE9PWZhbHNlP3N1YnN0cigkdCxtYXgoMCwkcC0xMjAwKSwxNTAwKTonJzsgfQogICRyWydpc3QnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihkYXRhKSBudW8sIE1BWChkYXRhKSBpa2ksIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIixBUlJBWV9BKSA/OiAkd3BkYi0+bGFzdF9lcnJvcjsKICBpZighaXNfYXJyYXkoJHJbJ2lzdCddKSl7ICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIik7ICRyWydpc3RfY29scyddPSRjb2xzOyB9CiAgJHJbJ2Zha3QnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihzdWt1cnRhX2F0KSBudW8sIE1BWChzdWt1cnRhX2F0KSBpa2ksIENPVU5UKCopIG4sIFNVTSh0ZXN0aW5pcz0xKSB0ZXN0IEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIixBUlJBWV9BKTsKICAkclsnZmFrdF9waXJtaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hc19pZCwgc3VrdXJ0YV9hdCwgdGVzdGluaXMsIHN0YXR1c2FzX2dhbHV0aW5pcyBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBPUkRFUiBCWSBzdWt1cnRhX2F0IExJTUlUIDYiLEFSUkFZX0EpOwogICRyWyd3Y19waXJtaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBkYXRlX2NyZWF0ZWRfZ210LCBzdGF0dXMgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIE9SREVSIEJZIGRhdGVfY3JlYXRlZF9nbXQgTElNSVQgNiIsQVJSQVlfQSk7CiAgJHQ9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1pc3Rvcmlqb3MtYWRhcHRlcmlzLnBocCcpOwogIHByZWdfbWF0Y2hfYWxsKCcvZnVuY3Rpb25ccysoXHcrKS8nLCR0LCRmbik7ICRyWydmdW5rY2lqb3MnXT0kZm5bMV07CiAgJHA9c3RycG9zKCR0LCd1cGRhdGVfb3B0aW9uKCBzZWxmOjpPUFRfUklCQScpOyAkclsnc2V0dGVyJ109c3Vic3RyKCR0LG1heCgwLCRwLTkwMCksMTMwMCk7CiAgJHA9c3RycG9zKCR0LCdDUkVBVEUgT1IgUkVQTEFDRSBWSUVXJyk7IGlmKCRwPT09ZmFsc2UpICRwPXN0cnBvcygkdCwnVklFVycpOyAkclsndmlld19zcWwnXT1zdWJzdHIoJHQsbWF4KDAsJHAtMzAwKSwxNjAwKTsKICAkclsnaXN0X3JpYm9zJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNSU4oc3VrdXJ0YV9hdCkgbnVvLCBNQVgoc3VrdXJ0YV9hdCkgaWtpLCBDT1VOVCgqKSBuLCBTVU0oc3VrdXJ0YV9hdD49JzIwMjYtMDktMDcnKSBwb18wOTA3LCBTVU0oc3VrdXJ0YV9hdD49JzIwMjYtMDktMDgnKSBwb18wOTA4IEZST00geyRQfXBzX2lzdF9mYWt0X3V6c2FreW1haSIsQVJSQVlfQSk7CiAgJHJbJ2lzdF9wYXNrdXRpbmlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hc19pZCxzdWt1cnRhX2F0LHN0YXR1c2FzX2dhbHV0aW5pcyBGUk9NIHskUH1wc19pc3RfZmFrdF91enNha3ltYWkgT1JERVIgQlkgc3VrdXJ0YV9hdCBERVNDIExJTUlUIDQiLEFSUkFZX0EpOwogICRyWydyaWJhX2RhYmFyJ109Z2V0X29wdGlvbigncHNfcGVyanVuZ2ltb19kYXRhJywnKG5lcmEpJyk7ICRyWydyb2RpbmlhaSddPWdldF9vcHRpb24oJ3BzX2lzdF9hZGFwdF9yb2RpbmlhaScsJyhuZXJhKScpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-193630';
const GKEY='ps_s1745p';
const PHASES=["1"];
const OUT='out/s1745_p.json';
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
