process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIwNyddKSB8fCAkX0dFVFsncHNfaDIwNyddIT09J1JVTicpIHJldHVybjsKICRmID0gV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnOwogJGMgPSBmaWxlX2dldF9jb250ZW50cygkZik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PidIMjA3JywnZHlkaXMnPT5zdHJsZW4oJGMpLCdtZDUnPT5tZDUoJGMpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKCRjKSkpOwogZXhpdDsKfSk7Cg==';
const out={v:'H207'};
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
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H207 dropship dump',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h207=RUN');
    try{ out.REZ=JSON.parse(await d.text()); }catch(e){ out.REZ='klaida'; }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h207.json', Buffer.from(JSON.stringify(out,null,1)), 'h207 dropship dump');
