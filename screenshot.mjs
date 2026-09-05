process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHIxMCAocmVjb24sIHRpayBza2FpdHltYXMpIOKAlCDigJ5TxIVza2FpdGHigJwgbGFuZ2FzOiBqdW9zdG9zIG5hdiBlbGVtZW50YWkgKHBldHNob3AtanVvc3RhLnBocCksIGRva3VtZW50xbMgbWV0YSByYWt0YWkgdGVtb2plIChgX3BldHNob3BfKmApLCBqxbMga2lla2lhaS9wYXZ5emTFvmlhaSB3Y19vcmRlcnNfbWV0YSwgSUFQViBQREYga2VsaWFzL3BhdmFkaW5pbWFzLCB3Y2RuL2ludm9pY2UgZmFpbMWzIHBhdmFkaW5pbWFpLCByZWZ1bmQnxbMgS1IgbWV0YSwgcGV0c2hvcC1wcmFnbWEgKGthcyBla3Nwb3J0dW9qYSksIHNreWRlbGlvIOKAnlPEhXNrYWl0YeKAnCBkdW9tZW7FsyB2aWV0YSAocHNfZGxfc2t5ZGVsaXMpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19yMTAnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYxNyByMTAnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgxMjApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0cywkY3R4PTEsJG1heD0zMCwkdz00MjApeyAkcj1hcnJheSgpOyBpZighZmlsZV9leGlzdHMoJGZpbGUpKSByZXR1cm4gJ07EllJBICcuJGZpbGU7ICRsPWZpbGUoJGZpbGUpOyBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyBmb3JlYWNoKChhcnJheSkkcGF0cyBhcyAkcHQpeyBpZihwcmVnX21hdGNoKCRwdCwkbG4pKXsgJHJbXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbShpbXBsb2RlKCcg4o+OICcsYXJyYXlfbWFwKCd0cmltJyxhcnJheV9zbGljZSgkbCxtYXgoMCwkaS0kY3R4KSwkY3R4KjIrMSkpKSksMCwkdyk7IGJyZWFrOyB9IH0gaWYoY291bnQoJHIpPj0kbWF4KSBicmVhazsgfSByZXR1cm4gJHI7IH07CiAgJG11PVdQTVVfUExVR0lOX0RJUjsgJHRoPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOwogICRvWydqdW9zdGFfbmF2J109JGdyZXAoJG11LicvcGV0c2hvcC1qdW9zdGEucGhwJyxhcnJheSgnL8W9dXJuYWxhc3xSaW5raW5pYWl8QWtjaWpvc3xMYWnFoWthaXxSeXRpbsSXIGVpZ2F8R2F2aW1hc3xUaWVraW1hcy91JywnL2Z1bmN0aW9uIG5hdnxmdW5jdGlvbiBqdW9zdGF8ZnVuY3Rpb24gaHRtbHxhZGRfYWN0aW9uXCgvJyksMSwzMCw1MDApOwogICRvWyd0ZW1hX21ldGEnXT0kZ3JlcCgkdGguJy9mdW5jdGlvbnMucGhwJyxhcnJheSgnL19wZXRzaG9wX1thLXpfXSsvJyksMCw2MCwzMDApOwogICRvWydtZXRhX2tpZWtpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSxDT1VOVCgqKSBuIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJ19wZXRzaG9wXyUnIEdST1VQIEJZIG1ldGFfa2V5IixBUlJBWV9BKTsKICAkb1snbWV0YV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcmRlcl9pZCxtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsMTYwKSB2IEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5IElOICgnX3BldHNob3Bfb3JkZXJfcGRmJywnX3BldHNob3BfaWFwdl9udW1iZXInLCdfcGV0c2hvcF9jb21wbGV0ZWRfcGRmJywnX3BldHNob3BfYXZwbl9udW1iZXInLCdfcGV0c2hvcF9pbnZvaWNlX2RvY3VtZW50X3R5cGUnLCdfcGV0c2hvcF9rcmF2cG5fbnVtYmVyJywnX3BldHNob3Bfa3JhdnBuX3BkZicsJ19wZXRzaG9wX2tyYXZwbl9kYXRlJywnX3BldHNob3BfYXZwbl9kYXRlJywnX3BldHNob3BfaWFwdl9kYXRlJykgT1JERVIgQlkgb3JkZXJfaWQgREVTQyBMSU1JVCAyNCIsQVJSQVlfQSk7CiAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGludj1nbG9iKCR1cFsnYmFzZWRpciddLicvd2Nkbi9pbnZvaWNlLyoucGRmJyk7ICRvWydpbnZvaWNlX2ZhaWxhaSddPWFycmF5KCduJz0+Y291bnQoJGludiksJ3B2eic9PmFycmF5X21hcCgnYmFzZW5hbWUnLGFycmF5X3NsaWNlKCRpbnYsLTgpKSwnaWFwdic9PmNvdW50KGFycmF5X2ZpbHRlcigkaW52LGZ1bmN0aW9uKCRmKXsgcmV0dXJuIHN0cmlwb3MoYmFzZW5hbWUoJGYpLCdJQVBWJykhPT1mYWxzZXx8c3RyaXBvcyhiYXNlbmFtZSgkZiksJ3NhbmtzdGluJykhPT1mYWxzZTsgfSkpKTsKICAkb1sncmVmdW5kc19rciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsby5wYXJlbnRfb3JkZXJfaWQsby50b3RhbF9hbW91bnQsby5kYXRlX2NyZWF0ZWRfZ210LG0ubWV0YV92YWx1ZSBrciBGUk9NIHskcH13Y19vcmRlcnMgbyBKT0lOIHskcH13Y19vcmRlcnNfbWV0YSBtIE9OIG0ub3JkZXJfaWQ9by5pZCBBTkQgbS5tZXRhX2tleT0nX3BldHNob3Bfa3JhdnBuX251bWJlcicgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyX3JlZnVuZCciLEFSUkFZX0EpOwogICRvWydwcmFnbWEnXT1hcnJheSgpOyBmb3JlYWNoKGdsb2IoJG11LicvcGV0c2hvcC1wcmFnbWEqLnBocCcpIGFzICRmKXsgJG9bJ3ByYWdtYSddW2Jhc2VuYW1lKCRmKV09JGdyZXAoJGYsYXJyYXkoJy9eXHMqXCpccy8nLCcvZnVuY3Rpb24gLycsJy9fcGV0c2hvcF98QVZQTnxrcmVkaXR8cmVmdW5kL2knKSwwLDI1LDMwMCk7IH0KICAkb1snZGxfc2Fza2FpdGEnXT0kZ3JlcCgkbXUuJy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCcsYXJyYXkoIi8nU8SFc2thaXRhJ3xTxIVza2FpdGE8XFwvYnV0dG9uPnxza1Nhc2t8J3Nhc2thaXRhJy91IiksMCwxMCwzMDApOwogICRvWydza3lkZWxpc19mbiddPSRncmVwKCRtdS4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyxhcnJheSgnL2Z1bmN0aW9uIHNreWRlbGlzXCh8ZnVuY3Rpb24gc2t5ZGVsaW9fZHVvbWVueXN8cHNfZGxfc2t5ZGVsaXMvJyksMCw4LDMwMCk7CiAgJG9bJ29yZGVyc19kb2NzJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBvcmRlcl9pZCkgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXkgSU4gKCdfcGV0c2hvcF9hdnBuX251bWJlcicsJ19wZXRzaG9wX2lhcHZfbnVtYmVyJykiKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-173033';
const GKEY='ps_r10';
const PHASES=["GO"];
const OUT='analize/s1617_r10.json';
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
