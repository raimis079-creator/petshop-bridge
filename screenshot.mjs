process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTYnXSkgfHwgJF9HRVRbJ3BzX3JlYzE2J10hPT0nUlVOJykgcmV0dXJuOwogJFQ9YXJyYXkoJ3YnPT4nUkVDMTYnKTsKICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1NpdW50b3MnKTsKICRmPSRyYy0+Z2V0RmlsZU5hbWUoKTsgJFRbJ2ZhaWxhcyddPSRmOyAkVFsnZHlkaXMnXT1maWxlc2l6ZSgkZik7CiAkVFsnc3JjJ109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkZikpOwogJHJkPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfQVZfRHJvcHNoaXAnKTsKICRUWydkcm9wX21ldG9kYWknXT1hcnJheSgpOwogZm9yZWFjaCgkcmQtPmdldE1ldGhvZHMoKSBhcyAkbSl7IGlmKCRtLT5jbGFzcz09PSRyZC0+Z2V0TmFtZSgpKSAkVFsnZHJvcF9tZXRvZGFpJ11bXT0kbS0+Z2V0TmFtZSgpOyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'REC16'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Recon H240 v1 (siuntu laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_rec16=RUN');
    const t=await d.text();
    let R=null; try{ R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,300); }
    if(R){ if(R.src){ out.put=await put('deploy/petshop-siuntu-laiskai.php.b64', Buffer.from(R.src), 'laiskai src'); delete R.src; } out.R=R; }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600); }
await put('screenshots/rec16.json', Buffer.from(JSON.stringify(out,null,1)), 'REC16');
