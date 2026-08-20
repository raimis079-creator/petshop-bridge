process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE0OSddKSA/ICRfR0VUWydwc19oMTQ5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE0OScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidESUFHTk9TVElLQScpOwogJGF2PWFycmF5KDE3Mzk0LDE3NDAwLDE3Mzk3LDE3NDE1KTsKICRJTj1pbXBsb2RlKCcsJywkYXYpOwoKIC8qIDEuIGFyIHlyYSBkdWJsaWthdGluaXUgX3N0b2NrIGVpbHVjaXUgKi8KICRvWydzdG9ja19laWx1dGVzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICJTRUxFQ1QgcG9zdF9pZCwgbWV0YV9pZCwgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YQogICAgV0hFUkUgcG9zdF9pZCBJTiAoJElOKSBBTkQgbWV0YV9rZXk9J19zdG9jaycgT1JERVIgQlkgcG9zdF9pZCwgbWV0YV9pZCIsIEFSUkFZX0EpOwogJG9bJ293bl9laWx1dGVzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICJTRUxFQ1QgcG9zdF9pZCwgQ09VTlQoKikga2llayBGUk9NIHskUH1wb3N0bWV0YQogICAgV0hFUkUgcG9zdF9pZCBJTiAoJElOKSBBTkQgbWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyBHUk9VUCBCWSBwb3N0X2lkIiwgQVJSQVlfQSk7CgogLyogMi4gV0MgbG9va3VwIGxlbnRlbGUgKi8KICRsdCA9ICRQLid3Y19wcm9kdWN0X21ldGFfbG9va3VwJzsKIGlmKCR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTSE9XIFRBQkxFUyBMSUtFICVzIiwkbHQpKSl7CiAgICRvWydsb29rdXAnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsIHN0b2NrX3F1YW50aXR5LCBzdG9ja19zdGF0dXMgRlJPTSAkbHQgV0hFUkUgcHJvZHVjdF9pZCBJTiAoJElOKSIsIEFSUkFZX0EpOwogfQoKIC8qIDMuIGFyIHZlaWtpYSBpc29yaW5pcyBvYmpla3R1IGtlc2FzICovCiAkb1snZXh0X29iamVjdF9jYWNoZSddID0gKGJvb2wpIHdwX3VzaW5nX2V4dF9vYmplY3RfY2FjaGUoKTsKCiAvKiA0LiBzdmFydXMgc2thaXR5bWFzIHBvIGtlc3UgdmFseW1vICovCiB3cF9jYWNoZV9mbHVzaCgpOwogY2xlYW5fcG9zdF9jYWNoZSgxNzM5NCk7CiBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygxNzM5NCk7CiAkcCA9IHdjX2dldF9wcm9kdWN0KDE3Mzk0KTsKICRvWydwb19mbHVzaCddID0gYXJyYXkoJ3djJz0+JHA/JHAtPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsCiAgICdtZXRhJz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKDE3Mzk0LCdfc3RvY2snLHRydWUpLAogICAnc3RhdHVzJz0+JHA/JHAtPmdldF9zdG9ja19zdGF0dXMoKTpudWxsKTsKCiAvKiA1LiBrYSBtYXRvIEZST05UQVMgKGxvb3BiYWNrKSAqLwogJHUgPSBnZXRfcGVybWFsaW5rKDE3Mzk0KTsKICRyID0gd3BfcmVtb3RlX2dldCgkdSwgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICRvWydmcm9udGFzX3VybCddID0gJHU7CiBpZighaXNfd3BfZXJyb3IoJHIpKXsKICAgJGggPSB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgICRvWydmcm9udGFzX2tvZGFzJ10gPSAoaW50KXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAgaWYocHJlZ19tYXRjaCgnLyhbMC05XSspXHMqKHZudHxwcmVrfHNhbmTEl2x5fGxpa3UpL2l1JywkaCwkbSkpICRvWydmcm9udGFzX2xpa3V0aXMnXT0kbVswXTsKICAgaWYocHJlZ19tYXRjaF9hbGwoJy9zdG9ja1tePD5dezAsNDB9PyhbMC05XXsyLDR9KS9pJywkaCwkbW0pKSAkb1snZnJvbnRhc19zdG9ja196eW1lcyddPWFycmF5X3NsaWNlKCRtbVswXSwwLDYpOwogICAkb1snZnJvbnRhc19pbnN0b2NrJ10gPSAoc3RyaXBvcygkaCwnaW4tc3RvY2snKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGgsJ2luc3RvY2snKSE9PWZhbHNlKTsKIH0gZWxzZSB7ICRvWydmcm9udGFzX2tsYWlkYSddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyB9CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H149'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H149 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h149=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h149.json', Buffer.from(JSON.stringify(out,null,1)), 'h149 Monge merge APPLY');
