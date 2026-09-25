process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3cyByZWNvbiByZWFkLW9ubHk6IEZsYXRzb21lIGthdGVnb3Jpam9zIGFudHJhc3RlcyAoSDEpIHNhbHRpbmlzLCB0aGVtZSBtb2RzLCBDb2RlIFNuaXBwZXRzIHN1IHBhZ2UgdGl0bGUgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE3cyddKSkgcmV0dXJuOwogIEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTcxN3MnXTsKICB0cnl7CiAgICAkdGQ9Z2V0X3RlbXBsYXRlX2RpcmVjdG9yeSgpOyAkZm91bmQ9W107CiAgICBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoJHRkLicvaW5jL3dvb2NvbW1lcmNlLyoucGhwJyksZ2xvYigkdGQuJy9pbmMvd29vY29tbWVyY2Uvc3RydWN0dXJlLyoucGhwJyksZ2xvYigkdGQuJy9pbmMvc3RydWN0dXJlLyoucGhwJyksZ2xvYigkdGQuJy9pbmMvKi5waHAnKSkgYXMgJGcpeyAkcz1maWxlX2dldF9jb250ZW50cygkZyk7IGlmKHN0cnBvcygkcywnZnVuY3Rpb24gZmxhdHNvbWVfY2F0ZWdvcnlfdGl0bGUnKSE9PWZhbHNlKXsgJGZvdW5kW109c3RyX3JlcGxhY2UoJHRkLCcnLCRnKTsgJGk9c3RycG9zKCRzLCdmdW5jdGlvbiBmbGF0c29tZV9jYXRlZ29yeV90aXRsZScpOyAkclsnZm4nXT1zdWJzdHIoJHMsbWF4KDAsJGktMjAwKSwyNjAwKTsgfQogICAgICBpZihwcmVnX21hdGNoX2FsbCgiI1teXG5dezAsMTAwfShzaG9wLXBhZ2UtdGl0bGV8Y2F0ZWdvcnlfdGl0bGV8d29vY29tbWVyY2Vfc2hvd19wYWdlX3RpdGxlfGNhdGVnb3J5X3BhZ2VfdGl0bGV8cHJvZHVjdF9hcmNoaXZlX3RpdGxlKVteXG5dezAsMTQwfSMiLCRzLCRtbSkpICRyWydncmVwJ11bc3RyX3JlcGxhY2UoJHRkLCcnLCRnKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCd0cmltJyxhcnJheV91bmlxdWUoJG1tWzBdKSksMCwxMCk7IH0KICAgICRyWydmb3VuZCddPSRmb3VuZDsKICAgICRtb2RzPWdldF90aGVtZV9tb2RzKCk7ICRyWydtb2RzX2tleXMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X2tleXMoJG1vZHMpLGZ1bmN0aW9uKCRrKXtyZXR1cm4gcHJlZ19tYXRjaCgnI2NhdHxzaG9wfHRpdGxlfGFyY2hpdmV8cHJvZHVjdF9wYWdlfGJyZWFkY3J1bWIjJywoc3RyaW5nKSRrKTt9KSk7IGZvcmVhY2goJHJbJ21vZHNfa2V5cyddIGFzICRrKXsgJHY9JG1vZHNbJGtdOyAkclsnbW9kcyddWyRrXT1pc19hcnJheSgkdik/J1thcnJdJzptYl9zdWJzdHIoKHN0cmluZykkdiwwLDYwKTsgfQogICAgJHJbJ3NuaXBwZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIG5hbWUsIGFjdGl2ZSwgc2NvcGUsIENIQVJfTEVOR1RIKGNvZGUpIGxlbiBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBuYW1lLCBjb2RlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIixBUlJBWV9BKSBhcyAkc24peyBpZihwcmVnX21hdGNoX2FsbCgiI1teXG5dezAsMTAwfShwYWdlX3RpdGxlfHNob3AtcGFnZS10aXRsZXw8aDF8d29vY29tbWVyY2Vfc2hvd19wYWdlX3RpdGxlfGZsYXRzb21lX2NhdGVnb3J5X3RpdGxlfGFyY2hpdmVfdGl0bGUpW15cbl17MCwxNDB9I2kiLCRzblsnY29kZSddLCRtbSkpICRyWydzbmlwcGV0X2dyZXAnXVskc25bJ2lkJ10uJyAnLiRzblsnbmFtZSddXT1hcnJheV9zbGljZShhcnJheV9tYXAoJ3RyaW0nLGFycmF5X3VuaXF1ZSgkbW1bMF0pKSwwLDYpOyB9CiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsgZm9yZWFjaChbJ3dvb2NvbW1lcmNlX3Nob3dfcGFnZV90aXRsZScsJ2ZsYXRzb21lX2NhdGVnb3J5X3RpdGxlJywnd29vY29tbWVyY2VfYmVmb3JlX21haW5fY29udGVudCcsJ3dvb2NvbW1lcmNlX2FmdGVyX21haW5fY29udGVudCddIGFzICRoKXsgaWYoIWlzc2V0KCR3cF9maWx0ZXJbJGhdKSkgeyAkclsnaG9va3MnXVskaF09JyhuZXJhKSc7IGNvbnRpbnVlOyB9IGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHJpbz0+JGNicyl7IGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyAkbm09aXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTooaXNfc3RyaW5nKCRmbik/JGZuOidjbG9zdXJlJyk7IGlmKCRmbiBpbnN0YW5jZW9mIENsb3N1cmUpeyAkcmY9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOyAkbm0uPScgQCcuYmFzZW5hbWUoJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTsgfSAkclsnaG9va3MnXVskaF1bXT0kcHJpby4nOiAnLiRubTsgfSB9IH0KICAgICRyWyd3Y19wYWdlcyddPVsnc2hvcCc9PndjX2dldF9wYWdlX2lkKCdzaG9wJyksJ3Bhc2t5cmEnPT53Y19nZXRfcGFnZV9pZCgnbXlhY2NvdW50JyksJ2tvbnRha3RhaSc9PmdldF9wYWdlX2J5X3BhdGgoJ2tvbnRha3RhaScpP2dldF9wYWdlX2J5X3BhdGgoJ2tvbnRha3RhaScpLT5JRDpudWxsLCdwYXNreXJhX3BhdGgnPT5nZXRfcGVybWFsaW5rKHdjX2dldF9wYWdlX2lkKCdteWFjY291bnQnKSldOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-084708';
const GKEY='ps_s1717s';
const PHASES=["1"];
const OUT='analize/s1717_s.json';
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
