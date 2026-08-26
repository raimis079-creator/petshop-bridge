process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUyIEJlYWNvbiB2MgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZTJiMiddKSB8fCAkX0dFVFsncHNfZTJiMiddIT09J0UyQjIyMDI2MDgyNicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJEk9JHdwZGItPnByZWZpeC4ncHNfd2ViX2l2eWtpYWknOwogJGZhemU9aXNzZXQoJF9HRVRbJ2ZhemUnXSk/JF9HRVRbJ2ZhemUnXTonc3RhcnQnOwoKIGlmKCRmYXplPT09J3N0YXJ0Jyl7CiAgIC8qIGRlcGxveSB2MS4xICovCiAgICRNVT1XUE1VX1BMVUdJTl9ESVI7ICRrPSRNVS4nL3BldHNob3AtYW5hbGl0aWthLnBocCc7CiAgICRvPWFycmF5KCdtZDVfcHJpZXMnPT5tZDVfZmlsZSgkaykpOwogICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS9wZXRzaG9wLWFuYWxpdGlrYS5iNjQ/cmVmPWFkZTc1Njk2ZWY5NTFjZWY5MGZiNGI4ZThhYzgzMGVkYTk4OTEyZGMnLAogICAgICBhcnJheSgndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnJhdycsJ1VzZXItQWdlbnQnPT4ncGV0c2hvcC1icmlkZ2UnKSkpOwogICBpZihpc193cF9lcnJvcigkcikpICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKICAgZWxzZWlmKHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSE9PTIwMCkgJG9bJ2tsYWlkYSddPSdIVFRQICcud3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogICBlbHNlewogICAgICRrb2Rhcz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSx0cnVlKTsKICAgICB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLFRPS0VOX1BBUlNFKTsgJG9bJ3NpbnRha3NlJ109J09LJzsgfQogICAgIGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkb1sna2xhaWRhJ109J1BhcnNlRXJyb3I6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICAgIGlmKGVtcHR5KCRvWydrbGFpZGEnXSkpewogICAgICAgQGNvcHkoJGssV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1hbmFsaXRpa2EucGhwLmJha18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgICRvWydpcmFzeXRhJ109ZmlsZV9wdXRfY29udGVudHMoJGssJGtvZGFzKTsgY2xlYXJzdGF0Y2FjaGUodHJ1ZSwkayk7CiAgICAgICAkb1snbWQ1X3BvJ109bWQ1X2ZpbGUoJGspOyAkb1snc3V0YW1wYSddPSgkb1snbWQ1X3BvJ109PT0nZjUzN2NlZTZlYTUxODUxMjczMzNlYWIxMjM1ZTljNmYnKTsKICAgICB9CiAgIH0KICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkSSIpOwogICB1cGRhdGVfb3B0aW9uKCdwc193ZWJfYXRtZXN0YV9wdXJjaGFzZScsMCxmYWxzZSk7CiAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIElEIERFU0MgTElNSVQgMSIpOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J0UyQjInLCdmYXplJz0+J3N0YXJ0JywnZGVwbG95Jz0+JG8sJ3ByZWtlX2lkJz0+JHBpZCwncHJla2VfdXJsJz0+Z2V0X3Blcm1hbGluaygkcGlkKSksSlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7CiB9CgogJG91dD1hcnJheSgndic9PidFMkIyJywnZmF6ZSc9PidyZXonLCd2ZXJzaWphJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FuYWxpdGlrYScpP1BldHNob3BfQW5hbGl0aWthOjpWRVJTSUpBOic/Jyk7CiAkb3V0Wyd2aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkiKTsKICRvdXRbJ3BhZ2FsX3RpcGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aXBhcyxDT1VOVCgqKSBuIEZST00gJEkgR1JPVVAgQlkgdGlwYXMgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICRvdXRbJ3BhZ2FsX3B1c2wnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwdXNsX3RpcGFzLENPVU5UKCopIG4gRlJPTSAkSSBXSEVSRSB0aXBhcz0ncGFnZXZpZXcnIEdST1VQIEJZIHB1c2xfdGlwYXMiLEFSUkFZX0EpOwogJG91dFsnZWlsdXRlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRpcGFzLHB1c2xfdGlwYXMsTEVGVCh1cmxfa2VsaWFzLDM4KSB1cmwsTEVGVChyYWt0YXMsMjIpIHJha3RhcyxyZWlrc21lLExFRlQoc2VzaWphLDEwKSBzZXMsTEVGVChsYW5reXRvamFzX2QsOCkgbGFuayxsYW5reXRvamFzXzMwLHNhbHRpbmlzLG1lZGl1bSxrYW1wYW5pamEscmVmZXJlcl9kb21lbmFzLGthbmFsYXMsbGFuZGluZyxpcmVuZ2lueXMsbmFyc19zZWltYSxzdXRpa2ltYXMgRlJPTSAkSSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAkb3V0WydzZXNpanUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRJIFdIRVJFIHNlc2lqYSBJUyBOT1QgTlVMTCIpOwogJG91dFsnbGFua3l0b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgRlJPTSAkSSIpOwogJG91dFsnc3VfdXRtJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgc2FsdGluaXM9J3Rlc3QnIik7CiAkb3V0WydsYW5rMzBfbmVOVUxMJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgbGFua3l0b2phc18zMCBJUyBOT1QgTlVMTCIpOwogJG91dFsncHVyY2hhc2VfbGVudGVsZWplJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgdGlwYXMgSU4gKCdwdXJjaGFzZScsJ3JlZnVuZCcpIik7CiAkb3V0WydhdG1lc3RhX3NrYWl0aWtsaXMnXT0oaW50KWdldF9vcHRpb24oJ3BzX3dlYl9hdG1lc3RhX3B1cmNoYXNlJyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG91dCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo=';
const KEY='E2B220260826'; const VER='E2B2';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E2 Beacon v2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);

  const s=await fx(WP+'/?ps_e2b2='+KEY+'&faze=start',{},'start');
  const st=JSON.parse(await s.text()); out.start=st;

  const {chromium}=await import('playwright'); const br=await chromium.launch();
  const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
  const ctx=await br.newContext({viewport:{width:1400,height:900},ignoreHTTPSErrors:true,userAgent:UA,
    extraHTTPHeaders:{'Referer':'https://kaina24.lt/'}});
  const pg=await ctx.newPage(); const kl=[];
  pg.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  const req=[]; pg.on('request',r=>{ if(r.url().indexOf('ps-web')>-1) req.push(r.method()+' '+r.url().slice(0,70)); });

  async function eik(u,ms){ try{ await pg.goto(u,{waitUntil:'domcontentloaded',timeout:45000}); }catch(e){ out.goto_klaidos=(out.goto_klaidos||[]); out.goto_klaidos.push(u.slice(-40)+' '+String(e).slice(0,60)); } await miegok(ms||1200); }
  // 1) landing su UTM is isorinio saltinio
  await eik(WP+'/?utm_source=test&utm_medium=cpc&utm_campaign=e2test',1500);
  out.beacon_yra=await pg.$('#ps-web-beacon')!==null;
  out.psWeb=await pg.evaluate(()=>typeof window.psWeb).catch(()=>'?');
  out.ua=await pg.evaluate(()=>navigator.userAgent).catch(()=>'?');
  await miegok(1200);

  // 2) preke
  await eik(st.preke_url,1200);
  // 3) i krepseli
  await eik(WP+'/?add-to-cart='+st.preke_id,1500);
  // 4) krepselis
  await eik(WP+'/krepselis/',1200);
  // 5) paieska be rezultatu
  await eik(WP+'/?s=zzzqqqxxx',1200);
  // 6) 404
  await eik(WP+'/nera-tokio-puslapio-e2/',1200);
  // 7) bandom PATYS push'inti purchase — turi buti atmesta JS lygyje
  await pg.evaluate(()=>{ if(window.psWeb){ window.psWeb({tipas:'purchase',reiksme:12345}); window.psWeb({tipas:'pageview',pusl:'kita',url:'/js-testas/'}); } });
  await miegok(500);
  await pg.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  await miegok(2000);

  out.js=kl; out.uzklausos=req.slice(0,12);
  out.put=await put('screenshots/e2_beacon2.png', await pg.screenshot({fullPage:false}), VER);
  await br.close();

  const r=await fx(WP+'/?ps_e2b2='+KEY+'&faze=rez',{},'rez');
  const txt=await r.text();
  try{ const j=JSON.parse(txt); await put('deploy/e2_beacon2.json', Buffer.from(JSON.stringify(j,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,500); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,500); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e2_beacon2run.json', Buffer.from(JSON.stringify(out,null,1)), VER);
