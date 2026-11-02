process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIyZiBHZW1vbiBwYWvFsyBwYXRpa3JhIChyZWFkLW9ubHkgKyBzaG90cykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODIyZiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyMmYnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgZm9yZWFjaChbMzM2MjQsMzM2MjZdIGFzICRiaWQpeyAkYj13Y19nZXRfcHJvZHVjdCgkYmlkKTsgJGNvc3Q9KGZsb2F0KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29zdF9uZXQgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIE9SREVSIEJZIGNvc3RfbmV0IERFU0MgTElNSVQgMSIsJGJpZCkpOwogICAgJG89WydiYXNlJz0+WyRiLT5nZXRfc3RhdHVzKCksJGItPmdldF9yZWd1bGFyX3ByaWNlKCksJGItPmdldF9zdG9ja19xdWFudGl0eSgpLGdldF9wb3N0X21ldGEoJGJpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSksZ2V0X3Bvc3RfbWV0YSgkYmlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsdHJ1ZSldLCdjb3N0Jz0+JGNvc3QsCiAgICAgICAgJ3RpZCc9PiR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskUH1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSIsJGJpZCkpXTsKICAgIGZvcmVhY2goJHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZT0lZCIsJGJpZCkpIGFzICRpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHx8JHAtPmdldF9zdGF0dXMoKT09PSd0cmFzaCcpIGNvbnRpbnVlOyAkcT0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfZHBfcGFja19xdHknLHRydWUpOyAkaz0oZmxvYXQpJHAtPmdldF9wcmljZSgpOwogICAgICAkb1sncGFrYWknXVskcV09WydpZCc9PiRpZCwnc3QnPT4kcC0+Z2V0X3N0YXR1cygpLCdrYWluYSc9PiRrLCd2bnQnPT5yb3VuZCgkay8kcSwzKSwnaW5fc3RvY2snPT4kcC0+aXNfaW5fc3RvY2soKSwncHVyY2gnPT4kcC0+aXNfcHVyY2hhc2FibGUoKSwnc2VpbWEnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSksJ3p5bWUnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3MxODIyX3Bha2FzJyx0cnVlKSwnc2t1Jz0+JHAtPmdldF9za3UoKSwKICAgICAgICAncGVsbmFzX3BvX3Bhc3RvbWF0byc9PnJvdW5kKCRrLzEuMjEtJGNvc3QqJHEtMi4xNSwyKSwndGlkJz0+JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00geyRQfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkaWQpKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkaWQpXTsgfQogICAga3NvcnQoJG9bJ3Bha2FpJ10pOyAkclsnZyddWyRiaWRdPSRvOyB9CiAgJHJbJ2xlbnRlbGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGFibGVfa2V5LHJvd19jb3VudCxzaGFwZSxyZXNvbHV0aW9uX3BvbGljeSwoU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2ZlZWRpbmdfbWFwIG0gV0hFUkUgbS5mZWVkaW5nX3RhYmxlX2lkPXQuaWQgQU5EIG0uaXNfYWN0aXZlPTEpIG1hcHMgRlJPTSB7JFB9cHNfZmVlZGluZ190YWJsZXMgdCBXSEVSRSB0YWJsZV9rZXkgTElLRSAnbWFudWFsX3MxODIyXyUnIixBUlJBWV9BKTsKICAkeD13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX2hiJyx0aW1lKCksaG9tZV91cmwoJy9rYXRlZ29yaWphL3N1bmltcy9tYWlzdGFzLXN1bmltcy9rb25zZXJ2YWktc3VuaW1zLycpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpOyAkaWRzPVtdOwogIGZvcmVhY2goWzM3NDU2LDM3NDU3LDM3NDU4LDM3NDU5LDM3NDYwLDM3NDYxXSBhcyAkaWQpIGlmKHByZWdfbWF0Y2goJy9wb3N0LScuJGlkLidcYi8nLCRoKSkgJGlkc1tdPSRpZDsgJHJbJ2thdGVnb3JpamEnXT1bJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdrb3J0ZWxlcyc9PiRpZHNdOwogICRyWyd0ZW1wNzE3NiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsbW9kaWZpZWQgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgaWQ9NzE3NiIsQVJSQVlfQSk7CiAgJHJbJ3RlbXBfYWt0eXZ1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsbW9kaWZpZWQgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG5hbWUgTElLRSAnVEVNUCUnIixBUlJBWV9BKTsKICAkbG9nPWluaV9nZXQoJ2Vycm9yX2xvZycpOyAkc3o9ZmlsZXNpemUoJGxvZyk7ICRoaD1mb3BlbigkbG9nLCdyJyk7IGZzZWVrKCRoaCxtYXgoMCwkc3otMzAwMDAwKSk7ICR0PWZyZWFkKCRoaCwzMDAwMDApOyBmY2xvc2UoJGhoKTsKICAkclsnZmF0YWxfcG9fMTk0MCddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLCR0KSxmdW5jdGlvbigkcyl7IHJldHVybiBzdHJpcG9zKCRzLCdGYXRhbCcpIT09ZmFsc2UgJiYgcHJlZ19tYXRjaCgnLzAyLU5vdi0yMDI2ICgxOTpbNC01XVxkfDJcZDopLycsJHMpOyB9KSk7CiAgJHUyND1nZXRfcGVybWFsaW5rKDM3NDU4KTsKICAkclsnc2hvdHMnXT1bWyduJz0+J3MxODIyX2dlbW9uMjRfdGVsJywndSc9PiR1MjQsJ3cnPT4zOTAsJ2gnPT44NDQsJ2Z1bGwnPT50cnVlXSxbJ24nPT4nczE4MjJfZ2Vtb25fa2F0X3RlbCcsJ3UnPT5ob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL2tvbnNlcnZhaS1zdW5pbXMvJyksJ3cnPT4zOTAsJ2gnPT44NDQsJ2Z1bGwnPT5mYWxzZV0sCiAgICBbJ24nPT4nczE4MjJfZ2Vtb242X3RlbCcsJ3UnPT5nZXRfcGVybWFsaW5rKDM3NDU2KSwndyc9PjM5MCwnaCc9Pjg0NCwnZnVsbCc9PmZhbHNlLCdldmFsJz0+IigoKT0+e2NvbnN0IHQ9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBzLXBha19fdCcpO3JldHVybiB0P3QuaW5uZXJUZXh0LnNsaWNlKDAsMzAwKTonbmVyYSc7fSkoKSJdXTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK';
const VER='dep-195732';
const GKEY='ps_s1822f';
const PHASES=["1"];
const OUT='analize/s1822_f.json';
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
