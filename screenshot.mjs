process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1OSddKSB8fCAkX0dFVFsncHNfaDI1OSddIT09J1JVTjIwMjYwODI0SCcpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNTlBJyk7CiAkZGlyPVdQX1BMVUdJTl9ESVI7ICRoaXRzPWFycmF5KCk7CiBmb3JlYWNoKGdsb2IoJGRpci4nLyp2ZW5pcGFrKi8qKi8qLnBocCcpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkcykgYXMgJG49PiRsKXsgaWYocHJlZ19tYXRjaCgnL3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YXxwYWNrX251bWJlcnN8YWxyZWFkeXxqYXUuKnJlZ2lzdHJ8dHJhY2tpbmcuKmV4aXN0fHBhY2tzXFt8bWFuaWZlc3RfaWQvaScsJGwpKSAkaGl0c1tdPWJhc2VuYW1lKGRpcm5hbWUoJGYpKS4nLycuYmFzZW5hbWUoJGYpLic6Jy4oJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE3MCkpOyB9IH0KICRUWydoaXRzJ109YXJyYXlfc2xpY2UoJGhpdHMsMCw4MCk7CiAkbz13Y19nZXRfb3JkZXIoMzUwNjEpOyAkVFsnbWV0YSddPWFycmF5KCk7CiBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyBpZihzdHJpcG9zKCRtLT5rZXksJ3ZlbmlwYWsnKSE9PWZhbHNlKSAkVFsnbWV0YSddWyRtLT5rZXldPW1iX3N1YnN0cihpc19zY2FsYXIoJG0tPnZhbHVlKT8kbS0+dmFsdWU6anNvbl9lbmNvZGUoJG0tPnZhbHVlKSwwLDIwMCk7IH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg=='; const SHA='acf134590fded19457b55a474024e3ef69d3a56f';
const MD5={"petshop-desk.php": "1ea03fc40ea502aa71ea8b4eedc76d5b", "petshop-av-dropship.php": "ee77f0d0559b6981a7b15a388c67ba47"};
const out={v:'H259A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H259 v1 (venipak plugin recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h259=RUN20260824H',{},'recon'); try{ out.r=JSON.parse(await d.text()); }catch(e){ out.r='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h259run.json', Buffer.from(JSON.stringify(out,null,1)), 'H259A');
