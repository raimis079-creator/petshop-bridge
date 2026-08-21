process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwMSddKSA/ICRfR0VUWydwc19yMjAxJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwMScpOwoKICRvWydncnVwaXVfZm90byddID0gZ2V0X29wdGlvbigncHNfbGF1a2FpX2dydXBpdV9mb3RvJyk7CiAkb1snbmF1amknXSAgICAgICA9IGdldF9vcHRpb24oJ3BzX2xhdWthaV9uYXVqaScpOwogJG9bJ3Rlc3RhaSddICAgICAgPSBnZXRfb3B0aW9uKCdwc19sYXVrYWlfdGVzdGFpJyk7CgogJGlkcyA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfbGF1a2FzJyBBTkQgbWV0YV92YWx1ZT0neWVzJyIpOwogJHNhciA9IGFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJHAgPSBnZXRfcG9zdCgkaWQpOwogICBpZighJHApIGNvbnRpbnVlOwogICAkcHJla2VzID0gZ2V0X3Bvc3RfbWV0YSgkaWQsICdfcHNfbGF1a2FzX3ByZWtlcycsIHRydWUpOwogICAkc2FyW10gPSBhcnJheSgKICAgICAnSUQnPT4oaW50KSRpZCwKICAgICAndGl0bGUnPT4kcC0+cG9zdF90aXRsZSwKICAgICAnc3RhdHVzJz0+JHAtPnBvc3Rfc3RhdHVzLAogICAgICd0aHVtYic9PihpbnQpZ2V0X3Bvc3RfdGh1bWJuYWlsX2lkKCRpZCksCiAgICAgJ2dydXBlJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfZ3J1cGUnLHRydWUpLAogICAgICdzZWltYSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX3NlaW1hJyx0cnVlKSwKICAgICAnem9kaXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthc196b2RpcycsdHJ1ZSksCiAgICAgJ2R5ZGlzJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfZHlkaXMnLHRydWUpLAogICAgICd0cnVtcGFzJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfdHJ1bXBhcycsdHJ1ZSksCiAgICAgJ3Bha29wb3MnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthc19wYWtvcG9zJyx0cnVlKSwKICAgICAnc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthc19zYW5kZWxpcycsdHJ1ZSksCiAgICAgJ2llamltYXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthc19pZWppbWFzJyx0cnVlKSwKICAgKTsKIH0KICRvWydsYXVrYWknXSA9ICRzYXI7CgogJGYgPSAoZGVmaW5lZCgnV1BNVV9QTFVHSU5fRElSJyk/V1BNVV9QTFVHSU5fRElSOldQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucycpLicvcGV0c2hvcC1sYXVrYWkucGhwJzsKICRvWydmYWlsYXMnXSA9IGFycmF5KCd5cmEnPT5maWxlX2V4aXN0cygkZiksICdkeWRpcyc9PkBmaWxlc2l6ZSgkZiksICdtZDUnPT5AbWQ1X2ZpbGUoJGYpKTsKICRvWydiNjQnXSA9IGJhc2U2NF9lbmNvZGUoKHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJGYpKTsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKIGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R201'};
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
  /* 0. isjungiam senus TEMP */
  const f0=await fetch(SNIP,{headers:A}); let visi=[]; try{visi=JSON.parse(await f0.text());}catch(e){}
  out.snippetu_kiek=Array.isArray(visi)?visi.length:'?';
  if(Array.isArray(visi)){ for(const s of visi){ if(String(s.name||'').startsWith('TEMP')&&s.active){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); out.isjungta=(out.isjungta||[]).concat(s.id); } } }
  /* 1. kuriam snippeta */
  const kunas=JSON.stringify({name:'TEMP R201 Laukai failas v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta = j&&j.id ? j.id : {s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const r=await fetch(WP+'/?ps_r201=GO'); const t=await r.text();
    try{ out.DUOM=JSON.parse(t); }catch(e){ out.DUOM={s:r.status, zalias:t.slice(0,600)}; }
    await miegok(1500);
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r201.json', Buffer.from(JSON.stringify(out,null,1)), 'r201 laukai recon');
