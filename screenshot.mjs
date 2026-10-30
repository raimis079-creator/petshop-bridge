process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODEyYiBhcGtyb3ZhIOKAlCBrYXMgdnlrc3RhIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgxMmInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEwMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODEyYicsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnbG9hZCc9PnN5c19nZXRsb2FkYXZnKCldOwogICRyWydwcm9jZXNhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELFVTRVIsVElNRSxTVEFURSxMRUZUKElORk8sMTYwKSBxIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLlBST0NFU1NMSVNUIFdIRVJFIENPTU1BTkQ8PidTbGVlcCcgT1JERVIgQlkgVElNRSBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAkclsnaW1wb3J0YWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLHRyaWdnZXJlZCxwcm9jZXNzaW5nLGV4ZWN1dGluZyxsYXN0X2FjdGl2aXR5LHF1ZXVlX2NodW5rX251bWJlcixjb3VudCBGUk9NIHskUH1wbXhpX2ltcG9ydHMiLEFSUkFZX0EpOwogICRkaXI9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzLyc7ICRyWydsb2dhaSddPVtdOyBmb3JlYWNoKChhcnJheSlnbG9iKCRkaXIuJyonKSBhcyAkZil7ICRyWydsb2dhaSddW2Jhc2VuYW1lKCRmKV09W2ZpbGVzaXplKCRmKSxkYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGYpKV07IH0KICAkYWw9bnVsbDsgZm9yZWFjaChbJ3BldHNob3AubHQubG9nJywnYWNjZXNzLmxvZycsJ3BldHNob3AubHQuYWNjZXNzLmxvZyddIGFzICRuKXsgaWYoZmlsZV9leGlzdHMoJGRpci4kbikpeyAkYWw9JGRpci4kbjsgYnJlYWs7IH0gfQogIGlmKCRhbCl7ICRmaD1mb3BlbigkYWwsJ3InKTsgJHN6PWZpbGVzaXplKCRhbCk7IGZzZWVrKCRmaCxtYXgoMCwkc3otMTUwMDAwMCkpOyAkdD1mcmVhZCgkZmgsMTUwMDAwMCk7IGZjbG9zZSgkZmgpOyAkTD1leHBsb2RlKCJcbiIsJHQpOyBhcnJheV9zaGlmdCgkTCk7CiAgICAkaXA9W107JHVhPVtdOyRtaW49W107JHN0PVtdOyR1cmw9W107ICRudW89dGltZSgpLTE4MDA7CiAgICBmb3JlYWNoKCRMIGFzICRsKXsgaWYoIXByZWdfbWF0Y2goJy9eKFxTKykgXFMrIFxTKyBcWyhbXlxdXSspXF0gIihcUyspIChcUyspW14iXSoiIChcZHszfSkgXFMrICJbXiJdKiIgIihbXiJdKikiLycsJGwsJG0pKSBjb250aW51ZTsgJHRzPXN0cnRvdGltZShzdHJfcmVwbGFjZSgnLycsJyAnLHByZWdfcmVwbGFjZSgnLzovJywnICcsJG1bMl0sMSkpKTsgaWYoJHRzPCRudW8pIGNvbnRpbnVlOwogICAgICAkaz1kYXRlKCdIOmknLCR0cyk7ICRtaW5bJGtdPSgkbWluWyRrXT8/MCkrMTsgJGlwWyRtWzFdXT0oJGlwWyRtWzFdXT8/MCkrMTsgJHU9bWJfc3Vic3RyKCRtWzZdLDAsNzApOyAkdWFbJHVdPSgkdWFbJHVdPz8wKSsxOyAkc3RbJG1bNV1dPSgkc3RbJG1bNV1dPz8wKSsxOyAkcD1wcmVnX3JlcGxhY2UoJy9cPy4qLycsJz/igKYnLG1iX3N1YnN0cigkbVs0XSwwLDYwKSk7ICR1cmxbJHBdPSgkdXJsWyRwXT8/MCkrMTsgfQogICAgYXJzb3J0KCRpcCk7YXJzb3J0KCR1YSk7YXJzb3J0KCR1cmwpOyBrc29ydCgkbWluKTsgJHJbJ2FjY2VzcyddPVsnZmFpbGFzJz0+YmFzZW5hbWUoJGFsKSwncGVyX21pbic9PiRtaW4sJ3N0YXR1c2FpJz0+JHN0LCdpcF90b3AnPT5hcnJheV9zbGljZSgkaXAsMCwxMix0cnVlKSwndWFfdG9wJz0+YXJyYXlfc2xpY2UoJHVhLDAsMTAsdHJ1ZSksJ3VybF90b3AnPT5hcnJheV9zbGljZSgkdXJsLDAsMTUsdHJ1ZSldOyB9CiAgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19oYj0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWydob21lJ109aXNfd3BfZXJyb3IoJHgpPyR4LT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-192805';
const GKEY='ps_s1812b';
const PHASES=["1"];
const OUT='analize/s1812b.json';
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
