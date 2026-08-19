process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEyMSddKSA/ICRfR0VUWydwc19oMTIxJ10gOiAnJykgIT09ICdSRUFEJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDE4MCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbyA9IGFycmF5KCd2Jz0+J0gxMjEnLCdyZXppbWFzJz0+J1RJSyBTS0FJVFlNQVMnKTsKICRvWyd3Y192ZXJzaWphJ10gPSBkZWZpbmVkKCdXQ19WRVJTSU9OJykgPyBXQ19WRVJTSU9OIDogJz8nOwogJG9bJ2hwb3MnXSA9IChjbGFzc19leGlzdHMoJ0F1dG9tYXR0aWNcV29vQ29tbWVyY2VcVXRpbGl0aWVzXE9yZGVyVXRpbCcpICYmIFxBdXRvbWF0dGljXFdvb0NvbW1lcmNlXFV0aWxpdGllc1xPcmRlclV0aWw6OmN1c3RvbV9vcmRlcnNfdGFibGVfdXNhZ2VfaXNfZW5hYmxlZCgpKSA/ICdpanVuZ3RhcycgOiAnaXNqdW5ndGFzJzsKCiAkcmFkbyA9IGFycmF5KCk7CiAkYmFzZSA9IFdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZSc7CiAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGJhc2UsIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAkbj0wOwogZm9yZWFjaCgkaXQgYXMgJGYpewogICBpZigkbisrID4gMTIwMDApIGJyZWFrOwogICBpZighJGYtPmlzRmlsZSgpIHx8IHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAkdD1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICBpZigkdD09PWZhbHNlKSBjb250aW51ZTsKICAgaWYoc3RycG9zKCR0LCdjYW5jZWxfdW5wYWlkJyk9PT1mYWxzZSAmJiBzdHJwb3MoJHQsJ2hvbGRfc3RvY2tfbWludXRlcycpPT09ZmFsc2UpIGNvbnRpbnVlOwogICAka2VsID0gc3RyX3JlcGxhY2UoJGJhc2UuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKTsKICAgJGVpbD1hcnJheSgpOwogICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkdCkgYXMgJGk9PiRsKXsKICAgICBpZihwcmVnX21hdGNoKCd+Y2FuY2VsX3VucGFpZHxob2xkX3N0b2NrX21pbnV0ZXN8YXBwbHlfZmlsdGVyc3xoZWxkX2R1cmF0aW9uficsICRsKQogICAgICAgICYmIHByZWdfbWF0Y2goJ35jYW5jZWxfdW5wYWlkfGhvbGRfc3RvY2tfbWludXRlc3xoZWxkX2R1cmF0aW9uficsICRsKSkKICAgICAgICRlaWxbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE4MCkpOwogICB9CiAgIGlmKCRlaWwpICRyYWRvWyRrZWxdPWFycmF5X3NsaWNlKCRlaWwsMCwxNCk7CiB9CiAkb1sndmlldG9zJ10gPSAkcmFkbzsKCiAvKiBwaWxuYXMgZnVua2Npam9zIHRla3N0YXMgKi8KICR3ZiA9ICRiYXNlLicvaW5jbHVkZXMvd2Mtb3JkZXItZnVuY3Rpb25zLnBocCc7CiBpZihmaWxlX2V4aXN0cygkd2YpKXsKICAgJHQgPSBmaWxlKCR3ZiwgRklMRV9JR05PUkVfTkVXX0xJTkVTKTsKICAgZm9yZWFjaCgkdCBhcyAkaT0+JGwpewogICAgIGlmKHByZWdfbWF0Y2goJ35mdW5jdGlvblxzK3djX2NhbmNlbF91bnBhaWRfb3JkZXJzficsICRsKSl7CiAgICAgICAkb1snZnVua2NpamEnXSA9IGFycmF5KCk7CiAgICAgICBmb3IoJGs9JGk7ICRrIDwgbWluKCRpKzU1LCBjb3VudCgkdCkpOyAkaysrKSAkb1snZnVua2NpamEnXVtdID0gKCRrKzEpLic6ICcucnRyaW0obWJfc3Vic3RyKCR0WyRrXSwwLDE3NSkpOwogICAgICAgYnJlYWs7CiAgICAgfQogICB9CiB9CiAvKiBjcm9uICovCiAkY3I9X2dldF9jcm9uX2FycmF5KCk7ICRjPWFycmF5KCk7CiBpZihpc19hcnJheSgkY3IpKSBmb3JlYWNoKCRjciBhcyAkdHM9PiRnKSBmb3JlYWNoKCRnIGFzICRrPT4keCkgaWYoc3RyaXBvcygkaywnY2FuY2VsJykhPT1mYWxzZXx8c3RyaXBvcygkaywndW5wYWlkJykhPT1mYWxzZSkgJGNbJGtdPWRhdGUoJ1ktbS1kIEg6aScsJHRzKTsKICRvWydjcm9uJ10gPSAkYyA/ICRjIDogJ25lcmFzdGEgY2FuY2VsL3VucGFpZCBjcm9uJzsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H121'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H121 wc cancel',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h121=READ'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h121.json', Buffer.from(JSON.stringify(out,null,1)), 'h121 wc_cancel_unpaid_orders');
