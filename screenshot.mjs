process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2NiddKSB8fCAkX0dFVFsncHNfaDI2NiddIT09J1JVTjIwMjYwODI0WScpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjZBJyk7IGdsb2JhbCAkd3BkYjsKIGZvcmVhY2goYXJyYXkoMzUwNzIsMzUwNzApIGFzICRpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCl7JFRbJGlkXT0nbmVyYSc7Y29udGludWU7fQogICRtPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ19wcmljZScsJ19yZWd1bGFyX3ByaWNlJywnX3NhbGVfcHJpY2UnLCdfbW5tX3Blcl9wcm9kdWN0X3ByaWNpbmcnLCdfbW5tX2Jhc2VfcHJpY2UnLCdfbW5tX2Jhc2VfcmVndWxhcl9wcmljZScsJ19tbm1fYmFzZV9zYWxlX3ByaWNlJywnX2Nvc3RfcHJpY2UnLCdfcGV0c2hvcF9yaW5raW55cycpIGFzICRrKXsgJG1bJGtdPWdldF9wb3N0X21ldGEoJGlkLCRrLHRydWUpOyB9CiAgJFRbJGlkXT1hcnJheSgndHlwZSc9PiRwLT5nZXRfdHlwZSgpLCdzdGF0dXMnPT4kcC0+Z2V0X3N0YXR1cygpLCdnZXRfcHJpY2UnPT4kcC0+Z2V0X3ByaWNlKCksJ2dldF9yZWd1bGFyJz0+JHAtPmdldF9yZWd1bGFyX3ByaWNlKCksJ21ldGEnPT4kbSwnbW9kaWZpZWQnPT4kcC0+Z2V0X2RhdGVfbW9kaWZpZWQoKT8kcC0+Z2V0X2RhdGVfbW9kaWZpZWQoKS0+ZGF0ZSgnWS1tLWQgSDppJyk6bnVsbCwKICAgJ25vdGVzJz0+JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT05DQVQoY29tbWVudF9kYXRlLCcgJyxMRUZUKGNvbW1lbnRfY29udGVudCw5MCkpIEZST00geyR3cGRiLT5jb21tZW50c30gV0hFUkUgY29tbWVudF9wb3N0X0lEPSVkIE9SREVSIEJZIGNvbW1lbnRfSUQgREVTQyBMSU1JVCA0IiwkaWQpKSk7CiAgaWYobWV0aG9kX2V4aXN0cygkcCwnaXNfcHJpY2VkX3Blcl9wcm9kdWN0JykpICRUWyRpZF1bJ3Blcl9wcm9kdWN0J109JHAtPmlzX3ByaWNlZF9wZXJfcHJvZHVjdCgpOwogfQogJFRbJ21ubV92ZXInXT1kZWZpbmVkKCdXQ19NaXhfYW5kX01hdGNoOjpWRVJTSU9OJyk/V0NfTWl4X2FuZF9NYXRjaDo6VkVSU0lPTjooY2xhc3NfZXhpc3RzKCdXQ19NaXhfYW5kX01hdGNoJyk/J3lyYSc6J25lcmEnKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const SHA='1b5a7af67272c7c6f9f99375918374dde35d157e';
const MD5={"petshop-desk.php": "b606c244efdf7da10f69fbc1c50668c7"};
const out={v:'H266A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H266 v1 (rinkinio kaina recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h266=RUN20260824Y',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h266run.json', Buffer.from(JSON.stringify(out,null,1)), 'H266A');
