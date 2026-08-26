process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDMwMyddKSB8fCAkX0dFVFsncHNfaDMwMyddIT09J1JVTjIwMjYwODI2QicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gzMDNBJyk7IGdsb2JhbCAkd3BkYjsKICRwaWQ9MzUwOTY7CiAkVFsnbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSwxMjApIHYgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPSVkIEFORCBtZXRhX2tleSBOT1QgTElLRSAnXF9lZGl0JScgT1JERVIgQlkgbWV0YV9rZXkiLCRwaWQpLEFSUkFZX0EpOwogJFRbJ2xlbnRlbGUnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfU291cmNlcycpP1BldHNob3BfU291cmNlczo6bGVudGVsZSgpOm51bGw7CiBpZigkVFsnbGVudGVsZSddKXsgJFRbJ3JlZyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JFRbJ2xlbnRlbGUnXX0gV0hFUkUgcHJvZHVjdF9pZCBJTiAoJWQsMTYzMDIpIiwkcGlkKSxBUlJBWV9BKTsgfQogLy8ga2FzIGt1cmlhIHBha3VvdGVzCiAkVFsna3VyJ109YXJyYXkoKTsKIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi97LCovfSoucGhwJyxHTE9CX0JSQUNFKSkgYXMgJGYpeyAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZigkYyE9PWZhbHNlICYmIChzdHJwb3MoJGMsJ3Bha3VvdCcpIT09ZmFsc2UpICYmIHByZWdfbWF0Y2goJy9fcHNfcGFrfHBha3VvdGVzX2tpZWtpc3xwYWt1b3RlX2JhemluZXxtdWx0aXBhY2svJywkYykpICRUWydrdXInXVtdPWJhc2VuYW1lKCRmKTsgfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'H303A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H303 v1 (pakuotes recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h303=RUN20260826B',{},'run'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h303run.json', Buffer.from(JSON.stringify(out,null,1)), 'H303A');
