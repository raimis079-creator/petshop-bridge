process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZ1bmN0aW9ucy5waHAgRGllZ2ltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX2RmJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiAkbz1bJ3YnPT4nREYxJywncmV6aW1hcyc9PiRyXTsKICRrZWxpYXM9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJzsKICRsYXVraWFtYXM9JzU0MzFkNDZjYjVhMTlhNTVjMzk3NTAxNDkzMWQyODZmJzsKICRzZW5hcyAgICA9JzA5Njg0NDk2Yzk2YmYzNGVjZTE4N2ExMTJjYzFiNzdhJzsKICRvWydlc2FtYXNfbWQ1J109bWQ1X2ZpbGUoJGtlbGlhcyk7CiBpZigkb1snZXNhbWFzX21kNSddIT09JHNlbmFzKXsgJG9bJ2tsYWlkYSddPSdmYWlsYXMgcGFzaWtlaXRlIG51byBwYXRpa3JvcyAtIFNUT0pVJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICR1cmw9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2RlcGxveS9mdW5jdGlvbnNfbmF1amFzLnBocD92PScuJGxhdWtpYW1hcy4nLScudGltZSgpOwogJHJlc3A9d3BfcmVtb3RlX2dldCgkdXJsLFsndGltZW91dCc9PjkwLCdoZWFkZXJzJz0+WydDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJ11dKTsKIGlmKGlzX3dwX2Vycm9yKCRyZXNwKSl7ICRvWydrbGFpZGEnXT0kcmVzcC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRrPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICRvWydwYXJzaXVzdGFfbWQ1J109bWQ1KCRrKTsgJG9bJ3N1dGFtcGEnXT0oJG9bJ3BhcnNpdXN0YV9tZDUnXT09PSRsYXVraWFtYXMpOwogaWYoISRvWydzdXRhbXBhJ10peyAkb1sna2xhaWRhJ109J21kNSBuZXN1dGFtcGEgLSBTVE9KVSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiB0cnl7ICR0PXRva2VuX2dldF9hbGwoJGssVE9LRU5fUEFSU0UpOyAkb1sndG9rZW51J109Y291bnQoJHQpOyAkb1snc2ludGFrc2UnXT0nb2snOyB9CiBjYXRjaChcUGFyc2VFcnJvciAkZSl7ICRvWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KIGlmKCRyPT09J0RSWScpeyAkb1sndmVpa3NtYXMnXT0nQlVUVSBJUkFTWVRBJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICR1cD13cF91cGxvYWRfZGlyKCk7ICRiPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGIpKSB3cF9ta2Rpcl9wKCRiKTsKICRvWydrb3BpamEnXT1jb3B5KCRrZWxpYXMsJGIuJy9mdW5jdGlvbnMuJy5nbWRhdGUoJ1ltZC1IaXMnKS4nLnBocCcpPydvayc6J05FUEFWWUtPJzsKIGlmKCRvWydrb3BpamEnXSE9PSdvaycpeyAkb1sna2xhaWRhJ109J2tvcGlqYSBuZXBhdnlrbyAtIFNUT0pVJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KIGZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsJGspOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrZWxpYXMpOwogJG9bJ3BvX2lyYXN5bW8nXT1tZDVfZmlsZSgka2VsaWFzKTsgJG9bJ3BhdnlrbyddPSgkb1sncG9faXJhc3ltbyddPT09JGxhdWtpYW1hcyk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg=='; const VER='DIEGFN-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS functions.php Diegimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_df=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry={sintakse:DJ&&DJ.sintakse,md5:DJ&&DJ.sutampa,tokenu:DJ&&DJ.tokenu,klaida:DJ&&DJ.klaida};
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_df=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text()); out.apply={pavyko:AJ.pavyko,kopija:AJ.kopija,po:AJ.po_irasymo}; }catch(e){} }
  await miegok(4000);
  const h=await fx(WP+'/',{headers:UA},'fe');
  out.svetaine={http:h.status, fatal:/Fatal error|Parse error/.test(await h.text())};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/diegfn_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
