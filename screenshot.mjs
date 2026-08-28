process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIE1vbm8gUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19tb25vOSddID8/ICcnKSAhPT0gJ0dPJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gWyd2Jz0+J01PTk8xJ107CgogLy8gMSkgcGFfbW9ub3Byb3RlaW4gdGVybWluYWkKICRvWyd0ZXJtcyddID0gJHdwZGItPmdldF9yZXN1bHRzKCIKICAgU0VMRUNUIHQudGVybV9pZCwgdC5uYW1lLCB0LnNsdWcsIHR0LmNvdW50CiAgIEZST00geyR3cGRiLT50ZXJtc30gdAogICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQKICAgV0hFUkUgdHQudGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyIsIEFSUkFZX0EpOwoKIC8vIDIpIHB1Ymxpc2ggcHJvZHVrdHUgc2thaWNpdXMgc3Uga2lla3ZpZW51IHRlcm1pbnUKICRvWydwdWJsaXNoX3BhZ2FsX3Rlcm1pbmEnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiCiAgIFNFTEVDVCB0LnNsdWcsIENPVU5UKERJU1RJTkNUIHAuSUQpIG4KICAgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgIEpPSU4geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIE9OIHRyLm9iamVjdF9pZD1wLklECiAgIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgSk9JTiB7JHdwZGItPnRlcm1zfSB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkCiAgIFdIRVJFIHR0LnRheG9ub215PSdwYV9tb25vcHJvdGVpbicgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgR1JPVVAgQlkgdC5zbHVnIiwgQVJSQVlfQSk7CgogLy8gMykgYXIgeXJhIHByZWtpdSBzdSBBQklFTSB0ZXJtaW5haXMKICRvWydzdV9hYmllbSddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiCiAgIFNFTEVDVCBDT1VOVCgqKSBGUk9NICgKICAgICBTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRAogICAgIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgICBXSEVSRSB0dC50YXhvbm9teT0ncGFfbW9ub3Byb3RlaW4nIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgR1JPVVAgQlkgcC5JRCBIQVZJTkcgQ09VTlQoRElTVElOQ1QgdHQudGVybV90YXhvbm9teV9pZCkgPiAxCiAgICkgeCIpOwoKIC8vIDQpIGthdGVnb3JpamEgbWFpc3Rhcy1zdW5pbXMgKHN1IHZhaWthaXMpCiAkY2F0ID0gZ2V0X3Rlcm1fYnkoJ3NsdWcnLCdtYWlzdGFzLXN1bmltcycsJ3Byb2R1Y3RfY2F0Jyk7CiAkb1sna2F0J10gPSAkY2F0ID8gWydpZCc9PiRjYXQtPnRlcm1faWQsJ2NvdW50Jz0+JGNhdC0+Y291bnRdIDogbnVsbDsKCiAkcTEgPSBuZXcgV1BfUXVlcnkoWwogICAncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4xLCdmaWVsZHMnPT4naWRzJywKICAgJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+J21haXN0YXMtc3VuaW1zJ11dLAogXSk7CiAkb1sna2F0X3Zpc29zJ10gPSAoaW50KSRxMS0+Zm91bmRfcG9zdHM7CgogJHEyID0gbmV3IFdQX1F1ZXJ5KFsKICAgJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+MSwnZmllbGRzJz0+J2lkcycsCiAgICd0YXhfcXVlcnknPT5bJ3JlbGF0aW9uJz0+J0FORCcsCiAgICAgWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PidtYWlzdGFzLXN1bmltcyddLAogICAgIFsndGF4b25vbXknPT4ncGFfbW9ub3Byb3RlaW4nLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT5bJ3RhaXAnXV0sCiAgIF0sCiBdKTsKICRvWydrYXRfbW9ub190YWlwJ10gPSAoaW50KSRxMi0+Zm91bmRfcG9zdHM7CgogLy8gNSkgNC1vIHB1c2xhcGlvIHByZWtlcyBCRSBmaWx0cm8gKGthaXAgUmFpbWlvIFVSTCkgKyBqdSBtb25vIHJlaWtzbWUKICRwcHAgPSAoaW50KSBnZXRfb3B0aW9uKCdwb3N0c19wZXJfcGFnZScpOwogJHBwcCA9ICRwcHAgPzogMTI7CiAkb1sncHBwX29wdGlvbiddID0gJHBwcDsKICRxMyA9IG5ldyBXUF9RdWVyeShbCiAgICdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9PiRwcHAsJ3BhZ2VkJz0+NCwnZmllbGRzJz0+J2lkcycsCiAgICd0YXhfcXVlcnknPT5bWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PidtYWlzdGFzLXN1bmltcyddXSwKIF0pOwogJHJvd3M9W107CiBmb3JlYWNoKCRxMy0+cG9zdHMgYXMgJHBpZCl7CiAgICR0dCA9IHdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncGFfbW9ub3Byb3RlaW4nLFsnZmllbGRzJz0+J3NsdWdzJ10pOwogICAkcm93c1tdID0gWwogICAgICdpZCc9PiRwaWQsCiAgICAgJ25hbWUnPT5nZXRfdGhlX3RpdGxlKCRwaWQpLAogICAgICdtb25vJz0+IGlzX3dwX2Vycm9yKCR0dCk/ICdFUlInIDogKGVtcHR5KCR0dCk/ICctJyA6IGltcGxvZGUoJywnLCR0dCkpLAogICBdOwogfQogJG9bJ3A0X2JlX2ZpbHRybyddID0gJHJvd3M7CgogLy8gNikgWUlUSCBwcmVzZXRhaSAvIGZpbHRyYWkKICRwcmVzID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X25hbWUscG9zdF9zdGF0dXMgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGUgTElLRSAneWl0aCUnIExJTUlUIDMwIiwgQVJSQVlfQSk7CiAkb1sneWl0aF9wb3N0YWknXSA9ICRwcmVzOwogJGZsdCA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9uYW1lLHBvc3RfcGFyZW50IEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSd5aXRoX3djYW5fZmlsdGVyJyBMSU1JVCA2MCIsIEFSUkFZX0EpOwogJG9bJ3lpdGhfZmlsdHJhaSddID0gJGZsdDsKIC8vIGZpbHRydSBtZXRhICh0YXhvbm9teSArIHNsdWcpCiAkZm09W107CiBmb3JlYWNoKChhcnJheSkkZmx0IGFzICRmKXsKICAgJG0gPSBnZXRfcG9zdF9tZXRhKCRmWydJRCddKTsKICAgJGZtWyRmWydJRCddXSA9IFsndGl0bGUnPT4kZlsncG9zdF90aXRsZSddLCdwYXJlbnQnPT4kZlsncG9zdF9wYXJlbnQnXSwKICAgICAndGF4b25vbXknPT4kbVsndGF4b25vbXknXVswXSA/PyBudWxsLCAndHlwZSc9PiRtWydmaWx0ZXJfdHlwZSddWzBdID8/IG51bGwsCiAgICAgJ3NsdWcnPT4kbVsnc2x1ZyddWzBdID8/IG51bGwsICd0ZXJtcyc9Pmlzc2V0KCRtWyd0ZXJtcyddWzBdKT8gc3Vic3RyKG1heWJlX3NlcmlhbGl6ZSgkbVsndGVybXMnXVswXSksMCwzMDApOm51bGxdOwogfQogJG9bJ3lpdGhfZmlsdHJ1X21ldGEnXT0kZm07CgogLy8gNykgYXIgcmVnaXN0cnVvdGFzIGF0cmlidXRhcyBwcm9kdWt0dW9zZSAoX3Byb2R1Y3RfYXR0cmlidXRlcykg4oCUIHBhdnl6ZHlzCiAkb1snYXR0cl90YXhvbm9teV9leGlzdHMnXSA9IHRheG9ub215X2V4aXN0cygncGFfbW9ub3Byb3RlaW4nKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const VER='MONO1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Mono Recon v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id;
  await miegok(8000);
  const r=await fx(WP+'/?ps_mono9=GO',{headers:{'Cache-Control':'no-cache'}},'db');
  const t=await r.text(); try{ out.db=JSON.parse(t); }catch(e){ out.db_zalias=t.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}

