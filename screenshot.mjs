process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAxIHNjaGVtYS9BSSByZWNvbiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MDEnXSl8fCRfR0VUWydwc19zMTcwMSddIT09JzEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTcwMSBtYScpOyBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgLy8gMS4gcHJla8SXcyBwdXNsYXBpbyBKU09OLUxEIChFeGNsdXNpb24gNyBrZyAjMTg1ODcsIGtvbnNlcnZhcywgYWtzZXN1YXJhcykKICAgIGZvcmVhY2goYXJyYXkoMTg1ODcsMTk0NzEsMTMxNjQpIGFzICRwaWQpewogICAgICAkcj13cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoJHBpZCksYXJyYXkoJ3RpbWVvdXQnPT4yNSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTcwMScpKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgICBwcmVnX21hdGNoX2FsbCgnIzxzY3JpcHRbXj5dKnR5cGU9ImFwcGxpY2F0aW9uL2xkXCtqc29uIltePl0qPiguKj8pPC9zY3JpcHQ+I3NpJywkaCwkbSk7CiAgICAgICRsZD1hcnJheSgpOyBmb3JlYWNoKCRtWzFdIGFzICR4KXsgJGQ9anNvbl9kZWNvZGUodHJpbSgkeCksdHJ1ZSk7ICRsZFtdPSRkPyRkOnN1YnN0cih0cmltKCR4KSwwLDMwMCk7IH0KICAgICAgJG9bJ2xkJ11bJHBpZF09YXJyYXkoJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCduJz0+Y291bnQoJG1bMV0pLCdqc29uJz0+JGxkKTsKICAgICAgJG9bJ21ldGEnXVskcGlkXT1hcnJheSgnZ3Rpbic9PmdldF9wb3N0X21ldGEoJHBpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpLCdicmFuZCc9PndwX2xpc3RfcGx1Y2soKGFycmF5KWdldF90aGVfdGVybXMoJHBpZCwncHJvZHVjdF9icmFuZCcpLCduYW1lJyksJ3dlaWdodCc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3dlaWdodCcsdHJ1ZSkpOwogICAgfQogICAgLy8gMi4gcm9ib3RzLnR4dAogICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3JvYm90cy50eHQnKSxhcnJheSgndGltZW91dCc9PjE1KSk7ICRvWydyb2JvdHMnXT13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgICAvLyAzLiBSYW5rIE1hdGggc2NoZW1hL29wY2lqb3MKICAgICRybT1nZXRfb3B0aW9uKCdyYW5rLW1hdGgtb3B0aW9ucy10aXRsZXMnKTsgJGtleXM9YXJyYXkoKTsgZm9yZWFjaCgoYXJyYXkpJHJtIGFzICRrPT4kdil7IGlmKHN0cmlwb3MoJGssJ3NjaGVtYScpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ3Byb2R1Y3QnKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdrbm93bGVkZ2UnKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdyb2JvdHMnKSE9PWZhbHNlKSAka2V5c1ska109aXNfYXJyYXkoJHYpP2pzb25fZW5jb2RlKCR2KTokdjsgfSAkb1sncmFua21hdGhfdGl0bGVzJ109JGtleXM7CiAgICAkcmc9Z2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtZ2VuZXJhbCcpOyAkZz1hcnJheSgpOyBmb3JlYWNoKChhcnJheSkkcmcgYXMgJGs9PiR2KXsgaWYoc3RyaXBvcygkaywnc2NoZW1hJykhPT1mYWxzZXx8c3RyaXBvcygkaywnbGxtcycpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ3JvYm90cycpIT09ZmFsc2UpICRnWyRrXT1pc19hcnJheSgkdik/anNvbl9lbmNvZGUoJHYpOiR2OyB9ICRvWydyYW5rbWF0aF9nZW5lcmFsJ109JGc7CiAgICAkb1sncm1fbW9kdWxlcyddPWdldF9vcHRpb24oJ3JhbmtfbWF0aF9tb2R1bGVzJyk7CiAgICAvLyA0LiBsbG1zLnR4dCwgYWkudHh0CiAgICBmb3JlYWNoKGFycmF5KCcvbGxtcy50eHQnLCcvYWkudHh0JywnLy53ZWxsLWtub3duL2FpLXBsdWdpbi5qc29uJykgYXMgJHUpeyAkcj13cF9yZW1vdGVfaGVhZChob21lX3VybCgkdSksYXJyYXkoJ3RpbWVvdXQnPT4xMCkpOyAkb1snZmFpbGFpJ11bJHVdPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsgfQogICAgLy8gNS4gV0Mgc3RydWN0dXJlZCBkYXRhIGhvb2sgYWt0eXZ1cz8KICAgICRvWyd3Y19zZCddPWhhc19hY3Rpb24oJ3dwX2Zvb3RlcicsYXJyYXkoV0MoKS0+c3RydWN0dXJlZF9kYXRhLCdvdXRwdXRfc3RydWN0dXJlZF9kYXRhJykpOwogICAgLy8gNi4gQUkgYm90xbMgYXBzaWxhbmt5bWFpIHBlciAxNCBkLiDigJQgc2VydmVyIGxvZyBuxJdyYTsgcHNfc2VvXzQwND8gbsSXcmEgVUEuIFByYWxlaWTFvmlhbS4KICAgIC8vIDcuIEdTQyBtZXJjaGFudCBsaXN0aW5ncz8g4oCUIG5lIHBlciBBUEkuIEdyxIXFvmluYW0gaGVhZGVyaXVzCiAgICAkcj13cF9yZW1vdGVfaGVhZChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MTUpKTsgJG9bJ2hlYWRlcnMnXT1hcnJheSgneC1yb2JvdHMnPT53cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCd4LXJvYm90cy10YWcnKSwnc2VydmVyJz0+d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnc2VydmVyJykpOwogICAgJG9bJ3NpdGVtYXAnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfaGVhZChob21lX3VybCgnL3NpdGVtYXBfaW5kZXgueG1sJyksYXJyYXkoJ3RpbWVvdXQnPT4xMCkpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-194713';
const GKEY='ps_s1701';
const PHASES=["1"];
const OUT='analize/s1701_ma.json';
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
