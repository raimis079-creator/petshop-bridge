process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODM2dCBsZXRlbml1IHRlcGFsbyBwYWllc2thIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgzNnQnXSkpIHJldHVybjsKICBAc2V0X3RpbWVfbGltaXQoMjUwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MzZ0J107CiAgJHJ4PScodGVwYWx8YmFsemFtfHZhxaFrfHZhc2t8bGV0ZW58cGF3fHBmb3RlfG11c2hlcnx3YXh8a3JlbWFzfGNyZWFtfGJhbG0pJzsKICB0cnl7CiAgICAkclsnd2MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklEIGlkLCBwLnBvc3Rfc3RhdHVzIHN0LCBMRUZUKHAucG9zdF90aXRsZSw5MCkgbiwgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3N0b2NrX3N0YXR1cycpIHNzLCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcHJpY2UnKSBrYWluYSBGUk9NIHskd3BkYi0+cG9zdHN9IHAgV0hFUkUgcC5wb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwLnBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJywncGVuZGluZycpIEFORCBwLnBvc3RfdGl0bGUgUkVHRVhQICckcngnIE9SREVSIEJZIHAucG9zdF9zdGF0dXMsIHAucG9zdF90aXRsZSBMSU1JVCAzMDAiLEFSUkFZX0EpOwogICAgJHVwPXdwX3VwbG9hZF9kaXIoKVsnYmFzZWRpciddOyAkclsndmYnXT1bXTsKICAgICRmPSR1cC4nL3BldHNob3AtdmYtY2FjaGUueG1sJzsKICAgIGlmKGlzX2ZpbGUoJGYpKXsgJHg9QHNpbXBsZXhtbF9sb2FkX2ZpbGUoJGYpOyBpZigkeCl7IGZvcmVhY2goJHgtPnhwYXRoKCcvL3JvdycpIGFzICRyb3cpeyAkbj0oc3RyaW5nKSRyb3ctPnByb2R1Y3RfbmFtZTsgaWYocHJlZ19tYXRjaCgnLycuJHJ4LicvaXUnLCRuKSkgJHJbJ3ZmJ11bXT1bKHN0cmluZykkcm93LT5za3VfaWQsbWJfc3Vic3RyKCRuLDAsOTApLChzdHJpbmcpJHJvdy0+cXR5LChzdHJpbmcpJHJvdy0+YmFzZV9wcmljZSwoc3RyaW5nKSRyb3ctPmJhcmNvZGVdOyB9IH0gJHJbJ3ZmX2ZhaWxhcyddPWRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkZikpOyB9CiAgICAkclsneG1sX2ZhaWxhaSddPVtdOyBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoJHVwLicvKi54bWwnKT86W10sZ2xvYigkdXAuJy8qLyoueG1sJyk/OltdKSBhcyAkZngpICRyWyd4bWxfZmFpbGFpJ11bXT1bc3RyX3JlcGxhY2UoJHVwLCcnLCRmeCkscm91bmQoZmlsZXNpemUoJGZ4KS8xMDI0KS4nS0InXTsKICAgIC8vIGtpdGkgWE1MIChaQiBpciBwYW4uKSAtIHBhaWVza2EgdGVrc3RlCiAgICBmb3JlYWNoKCRyWyd4bWxfZmFpbGFpJ10gYXMgJHhmKXsgJGZwPSR1cC4keGZbMF07IGlmKHN0cnBvcygkZnAsJ3ZmLWNhY2hlJykhPT1mYWxzZSB8fCBmaWxlc2l6ZSgkZnApPjYwMDAwMDAwKSBjb250aW51ZTsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGZwKTsgaWYocHJlZ19tYXRjaF9hbGwoJy88KD86bmFtZXx0aXRsZXxwcm9kdWN0X25hbWV8cGF2YWRpbmltYXMpW14+XSo+KD86PCFcW0NEQVRBXFspPyhbXjxdezAsMjAwfSkvaXUnLCRzLCRtKSl7ICRoaXQ9W107IGZvcmVhY2goJG1bMV0gYXMgJG5tKXsgaWYocHJlZ19tYXRjaCgnLycuJHJ4LicvaXUnLCRubSkpICRoaXRbXT1tYl9zdWJzdHIoJG5tLDAsMTAwKTsgfSBpZigkaGl0KSAkclsneG1sX2hpdHMnXVskeGZbMF1dPWFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGhpdCkpLDAsNjApOyB9IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-075047';
const GKEY='ps_s1836t';
const PHASES=["1"];
const OUT='analize/s1836t.json';
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
