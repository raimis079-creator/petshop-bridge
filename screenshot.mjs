process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFZlcnRpbXUgRGllZ2ltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoICgkX0dFVFsncHNfZHYnXSA/PyAnJykgIT09ICdBUFBMWScgKSByZXR1cm47CiAkbz1bJ3YnPT4nRFYxJ107CiAka2VsaWFzPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtdmVydGltYWkucGhwJzsKICRsYXVraWFtYXM9J2QwNGM4YmEyMDVjZjRmODhhMzhiMTZkYTViYjAzZWVlJzsKICR1cmw9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2RlcGxveS9wZXRzaG9wLXZlcnRpbWFpLnBocD92PScuJGxhdWtpYW1hcy4nLScudGltZSgpOwogJHJlc3A9d3BfcmVtb3RlX2dldCgkdXJsLFsndGltZW91dCc9PjYwLCdoZWFkZXJzJz0+WydDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJ11dKTsKIGlmKGlzX3dwX2Vycm9yKCRyZXNwKSl7ICRvWydrbGFpZGEnXT0kcmVzcC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRrPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICRvWydtZDUnXT1tZDUoJGspOyAkb1snc3V0YW1wYSddPSgkb1snbWQ1J109PT0kbGF1a2lhbWFzKTsKIGlmKCEkb1snc3V0YW1wYSddKXsgJG9bJ2tsYWlkYSddPSdtZDUgbmVzdXRhbXBhIC0gU1RPSlUnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogdHJ5eyB0b2tlbl9nZXRfYWxsKCRrLFRPS0VOX1BBUlNFKTsgJG9bJ3NpbnRha3NlJ109J29rJzsgfQogY2F0Y2goXFBhcnNlRXJyb3IgJGUpeyAkb1snc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiBpZihmaWxlX2V4aXN0cygka2VsaWFzKSl7ICR1cD13cF91cGxvYWRfZGlyKCk7ICRiPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7CiAgIGlmKCFpc19kaXIoJGIpKSB3cF9ta2Rpcl9wKCRiKTsgY29weSgka2VsaWFzLCRiLicvcGV0c2hvcC12ZXJ0aW1haS4nLmdtZGF0ZSgnWW1kLUhpcycpLicucGhwJyk7IH0KIGZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsJGspOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrZWxpYXMpOwogJG9bJ2lyYXN5dGFfbWQ1J109bWQ1X2ZpbGUoJGtlbGlhcyk7ICRvWydwYXZ5a28nXT0oJG9bJ2lyYXN5dGFfbWQ1J109PT0kbGF1a2lhbWFzKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='DIEGVERT-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Vertimu Diegimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dv=APPLY',{headers:UA},'dv');
  try{ out.diegimas=JSON.parse(await d.text()); }catch(e){}
  await miegok(4000);
  const h=await fx(WP+'/?s=maistas&post_type=product',{headers:UA},'fe'); const t=await h.text();
  out.paieska={http:h.status, anglisku:/Posts found|Products found/.test(t),
    lietuviskai:/Rasti straipsniai|Rastos prekės/.test(t), fatal:/Fatal error/.test(t)};
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/vertimai_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
