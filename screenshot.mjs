process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEthdGFsb2dvIERpZWdpbWFzIHYyLjAgKHZhcm5lbGUgKyByeXN5cykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyPSRfR0VUWydwc19kaWVnJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiAkbz1bJ3YnPT4nRElFRzEnLCdyZXppbWFzJz0+JHJdOwogJGtlbGlhcyA9IFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAkbGF1a2lhbWFzX21kNSA9ICcwMTYyYTA4MWY5YjBkM2Q5YmU5YjY1OGFhYTM2NWVmNic7CiAkc2VuYXNfbWQ1ICAgICA9ICdhNmMyYmU3MWJlZjRkMGIxMmU4YmZkYjJjYTFlY2FmZCc7CgogJG9bJ2VzYW1hc19tZDUnXSA9IGZpbGVfZXhpc3RzKCRrZWxpYXMpID8gbWQ1X2ZpbGUoJGtlbGlhcykgOiBudWxsOwogJG9bJ2VzYW1hc19iYWl0dSddID0gZmlsZV9leGlzdHMoJGtlbGlhcykgPyBmaWxlc2l6ZSgka2VsaWFzKSA6IG51bGw7CiBpZigkb1snZXNhbWFzX21kNSddICE9PSAkc2VuYXNfbWQ1KXsKICAgJG9bJ2tsYWlkYSddPSdmYWlsYXMgZGV2IHBhc2lrZWl0ZSBudW8gcGF0aWtyb3MgLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OwogfQogJHVybD0naHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZGVwbG95L2thdGFsb2dhc19uYXVqYXMucGhwP3Y9Jy4kbGF1a2lhbWFzX21kNS4nLScudGltZSgpOwogJHJlc3A9d3BfcmVtb3RlX2dldCgkdXJsLFsndGltZW91dCc9PjkwLCdoZWFkZXJzJz0+WydDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJywnUHJhZ21hJz0+J25vLWNhY2hlJ11dKTsKIGlmKGlzX3dwX2Vycm9yKCRyZXNwKSl7ICRvWydrbGFpZGEnXT0ncGFyc2l1bnRpbWFzOiAnLiRyZXNwLT5nZXRfZXJyb3JfbWVzc2FnZSgpOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJGtvZGFzPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICRvWydwYXJzaXVzdGFfYmFpdHUnXT1zdHJsZW4oJGtvZGFzKTsKICRvWydwYXJzaXVzdGFfbWQ1J109bWQ1KCRrb2Rhcyk7CiAkb1snbWQ1X3N1dGFtcGFfc3VfbGF1a2lhbXUnXT0oJG9bJ3BhcnNpdXN0YV9tZDUnXT09PSRsYXVraWFtYXNfbWQ1KTsKIGlmKCEkb1snbWQ1X3N1dGFtcGFfc3VfbGF1a2lhbXUnXSl7ICRvWydrbGFpZGEnXT0ncGFyc2l1c3RvIGZhaWxvIG1kNSBuZXN1dGFtcGEgLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogLy8gc2ludGFrc2VzIHBhdGlrcmEKIHRyeSB7ICR0PXRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7ICRvWyd0b2tlbnUnXT1jb3VudCgkdCk7ICRvWydzaW50YWtzZSddPSdvayc7IH0KIGNhdGNoIChcUGFyc2VFcnJvciAkZSl7ICRvWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiBpZigkcj09PSdEUlknKXsgJG9bJ3ZlaWtzbWFzJ109J0JVVFUgSVJBU1lUQSc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KCiAkdXA9d3BfdXBsb2FkX2RpcigpOyAkYmRpcj0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOwogaWYoIWlzX2RpcigkYmRpcikpIHdwX21rZGlyX3AoJGJkaXIpOwogJGJrcD0kYmRpci4nL3BldHNob3Ata2F0YWxvZ2FzLicuZ21kYXRlKCdZbWQtSGlzJykuJy5waHAnOwogJG9bJ2tvcGlqYSddPSBjb3B5KCRrZWxpYXMsJGJrcCkgPyAkYmtwIDogJ05FUEFWWUtPJzsKIGlmKCRvWydrb3BpamEnXT09PSdORVBBVllLTycpeyAkb1sna2xhaWRhJ109J2tvcGlqYSBuZXBhdnlrbyAtIFNUT0pVJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiAkbj1maWxlX3B1dF9jb250ZW50cygka2VsaWFzLCRrb2Rhcyk7CiBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrZWxpYXMpOwogJG9bJ2lyYXN5dGFfYmFpdHUnXT0kbjsKICRvWydwb19pcmFzeW1vX21kNSddPW1kNV9maWxlKCRrZWxpYXMpOwogJG9bJ3BhdnlrbyddPSgkb1sncG9faXJhc3ltb19tZDUnXT09PSRsYXVraWFtYXNfbWQ1KTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='DIEG-v2.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Katalogo Diegimas v2.0 (varnele)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dieg=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry={sintakse:DJ&&DJ.sintakse,md5:DJ&&DJ.md5_sutampa_su_laukiamu,tokenu:DJ&&DJ.tokenu,klaida:DJ&&DJ.klaida};
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_dieg=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text()); out.apply={pavyko:AJ.pavyko,kopija:AJ.kopija}; }catch(e){} }
  await miegok(3000);
  const h=await fx(WP+'/wp-admin/admin.php?page=ps-katalogas',{headers:UA},'lang');
  out.langas={http:h.status, fatal:/Fatal error|Parse error/.test(await h.text())};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/dieg13_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
