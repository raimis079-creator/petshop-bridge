process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3bSByZWNvbiByZWFkLW9ubHk6IG1ldGFfaWQgdGFycGFpIChhciBfcHNfc291cmNlIGJ1dm8gaXN0cmludGEpLCBraXRpIHV6c2FreW1haSBiZSBfcHNfc291cmNlIG51byAwOS0yMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTdtJ10pKSByZXR1cm47CiAgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzE3bSddOwogIHRyeXsKICAgICRyWydyYW5nZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ubWV0YV9pZCwgbS5vcmRlcl9pdGVtX2lkLCBpLm9yZGVyX2lkLCBtLm1ldGFfa2V5IEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gTEVGVCBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIE9OIGkub3JkZXJfaXRlbV9pZD1tLm9yZGVyX2l0ZW1faWQgV0hFUkUgbS5tZXRhX2lkIEJFVFdFRU4gMjczNDAgQU5EIDI3NDMyIE9SREVSIEJZIG0ubWV0YV9pZCIsQVJSQVlfQSk7CiAgICAkaWRzPWFycmF5X21hcCgnaW50dmFsJyxhcnJheV9jb2x1bW4oJHJbJ3JhbmdlJ10sJ21ldGFfaWQnKSk7ICRnYXBzPVtdOyBmb3IoJGk9MjczNDA7JGk8PTI3NDMyOyRpKyspeyBpZighaW5fYXJyYXkoJGksJGlkcyx0cnVlKSkgJGdhcHNbXT0kaTsgfSAkclsndGFycGFpJ109JGdhcHM7CiAgICAvLyB1enNha3ltYWkgbnVvIDA5LTIwIHN1IGFwbW9rZWppbXUsIGt1cml1IHByZWtpdSBlaWx1dGVzZSBuZXJhIF9wc19zb3VyY2UKICAgICRyWydiZV9zb3VyY2UnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLCBvLnN0YXR1cywgby5kYXRlX2NyZWF0ZWRfZ210LCBDT1VOVChpLm9yZGVyX2l0ZW1faWQpIGVpbCwgU1VNKEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBtIFdIRVJFIG0ub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIG0ubWV0YV9rZXk9J19wc19zb3VyY2UnKSkgc3Vfc3JjLCBTVU0oRVhJU1RTKFNFTEVDVCAxIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gV0hFUkUgbS5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgbS5tZXRhX2tleT0nX3BzX2tlbGlhcycpKSBzdV9rZWxpYXMgRlJPTSB7JFB9d2Nfb3JkZXJzIG8gSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBPTiBpLm9yZGVyX2lkPW8uaWQgQU5EIGkub3JkZXJfaXRlbV90eXBlPSdsaW5lX2l0ZW0nIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMTknIEFORCBvLnN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSBHUk9VUCBCWSBvLmlkIEhBVklORyBzdV9zcmM8ZWlsIE9SREVSIEJZIG8uaWQiLEFSUkFZX0EpOwogICAgJHJbJ3Zpc29fbnVvXzA5MTknXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMTknIEFORCBzdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykiKTsKICAgICRyWydocG9zJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfY3VzdG9tX29yZGVyc190YWJsZV9lbmFibGVkJyk7ICRyWydzeW5jJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfY3VzdG9tX29yZGVyc190YWJsZV9kYXRhX3N5bmNfZW5hYmxlZCcpOwogICAgJHJbJ28zNjI5NyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsc3RhdHVzLGRhdGVfY3JlYXRlZF9nbXQsdHlwZSBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgaWQ9MzYyOTciLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-073313';
const GKEY='ps_s1717m';
const PHASES=["1"];
const OUT='analize/s1717_m.json';
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
