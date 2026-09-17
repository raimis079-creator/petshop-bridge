process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIG8g4oCUIFJFQ09OIHZpc3VtYSAxOiBsZW50ZWxpxbMgc3RydWt0xatyYSArIFdDIHXFvnNha3ltxbMgdmVyc2xvIHJvZGlrbGlhaSArIGtsYWlkb3MvY3Jvbi9iYWNrdXAuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODlzbyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgZm9yZWFjaChhcnJheSgncHNfZmFrdF91enNha3ltYWknLCdwc19mYWt0X2VpbHV0ZXMnLCdwc19pc3RfZmFrdF91enNha3ltYWknLCdwc193ZWJfaXZ5a2lhaScsJ3BzX2Zha3RfcmVrbGFtYScsJ3BzX3Nhcmdhc19rbGFpZG9zJywncHNfZW1haWxfam9icycpIGFzICR0KXsgJG9bJ2NvbHMnXVskdF09aW1wbG9kZSgnLCcsKGFycmF5KSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9JHQiKSk7IH0KICAkUz0ic3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSI7CiAgJG9bJ3djX3NhdiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIE1JTihEQVRFKGRhdGVfY3JlYXRlZF9nbXQpKSBudW8sIENPVU5UKCopIG4sIFJPVU5EKFNVTSh0b3RhbF9hbW91bnQpKSBldXIsIFJPVU5EKEFWRyh0b3RhbF9hbW91bnQpLDEpIGFvdiBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EICRTIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNyAxOTowMCcgR1JPVVAgQlkgWUVBUldFRUsoZGF0ZV9jcmVhdGVkX2dtdCwzKSIsQVJSQVlfQSk7CiAgJG9bJ3djX3N0YXR1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIGRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA3IDE5OjAwJyBHUk9VUCBCWSBzdGF0dXMiLEFSUkFZX0EpOwogICRvWyd3Y19wYXknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwYXltZW50X21ldGhvZCwgQ09VTlQoKikgbiBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EICRTIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNyAxOTowMCcgR1JPVVAgQlkgcGF5bWVudF9tZXRob2QiLEFSUkFZX0EpOwogICRvWyd3Y19zaGlwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb2kub3JkZXJfaXRlbV9uYW1lIG0sIENPVU5UKCopIG4gRlJPTSB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgSk9JTiB7JHB9d2Nfb3JkZXJzIG8gT04gby5pZD1vaS5vcmRlcl9pZCBXSEVSRSBvaS5vcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBBTkQgby4kUyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wNyAxOTowMCcgR1JPVVAgQlkgbSBPUkRFUiBCWSBuIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgJG9bJ3djX2RldmljZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENBU0UgV0hFTiB1c2VyX2FnZW50IExJS0UgJyVNb2JpJScgVEhFTiAnbW9iJyBFTFNFICdkZXNrJyBFTkQgZCwgQ09VTlQoKikgbiBGUk9NIHskcH13Y19vcmRlcnMgbyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgJFMgQU5EIGRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA3IDE5OjAwJyBHUk9VUCBCWSBkIixBUlJBWV9BKTsKICAkbG9nPWRpcm5hbWUoQUJTUEFUSCkuJy9sb2dzL3BocF9lcnJvci5sb2cnOyBpZighaXNfcmVhZGFibGUoJGxvZykpICRsb2c9QUJTUEFUSC4nLi4vbG9ncy9waHBfZXJyb3IubG9nJzsKICBpZihpc19yZWFkYWJsZSgkbG9nKSl7ICRmPWZvcGVuKCRsb2csJ3InKTsgZnNlZWsoJGYsLW1pbihmaWxlc2l6ZSgkbG9nKSw0MDAwMDApLFNFRUtfRU5EKTsgJHR4dD1mcmVhZCgkZiw0MDAwMDApOyBmY2xvc2UoJGYpOwogICAgJGxpbmVzPWFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJHR4dCkpOyAkcmVjZW50PWFycmF5X2ZpbHRlcigkbGluZXMsZnVuY3Rpb24oJGwpe3JldHVybiBzdHJwb3MoJGwsJzE3LVNlcC0yMDI2JykhPT1mYWxzZXx8c3RycG9zKCRsLCcxNi1TZXAtMjAyNicpIT09ZmFsc2U7fSk7CiAgICAkY250PWFycmF5KCdmYXRhbCc9PjAsJ3dhcm5pbmcnPT4wLCdkZXByZWNhdGVkJz0+MCwnbm90aWNlJz0+MCk7ICR0b3A9YXJyYXkoKTsKICAgIGZvcmVhY2goJHJlY2VudCBhcyAkbCl7IGZvcmVhY2goJGNudCBhcyAkaz0+JHYpIGlmKHN0cmlwb3MoJGwsIlBIUCAkayIpIT09ZmFsc2V8fHN0cmlwb3MoJGwsIlBIUCAiLnVjZmlyc3QoJGspKSE9PWZhbHNlKXskY250WyRrXSsrO30gJGtleT1wcmVnX3JlcGxhY2UoJy9eXFtbXlxdXStcXVxzKi8nLCcnLCRsKTsgJGtleT1wcmVnX3JlcGxhY2UoJy9cZCsvJywnIycsc3Vic3RyKCRrZXksMCwxNTApKTsgJHRvcFska2V5XT0oJHRvcFska2V5XT8/MCkrMTsgfQogICAgYXJzb3J0KCR0b3ApOyAkb1sncGhwX2xvZyddPWFycmF5KCdzaXplX21iJz0+cm91bmQoZmlsZXNpemUoJGxvZykvMTA0ODU3NiwxKSwnMTYtMTdkJz0+JGNudCwndG9wJz0+YXJyYXlfc2xpY2UoJHRvcCwwLDgsdHJ1ZSkpOyB9IGVsc2UgJG9bJ3BocF9sb2cnXT0nbmVyYXN0YSc7CiAgJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkbGF0ZT0wOyAkbm93PXRpbWUoKTsgZm9yZWFjaCgkY3IgYXMgJHRzPT4kaCkgaWYoJHRzPCRub3ctMzYwMCkkbGF0ZSs9Y291bnQoJGgpOyAkb1snY3Jvbl9sYXRlXzFoJ109JGxhdGU7ICRvWydjcm9uX3RvdGFsJ109YXJyYXlfc3VtKGFycmF5X21hcCgnY291bnQnLCRjcikpOwogICRhcmNoPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcyc7ICRmcz1nbG9iKCRhcmNoLicvKicpPzphcnJheSgpOyB1c29ydCgkZnMsZnVuY3Rpb24oJGEsJGIpe3JldHVybiBmaWxlbXRpbWUoJGIpLWZpbGVtdGltZSgkYSk7fSk7ICRvWydhcmNoeXZhcyddPWFycmF5X21hcChmdW5jdGlvbigkZil7cmV0dXJuIGJhc2VuYW1lKCRmKS4nICcuZGF0ZSgnbS1kIEg6aScsZmlsZW10aW1lKCRmKSkuJyAnLnJvdW5kKGZpbGVzaXplKCRmKS8xMDQ4NTc2LDEpLidNQic7fSxhcnJheV9zbGljZSgkZnMsMCw2KSk7CiAgJG9bJ2FkbWlucyddPWNvdW50KGdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnZmllbGRzJz0+J0lEJykpKTsgJG9bJ3VzZXJzX3RvdGFsJ109Y291bnRfdXNlcnMoKVsndG90YWxfdXNlcnMnXTsKICAkb1snZGlzayddPWFycmF5KCdmcmVlX2diJz0+QHJvdW5kKGRpc2tfZnJlZV9zcGFjZShBQlNQQVRIKS8xMDczNzQxODI0LDEpLCd1cGxvYWRzX2diJz0+bnVsbCk7CiAgJG9bJ2RiX21iJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBST1VORChTVU0oZGF0YV9sZW5ndGgraW5kZXhfbGVuZ3RoKS8xMDQ4NTc2KSBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPURBVEFCQVNFKCkiKTsKICAkb1snZGJfdG9wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGFibGVfbmFtZSB0LCBST1VORCgoZGF0YV9sZW5ndGgraW5kZXhfbGVuZ3RoKS8xMDQ4NTc2KSBtYiBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfc2NoZW1hPURBVEFCQVNFKCkgT1JERVIgQlkgZGF0YV9sZW5ndGgraW5kZXhfbGVuZ3RoIERFU0MgTElNSVQgNiIsQVJSQVlfQSk7CiAgJG9bJ3Nlc3Npb25zJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13b29jb21tZXJjZV9zZXNzaW9ucyIpOyAkb1sndHJhbnNpZW50cyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdcX3RyYW5zaWVudFxfJSciKTsKICAkb1snYXNfcGVuZGluZyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9YWN0aW9uc2NoZWR1bGVyX2FjdGlvbnMgV0hFUkUgc3RhdHVzPSdwZW5kaW5nJyIpOyAkb1snYXNfZmFpbGVkXzdkJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1hY3Rpb25zY2hlZHVsZXJfYWN0aW9ucyBXSEVSRSBzdGF0dXM9J2ZhaWxlZCcgQU5EIHNjaGVkdWxlZF9kYXRlX2dtdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgNyBEQVkpIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-101135';
const GKEY='ps_s1689so';
const PHASES=["GO"];
const OUT='analize/s1689s_o.json';
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
