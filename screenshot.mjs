process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzUzZCBhciBrbGllbnR1IGxhbmdhaSB0dXJpIGR1b21lbmlzOiBwc19rbF9zdXZlc3RpbmUsIHN2ZcSNaWFpLCBLbGllbnTFsyBhbmFsaXrEl3MgxaFhbHRpbmlzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc1M2QnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkUz0kUC4ncHNfa2xfc3V2ZXN0aW5lJzsgJHI9Wyd2Jz0+J1MxNzUzZCddOwogICRyWydzdXYnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTSh3Y19uPjApIHN1X3djLCBTVU0oaXN0X24+MCkgc3VfaXN0LCBNQVgocGFza3V0aW5pcykgcGFzaywgU1VNKHVzZXJfaWQ9MCkgYmVfdWlkIEZST00gJFMiLEFSUkFZX0EpOwogICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkUyIpOyAkclsnY29scyddPWltcGxvZGUoJywnLCRjb2xzKTsKICAkdGM9bnVsbDsgZm9yZWFjaChbJ2F0bmF1amludGEnLCdwZXJza2FpY2l1b3RhJywndXBkYXRlZF9hdCcsJ3NrYWljaXVvdGEnXSBhcyAkYykgaWYoaW5fYXJyYXkoJGMsJGNvbHMpKSAkdGM9JGM7IGlmKCR0YykgJHJbJ2F0bmF1amludGEnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIE1BWCgkdGMpIEZST00gJFMiKTsKICAkclsncGFza19wZXJza2FpY2lhdmltYXMnXT1nZXRfb3B0aW9uKCdwc19rbF9wZXJza2FpY2l1b3RhJywgZ2V0X29wdGlvbigncHNfa2xfcGFzaycsIG51bGwpKTsKICAvLyBXQyB1enNha3ltYWkgbnVvIDA5LTA5OiBraWVrIGtsaWVudHUgKHBhZ2FsIGVsLiBwYXN0YSksIGtpZWsganUgc3V2ZXN0aW5lamUKICAkZW09JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBMT1dFUihiaWxsaW5nX2VtYWlsKSBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIHN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOSciKTsKICAkeXJhPTA7ICRzdmVjPTA7IGZvcmVhY2goJGVtIGFzICRlKXsgaWYoJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRTIFdIRVJFIExPV0VSKGVtYWlsKT0lcyIsJGUpKSkgJHlyYSsrOyB9CiAgJHJbJ3djX2tsaWVudHUnXT1jb3VudCgkZW0pOyAkclsnanVfc3V2ZXN0aW5lamUnXT0keXJhOwogICRyWydzdmVjaW9fdXpzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJykgQU5EIGRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA5JyBBTkQgY3VzdG9tZXJfaWQ9MCIpOwogIC8vICMxMjg4IGtsaWVudGFzCiAgJG89d2NfZ2V0X29yZGVyKDM2Njc1KTsgaWYoJG8peyAkcm93PSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdXNlcl9pZCx1enNha3ltYWksd2Nfbix3Y19zdW1hLGlzdF9uLHBhc2t1dGluaXMsc2VnbWVudGFzIEZST00gJFMgV0hFUkUgTE9XRVIoZW1haWwpPSVzIixzdHJ0b2xvd2VyKCRvLT5nZXRfYmlsbGluZ19lbWFpbCgpKSksQVJSQVlfQSk7ICRyWydrMTI4OCddPSRyb3c/OiduZXJhIHN1dmVzdGluZWplJzsgJHJbJ2sxMjg4X3djX3V6cyddPWNvdW50KHdjX2dldF9vcmRlcnMoWydiaWxsaW5nX2VtYWlsJz0+JG8tPmdldF9iaWxsaW5nX2VtYWlsKCksJ2xpbWl0Jz0+MjAsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ3N0YXR1cyc9PlsncHJvY2Vzc2luZycsJ2NvbXBsZXRlZCddXSkpOyB9CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0lzdF9BZGFwdGVyaXMnKSkgJHJbJ2F0YXNrYWl0dV9zYWx0aW5pcyddPVBldHNob3BfSXN0X0FkYXB0ZXJpczo6c2FsdGluaXMoKTsKICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-111539';
const GKEY='ps_s1753d';
const PHASES=["1"];
const OUT='out/s1753_d.json';
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
