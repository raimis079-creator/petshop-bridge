const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19rNjk2J10/PycnKSE9PSdLNjk2eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgJG89YXJyYXkoJ3YnPT4nSzY5NicpOwogIC8vIFZGOiBrYXMgZWluYSBQTyBrYWludSByYXN5bW8KICAkdmY9V1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXZmLWltcG9ydC5waHAnOwogIGlmKGZpbGVfZXhpc3RzKCR2ZikpewogICAgJGVpbD1leHBsb2RlKCJcbiIsZmlsZV9nZXRfY29udGVudHMoJHZmKSk7CiAgICAkb1sndmZfNjMwXzY2MCddPWltcGxvZGUoIlxuIixhcnJheV9zbGljZSgkZWlsLDYyOSwyOCkpOwogIH0KICAvLyBwZXRzaG9wLXhtbC5waHAgcmFkaW5pYWkgc3Uga29udGVrc3R1CiAgJHB4PVdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnOwogIGlmKGZpbGVfZXhpc3RzKCRweCkpewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHB4KTsgJGVpbD1leHBsb2RlKCJcbiIsJGMpOyAkcj1hcnJheSgpOwogICAgZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgICAgIGlmKHByZWdfbWF0Y2goJy91cGRhdGVfcG9zdF9tZXRhXHMqXChccypbXixdezEsNDB9LFxzKltcJyJdKF9wcmljZXxfcmVndWxhcl9wcmljZXxfc3RvY2tfc3RhdHVzfF93ZWlnaHQpW1wnIl0vJywkbCwkbSkpewogICAgICAgICRudW89bWF4KDAsJGktNyk7ICRpa2k9bWluKGNvdW50KCRlaWwpLTEsJGkrNSk7CiAgICAgICAgJHJbXT1hcnJheSgnZWlsdXRlJz0+JGkrMSwnbGF1a2FzJz0+JG1bMV0sJ2tvbnRla3N0YXMnPT5pbXBsb2RlKCJcbiIsYXJyYXlfc2xpY2UoJGVpbCwkbnVvLCRpa2ktJG51bysxKSkpOwogICAgICB9CiAgICB9CiAgICAkb1sncGV0c2hvcF94bWwnXT1hcnJheSgncmFkaW5pYWknPT4kciwKICAgICAgJ2xvb2t1cCc9PnN0cnBvcygkYywnd2NfdXBkYXRlX3Byb2R1Y3RfbG9va3VwJykhPT1mYWxzZSwKICAgICAgJ3NhdmUnPT5zdHJwb3MoJGMsJy0+c2F2ZSgpJykhPT1mYWxzZSk7CiAgfQogIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCA2KTsK';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S696-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Konteksto Recon 2 (S696)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_k696=K696x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s696_v1.json',out);
console.log('DONE');
