process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHEg4oCUIFJFQ09OIHZpc3VtYSAzOiBhdMWhYXVrdMWzIFBheXNlcmEgdcW+c2FreW3FsyBlaWdhIChwYXN0YWJvcywgbGFpa2FzKSwgdG9wIDEyIHByZWtpxbMga2Fpbm9zIGthaW7FsyBwYWx5Z2luaW11aSwgMzcgbmVwYXNpZWtpYW1pIGJlc3RzZWxlcmlhaS4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4OXNxJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAkYz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgZGF0ZV9jcmVhdGVkX2dtdCBjLCBkYXRlX3VwZGF0ZWRfZ210IHUsIHRvdGFsX2Ftb3VudCB0LCBwYXltZW50X21ldGhvZCBwbSwgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPW8uaWQgQU5EIG1ldGFfa2V5PSdfd2Nfb3JkZXJfYXR0cmlidXRpb25fZGV2aWNlX3R5cGUnIExJTUlUIDEpIGRldiBGUk9NIHskcH13Y19vcmRlcnMgbyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzPSd3Yy1jYW5jZWxsZWQnIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNyAxOTowMCcgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogIGZvcmVhY2goJGMgYXMgJiRyKXsgJHJbJ21pbiddPXJvdW5kKChzdHJ0b3RpbWUoJHJbJ3UnXSktc3RydG90aW1lKCRyWydjJ10pKS82MCk7ICRuPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29tbWVudF9jb250ZW50IEZST00geyRwfWNvbW1lbnRzIFdIRVJFIGNvbW1lbnRfcG9zdF9JRD0lZCBBTkQgY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBPUkRFUiBCWSBjb21tZW50X0lEIiwkclsnaWQnXSkpOyAkclsnbm90ZXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJHgpLDAsNzApO30sJG4pOyB1bnNldCgkclsndSddKTsgfQogICRvWydhdHNhdWt0aSddPSRjOwogICRJPSJ7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIjsKICAkdG9wPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUucHJla2VfaWQgcGlkLCBDT1VOVChESVNUSU5DVCBlLnV6c2FreW1hc19pZCkgdSBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIGUgSk9JTiAkSSBmIE9OIGYudXpzYWt5bWFzX2lkPWUudXpzYWt5bWFzX2lkIFdIRVJFIGYuc3VrdXJ0YV9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMTIgTU9OVEgpIEFORCBlLnByZWtlX2lkPjAgR1JPVVAgQlkgZS5wcmVrZV9pZCBPUkRFUiBCWSBTVU0oZS5rYWluYV9jdCkgREVTQyBMSU1JVCA2MCIsQVJSQVlfQSk7CiAgJG9bJ3RvcF9rYWlub3MnXT1hcnJheSgpOyAkb1snbmVwYXNpZWtpYW1pJ109YXJyYXkoKTsKICBmb3JlYWNoKCR0b3AgYXMgJHIpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHJbJ3BpZCddKTsgaWYoISRwcil7Y29udGludWU7fSAkcm93PWFycmF5KCdpZCc9PiRyWydwaWQnXSwnbic9Pmh0bWxfZW50aXR5X2RlY29kZSgkcHItPmdldF9uYW1lKCkpLCdrYWluYSc9PiRwci0+Z2V0X3ByaWNlKCksJ2d0aW4nPT5nZXRfcG9zdF9tZXRhKCRyWydwaWQnXSwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpPzpnZXRfcG9zdF9tZXRhKCRyWydwaWQnXSwnX2VhbicsdHJ1ZSksJ3UxMic9PiRyWyd1J10pOwogICAgaWYoJHByLT5nZXRfc3RhdHVzKCk9PT0ncHVibGlzaCcgJiYgJHByLT5pc19pbl9zdG9jaygpKXsgaWYoY291bnQoJG9bJ3RvcF9rYWlub3MnXSk8MTIpJG9bJ3RvcF9rYWlub3MnXVtdPSRyb3c7IH0gZWxzZSB7ICRyb3dbJ3N0J109JHByLT5nZXRfc3RhdHVzKCkuJy8nLiRwci0+Z2V0X3N0b2NrX3N0YXR1cygpOyAkb1snbmVwYXNpZWtpYW1pJ11bXT0kcm93OyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-101529';
const GKEY='ps_s1689sq';
const PHASES=["GO"];
const OUT='analize/s1689s_q.json';
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
