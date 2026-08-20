process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE1MCddKSA/ICRfR0VUWydwc19oMTUwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiLCR3cF9maWx0ZXI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbz1hcnJheSgndic9PidIMTUwJywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdSRVpJTUFTJz0+J0RJQUdOT1NUSUtBJyk7CgogJGhvb2tzPWFycmF5KCd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9zdG9ja19xdWFudGl0eScsJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfdmFyaWF0aW9uX2dldF9zdG9ja19xdWFudGl0eScsCiAgICd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9zdG9ja19zdGF0dXMnLCd3b29jb21tZXJjZV9nZXRfc3RvY2tfaHRtbCcsJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfaXNfaW5fc3RvY2snKTsKIGZvcmVhY2goJGhvb2tzIGFzICRoKXsKICAgJHNhcj1hcnJheSgpOwogICBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpewogICAgIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYil7CiAgICAgICBmb3JlYWNoKCRjYiBhcyAkaWQ9PiRjKXsKICAgICAgICAgJGZuPSRjWydmdW5jdGlvbiddOyAka3VyPScnOwogICAgICAgICB0cnl7CiAgICAgICAgICAgaWYoaXNfYXJyYXkoJGZuKSl7ICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSwgJGZuWzFdKTsKICAgICAgICAgICAgICRubT0oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTsgfQogICAgICAgICAgIGVsc2VpZigkZm4gaW5zdGFuY2VvZiBDbG9zdXJlKXsgJHI9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOyAkbm09J0Nsb3N1cmUnOyB9CiAgICAgICAgICAgZWxzZSB7ICRyPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGZuKTsgJG5tPSRmbjsgfQogICAgICAgICAgICRrdXI9c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJHItPmdldEZpbGVOYW1lKCkpLic6Jy4kci0+Z2V0U3RhcnRMaW5lKCk7CiAgICAgICAgIH1jYXRjaChFeGNlcHRpb24gJGUpeyAkbm09Jz8nOyB9CiAgICAgICAgICRzYXJbXT1hcnJheSgncHInPT4kcHIsJ2ZuJz0+JG5tLCdrdXInPT4ka3VyKTsKICAgICAgIH0KICAgICB9CiAgIH0KICAgJG9bJGhdPSRzYXI7CiB9CgogLyoga2llayBwcmlkZWRhOiBwcmllcy9wbyBmaWx0cm8gc2FsaW5pbW8gKi8KICR0PTE3Mzk0OwogJG9bJ3N1X2ZpbHRydSddID0gd2NfZ2V0X3Byb2R1Y3QoJHQpLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsKICRvWydyYXdfbWV0YSddICA9IChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkdCwnX3N0b2NrJyx0cnVlKTsKICRvWydwc19zb3VyY2VzX2F2J10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAiU0VMRUNUIHN0b2NrX3F0eSBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIHNvdXJjZT0nYXYnIiwkdCkpOwogJG9bJ3BzX3NvdXJjZXNfdmlzaSddID0gJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAiU0VMRUNUIHNvdXJjZSxzdG9ja19xdHkgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkdCksIEFSUkFZX0EpOwoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H150'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H150 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h150=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h150.json', Buffer.from(JSON.stringify(out,null,1)), 'h150 Monge merge APPLY');