// HTML zvalgyba
const urls={
 raimio_p4: WP+'/kategorija/sunims/maistas-sunims/page/4?yith_wcan=1&product_cat=maistas-sunims',
 p1_svarus: WP+'/kategorija/sunims/maistas-sunims/',
 p1_filtras: WP+'/kategorija/sunims/maistas-sunims/?filter_monoprotein=taip',
 p4_filtras: WP+'/kategorija/sunims/maistas-sunims/page/4/?filter_monoprotein=taip'
};
out.html={};
for(const [k,u] of Object.entries(urls)){
  try{
    const r=await fx(u,{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},k);
    const h=await r.text();
    const prek=(h.match(/woocommerce-loop-product__title/g)||[]).length;
    const af=h.match(/yith-wcan-active-filters[\s\S]{0,1200}?<\/div>/);
    const rez=h.match(/woocommerce-result-count[\s\S]{0,200}?<\/p>/);
    out.html[k]={ statusas:r.status, prekiu_korteliu:prek,
      aktyvus_filtrai: af? af[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,300):null,
      rezultatu_eilute: rez? rez[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,200):null,
      yra_mono_nuoroda: /monoprotein/i.test(h) };
  }catch(e){ out.html[k]={klaida:String(e).slice(0,200)}; }
}
await put('deploy/mono_recon.json', Buffer.from(JSON.stringify(out,null,1)), VER);
