const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const PROBE='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19lMHIyJ10/PycnKSE9PSdTNjM5eCcpIHJldHVybjsKICBpZighKCBjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpIHx8ICgoJF9HRVRbJ2snXT8/JycpPT09J3BzMjAyNicpICkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvdXQgPSBhcnJheSgndic9PidFMFJFQ09OMi1WMScpOwogICRtdSA9IFdQTVVfUExVR0lOX0RJUjsKICAkd2FudCA9IGFycmF5KCdwZXRzaG9wLWF2LXNvdXJjZS5waHAnLCdwZXRzaG9wLWF2LXN0b2NrLnBocCcsJ3BldHNob3AtYXYtb3JkZXIucGhwJywncGV0c2hvcC1hdi1yZWR1Y2UucGhwJywncGV0c2hvcC1hdi1saW1pdC5waHAnLCdwZXRzaG9wLWF2LWRyb3BzaGlwLnBocCcsJ3BldHNob3AtYXYtZXhwaXJ5LnBocCcpOwogIGZvcmVhY2goJHdhbnQgYXMgJGYpewogICAgJHAgPSAkbXUuJy8nLiRmOwogICAgaWYoZmlsZV9leGlzdHMoJHApKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgICAkb3V0WydmYWlsYWknXVskZl09YXJyYXkoJ2J5dGVzJz0+c3RybGVuKCRjKSwnc2hhJz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKCRjKSk7CiAgICB9IGVsc2UgJG91dFsnZmFpbGFpJ11bJGZdPSdORVJBJzsKICB9CiAgLy8gZGVrbGFydW90b3Mga2xhc2VzIG11LXBsdWdpbnMKICAkZGVjbCA9IGdldF9kZWNsYXJlZF9jbGFzc2VzKCk7CiAgJG91dFsna2xhc2VzX2F2J10gPSBhcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRkZWNsLCBmdW5jdGlvbigkYyl7IHJldHVybiBzdHJpcG9zKCRjLCdhdl8nKT09PTAgfHwgc3RyaXBvcygkYywncGV0c2hvcCcpPT09MCB8fCBzdHJpcG9zKCRjLCdfc291cmNlJykhPT1mYWxzZTsgfSkpOwogIGhlYWRlcignQ29udGVudC1UeXBlOmFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(name,obj){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+name;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const body={message:'r '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  if(sha) body.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('putResult',name,r.status);
}
const out={version:'S639-V1',errors:[]};
try{
  const code=Buffer.from(PROBE,'base64').toString('utf8');
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP E0 Recon v2 (S639)',code,scope:'global',active:true,priority:10})});
  const j=await r.json(); out.id=j.id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_e0r2=S639x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.recon=JSON.parse(t);}catch(e){out.raw=t.slice(0,2000);}
  await fetch(BASE+'/'+j.id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await fetch(BASE+'/2398',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
}catch(e){out.errors.push(String(e));}
await putResult('s639_v1.json',out);
console.log('DONE');
