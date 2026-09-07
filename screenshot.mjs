process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdnQ0IOKAlCDEr2RpZWd0aSBtdS1wbHVnaW5zL3BldHNob3AtdmVydGltYWkucGhwIChiNjQrbWQ1KSArIGZ1bmtjaW5pcyB0ZXN0YXM6IGZhaWxlZC9jYW5jZWxsZWQgbGFpxaFrYWkgTFQuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM1dnQ0J10pKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTYzNSB2dDQnKTsKICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkYjY0PSdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lIWmxjblJwYldGcENpQXFJRVJsYzJOeWFYQjBhVzl1T2lCVWNzV3JhM04wWVcxcElGZHZiME52YlcxbGNtTmxJR3gwWDB4VUlIWmxjblJwYldGcElDaHNZV25Gb1d2RnN5QjBaV3R6ZEdGcEtTNGdWR2xySUdWcGJIVjB4SmR6TENCcmRYSnB4Yk1nYnNTWGNtRWdiMlpwWTJsaGJHbGhiV1VnTG0xdkxnb2dLaUJXWlhKemFXOXVPaUF4TGpBS0lDb3ZDbWxtSUNnZ0lTQmtaV1pwYm1Wa0tDQW5RVUpUVUVGVVNDY2dLU0FwSUdWNGFYUTdDbUZrWkY5bWFXeDBaWElvSUNkblpYUjBaWGgwWDNkdmIyTnZiVzFsY21ObEp5d2dablZ1WTNScGIyNG9JQ1IwY21GdWMyeGhkR1ZrTENBa2RHVjRkQ3dnSkdSdmJXRnBiaUFwSUhzS0NYTjBZWFJwWXlBa2JXRndJRDBnWVhKeVlYa29DZ2tKSjFWdVptOXlkSFZ1WVhSbGJIa3NJSFJvWlNCd1lYbHRaVzUwSUdadmNpQnZjbVJsY2lBakpURWtjeUJtY205dElDVXlKSE1nYUdGeklHWmhhV3hsWkM0Z1ZHaGxJRzl5WkdWeUlIZGhjeUJoY3lCbWIyeHNiM2R6T2ljZ1BUNGdKMFJsYW1Fc0lIWEZ2bk5oYTNsdGJ5QWpKVEVrY3lBb2NHbHlhOFNYYW1GeklDVXlKSE1wSUdGd2JXOXJ4SmRxYVcxaGN5QnVaWEJoZG5scmJ5NGdWY1crYzJGcmVXMXZJR2x1Wm05eWJXRmphV3BoT2ljc0Nna0pJbGRsWEhoRk1seDRPREJjZURrNWNtVWdaMlYwZEdsdVp5QnBiaUIwYjNWamFDQjBieUJzWlhRZ2VXOTFJR3R1YjNjZ2RHaGhkQ0J2Y21SbGNpQWpKVEZjSkhNZ1puSnZiU0FsTWx3a2N5Qm9ZWE1nWW1WbGJpQmpZVzVqWld4c1pXUXVJaUE5UGlBblVISmhibVhGb1dGdFpTd2dhMkZrSUhYRnZuTmhhM2x0WVhNZ0l5VXhKSE1nS0hCcGNtdkVsMnBoY3lBbE1pUnpLU0JpZFhadklHRjB4YUZoZFd0MFlYTXVKeXdLQ1FrblQzSmtaWElnUm1GcGJHVmtPaUFsY3ljZ1BUNGdKMVhGdm5OaGEzbHRieUJoY0cxdmE4U1hkR2tnYm1Wd1lYWjVhMjg2SUNWekp5d0tDUWtuVG1WM0lFOXlaR1Z5T2lBakpYTW5JRDArSUNkT1lYVnFZWE1nZGNXK2MyRnJlVzFoY3pvZ0l5VnpKeXdLQ1NrN0NnbHBaaUFvSUNSMGNtRnVjMnhoZEdWa0lEMDlQU0FrZEdWNGRDQW1KaUJwYzNObGRDZ2dKRzFoY0ZzZ0pIUmxlSFFnWFNBcElDa2djbVYwZFhKdUlDUnRZWEJiSUNSMFpYaDBJRjA3Q2dseVpYUjFjbTRnSkhSeVlXNXpiR0YwWldRN0NuMHNJREV3TENBeklDazdDZz09JzsKICAkZnA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC12ZXJ0aW1haS5waHAnOwogIGZpbGVfcHV0X2NvbnRlbnRzKCRmcCxiYXNlNjRfZGVjb2RlKCRiNjQpKTsKICAkb1snbWQ1J109bWQ1X2ZpbGUoJGZwKTsgJG9bJ2R5ZGlzJ109ZmlsZXNpemUoJGZwKTsKICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAkb1sncGluZyddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAkb1snd2FybmluZyddPXN1YnN0cl9jb3VudCgoc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSwnV2FybmluZycpOwogIC8vIGZ1bmtjaW5pczogbGFpa2luYXMgdcW+c2FreW1hcyDihpIgZmFpbGVkIOKGkiBjYW5jZWxsZWQg4oaSIGxhacWha8WzIHRla3N0YWkKICAkeD13Y19jcmVhdGVfb3JkZXIoYXJyYXkoJ2N1c3RvbWVyX2lkJz0+MCkpOyAkeC0+YWRkX3Byb2R1Y3Qod2NfZ2V0X3Byb2R1Y3QoMzUzNTcpLDEpOwogICR4LT5zZXRfYmlsbGluZ19maXJzdF9uYW1lKCdWVCcpOyAkeC0+c2V0X2JpbGxpbmdfbGFzdF9uYW1lKCdUZXN0YXMnKTsgJHgtPnNldF9iaWxsaW5nX2VtYWlsKCd2dEBkZXYuYXZlc2EubHQnKTsgJHgtPmNhbGN1bGF0ZV90b3RhbHMoKTsgJHgtPnNhdmUoKTsKICAkaWQ9JHgtPmdldF9pZCgpOyAkb1snaWQnXT0kaWQ7CiAgJHgtPnVwZGF0ZV9zdGF0dXMoJ2ZhaWxlZCcsJ3ZlcnRpbXUgdGVzdGFzJyk7CiAgJHgtPnVwZGF0ZV9zdGF0dXMoJ2NhbmNlbGxlZCcsJ3ZlcnRpbXUgdGVzdGFzJyk7CiAgd3BfY2FjaGVfZmx1c2goKTsKICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7CiAgZm9yZWFjaChhcnJheV9zbGljZSgkeiwtNCkgYXMgJGUpeyAkdD13cF9zdHJpcF9hbGxfdGFncygoc3RyaW5nKSgkZVsndGVrc3RhcyddPz8kZVsnYm9keSddPz8nJykpOyAkb1snbGFpc2thaSddW109YXJyYXkoJ3RlbWEnPT5tYl9zdWJzdHIoJGVbJ3RlbWEnXT8/JycsMCw3MCksJ2x0Jz0+KHN0cnBvcygkdCwnRGVqYSwgdcW+c2FreW1vJykhPT1mYWxzZXx8c3RycG9zKCR0LCdQcmFuZcWhYW1lLCBrYWQnKSE9PWZhbHNlKT8nTFQg4pyTJzooKHN0cnBvcygkdCwnVW5mb3J0dW5hdGVseScpIT09ZmFsc2V8fHN0cnBvcygkdCwnZ2V0dGluZyBpbiB0b3VjaCcpIT09ZmFsc2UpPydFTiAhJzon4oCUJyksJ2lzdHJhdWthJz0+bWJfc3Vic3RyKCR0LHN0cnBvcygkdCwnVcW+c2FreW0nKSE9PWZhbHNlP21heCgwLHN0cnBvcygkdCwnIycuJGlkKS0xMjApOjAsMTUwKSk7IH0KICB3cF9kZWxldGVfcG9zdCgkaWQsdHJ1ZSk7CiAgJG9bJ2lzdHJpbnRhcyddPXdjX2dldF9vcmRlcigkaWQpPzA6MTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-084135';
const GKEY='ps_s1635vt4';
const PHASES=["V4"];
const OUT='analize/s1635_vt4.json';
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
