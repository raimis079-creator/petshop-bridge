process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZml4MSddKSB8fCAkX0dFVFsncHNfZml4MSddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidGSVgxJyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwoKIC8qIExQIHRlcm1pbmFsbyBwYWllc2tvcyBrb2RhcyAqLwogJGY9V1BfUExVR0lOX0RJUi4nL3dvby1saXRodWFuaWFwb3N0LW1haW4vcHVibGljL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LXB1YmxpYy5waHAnOwogaWYoZmlsZV9leGlzdHMoJGYpKXsgJEw9ZXhwbG9kZSgiXG4iLGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk7ICRUWydscF9rb2RhcyddPWFycmF5KCk7CiAgIGZvcigkaT00ODg7JGk8NTE1OyRpKyspeyBpZihpc3NldCgkTFskaV0pKSAkVFsnbHBfa29kYXMnXVtdPSgkaSsxKS4nICcudHJpbShzdWJzdHIoJExbJGldLDAsMTUwKSk7IH0gfQoKICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfdGVzdGluaXMnIE9SREVSIEJZIG9yZGVyX2lkIik7CiAkVFsncmFzdGEnXT1jb3VudCgkaWRzKTsKIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsKICAgJHNoPSRvLT5nZXRfaXRlbXMoJ3NoaXBwaW5nJyk7ICRzaT1yZXNldCgkc2gpOyBpZighJHNpKSBjb250aW51ZTsKICAgJG1pZD0kc2ktPmdldF9tZXRob2RfaWQoKTsKICAgJGluY2w9MDsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJGluY2wgKz0gKGZsb2F0KSRpdC0+Z2V0X3RvdGFsKCkrKGZsb2F0KSRpdC0+Z2V0X3RvdGFsX3RheCgpOyB9CiAgIGlmKGZhbHNlIT09c3RycG9zKCRtaWQsJ2NvdXJpZXInKSl7ICRmZWU9My4zMDsgfQogICBlbHNlaWYoZmFsc2UhPT1zdHJwb3MoJG1pZCwncGlja3VwJyl8fGZhbHNlIT09c3RycG9zKCRtaWQsJ2xwZXhwcmVzcycpKXsgJGZlZT0oJGluY2w+PTMwKT8wLjA6MS43ODsgfQogICBlbHNlIHsgJGZlZT0zLjMwOyB9CiAgICRzaS0+c2V0X3RvdGFsKCRmZWU+MD9yb3VuZCgkZmVlLzEuMjEsNik6MCk7CiAgICRzaS0+c2V0X3RheGVzKGFycmF5KCkpOwogICAkc2ktPnNhdmUoKTsKICAgJG8tPmNhbGN1bGF0ZV90YXhlcygpOwogICAkby0+Y2FsY3VsYXRlX3RvdGFscyh0cnVlKTsKICAgJG8tPnNhdmUoKTsKICAgJG9vPXdjX2dldF9vcmRlcigkaWQpOwogICAkc2gyPSRvby0+Z2V0X2l0ZW1zKCdzaGlwcGluZycpOyAkczI9cmVzZXQoJHNoMik7CiAgICRUWyd1enNha3ltYWknXVtdPWFycmF5KCdpZCc9PiRpZCwnbnInPT4kb28tPmdldF9vcmRlcl9udW1iZXIoKSwncHJla2VzX3N1X3B2bSc9PnJvdW5kKCRpbmNsLDIpLAogICAgICdzaXVudGEnPT5yb3VuZCgoZmxvYXQpJHMyLT5nZXRfdG90YWwoKSsoZmxvYXQpJHMyLT5nZXRfdG90YWxfdGF4KCksMiksJ3Zpc28nPT4kb28tPmdldF90b3RhbCgpLAogICAgICdwdm0nPT4kb28tPmdldF90b3RhbF90YXgoKSwnYnVzZW5hJz0+JG9vLT5nZXRfc3RhdHVzKCkpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'FIX1'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v1 (siuntos kainos pagal nustatymus)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_fix1=RUN20260823');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/fix1.json', Buffer.from(JSON.stringify(out,null,1)), 'FIX1');
