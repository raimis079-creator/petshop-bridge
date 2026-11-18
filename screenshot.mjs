process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkzciBQcmVtaW8gYWR2ZW50byBrYWxlbmRvcmlhaSDigJMgScWgSU1USSBpxaEgcHJla3lib3MgKFJhaW1pcyAxMS0xOCAyMzoxOTogWkIgcGFyZHVvZGEgdGlrIHBha3VvdMSXbWlzKSAoMiB2eWtkeXRpLCAzIHBhdGlrcmEpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg5M3InXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkZj0oc3RyaW5nKSRfR0VUWydwc19zMTg5M3InXTsgJHI9Wyd2Jz0+J1MxODkzcicsJ2YnPT4kZl07CiAgdHJ5ewogICAgZm9yZWFjaChbMzg3MDcsMzg3MDldIGFzICRpZCl7ICRwPWdldF9wb3N0KCRpZCk7CiAgICAgIGlmKCRmPT09JzInJiYkcC0+cG9zdF9zdGF0dXM9PT0ncHVibGlzaCcpeyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3BzX3JhbmthX2lzaW10YScsJ3RhaXAnKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19yYW5rYV9pc2ltdGFfa2FkYScsY3VycmVudF90aW1lKCdteXNxbCcpKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19yYW5rYV9pc2ltdGFfa2FzJywnUmFpbWlzIChwZXIgQ2xhdWRlLCBTMTg5MzogWkIgcGFyZHVvZGEgdGlrIHBvIDEwKScpOwogICAgICAgIHdwX3VwZGF0ZV9wb3N0KFsnSUQnPT4kaWQsJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0J10pOyBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkaWQpOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7ICRwPWdldF9wb3N0KCRpZCk7IH0KICAgICAgJHJbJ3AnXVskaWRdPVsnc3QnPT4kcC0+cG9zdF9zdGF0dXMsJ3QnPT4kcC0+cG9zdF90aXRsZSwncmFua2EnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3JhbmthX2lzaW10YScsdHJ1ZSksJ2thZGEnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3JhbmthX2lzaW10YV9rYWRhJyx0cnVlKSwKICAgICAgICAndXpzYWt5bXUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkaWQpKV07CiAgICB9CiAgICBpZigkZj09PScyJyYmZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICAgaWYoJGY9PT0nMycpeyAkclsnY2F0ODI0X3B1YiddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5wb3N0X3RpdGxlIEZST00geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9dHIub2JqZWN0X2lkIFdIRVJFIHR0LnRlcm1faWQ9ODI0IEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIik7CiAgICAgICRyWydzaG90cyddPVtbJ24nPT4nczE4OTNfcG9fc3VuJywndSc9PmhvbWVfdXJsKCcvcHJvZHVjdC90cml4aWUtcHJlbWlvLWFkdmVudG8ta2FsZW5kb3JpdXMtc3VuaW1zLycpLCd3Jz0+MzkwLCdoJz0+OTAwXSxbJ24nPT4nczE4OTNfcG9fa2F0JywndSc9PmhvbWVfdXJsKCcvcHJvZHVjdC90cml4aWUtcHJlbWlvLWFkdmVudG8ta2FsZW5kb3JpdXMta2F0ZW1zLycpLCd3Jz0+MzkwLCdoJz0+OTAwXSxbJ24nPT4nczE4OTNfcG9fa2F0ZWcnLCd1Jz0+Z2V0X3Rlcm1fbGluayg4MjQsJ3Byb2R1Y3RfY2F0JyksJ3cnPT4zOTAsJ2gnPT4yMDAwXV07IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9KTsK';
const VER='dep-212010';
const GKEY='ps_s1893r';
const PHASES=["2", "3"];
const OUT='analize/s1893r.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
