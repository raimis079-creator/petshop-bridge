process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODQgbWMg4oCUIFJFQUQtT05MWTogdmFydGFpIEMg4oCUIHJpbmtvZGFyb3Mgc3V0aWtpbcWzIGLFq2tsxJc6IFdDIGthc2EgKG9wdC1pbiBsYXVrYXMpLCB1c2VyL29yZGVyIG1ldGEsIFNlbmRlciBwbHVnaW5vIG51c3RhdHltYWksIGlzdG9yaW5pxbMga2xpZW50xbMgc3V0aWtpbW8gxb55bW9zLCBwc19lbWFpbF9qb2JzL2xhaXNrYWkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg0bWMnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4NCBtYycpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRvWydtZXRhX2tleXNfb3JkZXInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSBrLCBDT1VOVCgqKSBuIEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5IFJFR0VYUCAnb3B0aW58b3B0X2lufG1hcmtldGluZ3xuYXVqaWVufHN1dGlrfGNvbnNlbnR8c3Vic2NyaWJlfG5ld3NsZXR0ZXJ8c2VuZGVyJyBHUk9VUCBCWSBrIixBUlJBWV9BKTsKICAkb1snbWV0YV9rZXlzX3VzZXInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSBrLCBDT1VOVCgqKSBuLCBTVU0obWV0YV92YWx1ZSBJTignMScsJ3llcycsJ3RydWUnLCdvbicpKSB0YWlwIEZST00geyRwfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5IFJFR0VYUCAnb3B0aW58b3B0X2lufG1hcmtldGluZ3xuYXVqaWVufHN1dGlrfGNvbnNlbnR8c3Vic2NyaWJlfG5ld3NsZXR0ZXJ8c2VuZGVyJyBHUk9VUCBCWSBrIixBUlJBWV9BKTsKICAkb1snbWV0YV9rZXlzX3Bvc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSBrLCBDT1VOVCgqKSBuIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IFJFR0VYUCAnb3B0aW58b3B0X2lufG1hcmtldGluZ3xuYXVqaWVufHN1dGlrfGNvbnNlbnR8c3Vic2NyaWJlfG5ld3NsZXR0ZXInIEdST1VQIEJZIGsiLEFSUkFZX0EpOwogICRvWydvcHRpb25zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUgaywgTEVGVChvcHRpb25fdmFsdWUsMzAwKSB2IEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgUkVHRVhQICdzZW5kZXJ8bmV3c2xldHRlcnxtYXJrZXRpbmdfb3B0fGNvbnNlbnR8c3V0aWt8cHNfbGFpc2t8cHNfZW1haWx8cHNfa2FuYWwnIEFORCBvcHRpb25fbmFtZSBOT1QgTElLRSAnX3RyYW5zaWVudCUnIExJTUlUIDQwIixBUlJBWV9BKTsKICAkb1sncGx1Z2lucyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksZnVuY3Rpb24oJHgpe3JldHVybiBwcmVnX21hdGNoKCcvc2VuZGVyfG1haWx8bmV3c3xjb25zZW50fGNvb2tpZXxnZHByL2knLCR4KTt9KSk7CiAgJG9bJ3RhYmxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBXSEVSRSBUYWJsZXNfaW5fIi5EQl9OQU1FLiIgUkVHRVhQICdzZW5kZXJ8bmV3c2xldHRlcnxzdWJzY3JpfHN1dGlrfGNvbnNlbnR8ZW1haWx8bGFpc2t8cHNfaXN0X2tsaWVudHxwc19rbGllbnQnIik7CiAgZm9yZWFjaCgkb1sndGFibGVzJ10gYXMgJHQpeyAkYz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHQiKTsgJG9bJ3RibCddWyR0XT1hcnJheSgnY29scyc9PiRjLCduJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IikpOyB9CiAgZm9yZWFjaCgkb1sndGFibGVzJ10gYXMgJHQpIGlmKHByZWdfbWF0Y2goJy9pc3Rfa2xpZW50fHBzX2tsaWVudC8nLCR0KSl7ICRjPSRvWyd0YmwnXVskdF1bJ2NvbHMnXTsgZm9yZWFjaCgkYyBhcyAkY29sKSBpZihwcmVnX21hdGNoKCcvbmF1amllbnxzdXRpa3xvcHR8bWFya2V0aW5nfHN1YnNjci9pJywkY29sKSkgJG9bJ2lzdF9zdXRpayddWyR0LicuJy4kY29sXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBgJGNvbGAgdiwgQ09VTlQoKikgbiBGUk9NICR0IEdST1VQIEJZIHYiLEFSUkFZX0EpOyB9CiAgJG9bJ3BzX2VtYWlsX2pvYnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aXBhcywgQ09VTlQoKikgbiBGUk9NIHskcH1wc19lbWFpbF9qb2JzIEdST1VQIEJZIHRpcGFzIixBUlJBWV9BKTsKICAvLyBrYXNvcyBmb3JtYTogYXIgeXJhIG9wdC1pbiBsYXVrYXMgKGNoZWNrb3V0IGJsb2NrcyAvIGNsYXNzaWMpCiAgJG9bJ2NoZWNrb3V0X3BhZ2UnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIExFRlQocG9zdF9jb250ZW50LDE1MDApIEZST00geyRwfXBvc3RzIFdIRVJFIElEPSIuaW50dmFsKHdjX2dldF9wYWdlX2lkKCdjaGVja291dCcpKSk7CiAgJG9bJ3djX21hcmtldGluZ19vcHRpbl9zZXR0aW5nJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW5hYmxlX21hcmtldGluZ19vcHRpbicsbnVsbCk7CiAgLy8gcHJpdmF0dW1vL3N1dGlraW1vIHRla3N0YWkKICAkb1sncHJpdmFjeV9wYWdlJ109d2NfcHJpdmFjeV9wb2xpY3lfcGFnZV9pZCgpOyAkb1sndGVybXNfcGFnZSddPXdjX3Rlcm1zX2FuZF9jb25kaXRpb25zX3BhZ2VfaWQoKTsKICAkb1snc2VuZGVyX2Zvcm1fc2hvcnRjb2RlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X3R5cGUsIHBvc3RfdGl0bGUgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCdwcml2YXRlJykgQU5EIHBvc3RfY29udGVudCBMSUtFICclc2VuZGVyJScgQU5EIHBvc3RfdHlwZSBJTigncGFnZScsJ3dwX3RlbXBsYXRlJywnd3BfdGVtcGxhdGVfcGFydCcsJ3dwX2Jsb2NrJykgTElNSVQgMTAiLEFSUkFZX0EpOwogIC8vIHVuaWthbMWrcyBlbC4gcGHFoXRhaTogaXN0b3JpamEgdnMgZGFiYXIKICAkb1snZW1haWxzJ109YXJyYXkoJ2lzdF9oYXNoJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBrbGllbnRhc19lbWFpbF9oYXNoKSBGUk9NIHskcH1wc19pc3RfZmFrdF91enNha3ltYWkiKSwnd2NfY3VzdG9tZXJzJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13Y19jdXN0b21lcl9sb29rdXAiKSwnd2NfdXNlcnNfY3VzdG9tZXInPT4kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5PSd7JHB9Y2FwYWJpbGl0aWVzJyBBTkQgbWV0YV92YWx1ZSBMSUtFICclY3VzdG9tZXIlJyIpKTsKICAvLyBzZW5kZXIubmV0IGxlbnRlbMSXcy8gbWV0YSBpxaEgcGx1Z2lubwogICRvWydzZW5kZXJfdXNlcl9tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXkgaywgQ09VTlQoKikgbiBGUk9NIHskcH11c2VybWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICclc2VuZGVyJScgR1JPVVAgQlkgayIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-175446';
const GKEY='ps_s1684mc';
const PHASES=["GO"];
const OUT='analize/s1684_mc.json';
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
