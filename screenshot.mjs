process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE0ZyBmaWx0cnUgc2FyZ2FzICgwIHByaWVzLXRlc3RhcyAvIDEgZGVwbG95IC8gMiBwby10ZXN0YXMgLyA5IGlzanVuZ3RpKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTRnJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzE0ZyddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgJHI9Wyd2Jz0+J1MxNzE0ZycsJ2ZhemUnPT4kZl07ICRmbj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWZpbHRydS1zYXJnYXMucGhwJzsKICAkdXJscz1bJy9rYXRlZ29yaWphL2thdGVtcy8/eWl0aF93Y2FuPTEmcHJvZHVjdF9jYXQ9dHVhbGV0YWkta3JhaWthaS1zZW10dXZlbGlhaSxrcmFpa2FpLWthY2l1LXR1YWxldGFtcyZxdWVyeV90eXBlX3Byb2R1Y3RfY2F0PW9yJywnL2thdGVnb3JpamEva2F0ZW1zLz95aXRoX3djYW49MSZwcm9kdWN0X2NhdD10dWFsZXRhaS1rcmFpa2FpLXNlbXR1dmVsaWFpLGtyYWlrYWkta2FjaXUtdHVhbGV0YW1zJnF1ZXJ5X3R5cGVfcHJvZHVjdF9jYXQ9b3ImcXVlcnlfdHlwZV90aXBhcz1vciZmaWx0ZXJfdGlwYXM9YXR2aXJhcycsJy9rYXRlZ29yaWphL2thdGVtcy8/cHJvZHVjdF9jYXQ9a3JhaWthaS1rYWNpdS10dWFsZXRhbXMnLCcva2F0ZWdvcmlqYS9rYXRlbXMvJywnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8/eWl0aF93Y2FuPTEmcHJvZHVjdF9jYXQ9c2F1c2FzLW1haXN0YXMtc3VuaW1zJnF1ZXJ5X3R5cGVfc3BlY2lhbGlfbWl0eWJhPW9yJmZpbHRlcl9zcGVjaWFsaV9taXR5YmE9aGlwb2FsZXJnaW5pcyddOwogICR0ZXN0PWZ1bmN0aW9uKCkgdXNlKCR1cmxzKXsgJG89W107IGZvcmVhY2goJHVybHMgYXMgJHUpeyAkaD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCR1LicmbmM9Jy5tdF9yYW5kKCkpLFsndGltZW91dCc9PjYwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PlsnVXNlci1BZ2VudCc9PidNb3ppbGxhLzUuMCBDaHJvbWUvMTI4J11dKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpOyBwcmVnX21hdGNoKCcjPGgxW14+XSo+KC4qPyk8L2gxPiNzJywkYiwkbSk7IHByZWdfbWF0Y2hfYWxsKCcjY2xhc3M9InByb2R1Y3Qtc21hbGwjJywkYiwkcG0pOyAkb1skdV09Wydrb2Rhcyc9PmlzX3dwX2Vycm9yKCRoKT8nRVJSJzp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaCksJ2gxJz0+dHJpbShzdHJpcF90YWdzKCRtWzFdPz8nJykpLCdwcmVraXUnPT5jb3VudCgkcG1bMF0pXTsgfSByZXR1cm4gJG87IH07CiAgdHJ5ewogICAgaWYoJGY9PT0nMCcpeyAkclsncHJpZXMnXT0kdGVzdCgpOyB9CiAgICBpZigkZj09PScxJyl7CiAgICAgIGlmKGZpbGVfZXhpc3RzKCRmbikpIHRocm93IG5ldyBFeGNlcHRpb24oJ2ZhaWxhcyBqYXUgeXJhJyk7CiAgICAgICRuZXc9YmFzZTY0X2RlY29kZSgnUEQ5d2FIQUtMeW9xQ2lBcUlGQnNkV2RwYmlCT1lXMWxPaUJRWlhSemFHOXdJRVpwYkhSeXhiTWdjMkZ5WjJGeklIWXhMakFnS0RVd01DQnpkU0JyWld4cGIyMXBjeUJyWVhSbFoyOXlhV3B2YldseklGbEpWRWdnWm1sc2RISmxLUW9nS2lCRVpYTmpjbWx3ZEdsdmJqb2dXVWxVU0NCWGIyOURiMjF0WlhKalpTQkJhbUY0SUZCeWIyUjFZM1FnUm1sc2RHVnlJR3hsYVdURnZtbGhJSEJoeGI1NWJjU1hkR2tnYTJWc2FXRnpJR3RoZEdWbmIzSnBhbUZ6SU9LQWxDQlZVa3dnWjJGMWJtRUtJQ29nSUNCZ2NISnZaSFZqZEY5allYUTlZU3hpWUNBb1lYSmlZU0JnWVN0aVlDa3VJRmRRSUhYRnZtdHNZWFZ6WVNCMFlXa2djM1Z3Y21GdWRHRXNJR0psZENCWGIyOURiMjF0WlhKalpTQmpiM0psSUdacGJIUnlieUJ0ZVdkMGRXdGhjd29nS2lBZ0lDaFhRMTlYYVdSblpYUTZPbWRsZEY5amRYSnlaVzUwWDNCaFoyVmZkWEpzSU9LR2tpQm5aWFJmZEdWeWJWOXNhVzVyS0NkaExHSW5LU2tnWjJGMWJtRWdWMUJmUlhKeWIzSWdhWElnWVdSa1gzRjFaWEo1WDJGeVp5Z3BJRzFsZEdFS0lDb2dJQ0JVZVhCbFJYSnliM0lnNG9hU0lEVXdNQ0IyYVhOaGJTQnJZWFJsWjI5eWFXcHZjeUJ3ZFhOc1lYQnBkV2tnS0hCb2NGOWxjbkp2Y2k1c2IyYzZJREE1TFRJdzRvQ21NalFnY0c4Z04rS0FrelF6TDJRdUtTNEtJQ29nSUNCVFlYSm5ZWE1nY0c4Z2NHRm5jbWx1WkdsdXhKZHpJSFhGdm10c1lYVnpiM01nS0dCM2NHQXNJR3RoYVNCeVpYcDFiSFJoZEdGcElHcGhkU0J6ZFhKcGJtdDBhU2tnY0dGclpXbkVqV2xoSUdCd2NtOWtkV04wWDJOaGRHQWdjWFZsY25rZ2RtRnlDaUFxSUNBZ3hLOGdjR2x5Ylc5eklDaDF4YjVyYkdGMWMzUnZjeWtnYTJGMFpXZHZjbWxxYjNNZ2MyeDFaeWZFaFNEaWdKUWdjSEpsYTJuRnN5Qnp4SVZ5WWNXaGJ5QjBZV2tnYm1WclpXbkVqV2xoTENCMGFXc2diblZ2Y205a3hiTWdaMlZ1WlhKaGRtbHR4SVV1Q2lBcUlGWmxjbk5wYjI0NklERXVNQW9nS2lCVE1UY3hOQ0FvTWpBeU5pMHdPUzB5TkNrdUlFbkZvV3AxYm1kMGFUb2diM0JqYVdwaElHQndjMTltYVd4MGNuVmZjMkZ5WjJGelgybHphblZ1WjNSaFlEMHhMZ29nS2k4S2FXWWdLQ0FoSUdSbFptbHVaV1FvSUNkQlFsTlFRVlJJSnlBcElDa2dleUJsZUdsME95QjlDZ3BoWkdSZllXTjBhVzl1S0NBbmQzQW5MQ0JtZFc1amRHbHZiaUFvS1NCN0NnbHBaaUFvSUdkbGRGOXZjSFJwYjI0b0lDZHdjMTltYVd4MGNuVmZjMkZ5WjJGelgybHphblZ1WjNSaEp5QXBJQ2tnZXlCeVpYUjFjbTQ3SUgwS0NXbG1JQ2dnSVNCbWRXNWpkR2x2Ymw5bGVHbHpkSE1vSUNkcGMxOXdjbTlrZFdOMFgyTmhkR1ZuYjNKNUp5QXBJSHg4SUNFZ2FYTmZjSEp2WkhWamRGOWpZWFJsWjI5eWVTZ3BJQ2tnZXlCeVpYUjFjbTQ3SUgwS0NXZHNiMkpoYkNBa2QzQmZjWFZsY25rN0Nna2tkaUE5SUdkbGRGOXhkV1Z5ZVY5MllYSW9JQ2R3Y205a2RXTjBYMk5oZENjZ0tUc0tDV2xtSUNnZ0lTQnBjMTl6ZEhKcGJtY29JQ1IySUNrZ2ZId2dJU0J3Y21WblgyMWhkR05vS0NBbkwxc3NLeUJkTHljc0lDUjJJQ2tnS1NCN0lISmxkSFZ5YmpzZ2ZRb0pKSEVnSUNBZ1BTQm5aWFJmY1hWbGNtbGxaRjl2WW1wbFkzUW9LVHNLQ1NSemJIVm5JRDBnS0NBa2NTQW1KaUFoSUdWdGNIUjVLQ0FrY1MwK2MyeDFaeUFwSUNrZ1B5QWtjUzArYzJ4MVp5QTZJSEJ5WldkZmMzQnNhWFFvSUNjdld5d3JJRjB2Snl3Z0pIWWdLVnN3WFRzS0NXbG1JQ2dnSVNBa2MyeDFaeUFwSUhzZ2NtVjBkWEp1T3lCOUNna2tkM0JmY1hWbGNua3RQbkYxWlhKNVgzWmhjbk5iSjNCeWIyUjFZM1JmWTJGMEoxMGdJQ0FnUFNBa2MyeDFaenNLQ1NSM2NGOXhkV1Z5ZVMwK2NYVmxjbmxmZG1GeWMxc25jSE5mY0hKdlpIVmpkRjlqWVhSZmIzSnBaeWRkSUQwZ0pIWTdDbjBzSURFZ0tUc0snKTsgaWYobWQ1KCRuZXcpIT09JzQ1ODg5MmJmNTA5OTUzYjJhMzkwYTdlNWY0Y2VhNGE2JykgdGhyb3cgbmV3IEV4Y2VwdGlvbignbWQ1Jyk7ICR0b2s9QHRva2VuX2dldF9hbGwoJG5ldyxUT0tFTl9QQVJTRSk7IGlmKCEkdG9rKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCd0b2tlbicpOwogICAgICBmaWxlX3B1dF9jb250ZW50cygkZm4sJG5ldyk7ICRyWydtZDUnXT1tZDVfZmlsZSgkZm4pOwogICAgICAkaD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP25jPScubXRfcmFuZCgpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJHJbJ2hlYXJ0YmVhdCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKTsgaWYoJHJbJ2hlYXJ0YmVhdCddPj01MDB8fCRyWydoZWFydGJlYXQnXT09MCl7IHJlbmFtZSgkZm4sJGZuLicub2ZmX3MxNzE0Jyk7ICRyWydST0xMQkFDSyddPTE7IH0KICAgIH0KICAgIGlmKCRmPT09JzInKXsgJHJbJ3BvJ109JHRlc3QoKTsgJHJbJ3BocF9lcnJfdGFpbCddPWFycmF5X3NsaWNlKGZpbGUoZGlybmFtZShydHJpbShBQlNQQVRILCcvJykpLicvbG9ncy9waHBfZXJyb3IubG9nJyk/OltdLC0yKTsgfQogICAgaWYoJGY9PT0nOScpeyByZW5hbWUoJGZuLCRmbi4nLm9mZl9zMTcxNCcpOyAkclsnaXNqdW5ndGEnXT0hZmlsZV9leGlzdHMoJGZuKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-192552';
const GKEY='ps_s1714g';
const PHASES=["1"];
const OUT='analize/s1714_g1.json';
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
