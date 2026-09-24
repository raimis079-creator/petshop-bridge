process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA5cyddKSkgcmV0dXJuOwogICRyPVtdOyAkZj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcGV0c2hvcC1mZWVkcy9nb29nbGUueG1sJzsgaWYoIWZpbGVfZXhpc3RzKCRmKSl7ICRnPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzLyovZ29vZ2xlLnhtbCcpOyAkZj0kZz8kZ1swXTonJzsgfQogIGlmKCEkZil7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9mZWVkL2dvb2dsZScpLFsndGltZW91dCc9PjYwLCdzc2x2ZXJpZnknPT5mYWxzZV0pKTsgfSBlbHNlICRiPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAkclsnZmFpbGFzJ109JGY7ICRyWydsZW4nXT1zdHJsZW4oJGIpOwogIHByZWdfbWF0Y2hfYWxsKCcjPGc6aW1hZ2VfbGluaz4oLio/KTwvZzppbWFnZV9saW5rPiNzJywkYiwkbSk7ICR1PSRtWzFdOyAkclsnbiddPWNvdW50KCR1KTsKICAkc3Q9Wydub25hc2NpaSc9PjAsJ3BjdCc9PjAsJ3dlYnAnPT4wLCdwbmcnPT4wLCdqcGcnPT4wLCdodHRwJz0+MCwnc3BhY2UnPT4wLCdkaW1fc2NhbGVkJz0+MF07ICRwdno9W107CiAgZm9yZWFjaCgkdSBhcyAkeCl7ICR4PWh0bWxfZW50aXR5X2RlY29kZSgkeCk7IGlmKHByZWdfbWF0Y2goJy9bXlx4MjAtXHg3ZV0vJywkeCkpeyRzdFsnbm9uYXNjaWknXSsrOyAkcHZ6Wydub25hc2NpaSddW109JHg7fSBpZihzdHJwb3MoJHgsJyUnKSE9PWZhbHNlKXskc3RbJ3BjdCddKys7ICRwdnpbJ3BjdCddW109JHg7fSBpZihwcmVnX21hdGNoKCcvXC53ZWJwJC9pJywkeCkpJHN0Wyd3ZWJwJ10rKzsgaWYocHJlZ19tYXRjaCgnL1wucG5nJC9pJywkeCkpJHN0WydwbmcnXSsrOyBpZihwcmVnX21hdGNoKCcvXC5qcGU/ZyQvaScsJHgpKSRzdFsnanBnJ10rKzsgaWYoc3RycG9zKCR4LCdodHRwOi8vJyk9PT0wKSRzdFsnaHR0cCddKys7IGlmKHN0cnBvcygkeCwnICcpIT09ZmFsc2UpJHN0WydzcGFjZSddKys7IGlmKHN0cnBvcygkeCwnLXNjYWxlZCcpIT09ZmFsc2UpJHN0WydkaW1fc2NhbGVkJ10rKzsgfQogICRyWydzdCddPSRzdDsgZm9yZWFjaCgkcHZ6IGFzICRrPT4kdikgJHJbJ3B2eiddWyRrXT1hcnJheV9zbGljZSgkdiwwLDQpOyAkclsncGlybWknXT1hcnJheV9zbGljZSgkdSwwLDMpOwogIC8vIFVBIHRlc3RhaQogICR0ZXN0PWFycmF5X21lcmdlKGFycmF5X3NsaWNlKCR1LDAsMiksIGlzc2V0KCRwdnpbJ25vbmFzY2lpJ10pP2FycmF5X3NsaWNlKCRwdnpbJ25vbmFzY2lpJ10sMCwxKTpbXSwgaXNzZXQoJHB2elsncGN0J10pP2FycmF5X3NsaWNlKCRwdnpbJ3BjdCddLDAsMSk6W10pOwogIGZvcmVhY2goJHRlc3QgYXMgJHgpeyAkeD1odG1sX2VudGl0eV9kZWNvZGUoJHgpOyBmb3JlYWNoKFsnYmluZ2JvdCc9PidNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgYmluZ2JvdC8yLjA7ICtodHRwOi8vd3d3LmJpbmcuY29tL2Jpbmdib3QuaHRtKScsJ2FkaWR4Jz0+J01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMDAuMCBTYWZhcmkvNTM3LjM2IEVkZy8xMDAuMCAoY29tcGF0aWJsZTsgQWRJZHhCb3QvMi4wOyAraHR0cDovL3d3dy5iaW5nLmNvbS9iaW5nYm90Lmh0bSknLCdtc25tZWRpYSc9Pidtc25ib3QtbWVkaWEvMS4xICgraHR0cDovL3NlYXJjaC5tc24uY29tL21zbmJvdC5odG0pJ10gYXMgJGs9PiR1YSl7ICRoPXdwX3JlbW90ZV9oZWFkKCR4LFsndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PiR1YSwncmVkaXJlY3Rpb24nPT4wXSk7ICRyWyd1YSddWyR4XVska109aXNfd3BfZXJyb3IoJGgpPyRoLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKS4nICcud3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkaCwnY29udGVudC10eXBlJykuJyAnLndwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJGgsJ2NvbnRlbnQtbGVuZ3RoJyk7IH0gfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-124613';
const GKEY='ps_s1709s';
const PHASES=["1"];
const OUT='analize/s1709_s.json';
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
