process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIExQIFRhcmlmYWkgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2xwdCddKSB8fCAkX0dFVFsncHNfbHB0J10hPT0nTFAyMDI2MDgyNlQnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkVD1hcnJheSgndic9PidMUFQxJywndHMnPT5nbWRhdGUoJ2MnKSk7CiAkTVU9V1BNVV9QTFVHSU5fRElSOyAkQkFLPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKCiAkdXJsPSdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS9wZXRzaG9wLWZha3Qtc2l1bnRvcy5iNjQ/cmVmPTIzODYzMDg3YzgyMDI4MGNjZjdhMDBmYjAxYzU4MDA1ZGE4YTM4OTYnOwogJHI9d3BfcmVtb3RlX2dldCgkdXJsLGFycmF5KCd0aW1lb3V0Jz0+MjUsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL3ZuZC5naXRodWIucmF3JywnVXNlci1BZ2VudCc9PidwZXRzaG9wLWJyaWRnZScpKSk7CiAkbz1hcnJheSgpOwogaWYoaXNfd3BfZXJyb3IoJHIpKSAkb1sna2xhaWRhJ109JHItPmdldF9lcnJvcl9tZXNzYWdlKCk7CiBlbHNlaWYod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpIT09MjAwKSAkb1sna2xhaWRhJ109J0hUVFAgJy53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7CiBlbHNlewogICAka29kYXM9YmFzZTY0X2RlY29kZSh0cmltKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSksdHJ1ZSk7CiAgIGlmKCRrb2Rhcz09PWZhbHNlKXsgJG9bJ2tsYWlkYSddPSdiYXNlNjQnOyB9CiAgIGVsc2V7CiAgICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk7ICRvWydzaW50YWtzZSddPSdPSyc7IH0KICAgICBjYXRjaChQYXJzZUVycm9yICRlKXsgJG9bJ3NpbnRha3NlJ109J1BhcnNlRXJyb3I6ICcuJGUtPmdldE1lc3NhZ2UoKS4nIGVpbC4nLiRlLT5nZXRMaW5lKCk7ICRvWydrbGFpZGEnXT0nc2ludGFrc2UnOyB9CiAgICAgaWYoZW1wdHkoJG9bJ2tsYWlkYSddKSl7CiAgICAgICAkaz0kTVUuJy9wZXRzaG9wLWZha3Qtc2l1bnRvcy5waHAnOwogICAgICAgJG9bJ21kNV9wcmllcyddPW1kNV9maWxlKCRrKTsKICAgICAgICRiaz0kQkFLLicvcGV0c2hvcC1mYWt0LXNpdW50b3MucGhwLmJha19scF8nLmdtZGF0ZSgnWW1kX0hpcycpOwogICAgICAgJG9bJ2JhY2t1cCddPUBjb3B5KCRrLCRiayk/YmFzZW5hbWUoJGJrKTonTkVQQVZZS08nOwogICAgICAgaWYoJG9bJ2JhY2t1cCddPT09J05FUEFWWUtPJyl7ICRvWydrbGFpZGEnXT0nYmFja3VwIG5lcGF2eWtvJzsgfQogICAgICAgZWxzZXsKICAgICAgICAgJG9bJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkaywka29kYXMpOwogICAgICAgICBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrKTsgJG9bJ21kNV9wbyddPW1kNV9maWxlKCRrKTsKICAgICAgICAgJG9bJ3N1dGFtcGEnXT0oJG9bJ21kNV9wbyddPT09bWQ1KCRrb2RhcykpOwogICAgICAgfQogICAgIH0KICAgfQogfQogJFRbJ2RlcGxveSddPSRvOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo=';
const KEY='LP20260826T'; const VER='LPT1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP LP Tarifai v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_lpt='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/lp_deploy.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,900); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/lp_deployrun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
