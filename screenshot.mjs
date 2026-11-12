process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU2YiDigJQgQW5pbW9uZGEgxaF1bmltcyAxNTAgZyAxLzExLzIyICgxMSA9IOKIkjIgY3Qvdm50LiwgMjIgPSDiiJI1ICUpLCAyNC8zNiDihpIganVvZHJhxaF0aXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODU2J10pPyRfR0VUWydwc19zMTg1NiddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTg1NmItJy4kZik7CiAgJEs9YXJyYXkoMTk0NDY9PmFycmF5KCcxMy44NicsJzI2Ljc1JyksMTk0MTE9PmFycmF5KCcxMy44NicsJzI2Ljc1JyksMTk0MjU9PmFycmF5KCcxNC40MScsJzI3LjgwJyksMTk0MTQ9PmFycmF5KCcxNC40MScsJzI3LjgwJyksMTkzOTY9PmFycmF5KCcxNC40MScsJzI3LjgwJykpOwogICRUPWFycmF5KDExPT43NzIsMjI9Pjc3Myk7CiAgJHJhc3RpPWZ1bmN0aW9uKCRiLCRxKSB1c2UoJHdwZGIsJHApeyByZXR1cm4gJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwLnBvc3RfaWQgRlJPTSB7JHB9cG9zdG1ldGEgcCBKT0lOIHskcH1wb3N0bWV0YSBxIE9OIHEucG9zdF9pZD1wLnBvc3RfaWQgQU5EIHEubWV0YV9rZXk9J19kcF9wYWNrX3F0eScgQU5EIHEubWV0YV92YWx1ZT0lcyBKT0lOIHskcH1wb3N0cyB6IE9OIHouSUQ9cC5wb3N0X2lkIEFORCB6LnBvc3Rfc3RhdHVzPD4ndHJhc2gnIFdIRVJFIHAubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBwLm1ldGFfdmFsdWU9JXMgT1JERVIgQlkgcC5wb3N0X2lkIExJTUlUIDEiLChzdHJpbmcpJHEsKHN0cmluZykkYikpOyB9OwogICRUUj1hcnJheSgpOyBmb3JlYWNoKCRLIGFzICRiPT4keCkgZm9yZWFjaChhcnJheSgxMSwyMikgYXMgJGk9PiRxKSBpZighJHJhc3RpKCRiLCRxKSkgJFRSW109YXJyYXkoJGIsJHEsJHhbJGldKTsKICBpZigkZj09PScwJyl7ICRiYWs9YXJyYXkoJ2QxOSc9PmdldF9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnKSk7IGZvcmVhY2goJEsgYXMgJGI9PiR4KXsgJGJha1snc2VpbWEnXVskYl09Z2V0X3Bvc3RfbWV0YSgkYiwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSk7IGZvcmVhY2goJHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0lcyIsKHN0cmluZykkYikpIGFzICRpZCkgJGJha1sncGFrJ11bJGlkXT1nZXRfcG9zdF9zdGF0dXMoJGlkKTsgfQogICAgaWYoIWdldF9vcHRpb24oJ3BzX3MxODU2X2JhaycpKSB1cGRhdGVfb3B0aW9uKCdwc19zMTg1Nl9iYWsnLCRiYWssZmFsc2UpOyAkb1sndHJ1a3N0YSddPSRUUjsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICBpZihwcmVnX21hdGNoKCcvXlAoXGQrKSQvJywkZiwkbSkpeyBpZighJFRSKXsgZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PiRvWyd2J10sJ25pZWtvJz0+MSkpOyBleGl0OyB9IGxpc3QoJGIsJHEsJGspPSRUUlswXTsKICAgICRiYXplPXdjX2dldF9wcm9kdWN0KCRiKTsgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmlua2luaWFpJywnaXNzYXVnb3RpX2RwJyk7ICRyLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJHItPmludm9rZUFyZ3MoJHItPmlzU3RhdGljKCk/bnVsbDpuZXcgUGV0c2hvcF9SaW5raW5pYWkoKSxhcnJheSgwLCRxLicgdm50LiAnLiRiYXplLT5nZXRfbmFtZSgpLCcnLCRrLHdwX3N0cmlwX2FsbF90YWdzKCRiYXplLT5nZXRfc2hvcnRfZGVzY3JpcHRpb24oKSksdHJ1ZSxhcnJheSgpLGFycmF5KCRiPT4kcSksbnVsbCxhcnJheSgpLG51bGwpKTsKICAgIGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4kb1sndiddLCdwYXN0YWJhJz0+J2JlIHdwX3NlbmRfanNvbicpKTsgZXhpdDsgfQogIGlmKCRmPT09J1UnKXsgaWYoJFRSKSAkb1snRVJSX3RydWtzdGEnXT0kVFI7ICRkMTk9KGFycmF5KWdldF9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLGFycmF5KCkpOwogICAgZm9yZWFjaCgkSyBhcyAkYj0+JHgpeyAkcz1nZXRfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKTsgaWYoISRzKXsgJHM9J2F2LScuZ2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbmFtZScsJGIpOyB1cGRhdGVfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJywkcyk7IH0KICAgICAgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPSVzIiwoc3RyaW5nKSRiKSkgYXMgJGlkKXsgJHE9KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTsKICAgICAgICBpZihpc3NldCgkVFskcV0pKXsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19keWR6aW9fc2VpbWEnLCRzKTsgd3Bfc2V0X29iamVjdF90ZXJtcygkaWQsYXJyYXkoJFRbJHFdKSwncGFfcGFrdW90ZXNfZHlkaXMnLGZhbHNlKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19zMTg1Nl9wYWthcycsJGIpOyB9CiAgICAgICAgZWxzZWlmKGdldF9wb3N0X3N0YXR1cygkaWQpPT09J3B1Ymxpc2gnKXsgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCcpKTsgJG9bJ2p1b2RyYXN0aXMnXVtdPSRpZC4nICgnLiRxLicpJzsgfQogICAgICAgIGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkaWQpOwogICAgICAgICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkb1snYiddWyRiXVskcV09YXJyYXkoJGlkLGdldF9wb3N0X3N0YXR1cygkaWQpLCRwci0+Z2V0X3ByaWNlKCkscm91bmQoJHByLT5nZXRfcHJpY2UoKS9tYXgoMSwkcSksMyksZ2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSk7IH0KICAgICAgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfJy5tZDUoJHMpKTsgaWYoIWluX2FycmF5KCRzLCRkMTksdHJ1ZSkpICRkMTlbXT0kczsgY2xlYW5fcG9zdF9jYWNoZSgkYik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGIpOyB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJywkZDE5KTsgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7ICRvWydkMTlfbiddPWNvdW50KCRkMTkpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgaWYoJGY9PT0nOScpeyAkYmFrPWdldF9vcHRpb24oJ3BzX3MxODU2X2JhaycpOyBmb3JlYWNoKChhcnJheSkkYmFrWydwYWsnXSBhcyAkaWQ9PiRzdCkgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PiRzdCkpOwogICAgZm9yZWFjaCgkSyBhcyAkYj0+JHgpeyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3MxODU2X3Bha2FzJyBBTkQgbWV0YV92YWx1ZT0lcyIsKHN0cmluZykkYikpIGFzICRpZCkgaWYoIWlzc2V0KCRiYWtbJ3BhayddWyRpZF0pKSB3cF90cmFzaF9wb3N0KCRpZCk7IGlmKCRiYWtbJ3NlaW1hJ11bJGJdPT09JycpIGRlbGV0ZV9wb3N0X21ldGEoJGIsJ19wc19keWR6aW9fc2VpbWEnKTsgfQogICAgdXBkYXRlX29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsJGJha1snZDE5J10pOyBkZWxldGVfdHJhbnNpZW50KCdwc19ka19zZWltb3MnKTsgZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PidTMTg1NmItOScpKTsgZXhpdDsgfQp9KTsK';
const VER='dep-162029';
const GKEY='ps_s1856';
const PHASES=["0", "U"];
const OUT='analize/s1856_b.json';
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
