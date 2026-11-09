process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQwZCByeXRvIHR5cmltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQwZCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDBkJ107CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzPSd3Yy1wcm9jZXNzaW5nJyBPUkRFUiBCWSBpZCIpOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsgJG5uPVtdOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjZdKSBhcyAkbil7ICRubltdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDExMCk7IH0KICAgICRpdD1bXTsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJHgpeyAkcD0keC0+Z2V0X3Byb2R1Y3QoKTsgJGl0W109bWJfc3Vic3RyKCR4LT5nZXRfbmFtZSgpLDAsNDApLicgeCcuJHgtPmdldF9xdWFudGl0eSgpLicgc3Q9Jy4oJHA/JHAtPmdldF9zdG9ja19xdWFudGl0eSgpOictJykuJyAnLigkcD8kcC0+Z2V0X21ldGEoJ19wc190aWVrZWphcycpOicnKTsgfQogICAgJG1ldGE9W107IGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7ICRrPSRtLT5rZXk7IGlmKHByZWdfbWF0Y2goJy92ZW5pcGFrfHRyYWNraW5nfHNpdW50fF9wc198ZHJvcHNoaXB8bGF1a3RpfHNhbmRlbC9pJywkaykpICRtZXRhWyRrXT1pc19zY2FsYXIoJG0tPnZhbHVlKT9tYl9zdWJzdHIoKHN0cmluZykkbS0+dmFsdWUsMCw2MCk6J1thcnJdJzsgfQogICAgJHJbJ28nXVskby0+Z2V0X29yZGVyX251bWJlcigpXT1bJ2lkJz0+JGlkLCdzdWt1cnRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdzaGlwJz0+JG8tPmdldF9zaGlwcGluZ19tZXRob2QoKSwnbm90ZXMnPT4kbm4sJ2l0ZW1zJz0+JGl0LCdtZXRhJz0+JG1ldGEsJ2N1c3Rfbm90ZSc9Pm1iX3N1YnN0cigoc3RyaW5nKSRvLT5nZXRfY3VzdG9tZXJfbm90ZSgpLDAsMTIwKV07IH0KICAkclsndmVuaXBha19ub3Rlc183ZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoY29tbWVudF9kYXRlKSBkLCBDT1VOVChESVNUSU5DVCBjb21tZW50X3Bvc3RfSUQpIG4gRlJPTSB7JFB9Y29tbWVudHMgV0hFUkUgY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBBTkQgY29tbWVudF9jb250ZW50IExJS0UgJ1ZlbmlwYWsgcmVnaXN0cmFjaWphJScgQU5EIGNvbW1lbnRfZGF0ZT49Tk9XKCktSU5URVJWQUwgMTAgREFZIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ2ltcDJfaGlzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRpbWVfcnVuLCBMRUZUKHN1bW1hcnksMTIwKSBzLCBkYXRlIEZST00geyRQfXBteGlfaGlzdG9yeSBXSEVSRSBpbXBvcnRfaWQ9MiBBTkQgZGF0ZT49Tk9XKCktSU5URVJWQUwgNCBEQVkgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgJHJbJ2ltcDInXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JFB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTIiLEFSUkFZX0EpOyBpZihpc19hcnJheSgkclsnaW1wMiddKSl7IGZvcmVhY2goJHJbJ2ltcDInXSBhcyAkaz0+JHYpeyBpZihpc19zdHJpbmcoJHYpJiZzdHJsZW4oJHYpPjgwKSAkclsnaW1wMiddWyRrXT0nWycuc3RybGVuKCR2KS4nQl0nOyB9IH0KICAkclsnd3BhaV9jcm9uX29wdHMnXT1bXTsgCiAgJGxnPWdldF9vcHRpb24oJ3BldHNob3BfcHJhZ21hX2xvZycpOyAkclsncHJhZ21hX2xvZyddPWlzX2FycmF5KCRsZyk/YXJyYXlfc2xpY2UoJGxnLC02KTokbGc7CiAgJHBhPWdldF9vcHRpb24oJ3BldHNob3BfcHJhZ21hX3Bhc2tfYXRhc2thaXRhJyk7ICRyWydwcmFnbWFfcGFzayddPWlzX2FycmF5KCRwYSk/YXJyYXlfbWFwKGZuKCR4KT0+aXNfc2NhbGFyKCR4KT9tYl9zdWJzdHIoKHN0cmluZykkeCwwLDQwMCk6J1thcnJdJywkcGEpOihpc19zdHJpbmcoJHBhKT9tYl9zdWJzdHIoJHBhLDAsNjAwKTokcGEpOwogICRyWydwcmFnbWFfaXNzaXVzdGEnXT1nZXRfb3B0aW9uKCdwZXRzaG9wX3ByYWdtYV9pc3NpdXN0YScpOwogIGZvcmVhY2goWydwZXRzaG9wX3ByYWdtYV9kcnlfY2hlY2snLCdwZXRzaG9wX3ByYWdtYV9tb250aGx5X2V4cG9ydCcsJ3BldHNob3BfcHJhZ21hX3JldHJ5J10gYXMgJGgpeyAkdD13cF9uZXh0X3NjaGVkdWxlZCgkaCk7ICRyWydwcmFnbWFfY3JvbiddWyRoXT0kdD93cF9kYXRlKCdZLW0tZCBIOmknLCR0KTpudWxsOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-075150';
const GKEY='ps_s1840d';
const PHASES=["1"];
const OUT='analize/s1840_d.json';
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
