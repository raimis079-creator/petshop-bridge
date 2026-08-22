process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyogR2F1ZHlrbGUgdjI6IHN0YXRvbWEgSVMgS0FSVE8sIGJlIGthYmxpdWtvLiBTZW5hc2lzIHR2YXJreXRvamFzCiAgIChzYXJnYXMpIGlzc2F1Z29tYXMgaXIga3ZpZWNpYW1hcyB0b2xpYXUg4oCUIG5pZWtvIG5ldXpnb3ppYS4gKi8KaWYgKCBpc19hZG1pbigpICYmICEgZGVmaW5lZCgnUFNfUjIzMicpICkgewogICAgZGVmaW5lKCdQU19SMjMyJywgMSk7CiAgICAkcHNfc2VuYXMgPSBzZXRfZXJyb3JfaGFuZGxlcihmdW5jdGlvbigkbnIsICR6aW4sICRmYWlsYXMsICRlaWwpIHVzZSAoJiRwc19zZW5hcyl7CiAgICAgICAgaWYoc3RycG9zKCR6aW4sICdQYXNzaW5nIG51bGwnKSAhPT0gZmFsc2UpewogICAgICAgICAgICAkYnQgPSBkZWJ1Z19iYWNrdHJhY2UoREVCVUdfQkFDS1RSQUNFX0lHTk9SRV9BUkdTLCAzMCk7CiAgICAgICAgICAgICRrZWxpYXMgPSBhcnJheSgpOwogICAgICAgICAgICBmb3JlYWNoKCRidCBhcyAkayl7CiAgICAgICAgICAgICAgICBpZihlbXB0eSgka1snZnVuY3Rpb24nXSkpIGNvbnRpbnVlOwogICAgICAgICAgICAgICAgJGYgPSBpc3NldCgka1snZmlsZSddKSA/IGJhc2VuYW1lKCRrWydmaWxlJ10pIDogJz8nOwogICAgICAgICAgICAgICAgJGwgPSBpc3NldCgka1snbGluZSddKSA/ICRrWydsaW5lJ10gOiAnPyc7CiAgICAgICAgICAgICAgICAka2VsaWFzW10gPSAoaXNzZXQoJGtbJ2NsYXNzJ10pID8gJGtbJ2NsYXNzJ10uJzo6JyA6ICcnKS4ka1snZnVuY3Rpb24nXS4nIEAgJy4kZi4nOicuJGw7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgJHBhcmFzYXMgPSBtZDUoaW1wbG9kZSgnfCcsIGFycmF5X3NsaWNlKCRrZWxpYXMsIDAsIDYpKSk7CiAgICAgICAgICAgICRzZW5hcyA9IGdldF9vcHRpb24oJ3BzX3IyMzBfcGFnYXV0YScsIGFycmF5KCkpOwogICAgICAgICAgICBpZighaXNfYXJyYXkoJHNlbmFzKSkgJHNlbmFzID0gYXJyYXkoKTsKICAgICAgICAgICAgaWYoaXNzZXQoJHNlbmFzWyRwYXJhc2FzXSkpIHsgJHNlbmFzWyRwYXJhc2FzXVsna2llayddKys7IH0KICAgICAgICAgICAgZWxzZWlmKGNvdW50KCRzZW5hcykgPCA2KXsKICAgICAgICAgICAgICAgICRzZW5hc1skcGFyYXNhc10gPSBhcnJheSgna2llayc9PjEsICd6aW51dGUnPT5tYl9zdWJzdHIoJHppbiwwLDkwKSwKICAgICAgICAgICAgICAgICAgICAndXJsJz0+bWJfc3Vic3RyKGlzc2V0KCRfU0VSVkVSWydSRVFVRVNUX1VSSSddKT8kX1NFUlZFUlsnUkVRVUVTVF9VUkknXTonJywgMCwgOTApLAogICAgICAgICAgICAgICAgICAgICdrZWxpYXMnPT5hcnJheV9zbGljZSgka2VsaWFzLCAwLCAxNCkpOwogICAgICAgICAgICB9CiAgICAgICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3IyMzBfcGFnYXV0YScsICRzZW5hcywgZmFsc2UpOwogICAgICAgIH0KICAgICAgICBpZihpc19jYWxsYWJsZSgkcHNfc2VuYXMpKSByZXR1cm4gY2FsbF91c2VyX2Z1bmMoJHBzX3NlbmFzLCAkbnIsICR6aW4sICRmYWlsYXMsICRlaWwpOwogICAgICAgIHJldHVybiBmYWxzZTsKICAgIH0sIEVfQUxMKTsKfQoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMzAnXSkgPyAkX0dFVFsncHNfcjIzMCddIDogJyc7CiBpZigkciAhPT0gJ1NLQUlUWVRJJyAmJiAkciAhPT0gJ1ZBTFlUSScpIHJldHVybjsKIGlmKCRyID09PSAnVkFMWVRJJyl7IGRlbGV0ZV9vcHRpb24oJ3BzX3IyMzBfcGFnYXV0YScpOyAkbyA9IGFycmF5KCd2Jz0+J1IyMzInLCdpc3ZhbHl0YSc9PidPSycpOyB9CiBlbHNlIHsgJG8gPSBhcnJheSgndic9PidSMjMyJywgJ3BhZ2F1dGEnPT5nZXRfb3B0aW9uKCdwc19yMjMwX3BhZ2F1dGEnLCAnZGFyIG5pZWtvJykpOyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R232'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const f0=await fetch(SNIP,{headers:A}); let visi=[]; try{visi=JSON.parse(await f0.text());}catch(e){}
  const esama=Array.isArray(visi)?visi.find(s=>String(s.name||'').indexOf('ZZ R230')===0):null;
  if(esama){
    await fetch(SNIP+'/'+esama.id,{method:'POST',headers:A,body:JSON.stringify({id:esama.id,code:Buffer.from(B64,'base64').toString('utf8'),active:true})});
    out.atnaujinta=esama.id;
    await miegok(6000);
    const v=await fetch(WP+'/?ps_r230=VALYTI'); try{ out.valymas=JSON.parse(await v.text()); }catch(e){ out.valymas='?'; }
    out.gaudykle='v2 AKTYVI';
  } else out.klaida='snippetas nerastas';
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r232.json', Buffer.from(JSON.stringify(out,null,1)), 'r232 gaudykle v2');
