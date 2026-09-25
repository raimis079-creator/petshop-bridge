process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3dyDigJQgU3VwZXIgQ2FjaGU6IHdwX2NhY2hlX2NsZWFyX29uX3Bvc3RfZWRpdCAxIOKGkiAwIChrYWQgaW1wb3J0YWkgbmV0cmludHUgdmlzbyBrZXNvKS4gRmF6ZXM6IDEgc2F1c2FzLCAyIHZ5a2R5dGkgKGJhayBwcy1hcmNoeXZhcy93cC1jYWNoZS1jb25maWcucGhwLmJha19zMTcxNyksIDMgcGF0aWtyYSwgOSBhdHN0YXR5dGkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE3dyddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxN3cnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7ICRyPVsndic9PidTMTcxN3cnLCdmYXplJz0+JGZdOwogICRjZj1XUF9DT05URU5UX0RJUi4nL3dwLWNhY2hlLWNvbmZpZy5waHAnOyAkYmFrPScvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvcHMtYXJjaHl2YXMvd3AtY2FjaGUtY29uZmlnLnBocC5iYWtfczE3MTcnOwogICRzYz1XUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvcGV0c2hvcC5sdCc7CiAgJGtpZWs9ZnVuY3Rpb24oKSB1c2UoJHNjKXsgJG49MDsgaWYoaXNfZGlyKCRzYykpeyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRzYyxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZmkpeyBpZihzdWJzdHIoJGZpLT5nZXRGaWxlbmFtZSgpLC01KT09PScuaHRtbCcpICRuKys7IH0gfSByZXR1cm4gJG47IH07CiAgdHJ5ewogICAgJHM9ZmlsZV9nZXRfY29udGVudHMoJGNmKTsgcHJlZ19tYXRjaCgnI15cJHdwX2NhY2hlX2NsZWFyX29uX3Bvc3RfZWRpdFxzKj1ccyooW147XSopOyNtJywkcywkbSk7ICRyWydkYWJhciddPXRyaW0oJG1bMV0/Pyc/Jyk7ICRyWydtZDUnXT1tZDUoJHMpOyAkclsna2Vzb19mYWlsdSddPSRraWVrKCk7CiAgICBpZigkZj09PScyJyl7CiAgICAgIGlmKCFpc19maWxlKCRiYWspKSBjb3B5KCRjZiwkYmFrKTsgJHJbJ2JhayddPWlzX2ZpbGUoJGJhayk7CiAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfc2V0dGluZycpKXsgd3BfY2FjaGVfc2V0dGluZygnd3BfY2FjaGVfY2xlYXJfb25fcG9zdF9lZGl0JywwKTsgJHJbJ3dwX2NhY2hlX3NldHRpbmcnXT0nb2snOyB9CiAgICAgIGVsc2UgeyAkczI9cHJlZ19yZXBsYWNlKCcjXihcJHdwX2NhY2hlX2NsZWFyX29uX3Bvc3RfZWRpdFxzKj1ccyopW147XSo7I20nLCckezF9MDsnLCRzKTsgZmlsZV9wdXRfY29udGVudHMoJGNmLCRzMik7ICRyWydyZWdleCddPSdvayc7IH0KICAgICAgJHM9ZmlsZV9nZXRfY29udGVudHMoJGNmKTsgcHJlZ19tYXRjaCgnI15cJHdwX2NhY2hlX2NsZWFyX29uX3Bvc3RfZWRpdFxzKj1ccyooW147XSopOyNtJywkcywkbSk7ICRyWydwbyddPXRyaW0oJG1bMV0/Pyc/Jyk7CiAgICB9CiAgICBpZigkZj09PSczJyl7ICRyWydwYXRpa3JhJ109WydudXN0YXR5bWFzJz0+JHJbJ2RhYmFyJ10sJ2tlc29fZmFpbHUnPT4kclsna2Vzb19mYWlsdSddLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOyB9CiAgICBpZigkZj09PSc5Jyl7IGlmKGlzX2ZpbGUoJGJhaykpeyBjb3B5KCRiYWssJGNmKTsgJHJbJ2F0c3RhdHl0YSddPW1kNV9maWxlKCRjZik7IH0gZWxzZSAkclsna2xhaWRhJ109J2JhayBuZXJhJzsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-105141';
const GKEY='ps_s1717w';
const PHASES=["2"];
const OUT='analize/s1717_w2.json';
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
