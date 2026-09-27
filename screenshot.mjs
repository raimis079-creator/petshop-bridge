process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI1cCByZWFkLW9ubHk6IMWhZWltb3MsIGt1cmlvc2UgZGlkZXNuxJcgcGFrdW90xJcgYnJhbmdlc27ElyB1xb4ga2cgbmVpIG1hxb5lc27ElyAoYmUgRFAgcGFrxbMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNXAnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzI1cCddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgxNzApOwogIHRyeXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ucG9zdF9pZCBpZCwgbS5tZXRhX3ZhbHVlIHNlaW1hIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfZHlkemlvX3NlaW1hJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSB7JFB9cG9zdG1ldGEgZCBXSEVSRSBkLnBvc3RfaWQ9bS5wb3N0X2lkIEFORCBkLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJykiLEFSUkFZX0EpOwogICAgJGZhbT1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCkgJGZhbVskeFsnc2VpbWEnXV1bXT0oaW50KSR4WydpZCddOwogICAgJG91dD1bXTsgJG5rPTA7CiAgICBmb3JlYWNoKCRmYW0gYXMgJHM9PiRpZHMpeyBpZihjb3VudCgkaWRzKTwyKSBjb250aW51ZTsgJG09W107CiAgICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOyAkdT1QZXRzaG9wX0R5ZHppYWk6OnV6cmFzYXMoJGlkKTsgJGs9UGV0c2hvcF9EeWR6aWFpOjprZygkdSk7ICRrZz0oZmxvYXQpKCRrWzBdPzoka1sxXSk7IGlmKCRrZzw9MCl7ICRuaysrOyBjb250aW51ZTsgfQogICAgICAgICRzcmM9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc291cmNlLGNvc3RfbmV0LHN0b2NrX3F0eSBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSk7CiAgICAgICAgJHJlZz0oZmxvYXQpJHAtPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0Jyk7ICRhY3Q9KGZsb2F0KSRwLT5nZXRfcHJpY2UoJ2VkaXQnKTsgJGI9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgICAgICAkY29zdD1udWxsOyBmb3JlYWNoKCRzcmMgYXMgJHN4KXsgaWYoJHN4Wydjb3N0X25ldCddIT09bnVsbCAmJiAkc3hbJ2Nvc3RfbmV0J10hPT0nJyAmJiAoZmxvYXQpJHN4Wydjb3N0X25ldCddPjApeyAkY29zdD0oZmxvYXQpJHN4Wydjb3N0X25ldCddOyBpZigkc3hbJ3NvdXJjZSddIT09J2F2JykgYnJlYWs7IH0gfQogICAgICAgICRtW109WydpZCc9PiRpZCwncGF2Jz0+JHAtPmdldF9uYW1lKCksJ2R5ZGlzJz0+JHUsJ2tnJz0+JGtnLCdyZWcnPT4kcmVnLCdrYWluYSc9PiRhY3QsJ2FrY2lqYSc9PiRwLT5pc19vbl9zYWxlKCdlZGl0Jyk/MTowLCdldXJfa2cnPT4kYWN0PjA/cm91bmQoJGFjdC8ka2csMyk6bnVsbCwnc2FsdGluaXMnPT5pbXBsb2RlKCcrJyxhcnJheV9jb2x1bW4oJHNyYywnc291cmNlJykpLCdzYXZpa2FpbmFfYmVfcHZtJz0+JGNvc3QsJ21hcnphX3Byb2MnPT4oJGNvc3QmJiRhY3Q+MCk/cm91bmQoKCRhY3QvMS4yMS0kY29zdCkvKCRhY3QvMS4yMSkqMTAwLDEpOm51bGwsJ2xpa3V0aXMnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdicmVuZGFzJz0+JGI/JGJbMF06JyddOwogICAgICB9CiAgICAgIHVzb3J0KCRtLGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuICRhWydrZyddPD0+JGJbJ2tnJ107IH0pOyAkaW52PVtdOwogICAgICBmb3IoJGk9MDskaTxjb3VudCgkbSk7JGkrKykgZm9yKCRqPSRpKzE7JGo8Y291bnQoJG0pOyRqKyspeyBpZigkbVskal1bJ2tnJ10+JG1bJGldWydrZyddKzAuMDAxICYmICRtWyRpXVsnZXVyX2tnJ10gJiYgJG1bJGpdWydldXJfa2cnXSAmJiAkbVskal1bJ2V1cl9rZyddPiRtWyRpXVsnZXVyX2tnJ10rMC4wMDEpICRpbnZbXT1bJG1bJGldWydpZCddLCRtWyRqXVsnaWQnXSxyb3VuZCgoJG1bJGpdWydldXJfa2cnXS8kbVskaV1bJ2V1cl9rZyddLTEpKjEwMCwxKV07IH0KICAgICAgaWYoJGludikgJG91dFtdPVsnc2VpbWEnPT4kcywnbmFyaWFpJz0+JG0sJ2ludmVyc2lqb3MnPT4kaW52XTsgfQogICAgJHJbJ3NlaW11X3Zpc28nXT1jb3VudCgkZmFtKTsgJHJbJ2JlX2tnJ109JG5rOyAkclsnc3VfaW52ZXJzaWphJ109Y291bnQoJG91dCk7ICRyWydzZWltb3MnXT0kb3V0OwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-155848';
const GKEY='ps_s1725p';
const PHASES=["1"];
const OUT='analize/s1725_p.json';
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
