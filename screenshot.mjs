process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEthdGFsb2dvIERpZWdpbWFzIHYxLjkgKHZhcmlhY2lqdSBqdW5naWtsaXMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAkcj0kX0dFVFsncHNfZGllZyddID8/ICcnOyBpZigkciE9PSdEUlknICYmICRyIT09J0FQUExZJykgcmV0dXJuOwogJG89Wyd2Jz0+J0RJRUcxJywncmV6aW1hcyc9PiRyXTsKICRrZWxpYXMgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogJGxhdWtpYW1hc19tZDUgPSAnYTZjMmJlNzFiZWY0ZDBiMTJlOGJmZGIyY2ExZWNhZmQnOwogJHNlbmFzX21kNSAgICAgPSAnNDRlNTQ0M2ZmYTU3OThjODgwZjQyZmQ2YjQxMTNkYzQnOwoKICRvWydlc2FtYXNfbWQ1J10gPSBmaWxlX2V4aXN0cygka2VsaWFzKSA/IG1kNV9maWxlKCRrZWxpYXMpIDogbnVsbDsKICRvWydlc2FtYXNfYmFpdHUnXSA9IGZpbGVfZXhpc3RzKCRrZWxpYXMpID8gZmlsZXNpemUoJGtlbGlhcykgOiBudWxsOwogaWYoJG9bJ2VzYW1hc19tZDUnXSAhPT0gJHNlbmFzX21kNSl7CiAgICRvWydrbGFpZGEnXT0nZmFpbGFzIGRldiBwYXNpa2VpdGUgbnVvIHBhdGlrcm9zIC0gU1RPSlUnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKIH0KICR1cmw9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2RlcGxveS9rYXRhbG9nYXNfbmF1amFzLnBocD92PScuJGxhdWtpYW1hc19tZDUuJy0nLnRpbWUoKTsKICRyZXNwPXdwX3JlbW90ZV9nZXQoJHVybCxbJ3RpbWVvdXQnPT45MCwnaGVhZGVycyc9PlsnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScsJ1ByYWdtYSc9Piduby1jYWNoZSddXSk7CiBpZihpc193cF9lcnJvcigkcmVzcCkpeyAkb1sna2xhaWRhJ109J3BhcnNpdW50aW1hczogJy4kcmVzcC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRrb2Rhcz13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAkb1sncGFyc2l1c3RhX2JhaXR1J109c3RybGVuKCRrb2Rhcyk7CiAkb1sncGFyc2l1c3RhX21kNSddPW1kNSgka29kYXMpOwogJG9bJ21kNV9zdXRhbXBhX3N1X2xhdWtpYW11J109KCRvWydwYXJzaXVzdGFfbWQ1J109PT0kbGF1a2lhbWFzX21kNSk7CiBpZighJG9bJ21kNV9zdXRhbXBhX3N1X2xhdWtpYW11J10peyAkb1sna2xhaWRhJ109J3BhcnNpdXN0byBmYWlsbyBtZDUgbmVzdXRhbXBhIC0gU1RPSlUnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQoKIC8vIHNpbnRha3NlcyBwYXRpa3JhCiB0cnkgeyAkdD10b2tlbl9nZXRfYWxsKCRrb2RhcywgVE9LRU5fUEFSU0UpOyAkb1sndG9rZW51J109Y291bnQoJHQpOyAkb1snc2ludGFrc2UnXT0nb2snOyB9CiBjYXRjaCAoXFBhcnNlRXJyb3IgJGUpeyAkb1snc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogaWYoJHI9PT0nRFJZJyl7ICRvWyd2ZWlrc21hcyddPSdCVVRVIElSQVNZVEEnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OyB9CgogJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGJkaXI9JHVwWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzJzsKIGlmKCFpc19kaXIoJGJkaXIpKSB3cF9ta2Rpcl9wKCRiZGlyKTsKICRia3A9JGJkaXIuJy9wZXRzaG9wLWthdGFsb2dhcy4nLmdtZGF0ZSgnWW1kLUhpcycpLicucGhwJzsKICRvWydrb3BpamEnXT0gY29weSgka2VsaWFzLCRia3ApID8gJGJrcCA6ICdORVBBVllLTyc7CiBpZigkb1sna29waWphJ109PT0nTkVQQVZZS08nKXsgJG9bJ2tsYWlkYSddPSdrb3BpamEgbmVwYXZ5a28gLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogJG49ZmlsZV9wdXRfY29udGVudHMoJGtlbGlhcywka29kYXMpOwogY2xlYXJzdGF0Y2FjaGUodHJ1ZSwka2VsaWFzKTsKICRvWydpcmFzeXRhX2JhaXR1J109JG47CiAkb1sncG9faXJhc3ltb19tZDUnXT1tZDVfZmlsZSgka2VsaWFzKTsKICRvWydwYXZ5a28nXT0oJG9bJ3BvX2lyYXN5bW9fbWQ1J109PT0kbGF1a2lhbWFzX21kNSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg=='; const VER='DIEG-v1.9'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Katalogo Diegimas v1.9 (variaciju jungiklis)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dieg=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry={sintakse:DJ&&DJ.sintakse,md5:DJ&&DJ.md5_sutampa_su_laukiamu,klaida:DJ&&DJ.klaida,tokenu:DJ&&DJ.tokenu};
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_dieg=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text()); out.apply={pavyko:AJ.pavyko,kopija:AJ.kopija}; }catch(e){} }
  await miegok(3000);
  const h=await fx(WP+'/wp-admin/admin.php?page=ps-katalogas',{headers:UA},'lang');
  out.langas={http:h.status, fatal:/Fatal error|Parse error/.test(await h.text())};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/dieg12_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
