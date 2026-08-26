process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUyIEJlYWNvbiBUZXN0YXMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2UyYiddKSB8fCAkX0dFVFsncHNfZTJiJ10hPT0nRTJCMjAyNjA4MjYnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRJPSR3cGRiLT5wcmVmaXguJ3BzX3dlYl9pdnlraWFpJzsKICRmYXplPWlzc2V0KCRfR0VUWydmYXplJ10pPyRfR0VUWydmYXplJ106J3N0YXJ0JzsKCiBpZigkZmF6ZT09PSdzdGFydCcpewogICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRJIik7CiAgIHVwZGF0ZV9vcHRpb24oJ3BzX3dlYl9hdG1lc3RhX3B1cmNoYXNlJywwLGZhbHNlKTsKICAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAxIik7CiAgICRvdXQ9YXJyYXkoJ3YnPT4nRTJCMScsJ2ZhemUnPT4nc3RhcnQnLCdpc3ZhbHl0YSc9PjEsCiAgICAgJ3ByZWtlX2lkJz0+JHBpZCwncHJla2VfdXJsJz0+Z2V0X3Blcm1hbGluaygkcGlkKSwncHJla2VfcGF2Jz0+Z2V0X3RoZV90aXRsZSgkcGlkKSwKICAgICAnZW5kcG9pbnQnPT5ob21lX3VybCgnLz9yZXN0X3JvdXRlPS9wcy13ZWIvdjEvaScpKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkb3V0LEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7CiB9CgogJG91dD1hcnJheSgndic9PidFMkIxJywnZmF6ZSc9PidyZXonKTsKICRvdXRbJ3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkSSIpOwogJG91dFsncGFnYWxfdGlwYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRpcGFzLENPVU5UKCopIG4gRlJPTSAkSSBHUk9VUCBCWSB0aXBhcyBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogJG91dFsncGFnYWxfcHVzbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHB1c2xfdGlwYXMsQ09VTlQoKikgbiBGUk9NICRJIFdIRVJFIHRpcGFzPSdwYWdldmlldycgR1JPVVAgQlkgcHVzbF90aXBhcyIsQVJSQVlfQSk7CiAkb3V0WydlaWx1dGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGlwYXMscHVzbF90aXBhcyxMRUZUKHVybF9rZWxpYXMsNDIpIHVybCxMRUZUKHJha3RhcywyNikgcmFrdGFzLHJlaWtzbWUsTEVGVChzZXNpamEsMTIpIHNlcyxMRUZUKGxhbmt5dG9qYXNfZCwxMCkgbGFuayxsYW5reXRvamFzXzMwLHNhbHRpbmlzLG1lZGl1bSxrYW1wYW5pamEscmVmZXJlcl9kb21lbmFzLGthbmFsYXMsbGFuZGluZyxpcmVuZ2lueXMsbmFyc19zZWltYSxzdXRpa2ltYXMgRlJPTSAkSSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAkb3V0WydzZXNpanUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRJIFdIRVJFIHNlc2lqYSBJUyBOT1QgTlVMTCIpOwogJG91dFsnbGFua3l0b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgRlJPTSAkSSIpOwogJG91dFsnc3VfdXRtJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgc2FsdGluaXM9J3Rlc3QnIik7CiAkb3V0WydsYW5rMzBfbmVOVUxMJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgbGFua3l0b2phc18zMCBJUyBOT1QgTlVMTCIpOwogJG91dFsncHVyY2hhc2VfbGVudGVsZWplJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgdGlwYXMgSU4gKCdwdXJjaGFzZScsJ3JlZnVuZCcpIik7CiAkb3V0WydhdG1lc3RhX3NrYWl0aWtsaXMnXT0oaW50KWdldF9vcHRpb24oJ3BzX3dlYl9hdG1lc3RhX3B1cmNoYXNlJyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG91dCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo=';
const KEY='E2B20260826'; const VER='E2B1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E2 Beacon Testas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);

  const s=await fx(WP+'/?ps_e2b='+KEY+'&faze=start',{},'start');
  const st=JSON.parse(await s.text()); out.start=st;

  const {chromium}=await import('playwright'); const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1400,height:900},ignoreHTTPSErrors:true,
    extraHTTPHeaders:{'Referer':'https://kaina24.lt/'}});
  const pg=await ctx.newPage(); const kl=[];
  pg.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  const req=[]; pg.on('request',r=>{ if(r.url().indexOf('ps-web')>-1) req.push(r.method()+' '+r.url().slice(0,70)); });

  // 1) landing su UTM is isorinio saltinio
  await pg.goto(WP+'/?utm_source=test&utm_medium=cpc&utm_campaign=e2test',{waitUntil:'networkidle',timeout:90000});
  out.beacon_yra=await pg.$('#ps-web-beacon')!==null;
  out.psWeb=await pg.evaluate(()=>typeof window.psWeb).catch(()=>'?');
  await miegok(1800);

  // 2) preke
  await pg.goto(st.preke_url,{waitUntil:'networkidle',timeout:90000}); await miegok(1800);
  // 3) i krepseli
  await pg.goto(WP+'/?add-to-cart='+st.preke_id,{waitUntil:'networkidle',timeout:90000}); await miegok(1500);
  // 4) krepselis
  await pg.goto(WP+'/krepselis/',{waitUntil:'networkidle',timeout:90000}); await miegok(1800);
  // 5) paieska be rezultatu
  await pg.goto(WP+'/?s=zzzqqqxxx',{waitUntil:'networkidle',timeout:90000}); await miegok(1800);
  // 6) 404
  await pg.goto(WP+'/nera-tokio-puslapio-e2/',{waitUntil:'networkidle',timeout:90000}); await miegok(1800);
  // 7) bandom PATYS push'inti purchase — turi buti atmesta JS lygyje
  await pg.evaluate(()=>{ if(window.psWeb){ window.psWeb({tipas:'purchase',reiksme:12345}); window.psWeb({tipas:'pageview',pusl:'kita',url:'/js-testas/'}); } });
  await miegok(500);
  await pg.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  await miegok(2500);

  out.js=kl; out.uzklausos=req.slice(0,12);
  out.put=await put('screenshots/e2_beacon.png', await pg.screenshot({fullPage:false}), VER);
  await br.close();

  const r=await fx(WP+'/?ps_e2b='+KEY+'&faze=rez',{},'rez');
  const txt=await r.text();
  try{ const j=JSON.parse(txt); await put('deploy/e2_beacon.json', Buffer.from(JSON.stringify(j,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,500); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,500); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e2_beaconrun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
