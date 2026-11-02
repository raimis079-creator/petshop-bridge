process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2ZHYgZG92YW5vcyBpciBhdHNpbGllcGltYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODE2ZHYnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MTZkdiddOwogIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpLFtnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnXSkgYXMgJGYpeyAkdD1maWxlX2dldF9jb250ZW50cygkZik7ICRoPVtdOyBmb3JlYWNoKFsnZG92YW4nLCdnaWZ0JywncmV2aWV3JywnYXRzaWxpZXBpbScsJ2NvbW1lbnRfcG9zdCcsJ3dvb2NvbW1lcmNlX3JldmlldycsJ2ZyZWVfaXRlbSddIGFzICRrKXsgJGM9c3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJHQpLCRrKTsgaWYoJGMpICRoWyRrXT0kYzsgfSBpZigkaCkgJHJbJ2tvZGFzJ11bc3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJGYpXT0kaDsgfQogICRyWydyZXZpZXdzX29uJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW5hYmxlX3Jldmlld3MnKTsgJHJbJ3Jldmlld192ZXJpZmllZF9vbmx5J109Z2V0X29wdGlvbignd29vY29tbWVyY2VfcmV2aWV3X3JhdGluZ192ZXJpZmljYXRpb25fcmVxdWlyZWQnKTsgJHJbJ2NvbW1lbnRfbW9kZXJhdGlvbiddPWdldF9vcHRpb24oJ2NvbW1lbnRfbW9kZXJhdGlvbicpOwogICRyWydhdHNpbGllcGltdV9uJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY29tbWVudF9hcHByb3ZlZCwgQ09VTlQoKikgbiwgTUFYKGNvbW1lbnRfZGF0ZSkgcGFzayBGUk9NIHskUH1jb21tZW50cyBXSEVSRSBjb21tZW50X3R5cGU9J3JldmlldycgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ2F0c2lsaWVwaW1haV9wYXNrJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY29tbWVudF9JRCxjb21tZW50X3Bvc3RfSUQsY29tbWVudF9kYXRlLExFRlQoY29tbWVudF9jb250ZW50LDYwKSBjLGNvbW1lbnRfYXBwcm92ZWQgRlJPTSB7JFB9Y29tbWVudHMgV0hFUkUgY29tbWVudF90eXBlPSdyZXZpZXcnIE9SREVSIEJZIGNvbW1lbnRfSUQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAkclsnZG92YW51X2VpbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGRvdmFuYSwgQ09VTlQoKikgbiwgTUlOKGRpZW5hKSBudW8gRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIGRvdmFuYT0xIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydkb3ZhbnVfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBuIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJyVkb3ZhbiUnIE9SIG1ldGFfa2V5IExJS0UgJyVnaWZ0JScgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ3NrYW5lc3RhaV9waWd1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDYwKSB0LCBwci5tZXRhX3ZhbHVlIGthaW5hLCBzLm1ldGFfdmFsdWUgc2FuZCwgc3QubWV0YV92YWx1ZSBzdG9jayBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRCBKT0lOIHskUH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskUH10ZXJtcyB0bSBPTiB0bS50ZXJtX2lkPXR0LnRlcm1faWQgQU5EIHRtLnNsdWcgSU4oJ3NrYW5lc3RhaS1zdW5pbXMnLCdza2FuZXN0YWkta2F0ZW1zJykgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBwciBPTiBwci5wb3N0X2lkPXAuSUQgQU5EIHByLm1ldGFfa2V5PSdfcHJpY2UnIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHN0IE9OIHN0LnBvc3RfaWQ9cC5JRCBBTkQgc3QubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHMubWV0YV92YWx1ZT0nYXYnIEFORCBzdC5tZXRhX3ZhbHVlPSdpbnN0b2NrJyBBTkQgcHIubWV0YV92YWx1ZSswIEJFVFdFRU4gMC44IEFORCAyLjUgT1JERVIgQlkgdG0uc2x1ZywgcHIubWV0YV92YWx1ZSswIExJTUlUIDIwIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-130732';
const GKEY='ps_s1816dv';
const PHASES=["1"];
const OUT='analize/s1816_dv.json';
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
