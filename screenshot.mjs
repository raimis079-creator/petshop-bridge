process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2aiBWZW5pcGFrIGxvY2tlciBtYXRtZW51IGtvZGFzIHJlYWQtb25seSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTZqJ10pKSByZXR1cm47CiAgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzE2aiddOwogIHRyeXsKICAgICRmbj1XUF9QTFVHSU5fRElSLicvd2MtdmVuaXBhay1zaGlwcGluZy9wdWJsaWMvY2xhc3Mtd29vY29tbWVyY2Utc2hvcHVwLXZlbmlwYWstc2hpcHBpbmctcHVibGljLXBpY2t1cC1jaGVja291dC5waHAnOyAkcz1maWxlX2dldF9jb250ZW50cygkZm4pOyAkclsnbWQ1J109bWQ1KCRzKTsKICAgICRwPXN0cnBvcygkcywnTG9ja2VyIGludGVybmFsIG1heCBkaW1lbnNpb25zJyk7ICRyWydrb2RhcyddPXN1YnN0cigkcyxtYXgoMCwkcC0yNTAwKSw1NTAwKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcjZnVuY3Rpb25ccysoXHcrKVxzKlwoIycsJHMsJG0pOyAkclsnZnVua2Npam9zJ109JG1bMV07CiAgICBwcmVnX21hdGNoX2FsbCgnI2FkZF9maWx0ZXJcKFteXG5dezAsMTYwfSMnLCRzLCRtKTsgJHJbJ2ZpbHRyYWknXT0kbVswXTsKICAgIC8vIGt1ciBzaSBrbGFzZSBrdmllxI1pYW1hIGnFoSBwaWNrdXAgbWV0b2RvCiAgICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcvKiovKi5waHAnKSBhcyAkZyl7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsgaWYocHJlZ19tYXRjaCgnI2lzX2NhcnRfc3VpdGFibGV8Zml0c19sb2NrZXJ8bG9ja2VyX21heHxtYXhfZGltZW5zaW9uc3xjYXJ0X3ZvbHVtZSNpJywkdCkmJiRnIT09JGZuKXsgcHJlZ19tYXRjaF9hbGwoJyNbXlxuXXswLDE0MH0oaXNfY2FydF9zdWl0YWJsZXxmaXRzX2xvY2tlcnxsb2NrZXJfbWF4fG1heF9kaW1lbnNpb25zfGNhcnRfdm9sdW1lKVteXG5dezAsMTYwfSNpJywkdCwkbW0pOyAkclsna3ZpZWNpYW1hJ11bYmFzZW5hbWUoJGcpXT1hcnJheV9zbGljZShhcnJheV9tYXAoJ3RyaW0nLCRtbVswXSksMCw2KTsgfSB9CiAgICAvLyByaWJ1IHZpcnNpamFuY2lvcyBwcmVrZXMgKHBhZ2FsIHJ1c2l1b3RhIG1hdG1lbnUgdHZhcmthKToga2llayBwcmVraXUgdHVyaSBtYXgga3Jhc3RpbmUgPiA2MCAvIHZpZCA+IDM2IC4uLgogICAgJHJbJ3piX2tyYXN0aW5lcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIEdSRUFURVNUKENBU1QobC5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoOCwyKSksQ0FTVCh3Lm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSxDQVNUKGgubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpKSBteCwgQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU9J3piJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGwgT04gbC5wb3N0X2lkPXAuSUQgQU5EIGwubWV0YV9rZXk9J19sZW5ndGgnIEFORCBsLm1ldGFfdmFsdWU8PicnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdyBPTiB3LnBvc3RfaWQ9cC5JRCBBTkQgdy5tZXRhX2tleT0nX3dpZHRoJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGggT04gaC5wb3N0X2lkPXAuSUQgQU5EIGgubWV0YV9rZXk9J19oZWlnaHQnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgbXggT1JERVIgQlkgbXggREVTQyBMSU1JVCAxMiIsQVJSQVlfQSk7CiAgICAkclsnemJfdmlyczYwX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDQ4KSB0LCBsLm1ldGFfdmFsdWUgbCwgdy5tZXRhX3ZhbHVlIHcsIGgubWV0YV92YWx1ZSBoLCB3dC5tZXRhX3ZhbHVlIGtnIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHMubWV0YV92YWx1ZT0nemInIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbCBPTiBsLnBvc3RfaWQ9cC5JRCBBTkQgbC5tZXRhX2tleT0nX2xlbmd0aCcgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSB3IE9OIHcucG9zdF9pZD1wLklEIEFORCB3Lm1ldGFfa2V5PSdfd2lkdGgnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gaCBPTiBoLnBvc3RfaWQ9cC5JRCBBTkQgaC5tZXRhX2tleT0nX2hlaWdodCcgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHd0IE9OIHd0LnBvc3RfaWQ9cC5JRCBBTkQgd3QubWV0YV9rZXk9J193ZWlnaHQnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIEdSRUFURVNUKENBU1QobC5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoOCwyKSksQ0FTVCh3Lm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSxDQVNUKGgubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpKT42MCBPUkRFUiBCWSBDQVNUKHd0Lm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsKICAgIC8vIFpCIFhNTDogYXIgZmVlZCdlIHlyYSBtYXRtZW55cwogICAgJHg9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3dwYWxsaW1wb3J0L2ZpbGVzL2dvb2RzX2NsZWFuLnhtbCc7IGlmKGZpbGVfZXhpc3RzKCR4KSl7ICRoPWZvcGVuKCR4LCdyJyk7ICRidWY9ZnJlYWQoJGgsNjAwMDApOyBmY2xvc2UoJGgpOyBwcmVnX21hdGNoX2FsbCgnIzwoXHcqKGxlbmd0aHx3aWR0aHxoZWlnaHR8ZGltZW5zaW9ufHNpemV8dm9sdW1lfGlsZ2lzfHBsb3Rpc3xhdWtzdGlzKVx3Kik+I2knLCRidWYsJG1tKTsgJHJbJ3piX3htbF90YWdhaSddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1tWzFdKSk7ICRyWyd6Yl94bWxfcHZ6J109c3Vic3RyKHByZWdfcmVwbGFjZSgnI1xzKyMnLCcgJywkYnVmKSwwLDEyMDApOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-205953';
const GKEY='ps_s1716j';
const PHASES=["1"];
const OUT='analize/s1716_j1.json';
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
