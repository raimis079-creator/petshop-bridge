process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2MiddKSB8fCAkX0dFVFsncHNfaDI2MiddIT09J1JVTjIwMjYwODI0UCcpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjJBJyk7CiAkbj0oYXJyYXkpZ2V0X29wdGlvbignc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfc2V0dGluZ3MnLGFycmF5KCkpOyAkdT0kblsnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfdXNlcm5hbWUnXT8/Jyc7ICRwPSRuWydzaG9wdXBfdmVuaXBha19zaGlwcGluZ19maWVsZF9wYXNzd29yZCddPz8nJzsgJGY9JG5bJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2ZpZWxkX2xhYmVsZm9ybWF0J10/PydzdGlja2VyJzsKIGZvcmVhY2goYXJyYXkoJ29uZSc9PidWMDcyNjdFMTAwMDAyMycsJ3RocmVlJz0+J1YwNzI2N0UxMDAwMDIzLFYwNzI2N0UxMDAwMDI0LFYwNzI2N0UxMDAwMDI1JywndmYnPT4nVjA3MjY3RTEwMDAwMjInKSBhcyAkaz0+JHBrKXsKICAkcj13cF9yZW1vdGVfcG9zdCgnaHR0cHM6Ly9nby52ZW5pcGFrLmx0L3dzL3ByaW50X2xhYmVsJyxhcnJheSgndGltZW91dCc9PjQ1LCdib2R5Jz0+YXJyYXkoJ3VzZXInPT4kdSwncGFzcyc9PiRwLCdwYWNrX25vJz0+JHBrLCdmb3JtYXQnPT4kZikpKTsKICAkYj1pc193cF9lcnJvcigkcik/J0VSUiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAkVFsnbGFiZWwnXVska109YXJyYXkoJ2xlbic9PnN0cmxlbigkYiksJ2hlYWQnPT5zdWJzdHIoJGIsMCwxMjApKTsKIH0KICRyPXdwX3JlbW90ZV9wb3N0KCdodHRwczovL2dvLnZlbmlwYWsubHQvd3MvcHJpbnRfbWFuaWZlc3QnLGFycmF5KCd0aW1lb3V0Jz0+NDUsJ2JvZHknPT5hcnJheSgndXNlcic9PiR1LCdwYXNzJz0+JHAsJ3BhY2tfbm8nPT4nVjA3MjY3RTEwMDAwMjMsVjA3MjY3RTEwMDAwMjQsVjA3MjY3RTEwMDAwMjUnKSkpOwogJGI9aXNfd3BfZXJyb3IoJHIpPydFUlInOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgJFRbJ21hbmlmZXN0J109YXJyYXkoJ2xlbic9PnN0cmxlbigkYiksJ2hlYWQnPT5zdWJzdHIoJGIsMCwxMjApKTsKICRhPShhcnJheSlnZXRfb3B0aW9uKCdwc19sYWlza3VfYXJjaHl2YXMnLGFycmF5KCkpOyAkVFsnYXJjaF9odG1sJ109bWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRhWzBdWydodG1sJ10pLDAsNjAwKTsgJFRbJ2FyY2hfbGl1Y2lvbml1J109c3RycG9zKCRhWzBdWydodG1sJ10sJ0xpdWNpb25pJykhPT1mYWxzZTsKICRUWydmbXQnXT0kZjsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const SHA='d7c0eb080b44a3d526a0bd2c991d57c5dd6e6692';
const MD5={"petshop-av-tiekimas.php": "2c3aa5b3d1ecb783801128b28099ff51", "petshop-av-dropship.php": "0282655f3fb5f1abc09de5340298721c"};
const out={v:'H262A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H262 v1 (venipak label recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h262=RUN20260824P',{},'recon'); try{ out.r=JSON.parse(await d.text()); }catch(e){ out.r='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h262run.json', Buffer.from(JSON.stringify(out,null,1)), 'H262A');
