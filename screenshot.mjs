process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwNiddKSA/ICRfR0VUWydwc19yMjA2J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwNicpOwoKIC8qIDEuIFZpc29zIHJpbmtpbml1IGthdGVnb3Jpam9zICovCiAkdGVybXMgPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlKSk7CiAkayA9IGFycmF5KCk7CiBmb3JlYWNoKChhcnJheSkkdGVybXMgYXMgJHQpewogICBpZihpc193cF9lcnJvcigkdCkpIGNvbnRpbnVlOwogICBpZihzdHJpcG9zKCR0LT5uYW1lLCdyaW5raW4nKT09PWZhbHNlICYmIHN0cmlwb3MoJHQtPm5hbWUsJ2tyYW10Jyk9PT1mYWxzZQogICAgICAmJiBzdHJpcG9zKCR0LT5zbHVnLCdyaW5raW4nKT09PWZhbHNlICYmIHN0cmlwb3MoJHQtPnNsdWcsJ2tyYW10Jyk9PT1mYWxzZSkgY29udGludWU7CiAgICRrW10gPSBhcnJheSgnaWQnPT4kdC0+dGVybV9pZCwncGF2Jz0+JHQtPm5hbWUsJ3NsdWcnPT4kdC0+c2x1ZywndGV2YXMnPT4kdC0+cGFyZW50LCdraWVrJz0+JHQtPmNvdW50KTsKIH0KICRvWydrYXRlZ29yaWpvcyddID0gJGs7CgogLyogMi4gVmlzaSBsYXVrYWkgc3UgcGlsbmEgYnVrbGUgKi8KICRpZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX2xhdWthcycgQU5EIG1ldGFfdmFsdWU9J3llcyciKTsKICRyID0gYXJyYXkoKTsKIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAkcCA9IHdjX2dldF9wcm9kdWN0KCRpZCk7CiAgICRyW10gPSBhcnJheSgKICAgICAnSUQnPT4oaW50KSRpZCwKICAgICAncGF2Jz0+Z2V0X3RoZV90aXRsZSgkaWQpLAogICAgICdzdCc9PmdldF9wb3N0X3N0YXR1cygkaWQpLAogICAgICdncnVwZV9tZXRhJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfZ3J1cGUnLHRydWUpLAogICAgICdncnVwZV9pc3ZhZGEnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfTGF1a2FpJykgPyBQZXRzaG9wX0xhdWthaTo6Z3J1cGUoJGlkKSA6ICcnLAogICAgICdzZWltYSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX3NlaW1hJyx0cnVlKSwKICAgICAnaWVqaW1hcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX2llamltYXMnLHRydWUpLAogICAgICdtYXRvbXVtYXMnPT4kcCA/ICRwLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCkgOiAnJywKICAgICAna2F0ZWdvcmlqb3MnPT53cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLAogICAgICdwcmVraXUnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfTGF1a2FpJykgPyBjb3VudChQZXRzaG9wX0xhdWthaTo6a3JlcHN5cygkaWQpKSA6IDAsCiAgICAgJ251b3JvZGEnPT5nZXRfcGVybWFsaW5rKCRpZCksCiAgICk7CiB9CiAkb1snbGF1a2FpJ10gPSAkcjsKCiAvKiAzLiBNZW5pdSBwdW5rdGFpIOKAnlN1c2lkZWsiICovCiAkbSA9IGFycmF5KCk7CiBmb3JlYWNoKGFycmF5KDM0MjQ4LDM0MjQ5LDM0MjUwLDM0MjUxLDM0MjUyKSBhcyAkbWlkKXsKICAgJG1wID0gZ2V0X3Bvc3QoJG1pZCk7CiAgICRtW10gPSBhcnJheSgnaWQnPT4kbWlkLCdwYXYnPT4kbXA/JG1wLT5wb3N0X3RpdGxlOidORVJBJywndXJsJz0+Z2V0X3Bvc3RfbWV0YSgkbWlkLCdfbWVudV9pdGVtX3VybCcsdHJ1ZSkpOwogfQogJG9bJ21lbml1J10gPSAkbTsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKIGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R206'};
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
  const kunas=JSON.stringify({name:'TEMP R206 Kramtalai recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r206=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,500); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r206.json', Buffer.from(JSON.stringify(out,null,1)), 'r206 kramtalai recon');
