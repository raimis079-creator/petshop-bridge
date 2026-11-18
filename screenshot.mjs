process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1diByeXRvIHR5cmltYXMgNSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4ODV2J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg4NXYnXTsKICB0cnl7CiAgJHdhbnQ9WycxNzM4JywnMTc0MScsJzE3NjgnLCcxNzcxJywnMTc3MiddOwogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIGRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTExLTEzJyBPUkRFUiBCWSBpZCIpOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsgJG5yPShzdHJpbmcpJG8tPmdldF9vcmRlcl9udW1iZXIoKTsgaWYoIWluX2FycmF5KCRuciwkd2FudCx0cnVlKSkgY29udGludWU7CiAgICAkbT1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSBrLCBMRUZUKG1ldGFfdmFsdWUsMTAwKSB2IEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPSVkIEFORCBtZXRhX2tleSBOT1QgTElLRSAnX2JpbGxpbmclJScgQU5EIG1ldGFfa2V5IE5PVCBMSUtFICdfc2hpcHBpbmclJScgQU5EIG1ldGFfa2V5IE5PVCBMSUtFICclJWVtYWlsJSUnIEFORCBtZXRhX2tleSBOT1QgTElLRSAnJSVwaG9uZSUlJyBBTkQgbWV0YV9rZXkgTk9UIExJS0UgJyUlYWRkcmVzcyUlJyBBTkQgbWV0YV9rZXkgTk9UIExJS0UgJyUlbmFtZSUlJyIsJGlkKSxBUlJBWV9BKSBhcyAkeCkgJG1bJHhbJ2snXV09JHhbJ3YnXTsKICAgICRubj1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4zXSkgYXMgJG4peyAkbm5bXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwyMjApLicgKCcuJG4tPmFkZGVkX2J5LicpJzsgfQogICAgJGl0PVtdOyBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkeCl7ICRwPSR4LT5nZXRfcHJvZHVjdCgpOyAkaXRbXT0oJHA/JHAtPmdldF9pZCgpOjApLicgJy5tYl9zdWJzdHIoJHgtPmdldF9uYW1lKCksMCw0NSkuJyB4Jy4keC0+Z2V0X3F1YW50aXR5KCkuJyBzdD0nLigkcD8kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCk6Jy0nKS4nIHZmcT0nLigkcD8kcC0+Z2V0X21ldGEoJ192Zl9xdHknKTonJyk7IH0KICAgICRyWydvJ11bJG5yXT1bJ2lkJz0+JGlkLCdzdCc9PiRvLT5nZXRfc3RhdHVzKCksJ2NvbXBsJz0+JG8tPmdldF9kYXRlX2NvbXBsZXRlZCgpPyRvLT5nZXRfZGF0ZV9jb21wbGV0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpOm51bGwsJ21ldGEnPT4kbSwnbm90ZXMnPT4kbm4sJ2l0ZW1zJz0+JGl0XTsgfQogICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfZW1haWxfam9icyIpOyAkclsnZWpfY29scyddPSRjb2xzOwogICRyWydzdWJfam9iJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIHN0YXR1cywgc2NoZWR1bGVkX2F0LCBzZW50X2F0Ii4oaW5fYXJyYXkoJ29yZGVyX2lkJywkY29scyk/Jywgb3JkZXJfaWQnOicnKS4oaW5fYXJyYXkoJ3BheWxvYWQnLCRjb2xzKT8nLCBMRUZUKHBheWxvYWQsMjAwKSBwbCc6JycpLiIgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93PSdzdWJzY3JpcHRpb25fc3RhcnRlZCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICBmb3JlYWNoKFsncHNfc3Vic2NyaXB0aW9ucycsJ3BzX3ByZW51bWVyYXRvcycsJ3BzX3ByZW51bWVyYXRhJ10gYXMgJHQpeyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRQfSR0JyIpKXsgJHJbJ3N1Yl90J11bJHRdPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9JHQgT1JERVIgQlkgMSBERVNDIExJTUlUIDMiLEFSUkFZX0EpOyB9IH0KICBpZighZW1wdHkoJHJbJ3N1Yl90J10pKSBmb3JlYWNoKCRyWydzdWJfdCddIGFzICR0PT4kcm93cykgZm9yZWFjaCgkcm93cyBhcyAkaT0+JHJvdykgZm9yZWFjaCgkcm93IGFzICRrPT4kdikgaWYocHJlZ19tYXRjaCgnI21haWx8cGhvbmV8bmFtZXxhZGRyfHRva2VufGNhcmQjaScsJGspKSAkclsnc3ViX3QnXVskdF1bJGldWyRrXT0nKioqJzsKICB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-074937';
const GKEY='ps_s1885v';
const PHASES=["1"];
const OUT='analize/s1885v.json';
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
