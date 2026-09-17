process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTAgZCDigJQgdGVzdGFzOiBzdmXEjWlvIGthc2Egc3UgZXNhbW9zIHBhc2t5cm9zIGVsLiBwYcWhdHUgKHRlcnJhQGd5dnVuYWkubHQpLCBiYWNzLCB0ZXN0aW7ElyBwcmVrxJc7IHBvIHRvIGF0xaFhdWt0aS4gKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRFPSd0ZXJyYUBneXZ1bmFpLmx0JzsKICBpZiAoaXNzZXQoJF9HRVRbJ3BzX3MxNjkwZDInXSkpIHsKICAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfbmFtZSBMSUtFICcldGVzdGFzJScgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDEiKTsgaWYoISRwaWQpe2VjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ25lcmFfdGVzdGluZXMnPT4xKSk7ZXhpdDt9IHdjX2xvYWRfY2FydCgpOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7IFdDKCktPmNhcnQtPmFkZF90b19jYXJ0KCRwaWQsMSk7CiAgICAkX1BPU1Q9YXJyYXkoJ2JpbGxpbmdfZmlyc3RfbmFtZSc9PidUZXN0YXMnLCdiaWxsaW5nX2xhc3RfbmFtZSc9PidTMTY5MCcsJ2JpbGxpbmdfY291bnRyeSc9PidMVCcsJ2JpbGxpbmdfYWRkcmVzc18xJz0+J1Rlc3RvIGcuIDEnLCdiaWxsaW5nX2NpdHknPT4nVmlsbml1cycsJ2JpbGxpbmdfcG9zdGNvZGUnPT4nMDExMDAnLCdiaWxsaW5nX3Bob25lJz0+JyszNzA2MDAwMDAwMCcsJ2JpbGxpbmdfZW1haWwnPT4kRSwnY3JlYXRlYWNjb3VudCc9PjEsJ3BheW1lbnRfbWV0aG9kJz0+J2JhY3MnLCd0ZXJtcyc9PjEsJ3Rlcm1zLWZpZWxkJz0+MSwnc2hpcF90b19kaWZmZXJlbnRfYWRkcmVzcyc9PjAsJ29yZGVyX2NvbW1lbnRzJz0+J1RFU1RBUyBTMTY5MCDigJQgYXTFoWF1a3RpJyk7CiAgICAkX1BPU1RbJ3dvb2NvbW1lcmNlLXByb2Nlc3MtY2hlY2tvdXQtbm9uY2UnXT13cF9jcmVhdGVfbm9uY2UoJ3dvb2NvbW1lcmNlLXByb2Nlc3NfY2hlY2tvdXQnKTsgJF9QT1NUWydfd3Bub25jZSddPSRfUE9TVFsnd29vY29tbWVyY2UtcHJvY2Vzcy1jaGVja291dC1ub25jZSddOwogICAgJF9SRVFVRVNUPWFycmF5X21lcmdlKCRfUkVRVUVTVCwkX1BPU1QpOyAkX1NFUlZFUlsnUkVRVUVTVF9NRVRIT0QnXT0nUE9TVCc7IGlmKCFkZWZpbmVkKCdET0lOR19BSkFYJykpIGRlZmluZSgnRE9JTkdfQUpBWCcsdHJ1ZSk7CiAgICBhZGRfZmlsdGVyKCd3cF9kb2luZ19hamF4JywnX19yZXR1cm5fdHJ1ZScpOyBXQygpLT5jaGVja291dCgpLT5wcm9jZXNzX2NoZWNrb3V0KCk7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ25lYnV2b19leGl0Jz0+dHJ1ZSwgJ25vdGljZXMnPT53Y19nZXRfbm90aWNlcygpKSk7IGV4aXQ7IH0KICBpZiAoaXNzZXQoJF9HRVRbJ3BzX3MxNjkwZDMnXSkpIHsgJG89YXJyYXkoKTsKICAgICRpZHM9d2NfZ2V0X29yZGVycyhhcnJheSgnbGltaXQnPT4yLCdvcmRlcmJ5Jz0+J2lkJywnb3JkZXInPT4nREVTQycsJ2JpbGxpbmdfZW1haWwnPT4kRSwncmV0dXJuJz0+J2lkcycpKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkb3JkPXdjX2dldF9vcmRlcigkaWQpOyAkbj1hcnJheSgpOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+NikpIGFzICRudCkgJG5bXT1tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRudC0+Y29udGVudCksMCwxMDApOwogICAgICAkcm93PWFycmF5KCdpZCc9PiRpZCwnc3QnPT4kb3JkLT5nZXRfc3RhdHVzKCksJ3VpZCc9PiRvcmQtPmdldF9jdXN0b21lcl9pZCgpLCdtZXRhJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19wYXNreXJhX3ByaXNraXJ0YScpLCdzdWt1cnRhcyc9PiRvcmQtPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdwYXN0YWJvcyc9PiRuKTsKICAgICAgaWYgKCRvcmQtPmdldF9jdXN0b21lcl9ub3RlKCk9PT0nVEVTVEFTIFMxNjkwIOKAlCBhdMWhYXVrdGknICYmICRvcmQtPmhhc19zdGF0dXMoJ29uLWhvbGQnKSkgeyAkb3JkLT51cGRhdGVfc3RhdHVzKCdjYW5jZWxsZWQnLCdURVNUQVMgUzE2OTAgYXTFoWF1a3RhcyBhdXRvbWF0acWha2FpLicpOyAkcm93WydhdHNhdWt0YSddPXRydWU7IH0KICAgICAgJG9bJ3V6cyddW109JHJvdzsgfQogICAgJHU9Z2V0X3VzZXJfYnkoJ2VtYWlsJywkRSk7ICRvWydwYXNreXJvc19hZHJlc2FzJ109YXJyYXkoJ2FkZHInPT5nZXRfdXNlcl9tZXRhKCR1LT5JRCwnYmlsbGluZ19hZGRyZXNzXzEnLHRydWUpLCdjaXR5Jz0+Z2V0X3VzZXJfbWV0YSgkdS0+SUQsJ2JpbGxpbmdfY2l0eScsdHJ1ZSkpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogIGlmIChpc3NldCgkX0dFVFsncHNfczE2OTBkMSddKSkgeyAkbz1hcnJheSgpOwogICAgJG9bJ3VpZCddPWVtYWlsX2V4aXN0cygkRSk7ICRvWydwcm9kJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF9uYW1lLHBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIChwb3N0X25hbWUgTElLRSAnJXRlc3RhcyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJXRlc3RpbiUnIE9SIHBvc3RfbmFtZSBMSUtFICcldGVzdC0lJykgTElNSVQgOCIsQVJSQVlfQSk7CiAgICAkb1sncGx1Z2luJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thc2FfUGFza3lyYScpOwogICAgJGQ9YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY2hlY2tvdXRfcG9zdGVkX2RhdGEnLGFycmF5KCdiaWxsaW5nX2VtYWlsJz0+JEUsJ2NyZWF0ZWFjY291bnQnPT4xKSk7CiAgICAkb1snY3JlYXRlYWNjb3VudF9wbyddPSRkWydjcmVhdGVhY2NvdW50J107ICRvWydjdXN0b21lcl9pZF9wbyddPWFwcGx5X2ZpbHRlcnMoJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X2N1c3RvbWVyX2lkJywwKTsgJG9bJ3VwZGF0ZV9kYXRhJ109YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY2hlY2tvdXRfdXBkYXRlX2N1c3RvbWVyX2RhdGEnLHRydWUsbnVsbCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQp9LDk5KTsK';
const VER='dep-160531';
const GKEY='ps_s1690d1';
const PHASES=["ps_s1690d1"];
const OUT='analize/s1690_d1.json';
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
