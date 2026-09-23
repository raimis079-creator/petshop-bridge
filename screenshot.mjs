process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcwNWQnXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRyPVtdOwogICRxPWZ1bmN0aW9uKCRrLCRzcWwpIHVzZSgmJHIsJHdwZGIpeyAkclska109JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7IGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclskay4nX2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOyB9OwogICRicj0iJ3JveWFsLWNhbmluJywnYW1icm9zaWEnLCdyYXNjbycsJ3ByaW5zJywnYmVsb2NhdCcsJ3Blc3MnLCdqb3NlcmEnLCdleGNsdXNpb24nLCdxdWF0dHJvJywnYW5pbW9uZGEnLCdmYXJtaW5hJywnYnJpdCcsJ2hpbGxzJyI7CiAgJHEoJ2JyX3N0JywiU0VMRUNUIHQuc2x1ZyBiLCBwLnBvc3Rfc3RhdHVzIHN0LCBTVU0oQ09BTEVTQ0Uoc20ubWV0YV92YWx1ZSwnJyk9J2luc3RvY2snKSBpbnN0b2NrLCBTVU0oQ09BTEVTQ0Uoc20ubWV0YV92YWx1ZSwnJyk8PidpbnN0b2NrJykgbmVyYSwgU1VNKEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskcH1wb3N0bWV0YSBoIFdIRVJFIGgucG9zdF9pZD1wLklEIEFORCBoLm1ldGFfa2V5PSdfcHNfZHJvcHNoaXBfcGFzbGVwdGEnIEFORCBoLm1ldGFfdmFsdWU9JzEnKSkgcGFzbGVwdGEgRlJPTSB7JHB9dGVybXMgdCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcgSk9JTiB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLnRlcm1fdGF4b25vbXlfaWQ9dHQudGVybV90YXhvbm9teV9pZCBKT0lOIHskcH1wb3N0cyBwIE9OIHAuSUQ9dHIub2JqZWN0X2lkIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBzbSBPTiBzbS5wb3N0X2lkPXAuSUQgQU5EIHNtLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBXSEVSRSB0LnNsdWcgSU4gKCRicikgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMiIpOwogICRxKCdicl9hdWcnLCJTRUxFQ1QgYnJlbmRhc19zbHVnIGIsIFJPVU5EKFNVTShrYWluYV9jdCkvMTAwKSBldXIsIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdXogRlJPTSB7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSBkaWVuYSBCRVRXRUVOICcyMDI2LTA4LTAxJyBBTkQgJzIwMjYtMDgtMjUnIEdST1VQIEJZIDEgT1JERVIgQlkgMiBERVNDIExJTUlUIDI1Iik7CiAgJHEoJ2JyX3EyJywiU0VMRUNUIGJyZW5kYXNfc2x1ZyBiLCBST1VORChTVU0oa2FpbmFfY3QpLzEwMCkgZXVyIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgZGllbmEgQkVUV0VFTiAnMjAyNi0wNC0wMScgQU5EICcyMDI2LTA2LTMwJyBHUk9VUCBCWSAxIE9SREVSIEJZIDIgREVTQyBMSU1JVCAyMCIpOwogICRxKCdneV9hdWcnLCJTRUxFQ1QgZ3l2dW5hcyBnLCBST1VORChTVU0oa2FpbmFfY3QpLzEwMCkgZXVyIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgZGllbmEgQkVUV0VFTiAnMjAyNi0wOC0wMScgQU5EICcyMDI2LTA4LTI1JyBHUk9VUCBCWSAxIik7CiAgJHEoJ2F1Z190b3QnLCJTRUxFQ1QgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHZpc29fY3QpLzEwMCkgdmlzbywgU1VNKGtsaWVudGFzX25hdWphcz0xKSBuYXVqaSwgUk9VTkQoU1VNKHByZWtpdV9zdW1hX2N0KS8xMDApIHByZWsgRlJPTSB7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIFdIRVJFIGRpZW5hIEJFVFdFRU4gJzIwMjYtMDgtMDEnIEFORCAnMjAyNi0wOC0yNSciKTsKICAkcSgncmNfdmknLCJTRUxFQ1QgQ09VTlQoKikgbiBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0aXBhcz0ndmlld19pdGVtJyBBTkQgZGllbmE+PScyMDI2LTA5LTA5JyBBTkQgdXJsX2tlbGlhcyBMSUtFICclcm95YWwtY2FuaW4lJyIpOwogICRxKCdnYWRzX3V6JywiU0VMRUNUIENPVU5UKCopIG4sIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIHZpc28sIFJPVU5EKFNVTShrb250cmlidWNpamFfY3QpLzEwMCkga29udHIsIFNVTShrbGllbnRhc19uYXVqYXM9MSkgbmF1amkgRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCcgQU5EIHN0YXR1c2FzX2dhbHV0aW5pczw+J2NhbmNlbGxlZCcgQU5EIGRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMDknIEFORCAnMjAyNi0wOS0yMicgQU5EIGdjbGlkPTEiKTsKICAkcSgna2Fpbl91eicsIlNFTEVDVCB1dG1fc291cmNlIHMsIENPVU5UKCopIG4sIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIHZpc28sIFJPVU5EKFNVTShrb250cmlidWNpamFfY3QpLzEwMCkga29udHIsIFNVTShrbGllbnRhc19uYXVqYXM9MSkgbmF1amkgRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCcgQU5EIHN0YXR1c2FzX2dhbHV0aW5pczw+J2NhbmNlbGxlZCcgQU5EIGRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMDknIEFORCAnMjAyNi0wOS0yMicgQU5EICh1dG1fc291cmNlIElOICgna2FpbmEyNCcsJ2thaW5vcycpIE9SIHJlZmVyZXJfZG9tZW5hcyBMSUtFICcla2FpbiUnKSBHUk9VUCBCWSAxIik7CiAgJHEoJ3NpdW50JywiU0VMRUNUIHZlemVqYXMsIHByaXN0YXR5bW9fdGlwYXMsIENPVU5UKCopIG4sIFJPVU5EKEFWRyhrYWluYV92ZXplam9fY3QpLzEwMCwyKSBrLCBST1VORChBVkcoZGllbm9zX2lraV9wcmlzdGF0eW1vKSwxKSBkIEZST00geyRwfXBzX2Zha3Rfc2l1bnRvcyBXSEVSRSB0ZXN0aW5pcz0wIEFORCBkaWVuYSBCRVRXRUVOICcyMDI2LTA5LTA5JyBBTkQgJzIwMjYtMDktMjInIEFORCBzdGF0dXNhczw+J2F0c2F1a3RhJyBHUk9VUCBCWSAxLDIiKTsKICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-083619';
const GKEY='ps_s1705d';
const PHASES=["1"];
const OUT='analize/s1705_d.json';
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
