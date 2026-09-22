process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0IGxpa3VjaXUgcmVjb24gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTcwNCddKT8kX0dFVFsncHNfczE3MDQnXTonJyk7IGlmKCRmIT09JzEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTcwNCcsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJEVBTj0nNDAxNzcyMTgyOTczMSc7CiAgICAvLyAxLiByYXN0aSBwcmVrZQogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIERJU1RJTkNUIHBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX3ZhbHVlPSVzIEFORCBtZXRhX2tleSBJTiAoJ19lYW4nLCdfdmZfYmFyY29kZScsJ19za3UnLCdfemJfYmFyY29kZScsJ19iYXJjb2RlJywnX2d0aW4nKSIsJEVBTikpOwogICAgJG9bJ3Jhc3RhX2lkcyddPSRpZHM7CiAgICAkcGlkPSRpZHM/KGludCkkaWRzWzBdOjA7ICRvWydwaWQnXT0kcGlkOwogICAgaWYoJHBpZCl7CiAgICAgICRwc3Q9Z2V0X3Bvc3QoJHBpZCk7CiAgICAgICRvWydwcmVrZSddPWFycmF5KCdpZCc9PiRwaWQsJ3Bhdic9PiRwc3QtPnBvc3RfdGl0bGUsJ3N0YXR1cyc9PiRwc3QtPnBvc3Rfc3RhdHVzLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpKTsKICAgICAgJG1rPWFycmF5KCdfcHNfc2FuZGVsaXMnLCdfc3RvY2snLCdfb3duX3N0b2NrX3F0eScsJ19tYW5hZ2Vfc3RvY2snLCdfc3RvY2tfc3RhdHVzJywnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JywnX3ZmX3N1cHBsaWVyX3NrdScsJ196Yl9za3UnLCdfdmZfYmFyY29kZScsJ19lYW4nLCdfcHJpY2UnLCdfcmVndWxhcl9wcmljZScsJ19wc19kcm9wc2hpcF9wYXNsZXB0YScsJ19vd25fc3RvY2tfcXR5X2xvZ19wcmV2JywnX3piX3F0eV9sb2dfcHJldicsJ19wc19yYW5rYV9pc2ltdGEnKTsKICAgICAgJG9bJ21ldGEnXT1hcnJheSgpOyBmb3JlYWNoKCRtayBhcyAkayl7ICR2PWdldF9wb3N0X21ldGEoJHBpZCwkayx0cnVlKTsgJG9bJ21ldGEnXVska109KCR2PT09Jyc/bnVsbDokdik7IH0KICAgICAgJG9bJ3Zpc29zX21ldGFfc3RvY2snXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgcG9zdF9pZD0lZCBBTkQgKG1ldGFfa2V5IExJS0UgJyUlc3RvY2slJScgT1IgbWV0YV9rZXkgTElLRSAnJSVxdHklJScgT1IgbWV0YV9rZXkgTElLRSAnJSVsaWt1dCUlJyBPUiBtZXRhX2tleSBMSUtFICclJWNvc3QlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVzYW5kZWwlJScpIiwkcGlkKSxBUlJBWV9BKTsKICAgICAgLy8gMi4gcmVnaXN0cmFzCiAgICAgICRvWydwc19zb3VyY2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRwaWQpLEFSUkFZX0EpOwogICAgICAvLyAzLiBwYXJ0aWpvcwogICAgICAkb1sncHNfcGFydGlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX3BhcnRpam9zIFdIRVJFIHByb2R1Y3RfaWQ9JWQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAyMCIsJHBpZCksQVJSQVlfQSk7CiAgICB9CiAgICAvLyA0LiBrb2tpb3MgbGVudGVsZXMgZ2FsZXR1IGJ1dGkgaXN0b3Jpam9zCiAgICAkb1snbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXBzXyUnIik7CiAgICAvLyA1LiBrdXIgZ2VuZXJ1b2phbWEgSXN0b3Jpam9zIGtvcnRlbGUKICAgICRkaXI9V1BNVV9QTFVHSU5fRElSOyAkcmFkPWFycmF5KCk7CiAgICBmb3JlYWNoKHNjYW5kaXIoJGRpcikgYXMgJGZuKXsgaWYoc3Vic3RyKCRmbiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkYz1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nLycuJGZuKTsgaWYoJGM9PT1mYWxzZSkgY29udGludWU7CiAgICAgIGlmKHN0cnBvcygkYywnVklTS0FTLCBLQVMgVllLTycpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdQYWdhbCBzcml0xK8nKSE9PWZhbHNlIHx8IHN0cnBvcygkYywnUGFnYWwgc3JpdCcpIT09ZmFsc2UpICRyYWRbXT0kZm47IH0KICAgICRvWydpc3Rvcmlqb3NfZmFpbGFpJ109JHJhZDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-075844';
const GKEY='ps_s1704';
const PHASES=["1"];
const OUT='analize/s1704_a.json';
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
