process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxdSByZWFkLW9ubHk6IHBldHNob3AtbGF1a2FpIGZvdG9fYXRzYXJnaW5lICsgZ3J1cGl1IGZvdG8gKyBQZXRzaG9wX1JpbmtpbmlhaTo6a29tcG96aWNpamEgc2lnbmF0dXJhICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyMXUnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzIxdSddOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGF1a2FpLnBocCc7ICRyWydsYXVrYWlfeXJhJ109aXNfZmlsZSgkZik7CiAgICBpZihpc19maWxlKCRmKSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgcHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFtcZC5dKykvJywkcywkbSk7ICRyWydsYXVrYWlfdiddPSRtWzFdPz8nPyc7ICRyWydsYXVrYWlfbWQ1J109bWQ1KCRzKTsKICAgICAgZm9yZWFjaChbJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfZ2V0X2ltYWdlX2lkJywnZm90b19hdHNhcmdpbmUnLCdwc19sYXVrYWlfZ3J1cGl1X2ZvdG8nLCdwb3N0X3RodW1ibmFpbF9pZCcsJ3dwX2dldF9hdHRhY2htZW50X2ltYWdlX3NyYyddIGFzICRrdykgJHJbJ2xhdWthaV9rdyddWyRrd109c3Vic3RyX2NvdW50KCRzLCRrdyk7CiAgICAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvblxzK2ZvdG9fYXRzYXJnaW5lXHMqXChbXildKlwpXHMqXHsuezAsOTAwfS9zJywkcywkbW0pKSAkclsnZm90b19hdHNhcmdpbmVfc3JjJ109JG1tWzBdOwogICAgICBpZihwcmVnX21hdGNoX2FsbCgnL2FkZF9maWx0ZXJcKFxzKltcJyJdd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfaW1hZ2VfaWRbXCciXVteO10qOy8nLCRzLCRtbTIpKSAkclsnaW1hZ2VfaWRfZmlsdGVyJ109JG1tMlswXTsKICAgIH0KICAgICRnPWdldF9vcHRpb24oJ3BzX2xhdWthaV9ncnVwaXVfZm90bycpOyAkclsnZ3J1cGl1X2ZvdG8nXT0kZzsKICAgIGZvcmVhY2goKGFycmF5KSRnIGFzICRrPT4kYWlkKXsgJHJbJ2dydXBpdV9mb3RvX2F0dCddWyRrXT1bKGludCkkYWlkLGdldF9wb3N0X3N0YXR1cygoaW50KSRhaWQpLGdldF9wb3N0X3R5cGUoKGludCkkYWlkKSwoJGZwPWdldF9hdHRhY2hlZF9maWxlKChpbnQpJGFpZCkpJiZmaWxlX2V4aXN0cygkZnApPydmYWlsYXMnOidCRSBGQUlMTyddOyB9CiAgICBmb3JlYWNoKFszNjE1NCwzNDk0MiwzNDkzOCwzNTc4Ml0gYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHJbJ2xhdWthcyddWyRpZF09WydncnVwZSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX2dydXBlJyx0cnVlKSwnaW1hZ2VfaWRfdmlldyc9PiRwPyRwLT5nZXRfaW1hZ2VfaWQoKTpudWxsLCdpbWFnZV9pZF9lZGl0Jz0+JHA/JHAtPmdldF9pbWFnZV9pZCgnZWRpdCcpOm51bGwsJ2ltZ19odG1sJz0+JHA/bWJfc3Vic3RyKHN0cmlwX3RhZ3MoJHAtPmdldF9pbWFnZSgnd29vY29tbWVyY2VfdGh1bWJuYWlsJyksJzxpbWc+JyksMCwxNjApOicnXTsgfQogICAgLy8gUGV0c2hvcF9SaW5raW5pYWkga29tcG96aWNpamEKICAgICRyZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOyAkczI9ZmlsZV9nZXRfY29udGVudHMoJHJmKTsgcHJlZ19tYXRjaCgnL15ccypcKlxzKlZlcnNpb246LiokL20nLCRzMiwkbXYpOyAkclsncmlua19oZWFkZXInXT10cmltKCRtdlswXT8/JycpOyBwcmVnX21hdGNoKCcvUGx1Z2luIE5hbWU6LiokL20nLCRzMiwkbW4pOyAkclsncmlua19uYW1lJ109dHJpbSgkbW5bMF0/PycnKTsKICAgIGZvcmVhY2goWydrb21wb3ppY2lqYScsJ2tvbXBvemljaWphX3ZpZGluZScsJ2lzdmFseXRpX3BlZHNha3VzJ10gYXMgJGZuKXsgaWYocHJlZ19tYXRjaCgnLygoPzpwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpP1xzKnN0YXRpY1xzKyk/ZnVuY3Rpb25ccysnLiRmbi4nXHMqXChbXildKlwpLycsJHMyLCRtbTMpKSAkclsncmlua19mbiddWyRmbl09JG1tM1swXTsgfQogICAgLy8ga3VyIGt2aWVjaWFtYSBrb21wb3ppY2lqYSgpIGlyIGt1ciBfdGh1bWJuYWlsX2lkCiAgICBwcmVnX21hdGNoX2FsbCgnLy57MCwxNjB9KD86c2VsZjo6fHN0YXRpYzo6fFwkdGhpcy0+KWtvbXBvemljaWphXCguezAsMTIwfS8nLCRzMiwkbWMpOyAkclsna29tcG96aWNpamFfa3ZpZXRpbWFpJ109YXJyYXlfbWFwKGZuKCR4KT0+cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KSwkbWNbMF0pOwogICAgcHJlZ19tYXRjaF9hbGwoJy8uezAsMjAwfV90aHVtYm5haWxfaWQuezAsMTIwfS8nLCRzMiwkbXQpOyAkclsndGh1bWJfdmlldG9zJ109YXJyYXlfbWFwKGZuKCR4KT0+cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KSwkbXRbMF0pOwogICAgcHJlZ19tYXRjaF9hbGwoJy8uezAsMjAwfV9wc19yaW5rX2tvbXBfaGFzaC57MCwxNjB9LycsJHMyLCRtaCk7ICRyWydoYXNoX3ZpZXRvcyddPWFycmF5X3NsaWNlKGFycmF5X21hcChmbigkeCk9PnByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCksJG1oWzBdKSwwLDYpOwogICAgcHJlZ19tYXRjaF9hbGwoJy8uezAsMjQwfXdwX2RlbGV0ZV9hdHRhY2htZW50LnswLDgwfS8nLCRzMiwkbWQpOyAkclsnZGVsZXRlX2F0dCddPWFycmF5X21hcChmbigkeCk9PnByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCksJG1kWzBdKTsKICAgICRyWydrbGFzZSddPXByZWdfbWF0Y2goJy9jbGFzc1xzKyhcdyspLycsJHMyLCRtayk/JG1rWzFdOic/JzsKICAgIC8vIDUgYmUgdGh1bWIgYmV0IHN1IGF0dGFjaG1lbnR1OiBhdHRhY2htZW50dSBwb3N0X3BhcmVudAogICAgZm9yZWFjaChbMzUzOTIsMzUzOTYsMzU0MDQsMzU0MDYsMzU0MDgsMzUwNzAsMzUwNzYsMzUwNzksMzUwODVdIGFzICRpZCl7ICRyWydwYXJ1b3N0aSddWyRpZF09WydoYXNoJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19yaW5rX2tvbXBfaGFzaCcsdHJ1ZSksJ2tvbXAnPT5jb3VudCgoYXJyYXkpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wZXRzaG9wX2NvbXBvbmVudF9xdWFudGl0aWVzJyx0cnVlKSksJ21ubV92YWlrYWknPT4oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH13Y19tbm1fY2hpbGRfaXRlbXMgV0hFUkUgY29udGFpbmVyX2lkPSVkIiwkaWQpKV07IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-163429';
const GKEY='ps_s1721u';
const PHASES=["1"];
const OUT='analize/s1721u.json';
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
