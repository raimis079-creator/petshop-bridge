process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTUgYiDigJQgIzExMjAga29udGVrc3RhczogcGFza3lyb3MgMzQxMiB1xb5zYWt5bWFpLCDFoWlhbmRpZW5vcyB1xb5zYWt5bWFpIGnFoSB0byBwYXRpZXMgSVAvZWwuIHBhxaF0bywga2l0aSDFoWlhbmRpZW5vcyB1xb5zLiBzdSAxODU4NywgUGF5c2VyYSDFvnVybmFsYXMsIGxpa3XEjWlvIGlzdG9yaWphLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjk1YiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3Bhc2t5cmFfMzQxMiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyx0b3RhbF9hbW91bnQsZGF0ZV9jcmVhdGVkX2dtdCxiaWxsaW5nX2VtYWlsLHBheW1lbnRfbWV0aG9kIEZST00geyRwfXdjX29yZGVycyBXSEVSRSBjdXN0b21lcl9pZD0zNDEyIE9SREVSIEJZIGlkIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgJG9bJ3VzZXJfMzQxMiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgSUQsdXNlcl9lbWFpbCx1c2VyX3JlZ2lzdGVyZWQsZGlzcGxheV9uYW1lIEZST00geyRwfXVzZXJzIFdIRVJFIElEPTM0MTIiLEFSUkFZX0EpOwogICRvWydzaWFuZGllbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsby5zdGF0dXMsby50b3RhbF9hbW91bnQsby5kYXRlX2NyZWF0ZWRfZ210LG8uYmlsbGluZ19lbWFpbCxvLmlwX2FkZHJlc3Msby5wYXltZW50X21ldGhvZCwoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgbSBXSEVSRSBtLm9yZGVyX2lkPW8uaWQgQU5EIG0ubWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInKSBuciBGUk9NIHskcH13Y19vcmRlcnMgbyBXSEVSRSBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTE5IDIxOjAwOjAwJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAkb1snc3VfMTg1ODdfc2F2YWl0ZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLG8uc3RhdHVzLG8uZGF0ZV9jcmVhdGVkX2dtdCBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBKT0lOIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBvaW0gT04gb2ltLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgb2ltLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgQU5EIG9pbS5tZXRhX3ZhbHVlPScxODU4NycgSk9JTiB7JHB9d2Nfb3JkZXJzIG8gT04gby5pZD1vaS5vcmRlcl9pZCBXSEVSRSBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTEzJyBPUkRFUiBCWSBvaS5vcmRlcl9pZCBERVNDIixBUlJBWV9BKTsKICAkb1sncHJla2VfMTg1ODcnXT1hcnJheSgnc3RvY2snPT5nZXRfcG9zdF9tZXRhKDE4NTg3LCdfc3RvY2snLHRydWUpLCd2Zl9xdHknPT5nZXRfcG9zdF9tZXRhKDE4NTg3LCdfdmZfcXR5Jyx0cnVlKSwnb3duJz0+Z2V0X3Bvc3RfbWV0YSgxODU4NywnX293bl9zdG9ja19xdHknLHRydWUpLCdtYW5hZ2UnPT5nZXRfcG9zdF9tZXRhKDE4NTg3LCdfbWFuYWdlX3N0b2NrJyx0cnVlKSwnc3RhdHVzJz0+Z2V0X3Bvc3RfbWV0YSgxODU4NywnX3N0b2NrX3N0YXR1cycsdHJ1ZSkpOwogICRvWydwYXlzZXJhX2xvZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfc2FyZ2FzX2tsYWlkb3MgV0hFUkUgbGFpa2FzPj0nMjAyNi0wOS0yMCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAkb1sncGFzdGFib3NfMzYwOTRfdmlzb3MnXT1jb3VudCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+MzYwOTQsJ2xpbWl0Jz0+NTApKSk7CiAgJG9bJ2RhcmJhbGF1a2lvX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsMTIwKSB2IEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPTM2MDk0IEFORCBtZXRhX2tleSBMSUtFICdfcHNfJScgT1JERVIgQlkgbWV0YV9rZXkiLEFSUkFZX0EpOwogICRvWydkYl9lcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-073738';
const GKEY='ps_s1695b';
const PHASES=["1"];
const OUT='analize/s1695_b.json';
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
