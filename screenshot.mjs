process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUzZCDigJQgQW5pbW9uZGEgMTAwIGcgcGFrYWkgMTYvMzIgKDE2IGJlIG51b2xhaWRvcywgMzIg4oiSNSAlKSwgRDE5IMWhZWltb3MgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODUzJ10pPyRfR0VUWydwc19zMTg1MyddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRLPWFycmF5KDE5MzU1PT5hcnJheSgnMTcuOTInLCczMy45OScpLDE5MzU4PT5hcnJheSgnMTcuOTInLCczMy45OScpLDE5MzYxPT5hcnJheSgnMTcuOTInLCczMy45OScpLDE5Mzg3PT5hcnJheSgnMTYuODAnLCczMS44OScpLDE5Mzk5PT5hcnJheSgnMTYuODAnLCczMS44OScpLDE5NDE3PT5hcnJheSgnMTUuODQnLCcyOS45OScpLDE5NDA1PT5hcnJheSgnMTUuODQnLCcyOS45OScpLDE5NDQwPT5hcnJheSgnMTQuNTYnLCcyNy42OScpLDE5NDQ5PT5hcnJheSgnMTkuNjgnLCczNy4zOScpLDE5NDUyPT5hcnJheSgnMTkuNjgnLCczNy4zOScpKTsKICAkUEFLPWFycmF5KCk7IGZvcmVhY2goJEsgYXMgJGI9PiR4KXsgJFBBS1tdPWFycmF5KCRiLDE2LCR4WzBdKTsgJFBBS1tdPWFycmF5KCRiLDMyLCR4WzFdKTsgfQogICRyYXN0aT1mdW5jdGlvbigkYiwkcSkgdXNlKCR3cGRiLCRwKXsgcmV0dXJuICR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcC5wb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIHAgSk9JTiB7JHB9cG9zdG1ldGEgcSBPTiBxLnBvc3RfaWQ9cC5wb3N0X2lkIEFORCBxLm1ldGFfa2V5PSdfZHBfcGFja19xdHknIEFORCBxLm1ldGFfdmFsdWU9JXMgSk9JTiB7JHB9cG9zdHMgeiBPTiB6LklEPXAucG9zdF9pZCBBTkQgei5wb3N0X3N0YXR1czw+J3RyYXNoJyBXSEVSRSBwLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgcC5tZXRhX3ZhbHVlPSVzIiwoc3RyaW5nKSRxLChzdHJpbmcpJGIpKTsgfTsKICBpZigkZj09PScwJyl7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTg1M19iYWsnKSkgdXBkYXRlX29wdGlvbigncHNfczE4NTNfYmFrJyxhcnJheSgnZDE5Jz0+Z2V0X29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycpLCdwMzc4NzknPT5nZXRfcG9zdF9zdGF0dXMoMzc4NzkpLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpLGZhbHNlKTsgZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PidTMTg1M2QtMCcsJ24nPT5jb3VudCgkUEFLKSkpOyBleGl0OyB9CiAgaWYocHJlZ19tYXRjaCgnL15QKFxkKykkLycsJGYsJG0pKXsKICAgIGxpc3QoJGJpZCwkcXR5LCRrYWluYSk9JFBBS1soaW50KSRtWzFdLTFdOwogICAgJGV4PSRyYXN0aSgkYmlkLCRxdHkpOyBpZigkZXgpeyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxODUzZC0nLiRmLCdqYXUnPT4kZXgpKTsgZXhpdDsgfQogICAgJGJhemU9d2NfZ2V0X3Byb2R1Y3QoJGJpZCk7ICRwYXY9JHF0eS4nIHZudC4gJy4kYmF6ZS0+Z2V0X25hbWUoKTsgJGFwcj13cF9zdHJpcF9hbGxfdGFncygkYmF6ZS0+Z2V0X3Nob3J0X2Rlc2NyaXB0aW9uKCkpOwogICAgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmlua2luaWFpJywnaXNzYXVnb3RpX2RwJyk7ICRyLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJHItPmludm9rZUFyZ3MoJHItPmlzU3RhdGljKCk/bnVsbDpuZXcgUGV0c2hvcF9SaW5raW5pYWkoKSxhcnJheSgwLCRwYXYsJycsJGthaW5hLCRhcHIsdHJ1ZSxhcnJheSgpLGFycmF5KCRiaWQ9PiRxdHkpLG51bGwsYXJyYXkoKSxudWxsKSk7CiAgICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxODUzZC0nLiRmLCdwYXN0YWJhJz0+J2JlIHdwX3NlbmRfanNvbicpKTsgZXhpdDsgfQogIGlmKCRmPT09J0YnKXsgJG89YXJyYXkoJ3YnPT4nUzE4NTNkLUYnKTsgJGQxOT0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsYXJyYXkoKSk7ICRUPWFycmF5KDE2PT43MzMsMzI9Pjc3NSk7ICRuYXVqaT1hcnJheSgpOwogICAgZm9yZWFjaCgkSyBhcyAkYj0+JHgpeyAkcz1nZXRfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKTsgaWYoISRzKXsgJHM9J2F2LScuZ2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbmFtZScsJGIpOyB1cGRhdGVfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJywkcyk7IH0KICAgICAgZm9yZWFjaChhcnJheSgxNiwzMikgYXMgJHEpeyAkaWQ9JHJhc3RpKCRiLCRxKTsgaWYoISRpZCl7ICRvWyd0cnVrc3RhJ11bXT0kYi4neCcuJHE7IGNvbnRpbnVlOyB9ICRuYXVqaVtdPSRpZDsKICAgICAgICB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsJHMpOyB3cF9zZXRfb2JqZWN0X3Rlcm1zKCRpZCxhcnJheSgkVFskcV0pLCdwYV9wYWt1b3Rlc19keWRpcycsZmFsc2UpOwogICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfczE4NTNfcGFrYXMnLCRiKTsgJG9bJ3BhayddWyRiXVskcV09YXJyYXkoJGlkLGdldF9wb3N0X3N0YXR1cygkaWQpLHdjX2dldF9wcm9kdWN0KCRpZCktPmdldF9wcmljZSgpLGdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSkpOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsgfQogICAgICBpZighaW5fYXJyYXkoJHMsJGQxOSx0cnVlKSkgJGQxOVtdPSRzOyBjbGVhbl9wb3N0X2NhY2hlKCRiKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkYik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGIpOyB9CiAgICAvKiBzZW5hcyAzNiB2bnQuIHBha2FzIOKGkiBqdW9kcmHFoXRpcyAoUmFpbWlzOiB0aWsgMS8xNi8zMikgKi8KICAgIGlmKGdldF9wb3N0X3N0YXR1cygzNzg3OSk9PT0ncHVibGlzaCcpeyB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4zNzg3OSwncG9zdF9zdGF0dXMnPT4nZHJhZnQnKSk7ICRvWydwMzc4NzknXT0nZHJhZnQnOyB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJywkZDE5KTsgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7ICRvWydkMTlfbiddPWNvdW50KCRkMTkpOwogICAgJGI9Z2V0X29wdGlvbigncHNfczE4NTNfYmFrJyk7ICRiWyduYXVqaSddPSRuYXVqaTsgdXBkYXRlX29wdGlvbigncHNfczE4NTNfYmFrJywkYixmYWxzZSk7CiAgICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgaWYoJGY9PT0nOScpeyAkYj1nZXRfb3B0aW9uKCdwc19zMTg1M19iYWsnKTsgZm9yZWFjaCgoYXJyYXkpJGJbJ25hdWppJ10gYXMgJGlkKXsgd3BfdHJhc2hfcG9zdCgkaWQpOyB9IGlmKCRiWydwMzc4NzknXSkgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+Mzc4NzksJ3Bvc3Rfc3RhdHVzJz0+JGJbJ3AzNzg3OSddKSk7IHVwZGF0ZV9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLCRiWydkMTknXSk7CiAgICBmb3JlYWNoKCRLIGFzICRiYj0+JHgpeyBpZigkYmIhPT0xOTQxNykgZGVsZXRlX3Bvc3RfbWV0YSgkYmIsJ19wc19keWR6aW9fc2VpbWEnKTsgfSBkZWxldGVfdHJhbnNpZW50KCdwc19ka19zZWltb3MnKTsgZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PidTMTg1M2QtOScsJ29rJz0+MSkpOyBleGl0OyB9Cn0pOwo=';
const VER='dep-143238';
const GKEY='ps_s1853';
const PHASES=["P6", "P7", "P8", "P9", "P10", "P11"];
const OUT='analize/s1853_d.json';
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
