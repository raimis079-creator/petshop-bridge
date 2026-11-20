process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTA0ZCBpbXBvcnQgdGVtcGFzICsjMiAoRCBkcnksIDEgZGllZ3RpLCAyIHBhdGlrcmEsIDkgYXRzdGF0eXRpKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE5MDRkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTkwNGQnXTsgJHI9Wyd2Jz0+J1MxOTA0ZCcsJ0YnPT4kRl07CiAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1pbXBvcnQtdGVtcGFzLnBocCc7ICRBPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy9zMTkwNC8nOyAkYj0kQS4ncGV0c2hvcC1pbXBvcnQtdGVtcGFzLnBocC5iYWsnOwogICRPTEQ9Ilx0Y29uc3QgVkVSU0lKQSAgPSAnMS4yJzsiOyAkTkVXPSJcdGNvbnN0IFZFUlNJSkEgID0gJzEuMyc7IjsKICAkT0xEMj0iXHRjb25zdCBJTVBPUlRBSSA9IFsgMyBdOyI7ICRORVcyPSJcdGNvbnN0IElNUE9SVEFJID0gWyAyLCAzIF07IC8vIHYxLjMgKFMxOTA0LCAyMDI2LTExLTIwLCBSYWltaXMpOiArICMyIFpCIHByZWtlcywga2l0YWlwIGJhaWdkYXZvc2kgdGlrIGthcyB+NSBkLiI7CiAgJGhjPWZ1bmN0aW9uKCl7ICRvPVtdOyBmb3JlYWNoKFsnLycsJy9rcmVwc2VsaXMvJywnL3BhcmR1b3R1dmUvJ10gYXMgJHUpeyAkeD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCR1KSxbJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJG9bJHVdPWlzX3dwX2Vycm9yKCR4KT8nZXJyJzp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCk7IH0gcmV0dXJuICRvOyB9OwogIHRyeXsKICAgICR0PUBmaWxlX2dldF9jb250ZW50cygkZik7ICRyWydtZDUnXT0kdD9tZDUoJHQpOm51bGw7ICRyWyduX29sZCddPXN1YnN0cl9jb3VudCgoc3RyaW5nKSR0LCRPTEQpOyAkclsnbl9vbGQyJ109c3Vic3RyX2NvdW50KChzdHJpbmcpJHQsJE9MRDIpOwogICAgaWYoJEY9PT0nRCcpeyAkclsnYmFrX3lyYSddPWZpbGVfZXhpc3RzKCRiKTsgfQogICAgZWxzZWlmKCRGPT09JzEnKXsKICAgICAgaWYoc3Vic3RyKCRyWydtZDUnXSwwLDgpIT09JzU0NjFmZjVhJ3x8JHJbJ25fb2xkJ10hPT0xfHwkclsnbl9vbGQyJ10hPT0xKXsgJHJbJ2tsYWlkYSddPSdmYWlsYXMgbmUgdG9rcywga29rcyBsYXVrdGEnOyB9CiAgICAgIGVsc2V7CiAgICAgICAgaWYoIWlzX2RpcigkQSkpIHdwX21rZGlyX3AoJEEpOyBpZighZmlsZV9leGlzdHMoJGIpKSBjb3B5KCRmLCRiKTsgJHJbJ2Jha19tZDUnXT1tZDVfZmlsZSgkYik7CiAgICAgICAgaWYoJHJbJ2Jha19tZDUnXSE9PSRyWydtZDUnXSl7ICRyWydrbGFpZGEnXT0nYmFrIG1kNSc7IH0KICAgICAgICBlbHNlewogICAgICAgICAgJG49c3RyX3JlcGxhY2UoWyRPTEQsJE9MRDJdLFskTkVXLCRORVcyXSwkdCk7CiAgICAgICAgICB0cnl7IHRva2VuX2dldF9hbGwoJG4sVE9LRU5fUEFSU0UpOyB9Y2F0Y2goXFRocm93YWJsZSAkeCl7ICRyWydrbGFpZGEnXT0ncGFyc2U6ICcuJHgtPmdldE1lc3NhZ2UoKTsgfQogICAgICAgICAgaWYoZW1wdHkoJHJbJ2tsYWlkYSddKSl7IGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRuKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnbWQ1X25hdWphcyddPW1kNV9maWxlKCRmKTsKICAgICAgICAgICAgJHJbJ2hjJ109JGhjKCk7IGZvcmVhY2goJHJbJ2hjJ10gYXMgJGgpeyBpZigkaD09PSdlcnInfHwkaD49NTAwKXsgZmlsZV9wdXRfY29udGVudHMoJGYsZmlsZV9nZXRfY29udGVudHMoJGIpKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnQVRTVEFUWVRBJ109bWQ1X2ZpbGUoJGYpOyBicmVhazsgfSB9IH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIGVsc2VpZigkRj09PScyJyl7ICRyWydlaWx1dGUnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X21hcCgncnRyaW0nLGZpbGUoJGYpKSxmbigkbCk9PnN0cnBvcygkbCwnSU1QT1JUQUkgPScpIT09ZmFsc2V8fHN0cnBvcygkbCwnVkVSU0lKQSAgPScpIT09ZmFsc2UpKTsgJHJbJ2hjJ109JGhjKCk7CiAgICAgIGdsb2JhbCAkd3BkYjsgJHJbJ2ltcDInXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHRyaWdnZXJlZCxwcm9jZXNzaW5nLHF1ZXVlX2NodW5rX251bWJlcixpbXBvcnRlZCxza2lwcGVkLGNvdW50LGxhc3RfYWN0aXZpdHkgRlJPTSB7JHdwZGItPnByZWZpeH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MiIsQVJSQVlfQSk7ICRyWyd0ZW1wYXNfcGFzayddPWdldF9vcHRpb24oJ3BzX2ltcG9ydF90ZW1wYXNfcGFza3V0aW5pcycpOyAkbj13cF9uZXh0X3NjaGVkdWxlZCgncGV0c2hvcF9pbXBvcnRfdGVtcGFzJyk7ICRyWydraXRhcyddPSRuP3dwX2RhdGUoJ0g6aTpzJywkbik6bnVsbDsgfQogICAgZWxzZWlmKCRGPT09JzknKXsgaWYoZmlsZV9leGlzdHMoJGIpKXsgZmlsZV9wdXRfY29udGVudHMoJGYsZmlsZV9nZXRfY29udGVudHMoJGIpKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnYXRzdGF0eXRhJ109bWQ1X2ZpbGUoJGYpOyB9IGVsc2UgJHJbJ2tsYWlkYSddPSduZXJhIGJhayc7IH0KICB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-082132';
const GKEY='ps_s1904d';
const PHASES=["D", "1", "2"];
const OUT='analize/s1904_d.json';
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
