process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI3MiddKSB8fCAkX0dFVFsncHNfaDI3MiddIT09J1JVTjIwMjYwODI1RicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNzJBJyk7IGdsb2JhbCAkd3BkYjsKICR0PW51bGw7IGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fSVzYXJnYXMlJyIpIGFzICR4KXsgJHQ9JHg7IGJyZWFrOyB9CiAkVFsnbGVudGVsZSddPSR0OwogaWYoJHQpewogICRUWydzdHVscGVsaWFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7CiAgJFRbJ2ZhdGFsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICR0IFdIRVJFIGx5Z2lzPSdmYXRhbCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA2IixBUlJBWV9BKTsKICAkVFsndG9wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbHlnaXMsemludXRlLGZhaWxhcyxlaWx1dGUsa2llayxsYWlrYXMgRlJPTSAkdCBXSEVSRSBseWdpcyBJTignZmF0YWwnLCd3YXJuaW5nJykgT1JERVIgQlkga2llayBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICRUWyd2aXNvJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiB9CiAkVFsnY3Jvbl92YWwnXT1nZXRfb3B0aW9uKCdwc19zYXJnYXNfY3Jvbl92YWxhbmRvcycsJ25lZGVmJyk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo='; const SHA='61db6827a123456d4d7cfe862fd451f87716b138';
const MD5={"petshop-rinkiniai.php": "5f79ff63ffe2e57cee87129b41e0ca32"};
const out={v:'H272A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H267 v1 (log+snippet recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h272=RUN20260825F',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h272run.json', Buffer.from(JSON.stringify(out,null,1)), 'H272A');
