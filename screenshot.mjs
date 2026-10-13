process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzc5bCByZXplcnZhY2lqb3MgcGF0aWtyYTogX3N0b2NrIHZzIEFWLCBwYXZlaWt0b3MgcHJla2VzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc3OWwnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDkwKTsgJHI9Wyd2Jz0+J1MxNzc5bCddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJHJbJ3JhdzE4NTU3J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0xODU1NyBBTkQgbWV0YV9rZXkgSU4oJ19zdG9jaycsJ19vd25fc3RvY2tfcXR5JywnX21hbmFnZV9zdG9jaycsJ19zdG9ja19zdGF0dXMnLCdfYmFja29yZGVycycpIixBUlJBWV9BKTsKICAgICRyWydsb29rdXAnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHN0b2NrX3F1YW50aXR5LCBzdG9ja19zdGF0dXMgRlJPTSB7JFB9d2NfcHJvZHVjdF9tZXRhX2xvb2t1cCBXSEVSRSBwcm9kdWN0X2lkPTE4NTU3IixBUlJBWV9BKTsKICAgICRkcz1XQ19EYXRhX1N0b3JlOjpsb2FkKCdwcm9kdWN0Jyk7ICRyWydxdWVyeV9mb3Jfc3RvY2snXT1tZXRob2RfZXhpc3RzKCRkcywnZ2V0X3F1ZXJ5X2Zvcl9zdG9jaycpPyR3cGRiLT5nZXRfdmFyKCRkcy0+Z2V0X3F1ZXJ5X2Zvcl9zdG9jaygxODU1NykpOic/JzsKICAgIC8vIHBhdmVpa3RvczogbWFuYWdlX3N0b2NrIHllcywgcmF3IF9zdG9jazw9MCwgb3duPjAsIHB1Ymxpc2gKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIHAucG9zdF90aXRsZSwgcy5tZXRhX3ZhbHVlIHN0LCBvLm1ldGFfdmFsdWUgb3duIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX21hbmFnZV9zdG9jaycgQU5EIG0ubWV0YV92YWx1ZT0neWVzJyBKT0lOIHskUH1wb3N0bWV0YSBvIE9OIG8ucG9zdF9pZD1wLklEIEFORCBvLm1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgQU5EIENBU1Qoby5tZXRhX3ZhbHVlIEFTIFNJR05FRCk+MCBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19zdG9jaycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgKHMubWV0YV92YWx1ZSBJUyBOVUxMIE9SIENBU1Qocy5tZXRhX3ZhbHVlIEFTIFNJR05FRCk8PTApIixBUlJBWV9BKTsKICAgICRyWydwYXZlaWt0dV9uJ109Y291bnQoJHJvd3MpOyAkclsncGF2ZWlrdG9zJ109YXJyYXlfbWFwKGZuKCR4KT0+WyR4WydJRCddLG1iX3N1YnN0cigkeFsncG9zdF90aXRsZSddLDAsNTUpLCR4WydzdCddLCR4Wydvd24nXV0sYXJyYXlfc2xpY2UoJHJvd3MsMCw0MCkpOwogICAgLy8gYXIgYnV2byBzZWttaW5ndSB1enNha3ltdSB0b2tpb20gcHJla2VtIHBvIFQtMCAoa2FpIF9zdG9jazw9MCk/IHRpayBza2FpY2l1czogcHJla2VzIHN1IG93bj4wIGlyIHN0PD0wIHBhcmRhdmltYWkgbnVvIDA5LTA4CiAgICBpZigkcm93cyl7ICRpbj1pbXBsb2RlKCcsJyxhcnJheV9tYXAoZm4oJHgpPT4oaW50KSR4WydJRCddLCRyb3dzKSk7ICRyWydqdV9wYXJkYXZpbWFpX251b18wOTA4J109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBvLmlkKSBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9aS5vcmRlcl9pZCBBTkQgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCcgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgaW0gT04gaW0ub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIGltLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgQU5EIGltLm1ldGFfdmFsdWUgSU4oJGluKSIpOyAKICAgICAgJHJbJ2p1X25lYXBtX2F0c2F1a3RpX251b18xMDAxJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgby5zdGF0dXMsIG8uZGF0ZV9jcmVhdGVkX2dtdCwgaW0ubWV0YV92YWx1ZSBwaWQgRlJPTSB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPWkub3JkZXJfaWQgQU5EIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOKCd3Yy1jYW5jZWxsZWQnLCd3Yy1wZW5kaW5nJywnd2MtZmFpbGVkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMTAtMDEnIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIGltIE9OIGltLm9yZGVyX2l0ZW1faWQ9aS5vcmRlcl9pdGVtX2lkIEFORCBpbS5tZXRhX2tleT0nX3Byb2R1Y3RfaWQnIEFORCBpbS5tZXRhX3ZhbHVlIElOKCRpbikgT1JERVIgQlkgby5pZCIsQVJSQVlfQSk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-061727';
const GKEY='ps_s1779l';
const PHASES=["1"];
const OUT='out/s1779l.json';
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
