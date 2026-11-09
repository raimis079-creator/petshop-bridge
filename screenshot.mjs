process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQwdi1nIEV4Y2x1c2lvbiBwcmVraXUgc2thaWNpdXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQwdmcnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDB2ZyddOwogICR3PSJwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIChwLnBvc3RfdGl0bGUgTElLRSAnJWV4Y2x1c2lvbiUnIE9SIHAuSUQgSU4gKFNFTEVDVCB0ci5vYmplY3RfaWQgRlJPTSB7JFB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEpPSU4geyRQfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXkgSU4oJ3Byb2R1Y3RfYnJhbmQnLCdwYV9nYW1pbnRvamFzJywncGFfcHJla2VzLXplbmtsYXMnKSBBTkQgdC5uYW1lIExJS0UgJyVleGNsdXNpb24lJykpIjsKICAkclsncGFnYWxfYnVzZW5hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5wb3N0X3N0YXR1cyBzdCwgQ09BTEVTQ0Uoc3MubWV0YV92YWx1ZSwnPycpIHN0b2NrLCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RzIHAgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBzcyBPTiBzcy5wb3N0X2lkPXAuSUQgQU5EIHNzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBXSEVSRSAkdyBHUk9VUCBCWSBzdCxzdG9jayBPUkRFUiBCWSBzdCxzdG9jayIsQVJSQVlfQSk7CiAgJHJbJ3ZhcmlhY2lqb3NfcHVibCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENPQUxFU0NFKHNzLm1ldGFfdmFsdWUsJz8nKSBzdG9jaywgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0cyB2IEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD12LnBvc3RfcGFyZW50IExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgc3MgT04gc3MucG9zdF9pZD12LklEIEFORCBzcy5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgV0hFUkUgdi5wb3N0X3R5cGU9J3Byb2R1Y3RfdmFyaWF0aW9uJyBBTkQgdi5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAkdyBHUk9VUCBCWSBzdG9jayIsQVJSQVlfQSk7CiAgJHJbJ3NhbmRlbGlzX3B1YmwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDT0FMRVNDRShzLm1ldGFfdmFsdWUsJy0nKSBzYW5kZWxpcywgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0cyBwIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBXSEVSRSBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgJHcgR1JPVVAgQlkgc2FuZGVsaXMiLEFSUkFZX0EpOwogICRyWydwYXJkYXZpbWFpXzkwZCddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgbC5vcmRlcl9pZCkgdXpzLCBTVU0obC5wcm9kdWN0X3F0eSkgdm50LCBST1VORChTVU0obC5wcm9kdWN0X25ldF9yZXZlbnVlKSwyKSBuZXQgRlJPTSB7JFB9d2Nfb3JkZXJfcHJvZHVjdF9sb29rdXAgbCBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bC5wcm9kdWN0X2lkIFdIRVJFIGwuZGF0ZV9jcmVhdGVkPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCA5MCBEQVkpIEFORCAkdyIsQVJSQVlfQSk7CiAgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWydFUlInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-111640';
const GKEY='ps_s1840vg';
const PHASES=["1"];
const OUT='out/s1840vg.json';
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
