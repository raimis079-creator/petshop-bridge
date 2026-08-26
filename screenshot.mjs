process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFJlc3RvcmUgdjEzCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19yc3QnXSkgfHwgJF9HRVRbJ3BzX3JzdCddIT09J1JTVDIwMjYwODI2JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJFQ9YXJyYXkoJ3YnPT4nUlNUMScsJ3RzJz0+Z21kYXRlKCdjJykpOwogJE1VPVdQTVVfUExVR0lOX0RJUjsKICR1cmw9J2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95L3Jlc3RvcmVfdjEzLmI2ND9yZWY9ZTIyYzEyNDUxNWY0NWJkYmM3NmQ2NjJmODdiNDdkYzhiMDkwZTk1Nyc7CiAkcj13cF9yZW1vdGVfZ2V0KCR1cmwsYXJyYXkoJ3RpbWVvdXQnPT4yNSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5yYXcnLCdVc2VyLUFnZW50Jz0+J3BldHNob3AtYnJpZGdlJykpKTsKICRvPWFycmF5KCk7CiBpZihpc193cF9lcnJvcigkcikpICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKIGVsc2VpZih3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcikhPT0yMDApICRvWydrbGFpZGEnXT0nSFRUUCAnLndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKIGVsc2V7CiAgICRrb2Rhcz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSx0cnVlKTsKICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk7ICRvWydzaW50YWtzZSddPSdPSyc7IH0KICAgY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRvWydrbGFpZGEnXT0nUGFyc2VFcnJvcjogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgIGlmKGVtcHR5KCRvWydrbGFpZGEnXSkpewogICAgICRrPSRNVS4nL3BldHNob3AtZmFrdC1zaXVudG9zLnBocCc7CiAgICAgJG9bJ21kNV9wcmllcyddPW1kNV9maWxlKCRrKTsKICAgICAkb1snaXJhc3l0YSddPWZpbGVfcHV0X2NvbnRlbnRzKCRrLCRrb2Rhcyk7CiAgICAgY2xlYXJzdGF0Y2FjaGUodHJ1ZSwkayk7ICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkayk7CiAgICAgJG9bJ2F0c3RhdHl0YV9pJ109J2E5MGJmODBlZjY3N2IwY2Y3MzU3NTM4MWQwZjgxYzRiJzsKICAgICAkb1snc3V0YW1wYSddPSgkb1snbWQ1X3BvJ109PT0nYTkwYmY4MGVmNjc3YjBjZjczNTc1MzgxZDBmODFjNGInKTsKICAgfQogfQogJFRbJ3Jlc3RvcmUnXT0kbzsKICRUWydrbGFzZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9GYWt0X1NpdW50b3MnKT9QZXRzaG9wX0Zha3RfU2l1bnRvczo6VkVSU0lKQTonPyc7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJFQpOyBleGl0Owp9LDUpOwo=';
const KEY='RST20260826'; const VER='RST1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Restore v13',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_rst='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/restore.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,900); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/restorerun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
