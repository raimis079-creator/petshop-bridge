process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZ1bmN0aW9ucy5waHAgRGllZ2ltYXMgdjEuMSAoa3JlcHNlbGlvIGp1b3N0YSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyPSRfR0VUWydwc19kZiddID8/ICcnOyBpZigkciE9PSdEUlknICYmICRyIT09J0FQUExZJykgcmV0dXJuOwogJG89Wyd2Jz0+J0RGMScsJ3JlemltYXMnPT4kcl07CiAka2VsaWFzPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7CiAkbGF1a2lhbWFzPSc1NWY1NjEzOThkM2Y2ZTc0NWI5M2U0ZDdkM2Q4OTVhMic7CiAkc2VuYXMgICAgPSc1NDMxZDQ2Y2I1YTE5YTU1YzM5NzUwMTQ5MzFkMjg2Zic7CiAkb1snZXNhbWFzX21kNSddPW1kNV9maWxlKCRrZWxpYXMpOwogaWYoJG9bJ2VzYW1hc19tZDUnXSE9PSRzZW5hcyl7ICRvWydrbGFpZGEnXT0nZmFpbGFzIHBhc2lrZWl0ZSBudW8gcGF0aWtyb3MgLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAkdXJsPSdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvbWFpbi9kZXBsb3kvZnVuY3Rpb25zX25hdWphcy5waHA/dj0nLiRsYXVraWFtYXMuJy0nLnRpbWUoKTsKICRyZXNwPXdwX3JlbW90ZV9nZXQoJHVybCxbJ3RpbWVvdXQnPT45MCwnaGVhZGVycyc9PlsnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZSddXSk7CiBpZihpc193cF9lcnJvcigkcmVzcCkpeyAkb1sna2xhaWRhJ109JHJlc3AtPmdldF9lcnJvcl9tZXNzYWdlKCk7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAkaz13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAkb1sncGFyc2l1c3RhX21kNSddPW1kNSgkayk7ICRvWydzdXRhbXBhJ109KCRvWydwYXJzaXVzdGFfbWQ1J109PT0kbGF1a2lhbWFzKTsKIGlmKCEkb1snc3V0YW1wYSddKXsgJG9bJ2tsYWlkYSddPSdtZDUgbmVzdXRhbXBhIC0gU1RPSlUnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogdHJ5eyAkdD10b2tlbl9nZXRfYWxsKCRrLFRPS0VOX1BBUlNFKTsgJG9bJ3Rva2VudSddPWNvdW50KCR0KTsgJG9bJ3NpbnRha3NlJ109J29rJzsgfQogY2F0Y2goXFBhcnNlRXJyb3IgJGUpeyAkb1snc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiBpZigkcj09PSdEUlknKXsgJG9bJ3ZlaWtzbWFzJ109J0JVVFUgSVJBU1lUQSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OyB9CiAkdXA9d3BfdXBsb2FkX2RpcigpOyAkYj0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRiKSkgd3BfbWtkaXJfcCgkYik7CiAkb1sna29waWphJ109Y29weSgka2VsaWFzLCRiLicvZnVuY3Rpb25zLicuZ21kYXRlKCdZbWQtSGlzJykuJy5waHAnKT8nb2snOidORVBBVllLTyc7CiBpZigkb1sna29waWphJ10hPT0nb2snKXsgJG9bJ2tsYWlkYSddPSdrb3BpamEgbmVwYXZ5a28gLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiBmaWxlX3B1dF9jb250ZW50cygka2VsaWFzLCRrKTsgY2xlYXJzdGF0Y2FjaGUodHJ1ZSwka2VsaWFzKTsKICRvWydwb19pcmFzeW1vJ109bWQ1X2ZpbGUoJGtlbGlhcyk7ICRvWydwYXZ5a28nXT0oJG9bJ3BvX2lyYXN5bW8nXT09PSRsYXVraWFtYXMpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='DIEGFN-v1.1'; const out={v:VER};
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS functions.php Diegimas v1.1 (krepselio juosta)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_df=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry={sintakse:DJ&&DJ.sintakse,md5:DJ&&DJ.sutampa,tokenu:DJ&&DJ.tokenu,klaida:DJ&&DJ.klaida};
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_df=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text()); out.apply={pavyko:AJ.pavyko,po:AJ.po_irasymo}; }catch(e){} }
  await miegok(4000);
  const h=await fx(WP+'/',{headers:UA},'fe');
  out.svetaine={http:h.status, fatal:/Fatal error|Parse error/.test(await h.text())};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/diegfn2_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
