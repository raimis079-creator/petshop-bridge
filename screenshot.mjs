process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE1YiBXb25kZXIga3JlcMWhZWxpbyBhdGthcnRvamltYXMgcmVhZC1vbmx5IChuaWVrYXMgbmVpxaFzYXVnb21hKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTViJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzE1YiddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiLCAkd3BfZmlsdGVyOyAkcj1bJ3YnPT4nUzE3MTViJywnZmF6ZSc9PiRmXTsgJFA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgZm9yZWFjaChbJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfZ2V0X3N0b2NrX3F1YW50aXR5Jywnd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfc3RvY2tfc3RhdHVzJywnd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfbWFuYWdlX3N0b2NrJywnd29vY29tbWVyY2VfcHJvZHVjdF9iYWNrb3JkZXJzX2FsbG93ZWQnLCd3b29jb21tZXJjZV9wcm9kdWN0X2lzX2luX3N0b2NrJywnd29vY29tbWVyY2VfYWRkX3RvX2NhcnRfdmFsaWRhdGlvbicsJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfZ2V0X2JhY2tvcmRlcnMnLCd3b29jb21tZXJjZV9jYXJ0X2l0ZW1fcmVxdWlyZWRfc3RvY2tfaXNfbm90X2Vub3VnaCcsJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfaGFzX2Vub3VnaF9zdG9jayddIGFzICRoKXsgaWYoIWlzc2V0KCR3cF9maWx0ZXJbJGhdKSkgY29udGludWU7IGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHJpbz0+JGNicyl7IGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyAkbm09aXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTooaXNfc3RyaW5nKCRmbik/JGZuOidjbG9zdXJlJyk7IGlmKCRmbiBpbnN0YW5jZW9mIENsb3N1cmUpeyAkcmY9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOyAkbm0uPScgQCcuYmFzZW5hbWUoJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTsgfSAkclsna2FibGlhaSddWyRoXVtdPSRwcmlvLic6ICcuJG5tOyB9IH0gfQogICAgZm9yZWFjaChbMTczMzksMTczNTQsMTczMzYsMTczNDVdIGFzICRwaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHJbJ3AnXVskcGlkXT1bJ3N0b2NrX3N0YXR1cyc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJ3F0eSc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnbWFuYWdlJz0+JHAtPmdldF9tYW5hZ2Vfc3RvY2soKSwnYmFja29yZGVycyc9PiRwLT5nZXRfYmFja29yZGVycygpLCdpc19pbl9zdG9jayc9PiRwLT5pc19pbl9zdG9jaygpLCdoYXNfZW5vdWdoXzEnPT4kcC0+aGFzX2Vub3VnaF9zdG9jaygxKSwncmF3X3N0YXR1cyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksJ3Jhd19zdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwnbG9va3VwJz0+JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzdG9ja19zdGF0dXMsIHN0b2NrX3F1YW50aXR5LCBvbnNhbGUgRlJPTSB7JFB9d2NfcHJvZHVjdF9tZXRhX2xvb2t1cCBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkcGlkKSxBUlJBWV9BKSwnbW9kaWZpZWQnPT5nZXRfcG9zdF9maWVsZCgncG9zdF9tb2RpZmllZCcsJHBpZCldOyB9CiAgICAvLyBhdGthcnRvamltYXM6IGtyZXDFoWVsaXMgYmUgacWhc2F1Z29qaW1vCiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ1dDJykmJldDKCktPmNhcnQpeyB3Y19sb2FkX2NhcnQoKTsgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydChmYWxzZSk7IHdjX2NsZWFyX25vdGljZXMoKTsKICAgICAgJGtleT1XQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgxNzMzOSwxKTsgJHJbJ2FkZF8xNzMzOSddPVsna2V5Jz0+JGtleT9zdWJzdHIoJGtleSwwLDgpOmZhbHNlLCdub3RpY2VzJz0+d2NfZ2V0X25vdGljZXMoKV07IHdjX2NsZWFyX25vdGljZXMoKTsKICAgICAgJHJbJ2NhcnRfbiddPVdDKCktPmNhcnQtPmdldF9jYXJ0X2NvbnRlbnRzX2NvdW50KCk7CiAgICAgIFdDKCktPmNhcnQtPmNoZWNrX2NhcnRfaXRlbXMoKTsgJHJbJ2NoZWNrX2NhcnRfaXRlbXNfbm90aWNlcyddPXdjX2dldF9ub3RpY2VzKCk7IHdjX2NsZWFyX25vdGljZXMoKTsKICAgICAgJGtleTI9V0MoKS0+Y2FydC0+YWRkX3RvX2NhcnQoMTczNDUsMSk7ICRyWydhZGRfMTczNDVfb3V0b2ZzdG9jayddPVsna2V5Jz0+JGtleTI/c3Vic3RyKCRrZXkyLDAsOCk6ZmFsc2UsJ25vdGljZXMnPT53Y19nZXRfbm90aWNlcygpXTsgd2NfY2xlYXJfbm90aWNlcygpOwogICAgICBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KGZhbHNlKTsgfQogICAgLy8gaXN0b3JpamE6IGthZGEgc3RvY2tfc3RhdHVzIHRhcG8gaW5zdG9jayDigJQgcG9zdG1ldGEgbmV0dXJpIGlzdG9yaWpvczsgxb5pxatyaW0gZmFrdMWzL8W+dXJuYWzFsyBsZW50ZWxlcwogICAgJHJbJ3p1cm5hbGFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc18lbG9nJSciKTsKICAgICRyWydpdnlraWFpX3dvbmRlciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhaWthcywgdGlwYXMsIHByZWtlX2lkLCBMRUZUKHZlcnRlLDYwKSB2IEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIHByZWtlX2lkIElOICgxNzMzNiwxNzMzOSwxNzM0MiwxNzM0NSwxNzM0OCwxNzM1MSwxNzM1NCwxNzM1NywxNzM2MCwxNzM2MykgQU5EIGxhaWthcz49REFURV9TVUIoTk9XKCksSU5URVJWQUwgNSBEQVkpIE9SREVSIEJZIGxhaWthcyBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsKICAgICR3Yz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX3dlYl9pdnlraWFpIik7ICRyWyd3ZWJfY29scyddPSR3YzsKICB9CiAgaWYoJGY9PT0nMicpewogICAgLy8ga2FzIGt1cmlhIHBzX3NvdXJjZXMgLyBzdG9ja19zdGF0dXMgZHJvcHNoaXAgcHJla8SXbXMg4oCUIGJlbGNvcl90b2Z1IGltcG9ydGFzCiAgICBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovaW5jbHVkZXMvKi5waHAnKSkgYXMgJGcpeyAkcz1maWxlX2dldF9jb250ZW50cygkZyk7IGlmKHN0cmlwb3MoJHMsJ2JlbGNvcicpIT09ZmFsc2V8fHN0cmlwb3MoJHMsJ3RvZnUnKSE9PWZhbHNlKXsgcHJlZ19tYXRjaF9hbGwoJyMuezAsMTYwfShiZWxjb3J8dG9mdSkuezAsMjQwfSNpcycsJHMsJG0pOyAkclsnYmVsY29yJ11bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZyldPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfcmVwbGFjZSgnI1xzKyMnLCcgJyxzdWJzdHIoJHgsMCw0MDApKTt9LCRtWzBdKSwwLDQpOyB9IH0KICAgICRyWydwc19zb3VyY2VzX3NhbHRpbmlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSwgQ09VTlQoKikgbiwgU1VNKGFjdGl2ZT0xKSBha3QgRlJPTSB7JFB9cHNfc291cmNlcyBHUk9VUCBCWSBzb3VyY2UiLEFSUkFZX0EpOwogICAgJHJbJ2JlbGNvcl9wcmVrZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwLnBvc3Rfc3RhdHVzLCBzcy5tZXRhX3ZhbHVlIHN0b2NrX3N0YXR1cywgc3QubWV0YV92YWx1ZSBzdG9jaywgb3duLm1ldGFfdmFsdWUgb3duIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHMubWV0YV92YWx1ZT0nYmVsY29yX3RvZnUnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzcyBPTiBzcy5wb3N0X2lkPXAuSUQgQU5EIHNzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc3QgT04gc3QucG9zdF9pZD1wLklEIEFORCBzdC5tZXRhX2tleT0nX3N0b2NrJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gb3duIE9OIG93bi5wb3N0X2lkPXAuSUQgQU5EIG93bi5tZXRhX2tleT0nX293bl9zdG9ja19xdHknIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyIsQVJSQVlfQSk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-195047';
const GKEY='ps_s1715b';
const PHASES=["1"];
const OUT='analize/s1715_b1.json';
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
