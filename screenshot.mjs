process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE0MyddKSA/ICRfR0VUWydwc19oMTQzJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogJG8gPSBhcnJheSgndic9PidIMTQzJywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdSRVpJTUFTJz0+J1JFQ09OLU9OTFknKTsKCiAvKiBrdXIgZ3l2ZW5hIFN0b2NrX1NlcnZpY2UgLyBwc19zb3VyY2VzIGxvZ2lrYSAqLwogJHZpZXRvcyA9IGFycmF5KAogICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtZnVsZmlsbG1lbnQucGhwJywKICAgV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLWZ1bGZpbGxtZW50LXNvdXJjZS5waHAnLAogKTsKICRtdSA9IGdsb2IoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC0qLnBocCcpOwogZm9yZWFjaCgkbXUgYXMgJGYpewogICAkYyA9IEBmaWxlX2dldF9jb250ZW50cygkZik7CiAgIGlmKCRjICE9PSBmYWxzZSAmJiAoc3RyaXBvcygkYywncHNfc291cmNlcycpIT09ZmFsc2UgfHwgc3RyaXBvcygkYywnU3RvY2tfU2VydmljZScpIT09ZmFsc2UpKSAkdmlldG9zW10gPSAkZjsKIH0KICRjb3JlID0gZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwJyk7CiBmb3JlYWNoKCRjb3JlIGFzICRmKXsKICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJGYpOwogICBpZigkYyAhPT0gZmFsc2UgJiYgc3RyaXBvcygkYywncHNfc291cmNlcycpIT09ZmFsc2UpICR2aWV0b3NbXSA9ICRmOwogfQogJHZpZXRvcyA9IGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJHZpZXRvcykpOwoKICRvWydmYWlsYWknXSA9IGFycmF5KCk7CiBmb3JlYWNoKCR2aWV0b3MgYXMgJGYpewogICAkb1snZmFpbGFpJ11bXSA9IGFycmF5KCdrZWxpYXMnPT5zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkZiksJ2R5ZGlzJz0+QGZpbGVzaXplKCRmKSk7CiB9CgogLyogcGlsbmFzIGZ1bGZpbGxtZW50IHR1cmlueXMgKG1hemkgZmFpbGFpKSAqLwogZm9yZWFjaChhcnJheSgnY2xhc3MtZnVsZmlsbG1lbnQucGhwJywnY2xhc3MtZnVsZmlsbG1lbnQtc291cmNlLnBocCcpIGFzICRuKXsKICAgJHAgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvJy4kbjsKICAgJG9bJ3R1cmlueXNfJy4kbl0gPSBmaWxlX2V4aXN0cygkcCkgPyBmaWxlX2dldF9jb250ZW50cygkcCkgOiAnTkVSQSc7CiB9CgogLyogaXMgZGlkZXNuaXUgZmFpbHUg4oCUIHRpayBwc19zb3VyY2VzIGtvbnRla3N0YXMgKi8KIGZvcmVhY2goJHZpZXRvcyBhcyAkZil7CiAgICRiID0gYmFzZW5hbWUoJGYpOwogICBpZihpbl9hcnJheSgkYiwgYXJyYXkoJ2NsYXNzLWZ1bGZpbGxtZW50LnBocCcsJ2NsYXNzLWZ1bGZpbGxtZW50LXNvdXJjZS5waHAnKSwgdHJ1ZSkpIGNvbnRpbnVlOwogICAkZWlsID0gQGZpbGUoJGYpOyBpZighJGVpbCkgY29udGludWU7CiAgICRpc3AgPSBhcnJheSgpOwogICBmb3JlYWNoKCRlaWwgYXMgJGk9PiRsKXsKICAgICBpZihzdHJpcG9zKCRsLCdwc19zb3VyY2VzJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRsLCdzdG9ja19xdHknKSE9PWZhbHNlCiAgICAgICAgfHwgc3RyaXBvcygkbCwncHJpb3JpdHknKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ3NldF9zdG9jaycpIT09ZmFsc2UKICAgICAgICB8fCBzdHJpcG9zKCRsLCdzdXBwbGllcl9za3UnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ2lzX3NlbGxhYmxlJykhPT1mYWxzZSl7CiAgICAgICBmb3IoJGs9bWF4KDAsJGktMyk7ICRrPD1taW4oY291bnQoJGVpbCktMSwkaSszKTsgJGsrKykgJGlzcFska109KCRrKzEpLic6ICcucnRyaW0oJGVpbFska10pOwogICAgIH0KICAgfQogICBrc29ydCgkaXNwKTsKICAgaWYoJGlzcCkgJG9bJ2tvbnRla3N0YXNfJy4kYl0gPSBpbXBsb2RlKCJcbiIsIGFycmF5X3NsaWNlKCRpc3AsMCwyMjApKTsKIH0KCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H143'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H143 ZB blokavimo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h143=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,800)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h143.json', Buffer.from(JSON.stringify(out,null,1)), 'h143 ZB blokavimo recon');
