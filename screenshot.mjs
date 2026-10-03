process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ5YSBsYWlza3Uga29kbyBzdXJpbmtpbWFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0OWEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiLCR3cF9maWx0ZXI7ICRyPVsndic9PidTMTc0OWEnXTsKICAka2xhc2VzPVsnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcsJ1BldHNob3BfU2VuZGVyX0FkYXB0ZXInLCdQZXRzaG9wX1JlZmlsbF9FbmdpbmUnLCdQZXRzaG9wX1Bvc3RfUHVyY2hhc2UnLCdQZXRzaG9wX0NhcnRfQWJhbmRvbm1lbnQnLCdQZXRzaG9wX1Bha2FydG90aScsJ1BldHNob3BfU3VncmF6aW5pbWFzJywnUGV0c2hvcF9MaWZlY3ljbGVfVmFydGFpJywnUGV0c2hvcF9QYWthcnRvamltb19HcmFuZGluZScsJ1BldHNob3BfQmFjc19QcmltaW5pbWFzJywnUGV0c2hvcF9QZXJ6aXVydV9QcmltaW5pbWFzJywnUGV0c2hvcF9MYWlza2FpX1R1cmlueXMnLCdQZXRzaG9wX0VtYWlsX1N1cHByZXNzaW9uJywnUGV0c2hvcF9Db250YWN0X1BvbGljeScsJ1BldHNob3BfRXZlbnRfUmVnaXN0cnknLCdQZXRzaG9wX1JldHJ5X1F1ZXVlJywnUGV0c2hvcF9FbWFpbF9MYXlvdXQnXTsKICAkZmFpbGFpPVtdOyBmb3JlYWNoKCRrbGFzZXMgYXMgJGspeyBpZihjbGFzc19leGlzdHMoJGspKXsgJGY9KG5ldyBSZWZsZWN0aW9uQ2xhc3MoJGspKS0+Z2V0RmlsZU5hbWUoKTsgJGZhaWxhaVska109JGY7IH0gZWxzZSAkZmFpbGFpWyRrXT1udWxsOyB9CiAgLy8gd2ViaG9vayBoYW5kbGVyICsgZXNwIGFkYXB0ZXIgZmFjdG9yeQogIGZvcmVhY2goW1dQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSddIGFzICRkKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZmkpeyAkcD0oc3RyaW5nKSRmaTsgaWYoc3Vic3RyKCRwLC00KSE9PScucGhwJykgY29udGludWU7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYocHJlZ19tYXRjaCgnL3NlbmRlcl93ZWJob29rfGZ1bmN0aW9uIHBzX2VzcF9hZGFwdGVyfHBzX2VzcF81bWluLycsJHQpKSAkZmFpbGFpWyd4OicuYmFzZW5hbWUoJHApXT0kcDsgfSB9CiAgJHJbJ2ZhaWxhaSddPVtdOyBmb3JlYWNoKGFycmF5X3VuaXF1ZShhcnJheV9maWx0ZXIoJGZhaWxhaSkpIGFzICRmKXsgJHJbJ2ZhaWxhaSddW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYpXT1bJ21kNSc9Pm1kNV9maWxlKCRmKSwnbXRpbWUnPT5kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkZikpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKGd6Y29tcHJlc3MoZmlsZV9nZXRfY29udGVudHMoJGYpLDkpKV07IH0KICAkclsna2xhc2VzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRmKXsgcmV0dXJuICRmP3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYpOm51bGw7IH0sJGZhaWxhaSk7CiAgLy8gZmlsdHJhaSBpciBjcm9uCiAgZm9yZWFjaChbJ3BldHNob3BfZW1haWxfZWxpZ2liaWxpdHknLCdwZXRzaG9wX2VtYWlsX3ByZXBhcmVfY29udGV4dCcsJ3BldHNob3BfZW1haWxfcHJvdmlkZXInLCdwZXRzaG9wX2VtYWlsX3RlbXBsYXRlX3BhdGgnLCd3cF9tYWlsJywncHJlX3dwX21haWwnLCdwaHBtYWlsZXJfaW5pdCddIGFzICRoKXsgJHJbJ2hvb2tzJ11bJGhdPVtdOyBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyAkbm09aXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTooaXNfc3RyaW5nKCRmbik/JGZuOidjbG9zdXJlJyk7IGlmKCRubT09PSdjbG9zdXJlJyl7IHRyeXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGZuKTsgJG5tPSdjbG9zdXJlQCcuYmFzZW5hbWUoJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fSB9ICRyWydob29rcyddWyRoXVtdPSRwci4nICcuJG5tOyB9IH0KICAkc2NoZWQ9d3BfZ2V0X3NjaGVkdWxlcygpOyAkclsnY3JvbiddPVtdOyBmb3JlYWNoKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRoKXsgZm9yZWFjaCgkaCBhcyAkaGs9PiR4KXsgaWYocHJlZ19tYXRjaCgnL2VtYWlsfGVzcHxyZWZpbGx8Y2FydHxhYmFuZG9ufGJyb3dzZXxiYWNzfHBvc3RfcHVyY2hhc2V8c3VncmF6fHByaW1pbnxzZW5kZXJ8c3RvY2t8YXRzYXJnL2knLCRoaykpeyAkZT1hcnJheV92YWx1ZXMoJHgpWzBdOyAkclsnY3JvbiddWyRoa109WydraXRhcyc9PmdtZGF0ZSgnbS1kIEg6aScsJHRzKS4nWicsJ2dyYWZpa2FzJz0+JGVbJ3NjaGVkdWxlJ10/Pyd2aWVua2FydGluaXMnLCdpbnRlcnZhbGFzX3MnPT4kZVsnaW50ZXJ2YWwnXT8/bnVsbF07IH0gfSB9CiAgJHJbJ3BzX2VzcF81bWluJ109JHNjaGVkWydwc19lc3BfNW1pbiddPz9udWxsOwogICRyWydvcGNpam9zJ109Wydwc19saWZlY3ljbGVfdmFydGFpJz0+Z2V0X29wdGlvbigncHNfbGlmZWN5Y2xlX3ZhcnRhaScsJyhuZXJhKScpLCdwc19wYWthcnRvamltb19ncmFuZGluZV9pc2p1bmd0YSc9PmdldF9vcHRpb24oJ3BzX3Bha2FydG9qaW1vX2dyYW5kaW5lX2lzanVuZ3RhJywnKG5lcmEpJyksJ0RJU0FCTEVfV1BfQ1JPTic9PmRlZmluZWQoJ0RJU0FCTEVfV1BfQ1JPTicpP0RJU0FCTEVfV1BfQ1JPTjonKG5lcmEpJ107CiAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-172724';
const GKEY='ps_s1749a';
const PHASES=["1"];
const OUT='out/s1749_a.json';
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
