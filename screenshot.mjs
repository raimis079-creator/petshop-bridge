process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2MyddKSB8fCAkX0dFVFsncHNfaDI2MyddIT09J1JVTjIwMjYwODI0VScpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjNBJyk7CiAkbj0oYXJyYXkpZ2V0X29wdGlvbignc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfc2V0dGluZ3MnLGFycmF5KCkpOyAkdT0kblsnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfdXNlcm5hbWUnXT8/Jyc7ICRwPSRuWydzaG9wdXBfdmVuaXBha19zaGlwcGluZ19maWVsZF9wYXNzd29yZCddPz8nJzsKIGZvcmVhY2goYXJyYXkoMzUwNjYsMzUwNjEsMzUwNjIpIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyAkVFsndXpzJ11bJGlkXT1qc29uX2RlY29kZSgoc3RyaW5nKSRvLT5nZXRfbWV0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyksdHJ1ZSk7IH0KICRyPXdwX3JlbW90ZV9wb3N0KCdodHRwczovL2dvLnZlbmlwYWsubHQvd3MvcHJpbnRfbGlzdCcsYXJyYXkoJ3RpbWVvdXQnPT40NSwnaGVhZGVycyc9PmFycmF5KCdSZWZlcmVyJz0+J2h0dHBzOi8vd29vY29tbWVyY2UuY29tLycpLCdib2R5Jz0+YXJyYXkoJ3VzZXInPT4kdSwncGFzcyc9PiRwLCdjb2RlJz0+JzA3MjY3MjYwODI0MDA1JykpKTsKICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgJFRbJ3BkZl9iNjQnXT1iYXNlNjRfZW5jb2RlKCRiKTsKIC8vIFZlbmlwYWsgdHJhY2tpbmcgLyBzaGlwbWVudCBpbmZvIHBlciBwYWNrIChqZWkgeXJhIHdzKQogZm9yZWFjaChhcnJheSgnVjA3MjY3RTEwMDAwMjYnLCdWMDcyNjdFMTAwMDAyNycpIGFzICRwayl7ICRyPXdwX3JlbW90ZV9wb3N0KCdodHRwczovL2dvLnZlbmlwYWsubHQvd3MvdHJhY2tpbmcucGhwJyxhcnJheSgndGltZW91dCc9PjMwLCdib2R5Jz0+YXJyYXkoJ3VzZXInPT4kdSwncGFzcyc9PiRwLCdjb2RlJz0+JHBrLCd0eXBlJz0+MSkpKTsgJFRbJ3RyYWNrJ11bJHBrXT1pc193cF9lcnJvcigkcik/J0VSUic6bWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSksMCwzMDApOyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='4ecf1448db9735b4b341b6c6d4ffcab89f36abaf';
const MD5={"petshop-av-tiekimas.php": "2e4c94fa158f4a7139adbf691c1f5118", "petshop-av-dropship.php": "609d2b1e3056c744ad8fb93222a9b542"};
const out={v:'H263A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H263 v1 (manifest recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h263=RUN20260824U',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,800); }
  if(out.r&&out.r.pdf_b64){ out.pdf_put=await put('screenshots/h263_manifest005.pdf', Buffer.from(out.r.pdf_b64,'base64'),'H263A'); delete out.r.pdf_b64; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h263run.json', Buffer.from(JSON.stringify(out,null,1)), 'H263A');
