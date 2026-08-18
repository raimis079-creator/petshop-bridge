process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5NjAnXSk/JF9HRVRbJ3BzX2c5NjAnXTonJykgIT09ICdHOTYwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5NjAnKTsKCiAkdGV2YWk9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBwLklEIEZST00geyRQfXBvc3RzIHAKICAgSk9JTiB7JFB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklECiAgIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF90eXBlJwogICBKT0lOIHskUH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIEFORCB0LnNsdWc9J3ZhcmlhYmxlJwogICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAkb1sndGV2dSddPWNvdW50KCR0ZXZhaSk7CgogJGVpbD1hcnJheSgpOyAkZmVlZD1hcnJheV9mbGlwKHBzX2ZlZWRzX2lkcygpKTsKIGZvcmVhY2goJHRldmFpIGFzICRpZCl7CiAgICRpZD0oaW50KSRpZDsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7CiAgIGlmKCEkcHIpIGNvbnRpbnVlOwogICAkdms9YXJyYXkoKTsgJHZhcj1hcnJheSgpOwogICBmb3JlYWNoKCRwci0+Z2V0X2NoaWxkcmVuKCkgYXMgJHZpZCl7CiAgICAgJHY9d2NfZ2V0X3Byb2R1Y3QoJHZpZCk7CiAgICAgaWYoISR2KSBjb250aW51ZTsKICAgICAkaz0kdi0+Z2V0X3ByaWNlKCk7CiAgICAgaWYoJGs9PT0nJyB8fCAkaz09PW51bGwpIGNvbnRpbnVlOwogICAgICR2a1tdPShmbG9hdCkkazsKICAgICBpZihjb3VudCgkdmFyKTw0KSAkdmFyW109YXJyYXkoJ2lkJz0+JHZpZCwncGF2Jz0+aW1wbG9kZSgnLCAnLCR2LT5nZXRfdmFyaWF0aW9uX2F0dHJpYnV0ZXMoKSksCiAgICAgICAna2FpbmEnPT4oZmxvYXQpJGssJ2d0aW4nPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHZpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpLAogICAgICAgJ3NrdSc9PihzdHJpbmcpJHYtPmdldF9za3UoKSwnc3Rvayc9PiR2LT5nZXRfc3RvY2tfc3RhdHVzKCkpOwogICB9CiAgIGlmKCEkdmspIGNvbnRpbnVlOwogICAkbWluPW1pbigkdmspOyAkbWF4PW1heCgkdmspOwogICAkZWlsW109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5nZXRfdGhlX3RpdGxlKCRpZCksJ3ZhcmlhbnR1Jz0+Y291bnQoJHZrKSwKICAgICAnbWluJz0+JG1pbiwnbWF4Jz0+JG1heCwna2FydGFpJz0+JG1pbj4wP3JvdW5kKCRtYXgvJG1pbiwyKTpudWxsLAogICAgICdmZWVkZSc9Pmlzc2V0KCRmZWVkWyRpZF0pPzE6MCwKICAgICAndGV2b19ndGluJz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpLAogICAgICdwdnonPT4kdmFyKTsKIH0KIHVzb3J0KCRlaWwsIGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuICgkYlsna2FydGFpJ10/PzApIDw9PiAoJGFbJ2thcnRhaSddPz8wKTsgfSk7CiAkb1sncHJla2l1J109Y291bnQoJGVpbCk7CiAkb1snZmVlZGUnXT1jb3VudChhcnJheV9maWx0ZXIoJGVpbCxmdW5jdGlvbigkcil7cmV0dXJuICRyWydmZWVkZSddO30pKTsKICRvWydzYXJhc2FzJ109JGVpbDsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G960'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G960 variantines',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g960=G960')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g960.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g960');
