process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY2YSDigJQg4oCea2FuYXDEl3PigJwgxaFhbGluaW1hcyBpxaEgYXByYcWheW3FsyAoRCBkcnkgLyBXIHJhxaF5dGkgLyA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODY2J10pPyRfR0VUWydwc19zMTg2NiddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IEBzZXRfdGltZV9saW1pdCgyNTApOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE4NjZhLScuJGYpOwogICR2YWx5dGk9ZnVuY3Rpb24oJHQpeyBpZigkdD09PScnfHwkdD09PW51bGx8fHN0cmlwb3MoJHQsJ2thbmFwJyk9PT1mYWxzZSkgcmV0dXJuICR0OwogICAgJHQ9cHJlZ19yZXBsYWNlKCcvKD88PVssOjsoXSlccypbXiw7Oi48PigpXSprYW5hcFteLDsuPD5dKj8oXChbXildKlwpW14sOy48Pl0qKT8sL2l1JywnJywkdCk7ICAgICAgIC8vIOKAnuKApiwga2FuYXDEl3MgKDEgJSksIOKApuKAnCAvIOKAnlN1ZMSXdGlzOiBrYW5hcGnFsyDigKYsIOKApuKAnAogICAgJHQ9cHJlZ19yZXBsYWNlKCcvLFxzKlteLDs6Ljw+KCldKmthbmFwW14sOzouPD5dKj8oXChbXildKlwpW14sOzouPD5dKik/KD89XHMqWy47PCldfFxzKiQpL2l1JywnJywkdCk7IC8vIHBhc2t1dGluaXMgc8SFcmHFoW8gbmFyeXMg4oCe4oCmLCBrYW5hcMSXcyBzxJdrbG9zO+KAnAogICAgJHQ9cHJlZ19yZXBsYWNlKCcvKD88PTopXHMqW14sOzouPD4oKV0qa2FuYXBbXiw7Oi48Pl0qPyg/PVsuOzxdKS9pdScsJycsJHQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmllbmludGVsaXMgbmFyeXMgcG8gZHZpdGHFoWtpbwogICAgJHQ9cHJlZ19yZXBsYWNlKCcvKD88PVxzKWthbmFwXHcqXHMqLFxzKi9pdScsJycsJHQpOyAgIC8vIOKAnnN1ZMSXdHlqZSB5cmEga2FuYXBpxbMsIGFseXZ1b2dpxbMg4oCm4oCcCiAgICByZXR1cm4gJHQ7IH07CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTigncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIHBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJywncGVuZGluZycsJ2Z1dHVyZScpIEFORCAocG9zdF9jb250ZW50IExJS0UgJyVrYW5hcCUnIE9SIHBvc3RfZXhjZXJwdCBMSUtFICcla2FuYXAlJykiKTsKICAkdmY9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfdmZfZGVzY3JpcHRpb25fYmFzZTY0JyBBTkQgbWV0YV92YWx1ZTw+JyciKTsKICAkdmZrPWFycmF5KCk7IGZvcmVhY2goJHZmIGFzICRpZCl7ICRkPWJhc2U2NF9kZWNvZGUoZ2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9kZXNjcmlwdGlvbl9iYXNlNjQnLHRydWUpKTsgaWYoJGQhPT1mYWxzZSAmJiBzdHJpcG9zKCRkLCdrYW5hcCcpIT09ZmFsc2UpICR2ZmtbXT0oaW50KSRpZDsgfQogICRhbGw9YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZShhcnJheV9tZXJnZShhcnJheV9tYXAoJ2ludHZhbCcsJGlkcyksJHZmaykpKTsgc29ydCgkYWxsKTsKICAkb1snbiddPWNvdW50KCRhbGwpOyAkbGlrbz1hcnJheSgpOyAkcHZ6PWFycmF5KCk7ICRiYWs9YXJyYXkoKTsKICBmb3JlYWNoKCRhbGwgYXMgJGlkKXsgJHBvPWdldF9wb3N0KCRpZCk7ICRjPSRwby0+cG9zdF9jb250ZW50OyAkZT0kcG8tPnBvc3RfZXhjZXJwdDsgJG09Z2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9kZXNjcmlwdGlvbl9iYXNlNjQnLHRydWUpOyAkbWQ9JG0hPT0nJz9iYXNlNjRfZGVjb2RlKCRtKTonJzsKICAgICRjMj0kdmFseXRpKCRjKTsgJGUyPSR2YWx5dGkoJGUpOyAkbWQyPSR2YWx5dGkoJG1kKTsKICAgIGZvcmVhY2goYXJyYXkoJ2MnPT4kYzIsJ2UnPT4kZTIsJ20nPT4kbWQyKSBhcyAkaz0+JHQpeyBpZihzdHJpcG9zKChzdHJpbmcpJHQsJ2thbmFwJykhPT1mYWxzZSl7IHByZWdfbWF0Y2goJy8uezAsNzB9a2FuYXAuezAsNzB9L2lzdScsJHQsJG1tKTsgJGxpa29bJGlkXVska109JG1tWzBdPz8nJzsgfSB9CiAgICBpZihjb3VudCgkcHZ6KTwxNCAmJiAkYzIhPT0kYyl7ICRpPXN0cmlwb3MoJGMsJ2thbmFwJyk7ICRwdnpbJGlkXT1hcnJheSgnYnV2byc9Pm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncyhzdWJzdHIoJGMsbWF4KDAsJGktMTQwKSwzMDApKSwwLDIzMCksJ2J1cyc9Pm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncyhzdWJzdHIoJGMyLG1heCgwLCRpLTE0MCksMjMwKSksMCwyMDApKTsgfQogICAgaWYoJGY9PT0nVycpeyAkYmFrWyRpZF09YXJyYXkoJ2MnPT4kYywnZSc9PiRlLCdtJz0+JG0pOwogICAgICAkdXBkPWFycmF5KCk7IGlmKCRjMiE9PSRjKSAkdXBkWydwb3N0X2NvbnRlbnQnXT0kYzI7IGlmKCRlMiE9PSRlKSAkdXBkWydwb3N0X2V4Y2VycHQnXT0kZTI7CiAgICAgIGlmKCR1cGQpeyAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wb3N0cywkdXBkLGFycmF5KCdJRCc9PiRpZCkpOyB9CiAgICAgIGlmKCRtZDIhPT0kbWQpIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfdmZfZGVzY3JpcHRpb25fYmFzZTY0JyxiYXNlNjRfZW5jb2RlKCRtZDIpKTsKICAgICAgY2xlYW5fcG9zdF9jYWNoZSgkaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRpZCk7IH0gfQogIGlmKCRmPT09J1cnICYmICFnZXRfb3B0aW9uKCdwc19zMTg2Nl9iYWsnKSkgdXBkYXRlX29wdGlvbigncHNfczE4NjZfYmFrJywkYmFrLGZhbHNlKTsKICBpZigkZj09PSc5Jyl7IGZvcmVhY2goKGFycmF5KWdldF9vcHRpb24oJ3BzX3MxODY2X2JhaycpIGFzICRpZD0+JHgpeyAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wb3N0cyxhcnJheSgncG9zdF9jb250ZW50Jz0+JHhbJ2MnXSwncG9zdF9leGNlcnB0Jz0+JHhbJ2UnXSksYXJyYXkoJ0lEJz0+JGlkKSk7IGlmKCR4WydtJ10hPT0nJykgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ192Zl9kZXNjcmlwdGlvbl9iYXNlNjQnLCR4WydtJ10pOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsgfSAkb1snYXRzdGF0eXRhJ109MTsgfQogICRvWydsaWtvJ109JGxpa287ICRvWydwdnonXT0kcHZ6OwogIC8qIGFyIGltcG9ydGFpIHBlcnJhxaFvIGFwcmHFoXltxIUgKi8KICAkaW1wPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCcsJ3BldHNob3AtdmYvcGV0c2hvcC12Zi5waHAnKSBhcyAkcmVsKXsgJGZuPVdQX1BMVUdJTl9ESVIuJy8nLiRyZWw7IGlmKCFmaWxlX2V4aXN0cygkZm4pKXsgJGltcFskcmVsXT0nbsSXcmEnOyBjb250aW51ZTsgfSBmb3JlYWNoKGV4cGxvZGUoIlxuIixmaWxlX2dldF9jb250ZW50cygkZm4pKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcG9zdF9jb250ZW50fHNldF9kZXNjcmlwdGlvbnxfdmZfZGVzY3JpcHRpb25fYmFzZTY0LycsJGwpKSAkaW1wWyRyZWxdW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMTcwKTsgfSB9CiAgJG9bJ2ltcG9ydGFpJ109JGltcDsgJGc9YXJyYXkoKTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKFdQX1BMVUdJTl9ESVIuJy8qLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvKi8qLyoucGhwJyksZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpKSBhcyAkZm4peyAkY2M9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmbik7IGlmKCRjYyAmJiBzdHJwb3MoJGNjLCdfdmZfZGVzY3JpcHRpb25fYmFzZTY0JykhPT1mYWxzZSl7IGZvcmVhY2goZXhwbG9kZSgiXG4iLCRjYykgYXMgJGk9PiRsKXsgaWYoc3RycG9zKCRsLCdfdmZfZGVzY3JpcHRpb25fYmFzZTY0JykhPT1mYWxzZXx8cHJlZ19tYXRjaCgnL3Bvc3RfY29udGVudFwnXHMqPT58c2V0X2Rlc2NyaXB0aW9uXCgvJywkbCkpICRnW3N0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmbildW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMTcwKTsgfSB9IH0gJG9bJ3ZmX2tvZGFzJ109JGc7ICRvWyd2Zl9wbHVnaW5haSddPWFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoV1BfUExVR0lOX0RJUi4nLyp2ZionKSk7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-184655';
const GKEY='ps_s1866';
const PHASES=["D"];
const OUT='analize/s1866_a.json';
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
