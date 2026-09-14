process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgbSDigJQgcmVhZC1vbmx5OiBHQTQgRGF0YSBBUEkgKHBlciBwZXRzaG9wLWdhNC1zZXJ2ZXJpcyB0b2tlbikg4oCUIGRpZW5vcyAwNy0yN+KApjA5LTEzOiBzZXNpam9zL3BpcmtpbWFpL3BhamFtb3M7IGthbmFsxbMgZ3J1cMSXcyBwcmllxaEvcG8gVC0wLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4MW0nXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4nUzE2ODEgbScpOwogICRzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZ2E0LXNlcnZlcmlzLnBocCcpOyBwcmVnX21hdGNoKCcvY2xhc3NccysoXHcrKS8nLCRzLCRtKTsgJGNscz0kbVsxXTsgJG9bJ2NscyddPSRjbHM7CiAgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNscywndG9rZW4nKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7ICR0b2s9JHItPmludm9rZShudWxsKTsgaWYoaXNfd3BfZXJyb3IoJHRvaykpeyAkb1sndG9rX2VyciddPSR0b2stPmdldF9lcnJvcl9tZXNzYWdlKCk7IH0KICBlbHNlIHsgJHE9ZnVuY3Rpb24oJGJvZHkpIHVzZSgkdG9rKXsgJHg9d3BfcmVtb3RlX3Bvc3QoJ2h0dHBzOi8vYW5hbHl0aWNzZGF0YS5nb29nbGVhcGlzLmNvbS92MWJldGEvcHJvcGVydGllcy8zNDYwNTE1ODA6cnVuUmVwb3J0JyxhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQ29udGVudC1UeXBlJz0+J2FwcGxpY2F0aW9uL2pzb24nKSwnYm9keSc9Pmpzb25fZW5jb2RlKCRib2R5KSkpOyBpZihpc193cF9lcnJvcigkeCkpIHJldHVybiAkeC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLHRydWUpOyBpZighaXNzZXQoJGpbJ3Jvd3MnXSkpIHJldHVybiAkajsgJG91dD1hcnJheSgpOyBmb3JlYWNoKCRqWydyb3dzJ10gYXMgJHJvdyl7ICRvdXRbXT1hcnJheV9tZXJnZShhcnJheV9tYXAoZnVuY3Rpb24oJGQpe3JldHVybiAkZFsndmFsdWUnXTt9LCRyb3dbJ2RpbWVuc2lvblZhbHVlcyddKSxhcnJheV9tYXAoZnVuY3Rpb24oJGQpe3JldHVybiByb3VuZCgoZmxvYXQpJGRbJ3ZhbHVlJ10sMSk7fSwkcm93WydtZXRyaWNWYWx1ZXMnXSkpOyB9IHJldHVybiAkb3V0OyB9OwogICAgJG1ldD1hcnJheShhcnJheSgnbmFtZSc9PidzZXNzaW9ucycpLGFycmF5KCduYW1lJz0+J3RvdGFsVXNlcnMnKSxhcnJheSgnbmFtZSc9PidlY29tbWVyY2VQdXJjaGFzZXMnKSxhcnJheSgnbmFtZSc9PidwdXJjaGFzZVJldmVudWUnKSxhcnJheSgnbmFtZSc9PidhZGRUb0NhcnRzJyksYXJyYXkoJ25hbWUnPT4nY2hlY2tvdXRzJykpOwogICAgJG9bJ2RpZW5vcyddPSRxKGFycmF5KCdkYXRlUmFuZ2VzJz0+YXJyYXkoYXJyYXkoJ3N0YXJ0RGF0ZSc9PicyMDI2LTA3LTI3JywnZW5kRGF0ZSc9PicyMDI2LTA5LTEzJykpLCdkaW1lbnNpb25zJz0+YXJyYXkoYXJyYXkoJ25hbWUnPT4nZGF0ZScpKSwnbWV0cmljcyc9PiRtZXQsJ29yZGVyQnlzJz0+YXJyYXkoYXJyYXkoJ2RpbWVuc2lvbic9PmFycmF5KCdkaW1lbnNpb25OYW1lJz0+J2RhdGUnKSkpLCdsaW1pdCc9PjEwMCkpOwogICAgJG9bJ2thbl9wcmllcyddPSRxKGFycmF5KCdkYXRlUmFuZ2VzJz0+YXJyYXkoYXJyYXkoJ3N0YXJ0RGF0ZSc9PicyMDI2LTA4LTExJywnZW5kRGF0ZSc9PicyMDI2LTA5LTA3JykpLCdkaW1lbnNpb25zJz0+YXJyYXkoYXJyYXkoJ25hbWUnPT4nc2Vzc2lvbkRlZmF1bHRDaGFubmVsR3JvdXAnKSksJ21ldHJpY3MnPT4kbWV0LCdsaW1pdCc9PjIwKSk7CiAgICAkb1sna2FuX3BvJ109JHEoYXJyYXkoJ2RhdGVSYW5nZXMnPT5hcnJheShhcnJheSgnc3RhcnREYXRlJz0+JzIwMjYtMDktMDknLCdlbmREYXRlJz0+JzIwMjYtMDktMTMnKSksJ2RpbWVuc2lvbnMnPT5hcnJheShhcnJheSgnbmFtZSc9PidzZXNzaW9uRGVmYXVsdENoYW5uZWxHcm91cCcpKSwnbWV0cmljcyc9PiRtZXQsJ2xpbWl0Jz0+MjApKTsKICAgICRvWydpcmVuZ2lueXNfcG8nXT0kcShhcnJheSgnZGF0ZVJhbmdlcyc9PmFycmF5KGFycmF5KCdzdGFydERhdGUnPT4nMjAyNi0wOC0xMScsJ2VuZERhdGUnPT4nMjAyNi0wOS0wNycpLGFycmF5KCdzdGFydERhdGUnPT4nMjAyNi0wOS0wOScsJ2VuZERhdGUnPT4nMjAyNi0wOS0xMycpKSwnZGltZW5zaW9ucyc9PmFycmF5KGFycmF5KCduYW1lJz0+J2RldmljZUNhdGVnb3J5JyksYXJyYXkoJ25hbWUnPT4nZGF0ZVJhbmdlJykpLCdtZXRyaWNzJz0+JG1ldCwnbGltaXQnPT4yMCkpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-105233';
const GKEY='ps_s1681m';
const PHASES=["A"];
const OUT='analize/s1681_m.json';
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
