process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTInXSkgfHwgJF9HRVRbJ3BzX3JlYzEyJ10hPT0nUlVOJykgcmV0dXJuOwogJFQ9YXJyYXkoJ3YnPT4nUkVDMTInKTsKICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1RpZWtpbWFzJyk7CiAkZj0kcmMtPmdldEZpbGVOYW1lKCk7CiAkVFsnZmFpbGFzJ109JGY7ICRUWydkeWRpcyddPWZpbGVzaXplKCRmKTsKICRUWydzcmMnXT1iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'REC12'};
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
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Recon H236 v1 (tiekimas src)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_rec12=RUN');
    const t=await d.text();
    let R=null; try{ R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,400); }
    if(R){ if(R.src){ out.put=await put('deploy/petshop-tiekimas.php.b64', Buffer.from(R.src), 'tiekimas src'); delete R.src; } out.R=R; }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600); }
await put('screenshots/rec12.json', Buffer.from(JSON.stringify(out,null,1)), 'REC12');
