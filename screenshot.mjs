process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5YiAzNTk1OCArIDU4MzEgKyBQYXlzZXJhIHNhbnR5a2lzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTczOWInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzM5YiddOwogIHRyeXsKICAgIGZvcmVhY2goWzM1OTU4LDM1OTk2LDM2MDAxLDM2MDk3XSBhcyAkaWQpewogICAgICAkclsnbm90ZXNfJy4kaWRdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvbW1lbnRfZGF0ZV9nbXQgZCwgY29tbWVudF9hdXRob3IgYSwgTEVGVChSRVBMQUNFKGNvbW1lbnRfY29udGVudCwnXG4nLCcgJyksMjYwKSB0IEZST00geyR3cGRiLT5jb21tZW50c30gV0hFUkUgY29tbWVudF9wb3N0X0lEPSVkIEFORCBjb21tZW50X3R5cGU9J29yZGVyX25vdGUnIE9SREVSIEJZIGNvbW1lbnRfSUQiLCRpZCksQVJSQVlfQSk7CiAgICAgICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZigkbyl7ICRyWydtZXRhXycuJGlkXT1bJ3BhaWRfZGF0ZSc9PiRvLT5nZXRfZGF0ZV9wYWlkKCk/JG8tPmdldF9kYXRlX3BhaWQoKS0+ZGF0ZSgnYycpOm51bGwsJ3R4bic9PiRvLT5nZXRfdHJhbnNhY3Rpb25faWQoKT8neXJhJzonbmVyYScsJ2l0ZW1zJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRpKXsgcmV0dXJuICRpLT5nZXRfbmFtZSgpLicgw5cnLiRpLT5nZXRfcXVhbnRpdHkoKS4nID0gJy4kaS0+Z2V0X3RvdGFsKCk7IH0sYXJyYXlfdmFsdWVzKCRvLT5nZXRfaXRlbXMoKSkpLCdzaGlwJz0+JG8tPmdldF9zaGlwcGluZ190b3RhbCgpLCdwbV90aXRsZSc9PiRvLT5nZXRfcGF5bWVudF9tZXRob2RfdGl0bGUoKSwnY3JlYXRlZF92aWEnPT4kby0+Z2V0X2NyZWF0ZWRfdmlhKCksJ3VhJz0+c3Vic3RyKChzdHJpbmcpJG8tPmdldF9jdXN0b21lcl91c2VyX2FnZW50KCksMCwxMjApXTsKICAgICAgICAkbT1bXTsgZm9yZWFjaCgkby0+Z2V0X21ldGFfZGF0YSgpIGFzICRtZCl7ICRrPSRtZC0+a2V5OyBpZihwcmVnX21hdGNoKCcvcGF5c2VyYXxfcHNffHBheW1lbnR8cGF5L2knLCRrKSYmIXByZWdfbWF0Y2goJy9lbWFpbHxwaG9uZXxuYW1lfGFkZHJlc3MvaScsJGspKSAkbVska109aXNfc2NhbGFyKCRtZC0+dmFsdWUpP3N1YnN0cigoc3RyaW5nKSRtZC0+dmFsdWUsMCw4MCk6J1thcnJdJzsgfSAkclsnbWV0YWtfJy4kaWRdPSRtOyB9CiAgICB9CiAgICAkclsncGF5c2VyYV92aXNpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLCBDT1VOVCgqKSBuIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgcGF5bWVudF9tZXRob2Q9J3BheXNlcmEnIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCAyMTowMCcgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnYmFjc192aXNpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLCBDT1VOVCgqKSBuIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgcGF5bWVudF9tZXRob2Q9J2JhY3MnIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCAyMTowMCcgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAvLyBhciBrdXJpYW0gYXRzYXVrdGFtIHlyYSBwYWlkX2RhdGUgLyB0cmFuc2FjdGlvbgogICAgJHJbJ2F0c2F1a3RpX3N1X2FwbW9rZWppbXUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLCBvLnBheW1lbnRfbWV0aG9kIHBtLCBST1VORChvLnRvdGFsX2Ftb3VudCwyKSBzLCBvLnRyYW5zYWN0aW9uX2lkIHR4LCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgbSBXSEVSRSBtLm9yZGVyX2lkPW8uaWQgQU5EIG0ubWV0YV9rZXk9J19wYWlkX2RhdGUnIExJTUlUIDEpIHBkIEZST00geyRQfXdjX29yZGVycyBvIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJfb3BlcmF0aW9uYWxfZGF0YSBvZCBPTiBvZC5vcmRlcl9pZD1vLmlkIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzPSd3Yy1jYW5jZWxsZWQnIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA4IDIxOjAwJyBBTkQgKChvLnRyYW5zYWN0aW9uX2lkIElTIE5PVCBOVUxMIEFORCBvLnRyYW5zYWN0aW9uX2lkPD4nJykgT1Igb2QuZGF0ZV9wYWlkX2dtdCBJUyBOT1QgTlVMTCkiLEFSUkFZX0EpOwogICAgJHJbJ3BheXNlcmFfbm90ZV9wb19hcG1va2VqaW1vJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYy5jb21tZW50X3Bvc3RfSUQgaWQsIG8uc3RhdHVzIEZST00geyR3cGRiLT5jb21tZW50c30gYyBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPWMuY29tbWVudF9wb3N0X0lEIFdIRVJFIGMuY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBBTkQgYy5jb21tZW50X2NvbnRlbnQgTElLRSAnJSVixatzZW5hIHBvIGFwbW9rxJdqaW1vJSUnIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA4IDIxOjAwJyBHUk9VUCBCWSAxLDIiLEFSUkFZX0EpOwogICAgJHJbJ3Byb2RfMTgwNTQnXT0oJHA9d2NfZ2V0X3Byb2R1Y3QoMTgwNTQpKT9bJHAtPmdldF9uYW1lKCksJHAtPmdldF9zdGF0dXMoKSwkcC0+Z2V0X3ByaWNlKCksJHAtPmdldF9yZWd1bGFyX3ByaWNlKCldOm51bGw7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-164542';
const GKEY='ps_s1739b';
const PHASES=["1"];
const OUT='analize/s1739_b.json';
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
