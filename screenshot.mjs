process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMiddKSB8fCAkX0dFVFsncHNfcmVjMiddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nUkVDMicpOwogJGRpcj1XUF9QTFVHSU5fRElSLicvd2MtdmVuaXBhay1zaGlwcGluZyc7CiAkVFsnZmFpbGFpJ109YXJyYXkoKTsKICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOwogJHBocD1hcnJheSgpOwogZm9yZWFjaCgkaXQgYXMgJGYpeyBpZigkZi0+aXNGaWxlKCkpeyAkcD1zdHJfcmVwbGFjZSgkZGlyLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSk7ICRUWydmYWlsYWknXVtdPSRwLicgJy4kZi0+Z2V0U2l6ZSgpOyBpZihzdWJzdHIoJHAsLTQpPT09Jy5waHAnKSAkcGhwW109JGYtPmdldFBhdGhuYW1lKCk7IH0gfQogc29ydCgkVFsnZmFpbGFpJ10pOyAkVFsnZmFpbHVfa2llayddPWNvdW50KCRUWydmYWlsYWknXSk7ICRUWydmYWlsYWknXT1hcnJheV9zbGljZSgkVFsnZmFpbGFpJ10sMCw4MCk7CiAkVFsnZ3JlcF9waWNrdXAnXT1hcnJheSgpOwogZm9yZWFjaCgkcGhwIGFzICRwKXsKICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOwogICBpZihzdHJwb3MoJGMsJ3ZlbmlwYWtfcGlja3VwX3BvaW50JykhPT1mYWxzZSl7CiAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRuPT4kbCl7IGlmKHN0cnBvcygkbCwndmVuaXBha19waWNrdXBfcG9pbnQnKSE9PWZhbHNlKSAkVFsnZ3JlcF9waWNrdXAnXVtdPWJhc2VuYW1lKCRwKS4nOicuKCRuKzEpLicgJy50cmltKHN1YnN0cigkbCwwLDE4MCkpOyB9CiAgIH0KIH0KICRUWydncmVwX3BpY2t1cCddPWFycmF5X3NsaWNlKCRUWydncmVwX3BpY2t1cCddLDAsNDApOwogJFRbJ2dyZXBfdGVybWluYWxzJ109YXJyYXkoKTsKIGZvcmVhY2goJHBocCBhcyAkcCl7CiAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgZm9yZWFjaChhcnJheSgnZ2V0X3BpY2t1cF9wb2ludHMnLCdwaWNrdXBfcG9pbnRzJywndGVybWluYWxzJywnd3MvZ2V0X3BpY2t1cCcpIGFzICRrKXsKICAgICBpZihzdHJwb3MoJGMsJGspIT09ZmFsc2UpeyAkVFsnZ3JlcF90ZXJtaW5hbHMnXVtdPWJhc2VuYW1lKCRwKS4nIDo6ICcuJGs7IH0KICAgfQogfQogJFRbJ2dyZXBfdGVybWluYWxzJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkVFsnZ3JlcF90ZXJtaW5hbHMnXSkpOwogJFRbJ3RyYW5zaWVudGFpJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJV90cmFuc2llbnQlJyBBTkQgKG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXBpY2t1cCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV0ZXJtaW5hbCUnKSBMSU1JVCAyMCIpOwogJFRbJ2tsYXNlc192ZW5pcGFrJ109YXJyYXkoKTsKIGZvcmVhY2goZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSBhcyAkYyl7IGlmKHN0cmlwb3MoJGMsJ3ZlbmlwYWsnKSE9PWZhbHNlKSAkVFsna2xhc2VzX3ZlbmlwYWsnXVtdPSRjOyB9CiAkdD0kd3BkYi0+cHJlZml4Lidwc19zb3VyY2VzJzsKICRUWydzYWx0aW5pYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzb3VyY2UsIENPVU5UKCopIGssIFNVTShpc19zZWxsYWJsZSkgc2VsbCBGUk9NICR0IEdST1VQIEJZIHNvdXJjZSIsQVJSQVlfQSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'REC2'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Rec Uzsakymai v2 (venipak pickup)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec2=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/rec2.json', Buffer.from(JSON.stringify(out,null,1)), 'REC2');
