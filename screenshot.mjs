process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIwZyDigJQga3VyIGtsaWVudHVpIHJvZG9tYSDigJ5rYXNhIiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjBnJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyMGcnXTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgyODApOwogIHRyeXsKICAkcGc9Z2V0X3BhZ2VfYnlfcGF0aCgna2FzYScpOyAkclsncHNsX2thc2EnXT0kcGc/WydpZCc9PiRwZy0+SUQsJ3RpdGxlJz0+JHBnLT5wb3N0X3RpdGxlLCdzbHVnJz0+JHBnLT5wb3N0X25hbWUsJ3djX2NoZWNrb3V0X3BhZ2VfaWQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jaGVja291dF9wYWdlX2lkJyksJ3JtX3RpdGxlJz0+Z2V0X3Bvc3RfbWV0YSgkcGctPklELCdyYW5rX21hdGhfdGl0bGUnLHRydWUpXTonLSc7CiAgJHJbJ2VuZHBvaW50cyddPVsnY2hlY2tvdXQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jaGVja291dF9wYXlfZW5kcG9pbnQnKSwncmVjZWl2ZWQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jaGVja291dF9vcmRlcl9yZWNlaXZlZF9lbmRwb2ludCcpXTsKICAvLyBtdS1wbHVnaW5zICsgY2hpbGQ6IGtsaWVudHVpIG1hdG9tb3MgZnJhesSXcyBzdSDigJ5rYXMiCiAgJGhpdHM9W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLFtnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnXSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BzLXNhYmxvbmFpLyoucGhwJyksZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy8qLyoucGhwJykpIGFzICRmbil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbik7IGlmKHByZWdfbWF0Y2hfYWxsKCcvW1wnIj5dW15cJyI8Pl17MCw2MH1cYihrYXNbYcSFb8SZxIVdfEthc1thxIVvxJldfMSvIGthc8SFfGthc29qZXxLYXNvamUpXGJbXlwnIjw+XXswLDYwfVtcJyI8XS91JywkYywkbSkpeyAkdT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21hcCgndHJpbScsJG1bMF0pKSk7ICR1PWFycmF5X2ZpbHRlcigkdSxmdW5jdGlvbigkeCl7cmV0dXJuICFwcmVnX21hdGNoKCcvXC9rYXNhXC98a2FzYVw/fGlzX2NoZWNrb3V0fGthc2FffF9rYXNhfHBzX2thc2F8a2FzYVwucGhwfGthc29qZVwoXCl8XGJrYXNvamVcKC8nLCR4KTt9KTsgaWYoJHUpICRoaXRzW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGZuKV09YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKCR1KSwwLDgpO30gfSAkclsna29kYXMnXT0kaGl0czsKICAvLyBzbmlwcGV0cyBha3R5dsWrcwogICRyWydzbmlwcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyXEryBrYXPEhSUnIE9SIGNvZGUgTElLRSAnJUthc2ElJyBPUiBjb2RlIExJS0UgJyVrYXNvamUlJykiLEFSUkFZX0EpOwogIC8vIFdDL0ZsYXRzb21lIHZlcnRpbWFpIChnZXR0ZXh0KSDigJQga8SFIHJvZG8gZnJvbnRlbmQKICBmb3JlYWNoKFsnQ2hlY2tvdXQnLCdQcm9jZWVkIHRvIGNoZWNrb3V0JywnUHJvY2VlZCB0byBDaGVja291dCcsJ0NhcnQnLCdWaWV3IGNhcnQnLCdHbyB0byBjaGVja291dCcsJ1BsYWNlIG9yZGVyJywnUmV0dXJuIHRvIGNhcnQnLCdDb250aW51ZSBzaG9wcGluZycsJ1lvdXIgb3JkZXInLCdCaWxsaW5nIGRldGFpbHMnLCdTaGlwIHRvIGEgZGlmZmVyZW50IGFkZHJlc3M/JywnSGF2ZSBhIGNvdXBvbj8nLCdVcGRhdGUgY2FydCcsJ0NhcnQgdG90YWxzJ10gYXMgJHMpeyAkclsnZ2V0dGV4dF93YyddWyRzXT1fXygkcywnd29vY29tbWVyY2UnKTsgJGY9X18oJHMsJ2ZsYXRzb21lJyk7IGlmKCRmIT09JHMpICRyWydnZXR0ZXh0X2ZsJ11bJHNdPSRmOyB9CiAgLy8gZ3l2aSBIVE1MOiBrcmVwxaFlbGlzLCBtaW5pIChmb290ZXIpLCBrYXNhCiAgZm9yZWFjaChbJy9rcmVwc2VsaXMvJywnL2thc2EvJywnLyddIGFzICR1KXsgJHJzPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJHUpLFsndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTcyMCddKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJzKTsgcHJlZ19tYXRjaF9hbGwoJy8+KFtePD5dezAsNTB9XGJbS2tdYXMoPzphfMSFfG9zfG9qZXxhaSlcYltePD5dezAsNTB9KTwvdScsJGIsJG0pOyAkclsnaHRtbCddWyR1XT1bJ2h0dHAnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpLCdmcmF6ZXMnPT5hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21hcCgndHJpbScsJG1bMV0pKSldOyBpZihwcmVnX21hdGNoKCcvPHRpdGxlPihbXjxdKyk8LycsJGIsJHQpKSAkclsnaHRtbCddWyR1XVsndGl0bGUnXT0kdFsxXTsgfQogIC8vIG1lbnUKICAkclsnbWVudSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLHBtLm1ldGFfdmFsdWUgdXJsIEZST00geyRwfXBvc3RzIHAgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBwbSBPTiBwbS5wb3N0X2lkPXAuSUQgQU5EIHBtLm1ldGFfa2V5PSdfbWVudV9pdGVtX3VybCcgV0hFUkUgcC5wb3N0X3R5cGU9J25hdl9tZW51X2l0ZW0nIEFORCAocC5wb3N0X3RpdGxlIExJS0UgJyVrYXMlJyBPUiBwbS5tZXRhX3ZhbHVlIExJS0UgJyVrYXNhJScpIixBUlJBWV9BKTsKICAvLyBsYWnFoWvFsyDFoWFibG9uYWkgREIgKHBzIGVtYWlsIGRyYWZ0cykgc3Uga2FzYQogICRyWydsYWlza2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGUgSU4gKCdwc19lbWFpbCcsJ3BzX2VtYWlsX3RlbXBsYXRlJywncHNfbGFpc2thcycpIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJWthcyUnIExJTUlUIDEwIixBUlJBWV9BKTsKICAvLyBsZWdhY3kgbnVvcm9kb3MgxK8gL2thc2EvIGtvZGUgKGtpZWsgZmFpbMWzKSDigJQga2FkIMW+aW5vdHVtZSBzbHVnIGtlaXRpbW8ga2FpbsSFCiAgJG49MDsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGZuKXsgaWYoc3RycG9zKGZpbGVfZ2V0X2NvbnRlbnRzKCRmbiksJy9rYXNhLycpIT09ZmFsc2UpICRuKys7IH0gJHJbJ2ZhaWx1X3N1X2thc2Ffc2x1ZyddPSRuOwogICRyWydzbmlwcGV0c19zdV9zbHVnJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBjb2RlIExJS0UgJyUva2FzYS8lJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-184046';
const GKEY='ps_s1720g';
const PHASES=["1"];
const OUT='analize/s1720_g.json';
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
