process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY2YSDigJQg4oCea2FuYXDEl3PigJwgxaFhbGluaW1hcyBpxaEgYXByYcWheW3FsyAoRCBkcnkgLyBXIHJhxaF5dGkgLyA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODY2J10pPyRfR0VUWydwc19zMTg2NiddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IEBzZXRfdGltZV9saW1pdCgyNTApOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE4NjZhLScuJGYpOwogICR2YWx5dGk9ZnVuY3Rpb24oJHQpeyBpZigkdD09PScnfHwkdD09PW51bGx8fHN0cmlwb3MoJHQsJ2thbmFwJyk9PT1mYWxzZSkgcmV0dXJuICR0OwogICAgJHQ9cHJlZ19yZXBsYWNlKCcvKD88PVssOjsoXSlccypbXiw7Oi48PigpXSprYW5hcFteLDsuPD5dKj8oXChbXildKlwpW14sOy48Pl0qKT8sL2l1JywnJywkdCk7ICAgICAgIC8vIOKAnuKApiwga2FuYXDEl3MgKDEgJSksIOKApuKAnCAvIOKAnlN1ZMSXdGlzOiBrYW5hcGnFsyDigKYsIOKApuKAnAogICAgJHQ9cHJlZ19yZXBsYWNlKCcvLFxzKlteLDs6Ljw+KCldKmthbmFwW14sOzouPD5dKj8oXChbXildKlwpW14sOzouPD5dKik/KD89XHMqWy47PCldfFxzKiQpL2l1JywnJywkdCk7IC8vIHBhc2t1dGluaXMgc8SFcmHFoW8gbmFyeXMg4oCe4oCmLCBrYW5hcMSXcyBzxJdrbG9zO+KAnAogICAgJHQ9cHJlZ19yZXBsYWNlKCcvKD88PTopXHMqW14sOzouPD4oKV0qa2FuYXBbXiw7Oi48Pl0qPyg/PVsuOzxdKS9pdScsJycsJHQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmllbmludGVsaXMgbmFyeXMgcG8gZHZpdGHFoWtpbwogICAgcmV0dXJuICR0OyB9OwogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScsJ3BlbmRpbmcnLCdmdXR1cmUnKSBBTkQgKHBvc3RfY29udGVudCBMSUtFICcla2FuYXAlJyBPUiBwb3N0X2V4Y2VycHQgTElLRSAnJWthbmFwJScpIik7CiAgJHZmPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3ZmX2Rlc2NyaXB0aW9uX2Jhc2U2NCcgQU5EIG1ldGFfdmFsdWU8PicnIik7CiAgJHZmaz1hcnJheSgpOyBmb3JlYWNoKCR2ZiBhcyAkaWQpeyAkZD1iYXNlNjRfZGVjb2RlKGdldF9wb3N0X21ldGEoJGlkLCdfdmZfZGVzY3JpcHRpb25fYmFzZTY0Jyx0cnVlKSk7IGlmKCRkIT09ZmFsc2UgJiYgc3RyaXBvcygkZCwna2FuYXAnKSE9PWZhbHNlKSAkdmZrW109KGludCkkaWQ7IH0KICAkYWxsPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpLCR2ZmspKSk7IHNvcnQoJGFsbCk7CiAgJG9bJ24nXT1jb3VudCgkYWxsKTsgJGxpa289YXJyYXkoKTsgJHB2ej1hcnJheSgpOyAkYmFrPWFycmF5KCk7CiAgZm9yZWFjaCgkYWxsIGFzICRpZCl7ICRwbz1nZXRfcG9zdCgkaWQpOyAkYz0kcG8tPnBvc3RfY29udGVudDsgJGU9JHBvLT5wb3N0X2V4Y2VycHQ7ICRtPWdldF9wb3N0X21ldGEoJGlkLCdfdmZfZGVzY3JpcHRpb25fYmFzZTY0Jyx0cnVlKTsgJG1kPSRtIT09Jyc/YmFzZTY0X2RlY29kZSgkbSk6Jyc7CiAgICAkYzI9JHZhbHl0aSgkYyk7ICRlMj0kdmFseXRpKCRlKTsgJG1kMj0kdmFseXRpKCRtZCk7CiAgICBmb3JlYWNoKGFycmF5KCdjJz0+JGMyLCdlJz0+JGUyLCdtJz0+JG1kMikgYXMgJGs9PiR0KXsgaWYoc3RyaXBvcygoc3RyaW5nKSR0LCdrYW5hcCcpIT09ZmFsc2UpeyBwcmVnX21hdGNoKCcvLnswLDcwfWthbmFwLnswLDcwfS9pc3UnLCR0LCRtbSk7ICRsaWtvWyRpZF1bJGtdPSRtbVswXT8/Jyc7IH0gfQogICAgaWYoY291bnQoJHB2eik8MTQgJiYgJGMyIT09JGMpeyAkaT1zdHJpcG9zKCRjLCdrYW5hcCcpOyAkcHZ6WyRpZF09YXJyYXkoJ2J1dm8nPT5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3Moc3Vic3RyKCRjLG1heCgwLCRpLTE0MCksMzAwKSksMCwyMzApLCdidXMnPT5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3Moc3Vic3RyKCRjMixtYXgoMCwkaS0xNDApLDIzMCkpLDAsMjAwKSk7IH0KICAgIGlmKCRmPT09J1cnKXsgJGJha1skaWRdPWFycmF5KCdjJz0+JGMsJ2UnPT4kZSwnbSc9PiRtKTsKICAgICAgJHVwZD1hcnJheSgpOyBpZigkYzIhPT0kYykgJHVwZFsncG9zdF9jb250ZW50J109JGMyOyBpZigkZTIhPT0kZSkgJHVwZFsncG9zdF9leGNlcnB0J109JGUyOwogICAgICBpZigkdXBkKXsgJHdwZGItPnVwZGF0ZSgkd3BkYi0+cG9zdHMsJHVwZCxhcnJheSgnSUQnPT4kaWQpKTsgfQogICAgICBpZigkbWQyIT09JG1kKSB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3ZmX2Rlc2NyaXB0aW9uX2Jhc2U2NCcsYmFzZTY0X2VuY29kZSgkbWQyKSk7CiAgICAgIGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkaWQpOyB9IH0KICBpZigkZj09PSdXJyAmJiAhZ2V0X29wdGlvbigncHNfczE4NjZfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxODY2X2JhaycsJGJhayxmYWxzZSk7CiAgaWYoJGY9PT0nOScpeyBmb3JlYWNoKChhcnJheSlnZXRfb3B0aW9uKCdwc19zMTg2Nl9iYWsnKSBhcyAkaWQ9PiR4KXsgJHdwZGItPnVwZGF0ZSgkd3BkYi0+cG9zdHMsYXJyYXkoJ3Bvc3RfY29udGVudCc9PiR4WydjJ10sJ3Bvc3RfZXhjZXJwdCc9PiR4WydlJ10pLGFycmF5KCdJRCc9PiRpZCkpOyBpZigkeFsnbSddIT09JycpIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfdmZfZGVzY3JpcHRpb25fYmFzZTY0JywkeFsnbSddKTsgY2xlYW5fcG9zdF9jYWNoZSgkaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRpZCk7IH0gJG9bJ2F0c3RhdHl0YSddPTE7IH0KICAkb1snbGlrbyddPSRsaWtvOyAkb1sncHZ6J109JHB2ejsKICAvKiBhciBpbXBvcnRhaSBwZXJyYcWhbyBhcHJhxaF5bcSFICovCiAgJGltcD1hcnJheSgpOyBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnLCdwZXRzaG9wLXZmL3BldHNob3AtdmYucGhwJykgYXMgJHJlbCl7ICRmbj1XUF9QTFVHSU5fRElSLicvJy4kcmVsOyBpZighZmlsZV9leGlzdHMoJGZuKSl7ICRpbXBbJHJlbF09J27El3JhJzsgY29udGludWU7IH0gZm9yZWFjaChleHBsb2RlKCJcbiIsZmlsZV9nZXRfY29udGVudHMoJGZuKSkgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3Bvc3RfY29udGVudHxzZXRfZGVzY3JpcHRpb258X3ZmX2Rlc2NyaXB0aW9uX2Jhc2U2NC8nLCRsKSkgJGltcFskcmVsXVtdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE3MCk7IH0gfQogICRvWydpbXBvcnRhaSddPSRpbXA7ICRvWyd2Zl9wbHVnaW5haSddPWFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoV1BfUExVR0lOX0RJUi4nLyp2ZionKSk7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-184530';
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
