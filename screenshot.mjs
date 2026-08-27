process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFJ5dGFzIDEuMiBkZXBsb3kKICovCmFkZF9hY3Rpb24oICd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CglpZiAoICEgaXNzZXQoICRfR0VUWydwc19yMTInXSApIHx8ICRfR0VUWydwc19yMTInXSAhPT0gJ0dPJyApIHsgcmV0dXJuOyB9CglnbG9iYWwgJHdwZGI7ICRvID0gYXJyYXkoICd2JyA9PiAnUjEyJyApOyAkZiA9IFdQTVVfUExVR0lOX0RJUiAuICcvcGV0c2hvcC1yeXRhcy5waHAnOyAkb1sncHJpZXMnXSA9IG1kNV9maWxlKCAkZiApOwoJJGcgPSB3cF9yZW1vdGVfZ2V0KCAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlLzNkMmU4MDJlMWEwNmRhMzRiMDE0MTllN2IxMjk2YTc5MjdhOGMxZDAvZGVwbG95L3BldHNob3Atcnl0YXMuYjY0JywgYXJyYXkoICd0aW1lb3V0JyA9PiA0MCApICk7ICRjb2RlID0gaXNfd3BfZXJyb3IoICRnICkgPyBmYWxzZSA6IGJhc2U2NF9kZWNvZGUoIHRyaW0oIHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCAkZyApICksIHRydWUgKTsKCWlmICggISAkY29kZSB8fCBtZDUoICRjb2RlICkgIT09ICdkZmRmYzAwYzE2ZWU1NmEzMDU4YjMxZTY0MmZkMTlkMycgKSB7ICRvWydrbGFpZGEnXSA9ICdwYXJzaXVzdGEgbmUgdGFpJzsgfQoJZWxzZSB7IHRyeSB7IHRva2VuX2dldF9hbGwoICRjb2RlLCBUT0tFTl9QQVJTRSApOyBjb3B5KCAkZiwgV1BfQ09OVEVOVF9ESVIgLiAnL3VwbG9hZHMvcHMtYmFja3Vwcy9wZXRzaG9wLXJ5dGFzLnBocC5iYWtfcjEyXycgLiBnbWRhdGUoICdZbWRfSGknICkgKTsgJG9bJ3Jhc3l0YSddID0gZmlsZV9wdXRfY29udGVudHMoICRmLCAkY29kZSApOyAkb1sncG8nXSA9IG1kNV9maWxlKCAkZiApOyBpZiAoIGZ1bmN0aW9uX2V4aXN0cyggJ29wY2FjaGVfaW52YWxpZGF0ZScgKSApIHsgb3BjYWNoZV9pbnZhbGlkYXRlKCAkZiwgdHJ1ZSApOyB9IH0gY2F0Y2ggKCBUaHJvd2FibGUgJGUgKSB7ICRvWydrbGFpZGEnXSA9ICd0b2tlbic7IH0gfQoJJHdwZGItPnF1ZXJ5KCAiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIgKTsKCWhlYWRlciggJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicgKTsgZWNobyB3cF9qc29uX2VuY29kZSggJG8gKTsgZXhpdDsKfSwgNSApOwo='; const B64V='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFJ5dGFzIDEuMiB2ZXIKICovCmFkZF9hY3Rpb24oICd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CglpZiAoICEgaXNzZXQoICRfR0VUWydwc19yMTJ2J10gKSB8fCAkX0dFVFsncHNfcjEydiddICE9PSAnR08nICkgeyByZXR1cm47IH0KCWdsb2JhbCAkd3BkYjsgJG8gPSBhcnJheSggJ3ZlcnNpamEnID0+IFBldHNob3BfUnl0YXM6OlZFUlNJSkEgKTsKCWZvcmVhY2ggKCBQZXRzaG9wX1J5dGFzOjpwYXRpa3JvcygpIGFzICR4ICkgeyBpZiAoIGluX2FycmF5KCAkeFsna29kYXMnXSwgYXJyYXkoICdhZHMnLCAnZmVlZHMnLCAnZmFrdGFpJyApLCB0cnVlICkgKSB7ICRvWyAkeFsna29kYXMnXSBdID0gJHhbJ2x5Z2lzJ10gLiAnIHwgJyAuICR4Wyd0ZWtzdGFzJ107IH0gfQoJJHdwZGItPnF1ZXJ5KCAiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIgKTsKCWhlYWRlciggJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicgKTsgZWNobyB3cF9qc29uX2VuY29kZSggJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREUgKTsgZXhpdDsKfSwgNSApOwo='; const VER='E4B';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  /* 1. isjungiam senus TEMP */
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  /* 2. kuriam recon snippeta */
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Rytas 1.2 deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_r12=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
  await miegok(5000);
  const c2=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Rytas 1.2 ver',code:Buffer.from(B64V,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create2');
  const vid=JSON.parse(await c2.text()).id; await miegok(9000);
  const r2=await fx(WP+'/?ps_r12v=GO',{headers:{'Cache-Control':'no-cache'}},'ver'); const t2=await r2.text();
  try{ out.ver=JSON.parse(t2); }catch(e){ out.ver_zalias=t2.slice(0,800); }
  try{ await fetch(SNIP+'/'+vid,{method:'POST',headers:A,body:JSON.stringify({id:vid,active:false})}); }catch(e){}
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/r12.json', Buffer.from(JSON.stringify(out,null,1)), VER);
