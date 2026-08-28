process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEthdGFsb2dvIERpZWdpbWFzIHYxLjQgKGJyZW5kYXMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAkcj0kX0dFVFsncHNfZGllZyddID8/ICcnOyBpZigkciE9PSdEUlknICYmICRyIT09J0FQUExZJykgcmV0dXJuOwogJG89Wyd2Jz0+J0RJRUcxJywncmV6aW1hcyc9PiRyXTsKICRrZWxpYXMgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogJGxhdWtpYW1hc19tZDUgPSAnY2E1MWEzZGYzMmVjZDEyZTg2MDgwMDgxODBiZmU2ZGYnOwogJHNlbmFzX21kNSAgICAgPSAnMzVmYWRhYTE5NmI2MGY1ZTM2YzQxNDU0NWMwNzVjM2EnOwoKICRvWydlc2FtYXNfbWQ1J10gPSBmaWxlX2V4aXN0cygka2VsaWFzKSA/IG1kNV9maWxlKCRrZWxpYXMpIDogbnVsbDsKICRvWydlc2FtYXNfYmFpdHUnXSA9IGZpbGVfZXhpc3RzKCRrZWxpYXMpID8gZmlsZXNpemUoJGtlbGlhcykgOiBudWxsOwogaWYoJG9bJ2VzYW1hc19tZDUnXSAhPT0gJHNlbmFzX21kNSl7CiAgICRvWydrbGFpZGEnXT0nZmFpbGFzIGRldiBwYXNpa2VpdGUgbnVvIHBhdGlrcm9zIC0gU1RPSlUnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKIH0KICR1cmw9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2RlcGxveS9rYXRhbG9nYXNfbmF1amFzLnBocCc7CiAkcmVzcD13cF9yZW1vdGVfZ2V0KCR1cmwsWyd0aW1lb3V0Jz0+OTBdKTsKIGlmKGlzX3dwX2Vycm9yKCRyZXNwKSl7ICRvWydrbGFpZGEnXT0ncGFyc2l1bnRpbWFzOiAnLiRyZXNwLT5nZXRfZXJyb3JfbWVzc2FnZSgpOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJGtvZGFzPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICRvWydwYXJzaXVzdGFfYmFpdHUnXT1zdHJsZW4oJGtvZGFzKTsKICRvWydwYXJzaXVzdGFfbWQ1J109bWQ1KCRrb2Rhcyk7CiAkb1snbWQ1X3N1dGFtcGFfc3VfbGF1a2lhbXUnXT0oJG9bJ3BhcnNpdXN0YV9tZDUnXT09PSRsYXVraWFtYXNfbWQ1KTsKIGlmKCEkb1snbWQ1X3N1dGFtcGFfc3VfbGF1a2lhbXUnXSl7ICRvWydrbGFpZGEnXT0ncGFyc2l1c3RvIGZhaWxvIG1kNSBuZXN1dGFtcGEgLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogLy8gc2ludGFrc2VzIHBhdGlrcmEKIHRyeSB7ICR0PXRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7ICRvWyd0b2tlbnUnXT1jb3VudCgkdCk7ICRvWydzaW50YWtzZSddPSdvayc7IH0KIGNhdGNoIChcUGFyc2VFcnJvciAkZSl7ICRvWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiBpZigkcj09PSdEUlknKXsgJG9bJ3ZlaWtzbWFzJ109J0JVVFUgSVJBU1lUQSc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KCiAkdXA9d3BfdXBsb2FkX2RpcigpOyAkYmRpcj0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOwogaWYoIWlzX2RpcigkYmRpcikpIHdwX21rZGlyX3AoJGJkaXIpOwogJGJrcD0kYmRpci4nL3BldHNob3Ata2F0YWxvZ2FzLicuZ21kYXRlKCdZbWQtSGlzJykuJy5waHAnOwogJG9bJ2tvcGlqYSddPSBjb3B5KCRrZWxpYXMsJGJrcCkgPyAkYmtwIDogJ05FUEFWWUtPJzsKIGlmKCRvWydrb3BpamEnXT09PSdORVBBVllLTycpeyAkb1sna2xhaWRhJ109J2tvcGlqYSBuZXBhdnlrbyAtIFNUT0pVJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiAkbj1maWxlX3B1dF9jb250ZW50cygka2VsaWFzLCRrb2Rhcyk7CiBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrZWxpYXMpOwogJG9bJ2lyYXN5dGFfYmFpdHUnXT0kbjsKICRvWydwb19pcmFzeW1vX21kNSddPW1kNV9maWxlKCRrZWxpYXMpOwogJG9bJ3BhdnlrbyddPSgkb1sncG9faXJhc3ltb19tZDUnXT09PSRsYXVraWFtYXNfbWQ1KTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='DIEG-v1.4'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Katalogo Diegimas v1.4 (brendas)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dieg=DRY',{headers:UA},'dry'); const dt=await d.text();
  let DJ=null; try{ DJ=JSON.parse(dt); }catch(e){ out.dry_zalias=dt.slice(0,900); }
  out.dry=DJ;
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_dieg=APPLY',{headers:UA},'apply'); const at=await a.text();
    try{ out.apply=JSON.parse(at); }catch(e){ out.apply_zalias=at.slice(0,900); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/dieg5_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
