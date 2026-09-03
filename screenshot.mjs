process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDggcnVuIGUzc3RvcDIg4oCUIFdQIE1haWwgU01UUDogZWlsxJcvxb51cm5hbGFzIOKAlCBrYXMgZGFyIHNpdW7EjWlhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2Uzc3RvcDInXSkpIHJldHVybjsKICAkZj1zdHJ0b3VwcGVyKHNhbml0aXplX2tleSgkX0dFVFsncHNfZTNzdG9wMiddKSk7ICRvPWFycmF5KCdmJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRvWydsZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICclbWFpbHNtdHAlJyIpOwogIGZvcmVhY2goJG9bJ2xlbnRlbGVzJ10gYXMgJHQpeyAkb1snbiddWyR0XT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRgIik7ICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSBgJHRgIik7ICRvWydjb2xzJ11bJHRdPWltcGxvZGUoJywnLCRjb2xzKTsgfQogICRxPSJ7JHB9d3BtYWlsc210cF9lbWFpbHNfcXVldWUiOyBpZihpbl9hcnJheSgkcSwkb1snbGVudGVsZXMnXSx0cnVlKSl7ICRvWydxdWV1ZV9zdGF0dXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsQ09VTlQoKikgbiBGUk9NIGAkcWAgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsgJG9bJ3F1ZXVlX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxkYXRlX2VucXVldWVkLGRhdGVfcHJvY2Vzc2VkIEZST00gYCRxYCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLEFSUkFZX0EpOyB9CiAgJGw9InskcH13cG1haWxzbXRwX2VtYWlsc19sb2ciOyBpZihpbl9hcnJheSgkbCwkb1snbGVudGVsZXMnXSx0cnVlKSl7ICRvWydsb2dfcGFza3V0aW5pYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdWJqZWN0LGRhdGVfc2VudCxzdGF0dXMgRlJPTSBgJGxgIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNiIsQVJSQVlfQSk7ICRvWydsb2dfcGVyX21pbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKGRhdGVfc2VudCwnJUg6JWknKSBtLENPVU5UKCopIG4gRlJPTSBgJGxgIFdIRVJFIGRhdGVfc2VudD5EQVRFX1NVQihVVENfVElNRVNUQU1QKCksSU5URVJWQUwgMyBIT1VSKSBHUk9VUCBCWSBtIE9SREVSIEJZIG0gREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7IH0KICAkcz1nZXRfb3B0aW9uKCd3cF9tYWlsX3NtdHAnKTsgJG9bJ3NtdHBfbWFpbGVyJ109JHNbJ21haWwnXVsnbWFpbGVyJ10/P251bGw7ICRvWydxdWV1ZV9vcHQnXT0kc1sncXVldWUnXT8/bnVsbDsKICAkb1sncGVuZGluZ191enMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIHN0YXR1cyBJTiAoJ3djLXBlbmRpbmcnLCd3Yy1mYWlsZWQnKSIpOwogICRvWyd0M19saWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX29yZGVycyBXSEVSRSBpZCBCRVRXRUVOIDM1NDUxIEFORCAzNTc3MCIpOwogICRvWydjcm9uX21haWwnXT1hcnJheSgpOyBmb3JlYWNoKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcyl7IGZvcmVhY2goJGhvb2tzIGFzICRoPT4keCl7IGlmKHN0cmlwb3MoJGgsJ21haWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRoLCdlbWFpbCcpIT09ZmFsc2V8fHN0cmlwb3MoJGgsJ3BlbmRpbmcnKSE9PWZhbHNlKSAkb1snY3Jvbl9tYWlsJ11bXT0kaC4nIEAnLmdtZGF0ZSgnSDppJywkdHMpOyB9IH0KICBpZigkZj09PSdTVE9QJyAmJiBpbl9hcnJheSgkcSwkb1snbGVudGVsZXMnXSx0cnVlKSl7ICRvWydxdWV1ZV9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSBgJHFgIFdIRVJFIHN0YXR1czw+MiIpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-180141';
const GKEY='ps_e3stop2';
const PHASES=["R"];
const OUT='analize/e3_stop_recon2.json';
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
