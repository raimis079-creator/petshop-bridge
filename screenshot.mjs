process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52NSddKSB8fCAkX0dFVFsncHNfaW52NSddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0lOVjUnKTsKICRPSUQ9MzUwMzU7CiAkcGQ9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzJzsKIC8qIDEuIGtvbnRla3N0YXM6IGthaXAgZnJvbnRlbmQga3ZpZWNpYSBnZW5lcmF0ZSgpICovCiAkZnI9QGZpbGVfZ2V0X2NvbnRlbnRzKCRwZC4nL2luY2x1ZGVzL2Zyb250ZW5kL2NsYXNzLWZyb250ZW5kLnBocCcpOwogaWYoJGZyKXsKICAgJGxpbmVzPXByZWdfc3BsaXQoIi9cclxufFxuLyIsJGZyKTsKICAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsKXsKICAgICBpZihzdHJwb3MoJGwsJ1NlcnZpY2U6OnBkZigpLT5nZW5lcmF0ZSgnKSE9PWZhbHNlKXsKICAgICAgICRUWydrb250ZWtzdGFzJ11bXT1pbXBsb2RlKCJcbiIsYXJyYXlfc2xpY2UoJGxpbmVzLG1heCgwLCRpLTE0KSwyNikpOwogICAgIH0KICAgfQogfQogLyogMi4gUmVmbGVjdGlvbiAqLwogaWYoY2xhc3NfZXhpc3RzKCdUeWNoZVxcV0NETlxcU2VydmljZXNcXFBkZicpKXsKICAgdHJ5ewogICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnVHljaGVcXFdDRE5cXFNlcnZpY2VzXFxQZGYnLCdnZW5lcmF0ZScpOwogICAgICRwcz1hcnJheSgpOyBmb3JlYWNoKCRybS0+Z2V0UGFyYW1ldGVycygpIGFzICRwKXsgJHBzW109JHAtPmdldE5hbWUoKS4oJHAtPmlzT3B0aW9uYWwoKT8nPW9wdCc6JycpOyB9CiAgICAgJFRbJ2dlbmVyYXRlX3BhcmFtcyddPSRwczsKICAgfWNhdGNoKEV4Y2VwdGlvbiAkZSl7ICRUWydyZWZsX2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0KIH0gZWxzZSB7ICRUWydrbGFzZSddPSdUeWNoZVxcV0NETlxcU2VydmljZXNcXFBkZiBuZXJhc3RhJzsgfQogJFRbJ3NlcnZpY2Vfa2xhc2UnXT1jbGFzc19leGlzdHMoJ1R5Y2hlXFxXQ0ROXFxTZXJ2aWNlJyk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDUpOwo=';
const out={v:'INV5'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Recon v3 (generate signature)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv5=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv5.json', Buffer.from(JSON.stringify(out,null,1)), 'INV5');
