process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0NSddKSB8fCAkX0dFVFsncHNfaDI0NSddIT09J0RJQUcyMDI2MDgyNCcpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nSDI0NUQnKTsKICRUWydwYXJ0aWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRpZWtlamFzLGJ1c2VuYSxzdWt1cnRhLHV6c2FreXRhIEZST00geyR3cGRiLT5wcmVmaXh9cHNfdGlla2ltYXMgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogJFRbJ2VpbHV0ZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxwYXJ0aWphX2lkLG9yZGVyX2lkLHByb2R1Y3RfaWQscXR5LHF0eV9nYXV0YSxwYXN0YWJhIEZST00geyR3cGRiLT5wcmVmaXh9cHNfdGlla2ltYXNfZWlsIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnZWlsZScpOyAkcm0tPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcms9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2tvbnNfbGF1a2lhJyk7ICRyay0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRvcmQ9YXJyYXkoKTsKIGZvcmVhY2god2NfZ2V0X29yZGVycyhhcnJheSgnbGltaXQnPT4zMCwndHlwZSc9PidzaG9wX29yZGVyJywnb3JkZXJieSc9PidJRCcsJ29yZGVyJz0+J0RFU0MnKSkgYXMgJG8pewogIGlmKCFpc19hKCRvLCdXQ19PcmRlcicpKSBjb250aW51ZTsKICAkb3JkW109YXJyYXkoJ2lkJz0+JG8tPmdldF9pZCgpLCdzdCc9PiRvLT5nZXRfc3RhdHVzKCksCiAgICdzcHInPT4oc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX21pc3J1c19zcHJlbmRpbWFzJyksCiAgICdsYXVrJz0+KHN0cmluZykkby0+Z2V0X21ldGEoJ19wc190aWVraW1hc19sYXVraWEnKSwKICAgJ3NlbnQnPT4oc3RyaW5nKSRvLT5nZXRfbWV0YSgnX3BzX2Ryb3BzaGlwX3NlbnRfc3JjJyksCiAgICdrb25zX2xpa28nPT5jb3VudCgkcmstPmludm9rZShudWxsLCRvKSksCiAgICdlaWxlJz0+JHJtLT5pbnZva2UobnVsbCwkbykpOwogfQogJFRbJ3V6c2FreW1haSddPSRvcmQ7CiAkVFsnbm90ZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBjb21tZW50X3Bvc3RfSUQgcCxjb21tZW50X2RhdGUgZCxMRUZUKGNvbW1lbnRfY29udGVudCwxMjApIHQKICAgRlJPTSB7JHdwZGItPmNvbW1lbnRzfSBXSEVSRSBjb21tZW50X3R5cGU9J29yZGVyX25vdGUnIEFORCBjb21tZW50X2RhdGU+JzIwMjYtMDgtMjQgMDY6MDAnCiAgIE9SREVSIEJZIGNvbW1lbnRfSUQgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'H245D'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<4;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(6000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H245 diag v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h245=DIAG20260824',{},'diag');
    const tx=await d.text(); try{ out.D=JSON.parse(tx); }catch(e){ out.D='ne-json: '+tx.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h245.json', Buffer.from(JSON.stringify(out,null,1)), 'H245D');
