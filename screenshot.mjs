process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDExNiddKSA/ICRfR0VUWydwc19oMTE2J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTE2Jyk7CiAkZiA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnOwogJGVpbCA9IGZpbGUoJGYsIEZJTEVfSUdOT1JFX05FV19MSU5FUyk7CiAkb1sna2FibGl1a2FpJ10gPSBhcnJheSgpOwogZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgIGlmKHByZWdfbWF0Y2goJ35hZGRfKGZpbHRlcnxhY3Rpb24pXHMqXChccypbXHgyNyJdKFteXHgyNyJdKyl+JywgJGwsICRtKQogICAgICAmJiAoc3RycG9zKCRsLCdibG9ja196Yl9jcmVhdGUnKSE9PWZhbHNlIHx8IHN0cnBvcygkbCwnYmxvY2tfdmZfY3JlYXRlJykhPT1mYWxzZSB8fCBzdHJwb3MoJGwsJ2Jsb2NrX3piX2NoZWFwJykhPT1mYWxzZSkpewogICAgICRvWydrYWJsaXVrYWknXVtdID0gKCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNzApKTsKICAgfQogfQogLyogdmlzaSB3cF9hbGxfaW1wb3J0IGthYmxpdWthaSBmYWlsZSAqLwogJG9bJ3dwYWlfa2FibGl1a2FpJ10gPSBhcnJheSgpOwogZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgIGlmKHByZWdfbWF0Y2goJ35bXHgyNyJdKHdwX2FsbF9pbXBvcnR8cG14aSlbYS16X10qW1x4MjciXX4nLCAkbCkpICRvWyd3cGFpX2thYmxpdWthaSddW10gPSAoJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE3MCkpOwogfQogJG9bJ3dwYWlfa2FibGl1a2FpJ10gPSBhcnJheV9zbGljZSgkb1snd3BhaV9rYWJsaXVrYWknXSwgMCwgMjUpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H116'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H116 kabliukai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h116=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h116.json', Buffer.from(JSON.stringify(out,null,1)), 'h116 kabliuku paieska');
