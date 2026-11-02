process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2aCBIWVBNMTEgQUkgdXpzYWt5bWFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgxNmgnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MTZoJ107CiAgJHJbJ3NrdSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLHAucG9zdF90eXBlLHAucG9zdF9wYXJlbnQgRlJPTSB7JFB9cG9zdHMgcCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJ0hZUE0xMSUnIixBUlJBWV9BKTsKICAkclsndXpzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdS51enNha3ltYXNfaWQgaWQsdS5zdWt1cnRhX2F0LHUua2FuYWxhc19waXJtYXMsdS5rYW5hbGFzX3Bhc2t1dGluaXMsdS51dG1fc291cmNlLHUudXRtX21lZGl1bSx1LnV0bV9jYW1wYWlnbix1LnJlZmVyZXJfZG9tZW5hcyxMRUZUKHUubGFuZGluZ191cmwsMTIwKSBsYW5kLHUuaXJlbmdpbnlzLHUua2xpZW50YXNfbmF1amFzLFJPVU5EKHUudmlzb19jdC8xMDAsMikgZXVyLFJPVU5EKHUua29udHJpYnVjaWphX2N0LzEwMCwyKSBrb250cix1LmVpbHVjaXVfc2ssdS5taWVzdGFzIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgV0hFUkUgdS5zdWt1cnRhX2F0Pj0nMjAyNi0xMS0wMScgQU5EICh1LmthbmFsYXNfcGFza3V0aW5pcz0nYWknIE9SIHUua2FuYWxhc19waXJtYXM9J2FpJyBPUiB1LnJlZmVyZXJfZG9tZW5hcyBMSUtFICclY2hhdGdwdCUnIE9SIHUucmVmZXJlcl9kb21lbmFzIExJS0UgJyVvcGVuYWklJyBPUiB1LnJlZmVyZXJfZG9tZW5hcyBMSUtFICclcGVycGxleGl0eSUnIE9SIHUucmVmZXJlcl9kb21lbmFzIExJS0UgJyVnZW1pbmklJyBPUiB1LnJlZmVyZXJfZG9tZW5hcyBMSUtFICclY29waWxvdCUnKSBPUkRFUiBCWSB1LnN1a3VydGFfYXQgREVTQyIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkclsndXpzJ10gYXMgJiR1KXsgJHVbJ3ByZWtlcyddPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09OQ0FUKGkub3JkZXJfaXRlbV9uYW1lLCcgeCcscS5tZXRhX3ZhbHVlKSBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIExFRlQgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgcSBPTiBxLm9yZGVyX2l0ZW1faWQ9aS5vcmRlcl9pdGVtX2lkIEFORCBxLm1ldGFfa2V5PSdfcXR5JyBXSEVSRSBpLm9yZGVyX2lkPSVkIEFORCBpLm9yZGVyX2l0ZW1fdHlwZT0nbGluZV9pdGVtJyIsJHVbJ2lkJ10pKTsgJHVbJ25yJ109JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPSVkIEFORCBtZXRhX2tleSBJTignX29yZGVyX251bWJlcicsJ19wc19vcmRlcl9udW1iZXInKSBMSU1JVCAxIiwkdVsnaWQnXSkpOyB9CiAgJHJbJ3dlYl9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc193ZWJfaXZ5a2lhaSIpOwogIC8vIGtlbGlhczogbGFua3l0b2pvIGl2eWtpYWkgc3UgYWkga2FuYWx1IG51byAxMS0wMQogICRyWydrZWxpYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXBzX3dlYl9pdnlraWFpIFdIRVJFIGxhaWthcz49JzIwMjYtMTEtMDEnIEFORCAoa2FuYWxhcz0nYWknIE9SIHJlZmVyZXIgTElLRSAnJWNoYXRncHQlJyBPUiByZWZlcmVyIExJS0UgJyVvcGVuYWklJykgT1JERVIgQlkgbGFpa2FzIExJTUlUIDYwIixBUlJBWV9BKTsKICBmb3JlYWNoKCRyWydrZWxpYXMnXSBhcyAmJGspeyBmb3JlYWNoKCRrIGFzICRraz0+JHYpIGlmKGlzX3N0cmluZygkdikmJnN0cmxlbigkdik+MTYwKSAka1ska2tdPXN1YnN0cigkdiwwLDE2MCk7IH0KICAkclsnYWlfdmlzbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKHN1a3VydGFfYXQsJyVZLSVtJykgbSwgcmVmZXJlcl9kb21lbmFzLCBDT1VOVCgqKSBuLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQga2FuYWxhc19wYXNrdXRpbmlzPSdhaScgR1JPVVAgQlkgMSwyIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-120532';
const GKEY='ps_s1816h';
const PHASES=["1"];
const OUT='analize/s1816_h.json';
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
