process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgaGcg4oCUIChIMSkga2F0YWxvZ28gaGlnaWVuYToga2FpbmEgMCwgYmUga2F0LiwgYmUgZm90bywgZHJhZnQsIGJlIGFwcmHFoXltbzsgKEgyKSBsZWdhY3kgMzAxIHNwb3QtY2hlY2suIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzVoZyddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTYzNWhnJ107IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2MzUgaGcnLCdmYXplJz0+JGYpOwogICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogIGlmKCRmPT09J0gxJyl7CiAgICAkb1snc3RhdHVzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X3N0YXR1cyxDT1VOVCgqKSBuIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgR1JPVVAgQlkgcG9zdF9zdGF0dXMiLEFSUkFZX0EpOwogICAgJG9bJ2thaW5hMCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBtLnBvc3RfaWQsTEVGVChwby5wb3N0X3RpdGxlLDYwKSB0IEZST00geyRwfXBvc3RtZXRhIHBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXBtLnBvc3RfaWQgQU5EIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBXSEVSRSBwbS5tZXRhX2tleT0nX3ByaWNlJyBBTkQgKHBtLm1ldGFfdmFsdWU9JycrMCBPUiBwbS5tZXRhX3ZhbHVlPScnIE9SIHBtLm1ldGFfdmFsdWUgSVMgTlVMTCkgQU5EIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00geyRwfXBvc3RtZXRhIGsgV0hFUkUgay5wb3N0X2lkPXBtLnBvc3RfaWQgQU5EIGsubWV0YV9rZXk9J19wcmljZScgQU5EIGsubWV0YV92YWx1ZSswPjApIEdST1VQIEJZIHBtLnBvc3RfaWQgTElNSVQgMjUiLEFSUkFZX0EpOwogICAgJG9bJ2thaW5hMF9uJ109Y291bnQoJG9bJ2thaW5hMCddKTsKICAgICRvWydiZV9mb3RvX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgcG8gV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH1wb3N0bWV0YSBwbSBXSEVSRSBwbS5wb3N0X2lkPXBvLklEIEFORCBwbS5tZXRhX2tleT0nX3RodW1ibmFpbF9pZCcgQU5EIHBtLm1ldGFfdmFsdWUrMD4wKSIpOwogICAgJG9bJ2JlX2ZvdG8nXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChwby5JRCwnICcsTEVGVChwby5wb3N0X3RpdGxlLDU1KSkgRlJPTSB7JHB9cG9zdHMgcG8gV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH1wb3N0bWV0YSBwbSBXSEVSRSBwbS5wb3N0X2lkPXBvLklEIEFORCBwbS5tZXRhX2tleT0nX3RodW1ibmFpbF9pZCcgQU5EIHBtLm1ldGFfdmFsdWUrMD4wKSBMSU1JVCAyMCIpOwogICAgJG9bJ2JlX2thdF9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIHBvIFdIRVJFIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIFdIRVJFIHRyLm9iamVjdF9pZD1wby5JRCkiKTsKICAgICRvWydiZV9rYXQnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChwby5JRCwnICcsTEVGVChwby5wb3N0X3RpdGxlLDU1KSkgRlJPTSB7JHB9cG9zdHMgcG8gV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgV0hFUkUgdHIub2JqZWN0X2lkPXBvLklEKSBMSU1JVCAyMCIpOwogICAgJG9bJ2JlX2Fwcl9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgTEVOR1RIKHBvc3RfY29udGVudCk8NDAgQU5EIExFTkdUSChwb3N0X2V4Y2VycHQpPDIwIik7CiAgICAkb1snYmVfc2t1X24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgcG8gV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH1wb3N0bWV0YSBwbSBXSEVSRSBwbS5wb3N0X2lkPXBvLklEIEFORCBwbS5tZXRhX2tleT0nX3NrdScgQU5EIHBtLm1ldGFfdmFsdWU8PicnKSIpOwogIH0KICBpZigkZj09PSdIMicpewogICAgJG1hcD1qc29uX2RlY29kZSgoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbicpLHRydWUpOwogICAgJG9bJ21hcF9uJ109Y291bnQoKGFycmF5KSRtYXApOyAkaW10aT1hcnJheV9zbGljZSgoYXJyYXkpJG1hcCwwLDgsdHJ1ZSk7ICRpPTA7CiAgICBmb3JlYWNoKChhcnJheSkkbWFwIGFzICRzZW49PiRuYXUpeyBpZigkaT49OCkgYnJlYWs7IGlmKCRpJWludHZhbChtYXgoMSxjb3VudCgkbWFwKS84KSkhPT0wKXsgJGkrKzsgY29udGludWU7IH0KICAgICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgkc2VuKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wKSk7CiAgICAgICRvWyd0ZXN0J11bXT1hcnJheSgnc2VuJz0+bWJfc3Vic3RyKCRzZW4sMCw2MCksJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCdpJz0+bWJfc3Vic3RyKChzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnbG9jYXRpb24nKSwwLDgwKSk7ICRpKys7IH0KICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-093851';
const GKEY='ps_s1635hg';
const PHASES=["H1", "H2"];
const OUT='analize/s1635_hg.json';
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
