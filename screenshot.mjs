process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEzNiddKSA/ICRfR0VUWydwc19oMTM2J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG8gPSBhcnJheSgndic9PidIMTM2JywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKCiAkZGlyID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sJzsKICRvWydwbHVnaW5fZGlyX3lyYSddID0gaXNfZGlyKCRkaXIpOwogJGZhaWxhaSA9IGFycmF5KCk7CiBpZihpc19kaXIoJGRpcikpewogICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOwogICBmb3JlYWNoKCRpdCBhcyAkZil7CiAgICAgaWYoJGYtPmlzRmlsZSgpICYmIHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCk9PT0nLnBocCcpewogICAgICAgJGZhaWxhaVtzdHJfcmVwbGFjZSgkZGlyLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSldID0gJGYtPmdldFNpemUoKTsKICAgICB9CiAgIH0KIH0KIGtzb3J0KCRmYWlsYWkpOwogJG9bJ2ZhaWxhaSddID0gJGZhaWxhaTsKCiAvKiBpZXNrb20gYmxva2F2aW1vIGthYmxpdWt1IGlyIHJha3Rhem9keml1ICovCiAkcmFrdGFpID0gYXJyYXkoCiAgICd3cF9hbGxfaW1wb3J0X2lzX3Bvc3RfdG9fY3JlYXRlJywKICAgJ2lzX3Bvc3RfdG9fY3JlYXRlJywKICAgJ3Nob3VsZF9pbXBvcnQnLAogICAndmZfc2hvdWxkX2ltcG9ydCcsCiAgICd6Yl9zaG91bGRfaW1wb3J0JywKICAgJ2Jsb2t1bycsJ2Jsb2NrJywnc2tpcCcsJ3ByYWxlaXN0JywnYXRtZXN0JywnX3piX2RyYWZ0X3JlYXNvbicsJ2RyYWZ0JwogKTsKICRyYWRvID0gYXJyYXkoKTsKIGZvcmVhY2goJGZhaWxhaSBhcyAkcmVsPT4kc3opewogICAka2VsaWFzID0gJGRpci4nLycuJHJlbDsKICAgJGVpbCA9IEBmaWxlKCRrZWxpYXMpOwogICBpZighJGVpbCkgY29udGludWU7CiAgIGZvcmVhY2goJGVpbCBhcyAkaT0+JGwpewogICAgIGZvcmVhY2goJHJha3RhaSBhcyAkcil7CiAgICAgICBpZihzdHJpcG9zKCRsLCAkcikgIT09IGZhbHNlKXsKICAgICAgICAgJHJhZG9bJHJlbF1bXSA9ICgkaSsxKS4nOiAnLnJ0cmltKHN1YnN0cigkbCwwLDE4MCkpOwogICAgICAgICBicmVhazsKICAgICAgIH0KICAgICB9CiAgIH0KIH0KICRvWydyYWRpbmlhaSddID0gJHJhZG87CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H136'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H136 ZB blokavimo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h136=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,800)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h136.json', Buffer.from(JSON.stringify(out,null,1)), 'h136 ZB blokavimo recon');
