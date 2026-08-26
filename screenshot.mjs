process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEF0c2FyZ29zIHYxMQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfYXYxMSddKSB8fCAkX0dFVFsncHNfYXYxMSddIT09J0FWMTEyMDI2MDgyNicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRUPWFycmF5KCd2Jz0+J0FWMTEnLCd0cyc9PmdtZGF0ZSgnYycpKTsKICRNVT1XUE1VX1BMVUdJTl9ESVI7ICRrPSRNVS4nL3BldHNob3AtZmFrdC1hdHNhcmdvcy5waHAnOwogJGRhYmFyPW1kNV9maWxlKCRrKTsgJFRbJ21kNV9zZXJ2ZXJ5amUnXT0kZGFiYXI7CiBpZigkZGFiYXIhPT0nNjMzODU1ZjM0Y2FjYWM2N2Q2OWIzZDI5NjE3ZmVjNzQnKXsgJFRbJ2tsYWlkYSddPSdTVE9QOiBzZXJ2ZXJ5amUgbmUgdjEuMCc7IH0KIGVsc2V7CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvcGV0c2hvcC1mYWt0LWF0c2FyZ29zLmI2ND9yZWY9NmEwNmY4ZDlmYzViZGEyZTljZDc1MjA2NmFjODlhZTdkM2RhNGQzOCcsCiAgICAgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5yYXcnLCdVc2VyLUFnZW50Jz0+J3BldHNob3AtYnJpZGdlJykpKTsKICAkbz1hcnJheSgpOwogIGlmKGlzX3dwX2Vycm9yKCRyKSkgJG9bJ2tsYWlkYSddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOwogIGVsc2VpZih3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcikhPT0yMDApICRvWydrbGFpZGEnXT0nSFRUUCAnLndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICBlbHNlewogICAgJGtvZGFzPWJhc2U2NF9kZWNvZGUodHJpbSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpLHRydWUpOwogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk7ICRvWydzaW50YWtzZSddPSdPSyc7IH0KICAgIGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkb1sna2xhaWRhJ109J1BhcnNlRXJyb3I6ICcuJGUtPmdldE1lc3NhZ2UoKS4nIGVpbC4nLiRlLT5nZXRMaW5lKCk7IH0KICAgIGlmKGVtcHR5KCRvWydrbGFpZGEnXSkpewogICAgICBAY29weSgkayxXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcy9wZXRzaG9wLWZha3QtYXRzYXJnb3MucGhwLmJha18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgJG9bJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkaywka29kYXMpOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrKTsKICAgICAgJG9bJ21kNV9wbyddPW1kNV9maWxlKCRrKTsgJG9bJ3N1dGFtcGEnXT0oJG9bJ21kNV9wbyddPT09Jzc5ZmQyN2NhZjQxZmVjNTJiN2JkMWYyMTE4YjA4ZjJhJyk7CiAgICB9CiAgfQogICRUWydkZXBsb3knXT0kbzsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const KEY='AV1120260826'; const VER='AV11';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Atsargos v11',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_av11='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status;
  try{ const r=JSON.parse(txt); await put('deploy/av11.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,700); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/av11run.json', Buffer.from(JSON.stringify(out,null,1)), VER);
