process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA2bSddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHI9W107CiAgJHNraXA9YXJyYXkoJ2thc2EnLCdrcmVwc2VsaXMnLCdwYXNreXJhJywncGFyZHVvdHV2ZScsJ3RhaXN5a2xlcycsJ3ByaXZhdHVtby1wb2xpdGlrYScsJ3NsYXB1a3UtcG9saXRpa2EnLCdrb250YWt0YWknLCdhcGllLW11cycsJ2FwbW9rZWppbWFzJywnZ3JhemluaW1hcycsJ3ByaXN0YXR5bWFzJywnZHVrJywnYXVnaW50aW5pby1wcm9maWxpcycsJ2FrY2lqb3MnLCdkYXVnaWF1LXBpZ2lhdScsJ3Bhc2l1bHltYWknLCdza2FpY2l1b2tsZScpOwogICR2ZWlzbD1hcnJheV9rZXlzKFBldHNob3BfVmVpc2xlczo6emVtZWxhcGlzKCkpOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdHlwZSxwb3N0X25hbWUscG9zdF90aXRsZSxwb3N0X2NvbnRlbnQscG9zdF9wYXJlbnQscG9zdF9kYXRlLHBvc3RfbW9kaWZpZWQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIElOICgncG9zdCcsJ3BhZ2UnKSBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgJGdzYz1hcnJheSgpOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIFNVQlNUUklOR19JTkRFWChUUklNKFRSQUlMSU5HICcvJyBGUk9NIFNVQlNUUklOR19JTkRFWCh1cmwsJ3BldHNob3AubHQvJywtMSkpLCc/JywxKSBzLCBTVU0oY2xpY2tzKSBjbCwgU1VNKGltcHIpIGltLCBST1VORChTVU0ocG9zKmltcHIpL05VTExJRihTVU0oaW1wciksMCksMSkgcG9zIEZST00geyRwfXBzX2Zha3RfZ3NjX3VybF9kIFdIRVJFIGRpZW5hPj1DVVJEQVRFKCktSU5URVJWQUwgMTIwIERBWSBHUk9VUCBCWSAxIixBUlJBWV9BKSBhcyAkZyl7ICRnc2NbJGdbJ3MnXV09JGc7IH0KICAkcHY9YXJyYXkoKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBTVUJTVFJJTkdfSU5ERVgodXJsX2tlbGlhcywnPycsMSkgdSwgQ09VTlQoKikgbiBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0aXBhcz0ncGFnZXZpZXcnIEFORCBkaWVuYT49JzIwMjYtMDktMDknIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIDEiLEFSUkFZX0EpIGFzICR4KXsgJHB2W3RyaW0oJHhbJ3UnXSwnLycpXT0keFsnbiddOyB9CiAgZm9yZWFjaCgkcm93cyBhcyAkeCl7IGlmKGluX2FycmF5KCR4LT5wb3N0X25hbWUsJHNraXAsdHJ1ZSl8fGluX2FycmF5KCR4LT5wb3N0X25hbWUsJHZlaXNsLHRydWUpKSBjb250aW51ZTsKICAgICRjPSR4LT5wb3N0X2NvbnRlbnQ7ICR0eHQ9dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3Moc3RyaXBfc2hvcnRjb2RlcygkYykpKSk7CiAgICAkcGF0aD10cmltKHdwX21ha2VfbGlua19yZWxhdGl2ZShnZXRfcGVybWFsaW5rKCR4LT5JRCkpLCcvJyk7ICRnPSRnc2NbJHgtPnBvc3RfbmFtZV0/PygkZ3NjWyRwYXRoXT8/bnVsbCk7CiAgICBwcmVnX21hdGNoX2FsbCgnfmhyZWY9IihbXiJdKykificsJGMsJGgpOyAkaW50PTA7ICRleHQ9MDsgZm9yZWFjaCgkaFsxXSBhcyAkbCl7IGlmKHN0cnBvcygkbCwncGV0c2hvcC5sdCcpIT09ZmFsc2V8fCRsWzBdPT09Jy8nKSAkaW50Kys7IGVsc2UgJGV4dCsrOyB9CiAgICAkclsnYSddW109YXJyYXkoJ2lkJz0+JHgtPklELCd0Jz0+JHgtPnBvc3RfdHlwZSwnc2x1Zyc9PiRwYXRoLCd0aXRsZSc9Pm1iX3N1YnN0cigkeC0+cG9zdF90aXRsZSwwLDcwKSwnem9kJz0+c3RyX3dvcmRfY291bnQoJHR4dCwwLCfEhcSNxJnEl8SvxaHFs8Wrxb7EhMSMxJjElsSuxaDFssWqxb0nKSwnZGF0YSc9PnN1YnN0cigkeC0+cG9zdF9kYXRlLDAsMTApLCdub2ZvbGxvdyc9PnN1YnN0cl9jb3VudCgkYywnbm9mb2xsb3cnKSwnYmxhbmsnPT5zdWJzdHJfY291bnQoJGMsJ19ibGFuaycpLCdsbmtfaW50Jz0+JGludCwnbG5rX2V4dCc9PiRleHQsJ3NjJz0+aW1wbG9kZSgnLCcsYXJyYXlfdW5pcXVlKHByZWdfbWF0Y2hfYWxsKCcvXFsoXHcrKS8nLCRjLCRtKT8kbVsxXTphcnJheSgpKSksJ21ldGFpJz0+aW1wbG9kZSgnLCcsYXJyYXlfdW5pcXVlKHByZWdfbWF0Y2hfYWxsKCcvMjAoMVxkfDJbMC01XSkvJywkeC0+cG9zdF90aXRsZS4nICcuJHR4dCwkbTIpPyRtMlswXTphcnJheSgpKSksJ3JtX3JvYm90cyc9PmdldF9wb3N0X21ldGEoJHgtPklELCdyYW5rX21hdGhfcm9ib3RzJyx0cnVlKSwnZGVzYyc9PmdldF9wb3N0X21ldGEoJHgtPklELCdyYW5rX21hdGhfZGVzY3JpcHRpb24nLHRydWUpPzE6MCwnZ3NjX2NsJz0+JGdbJ2NsJ10/PzAsJ2dzY19pbSc9PiRnWydpbSddPz8wLCdwb3MnPT4kZ1sncG9zJ10/PycnLCdwdjE0Jz0+JHB2WyRwYXRoXT8/MCwncHJhZHppYSc9Pm1iX3N1YnN0cigkdHh0LDAsMTYwKSk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCA5OSk7Cg==';
const VER='dep-134710';
const GKEY='ps_s1706m';
const PHASES=["GO"];
const OUT='analize/s1706_ms.json';
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
