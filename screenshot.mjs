const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19rNjk1J10/PycnKSE9PSdLNjk1eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgJG89YXJyYXkoJ3YnPT4nSzY5NScpOwogICRmYWlsYWk9YXJyYXkoCiAgICAnbXUtcGx1Z2lucy9wZXRzaG9wLWF2LXN0b2NrLnBocCcsCiAgICAncGx1Z2lucy9wZXRzaG9wLXhtbC9pbmNsdWRlcy9jbGFzcy1mdWxmaWxsbWVudC5waHAnLAogICAgJ3BsdWdpbnMvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtYWRtaW4tdWkucGhwJywKICApOwogICRsYXVrYWk9YXJyYXkoJ19wcmljZScsJ19yZWd1bGFyX3ByaWNlJywnX3NhbGVfcHJpY2UnLCdfc3RvY2snLCdfc3RvY2tfc3RhdHVzJywnX21hbmFnZV9zdG9jaycsJ19za3UnLCdfd2VpZ2h0Jyk7CiAgZm9yZWFjaCgkZmFpbGFpIGFzICRmKXsKICAgICRrZWxpYXM9V1BfQ09OVEVOVF9ESVIuJy8nLiRmOwogICAgaWYoIWZpbGVfZXhpc3RzKCRrZWxpYXMpKXsgJG9bJ2ZhaWxhaSddWyRmXT0nTkVSQSc7IGNvbnRpbnVlOyB9CiAgICAkYz1maWxlX2dldF9jb250ZW50cygka2VsaWFzKTsKICAgICRlaWw9ZXhwbG9kZSgiXG4iLCRjKTsKICAgICRyYXN0YT1hcnJheSgpOwogICAgZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgICAgIGZvcmVhY2goJGxhdWthaSBhcyAkbGspewogICAgICAgIGlmKHByZWdfbWF0Y2goJy8odXBkYXRlX3Bvc3RfbWV0YXxhZGRfcG9zdF9tZXRhfGRlbGV0ZV9wb3N0X21ldGEpXHMqXChccypbXixdezEsNDB9LFxzKltcJyJdJy5wcmVnX3F1b3RlKCRsaywnLycpLidbXCciXS8nLCRsKSl7CiAgICAgICAgICAkbnVvPW1heCgwLCRpLTYpOyAkaWtpPW1pbihjb3VudCgkZWlsKS0xLCRpKzQpOwogICAgICAgICAgJHJhc3RhW109YXJyYXkoJ2VpbHV0ZSc9PiRpKzEsJ2xhdWthcyc9PiRsaywKICAgICAgICAgICAgJ2tvbnRla3N0YXMnPT5pbXBsb2RlKCJcbiIsYXJyYXlfc2xpY2UoJGVpbCwkbnVvLCRpa2ktJG51bysxKSkpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgJG9bJ2ZhaWxhaSddWyRmXT1hcnJheSgnZHlkaXMnPT5zdHJsZW4oJGMpLCdyYWRpbmlhaSc9PiRyYXN0YSwKICAgICAgJ2FyX2t2aWVjaWFfbG9va3VwJz0+KHN0cnBvcygkYywnd2NfdXBkYXRlX3Byb2R1Y3RfbG9va3VwJykhPT1mYWxzZSksCiAgICAgICdhcl9rdmllY2lhX3NhdmUnPT4oc3RycG9zKCRjLCctPnNhdmUoKScpIT09ZmFsc2UpLAogICAgICAnYXJfa3ZpZWNpYV90cmFuc2llbnRzJz0+KHN0cnBvcygkYywnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpIT09ZmFsc2UpKTsKICB9CiAgLy8gVkYgaW1wb3J0byBrYWludSB2aWV0YSDigJQgYXRza2lyYWksIG5lcyB0ZW4gUzcyIGluY2lkZW50YXMKICAkdmY9V1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXZmLWltcG9ydC5waHAnOwogIGlmKGZpbGVfZXhpc3RzKCR2ZikpewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHZmKTsgJGVpbD1leHBsb2RlKCJcbiIsJGMpOyAkcj1hcnJheSgpOwogICAgZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgICAgIGlmKHByZWdfbWF0Y2goJy91cGRhdGVfcG9zdF9tZXRhXHMqXChccypbXixdezEsNDB9LFxzKltcJyJdKF9wcmljZXxfcmVndWxhcl9wcmljZXxfc2FsZV9wcmljZXxfc2t1KVtcJyJdLycsJGwsJG0pKXsKICAgICAgICAkbnVvPW1heCgwLCRpLTUpOyAkaWtpPW1pbihjb3VudCgkZWlsKS0xLCRpKzMpOwogICAgICAgICRyW109YXJyYXkoJ2VpbHV0ZSc9PiRpKzEsJ2xhdWthcyc9PiRtWzFdLCdrb250ZWtzdGFzJz0+aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRlaWwsJG51bywkaWtpLSRudW8rMSkpKTsKICAgICAgfQogICAgfQogICAgJG9bJ3ZmX2ltcG9ydCddPWFycmF5KCdyYWRpbmlhaSc9PiRyLCdzYXZlJz0+c3RycG9zKCRjLCctPnNhdmUoKScpIT09ZmFsc2UsCiAgICAgICdsb29rdXAnPT5zdHJwb3MoJGMsJ3djX3VwZGF0ZV9wcm9kdWN0X2xvb2t1cCcpIT09ZmFsc2UpOwogIH0KICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgNik7Cg==';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S695-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Konteksto Recon (S695)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_k695=K695x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s695_v1.json',out);
console.log('DONE');
