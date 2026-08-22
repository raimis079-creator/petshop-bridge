process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIwMyddKSB8fCAkX0dFVFsncHNfaDIwMyddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRmID0gV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXNrLnBocCc7CiAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICRvID0gYXJyYXkoJ3YnPT4nSDIwMycsJ2R5ZGlzJz0+c3RybGVuKCRjKSwnbWQ1Jz0+bWQ1KCRjKSwnYjY0Jz0+YmFzZTY0X2VuY29kZSgkYykpOwogLyogTUlYRUQgdXpzYWt5bWFpIGRldidlICovCiAkb1snbWl4ZWQnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9yZGVyX2lkIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19vcmRlcl90eXBlJyBBTkQgbWV0YV92YWx1ZT0nTUlYRUQnIExJTUlUIDUiKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvKTsKIGV4aXQ7Cn0pOwo=';
const out={v:'H203'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H203 desk dump',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h203=RUN');
    const t=await d.text();
    try{ out.REZ=JSON.parse(t); }catch(e){ out.REZ='ne-json: '+t.slice(0,300); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h203.json', Buffer.from(JSON.stringify(out,null,1)), 'h203 desk dump');
