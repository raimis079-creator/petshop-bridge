process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwbCBBbWJyb3NpYSBrYXTEl3Mg4oCUIHBhdGFpc29zIChwc19zb3VyY2VzIHNhdmlrYWluYSwgRFQvVFIgbGVudGVsxJdzIG1hcCkgKyBwYXRpa3JhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDBsJ10pPyRfR0VUWydwc19zMTgwMGwnXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE4MDBsJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbm93PWN1cnJlbnRfdGltZSgnbXlzcWwnKTsKICAgICRpZHM9YXJyYXkoMzcwNzIsMzcwNzYsMzcwODAsMzcwODQsMzcwODgsMzcwOTIsMzcwOTYsMzcxMDAsMzcxMDQsMzcxMDgsMzcxMTIsMzcxMTYpOwogICAgLy8gMS4gbGVudGVsxJcgMzU0IOKAlCBiZW5kcmEgdHJpbXMgc3RlcmlsaXp1b3RvbXMgbGluaWpvbXMKICAgICR3cGRiLT51cGRhdGUoJHAuJ3BzX2ZlZWRpbmdfdGFibGVzJyxhcnJheSgnbGluZSc9PidBbWJyb3NpYSBDYXQgU3RlcmlsaXplZCBBZHVsdCAoVHVya2V5ICYgSGVycmluZyAvIER1Y2sgJiBUdXJrZXkgLyBUcm91dCAmIFJhYmJpdCDigJQgdmllbm9kYSBnYW1pbnRvam8gbGVudGVsxJcpJywndmVyaWZpY2F0aW9uX25vdGUnPT4nUzE4MDAgMjAyNi0xMC0yNjogc3VhdWd1c2lvcyBrYXTEl3MgKHBhbGFpa3ltbykgc3R1bHBlbGlzOyBMaWdodCDigJMgYXByYcWheW1lOyBnYW1pbnRvam8gbGVudGVsxJcgaWRlbnRpxaFrYSAzIGxpbmlqb21zICh1cV9jaGVja3N1bSksIHRvZMSXbCB2aWVuYSBsZW50ZWzElycsJ3VwZGF0ZWRfYXQnPT4kbm93KSxhcnJheSgnaWQnPT4zNTQpKTsKICAgIGZvcmVhY2goYXJyYXkoMzcwOTYsMzcxMDAsMzcxMDQsMzcxMDgpIGFzICRpZCl7IGlmKCEkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIDEgRlJPTSB7JHB9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSkpICR3cGRiLT5pbnNlcnQoJHAuJ3BzX2ZlZWRpbmdfbWFwJyxhcnJheSgnZmVlZGluZ190YWJsZV9pZCc9PjM1NCwncHJvZHVjdF9pZCc9PiRpZCwnaXNfYWN0aXZlJz0+MSkpOyB9CiAgICAvLyAyLiBwc19zb3VyY2VzIHNhdmlrYWluYQogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRjPWdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSk7ICRlPWdldF9wb3N0X21ldGEoJGlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsdHJ1ZSk7CiAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskcH1wc19zb3VyY2VzIFNFVCBjb3N0X25ldD0lcywgZWFuPSVzLCBpc19hY3RpdmU9MSwgaXNfc2VsbGFibGU9MSwgdXBkYXRlZF9hdD0lcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBzb3VyY2U9J2FtYnJvc2lhJyIsJGMsJGUsJG5vdywkaWQpKTsgfQogICAgJG9wdD1nZXRfb3B0aW9uKCdwc19zMTgwMF9jYXRzX2NyZWF0ZWQnKTsgJG9wdFsnaWRzJ109JGlkczsgJG9wdFsndGFibGVzJ11bJ0RUJ109MzU0OyAkb3B0Wyd0YWJsZXMnXVsnVFInXT0zNTQ7IHVwZGF0ZV9vcHRpb24oJ3BzX3MxODAwX2NhdHNfY3JlYXRlZCcsJG9wdCxmYWxzZSk7CiAgICAvLyAzLiBwYXRpa3JhCiAgICAkcmVwbz1jbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5Jyk/bmV3IFBldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5KCk6bnVsbDsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcil7ICRvWydwcmVrZXMnXVskaWRdPSdORVJBU1RBJzsgY29udGludWU7IH0KICAgICAgJHg9YXJyYXkoJ3NrdSc9PiRwci0+Z2V0X3NrdSgpLCdzdCc9PiRwci0+Z2V0X3N0YXR1cygpLCdrYWluYSc9PiRwci0+Z2V0X3ByaWNlKCksJ2Nvc3QnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpLCdlYW4nPT4kcHItPmdldF9nbG9iYWxfdW5pcXVlX2lkKCksJ3N2b3Jpcyc9PiRwci0+Z2V0X3dlaWdodCgpLCdpbWcnPT4kcHItPmdldF9pbWFnZV9pZCgpPzE6MCwnZ2FsJz0+Y291bnQoJHByLT5nZXRfZ2FsbGVyeV9pbWFnZV9pZHMoKSksCiAgICAgICAgJ2NhdCc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSksJ2JyYW5kJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLCdzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksCiAgICAgICAgJ3NyYyc9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxjb3N0X25ldCxzdG9ja19xdHksaXNfYWN0aXZlIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSxBUlJBWV9BKSwKICAgICAgICAnZGVzY19sZW4nPT5zdHJsZW4oJHByLT5nZXRfZGVzY3JpcHRpb24oKSksJ3VybCc9PmdldF9wZXJtYWxpbmsoJGlkKSk7CiAgICAgIGZvcmVhY2goJHByLT5nZXRfYXR0cmlidXRlcygpIGFzICRrPT4kYSl7ICR4WydhdHRycyddWyRrXT1hcnJheV9tYXAoZnVuY3Rpb24oJHQpeyByZXR1cm4gJHQtPm5hbWU7IH0sIHdwX2dldF9wb3N0X3Rlcm1zKCRpZCwkaykpOyB9CiAgICAgIGlmKCRyZXBvKXsgJGZyPSRyZXBvLT5nZXRfZm9yX3Byb2R1Y3QoJGlkKTsgJHhbJ2ZlZWQnXT0kZnJbJ3N0YXR1cyddLihpc3NldCgkZnJbJ3N1cHBvcnQnXSk/JyAnLiRmclsnc3VwcG9ydCddLicgdD0nLiRmclsndGFibGVfaWQnXS4nIHJvd3M9Jy5jb3VudCgkZnJbJ3Jvd3MnXSk6JycpOyB9CiAgICAgICRvWydwcmVrZXMnXVskaWRdPSR4OyB9CiAgICAkb1sndGFibGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbGluZSxzdGF0dXMscm93X2NvdW50LGlzX2FjdGl2ZSxjYW5vbmljYWxfaGFzaF92ZXJzaW9uLChTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfZmVlZGluZ19tYXAgbSBXSEVSRSBtLmZlZWRpbmdfdGFibGVfaWQ9dC5pZCkgcHJla2l1IEZST00geyRwfXBzX2ZlZWRpbmdfdGFibGVzIHQgV0hFUkUgaW1wb3J0X2JhdGNoX2lkPSdTMTgwMCciLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-125323';
const GKEY='ps_s1800l';
const PHASES=["GO"];
const OUT='analize/s1800_l.json';
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
