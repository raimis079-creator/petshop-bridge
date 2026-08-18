process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4NDUnXSk/JF9HRVRbJ3BzX2c4NDUnXTonJykgIT09ICdHODQ1JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidHODQ1Jyk7CiBmbHVzaF9yZXdyaXRlX3J1bGVzKGZhbHNlKTsKICRycj1nZXRfb3B0aW9uKCdyZXdyaXRlX3J1bGVzJyk7ICRvWydmZWVkX3RhaXN5a2xlcyddPWFycmF5KCk7CiBpZihpc19hcnJheSgkcnIpKSBmb3JlYWNoKCRyciBhcyAkaz0+JHYpeyBpZihzdHJwb3MoJGssJ2ZlZWQvJyk9PT0wKSAkb1snZmVlZF90YWlzeWtsZXMnXVska109JHY7IH0KIC8qIHBhdnl6ZHppYWkgaXMgcmVhbGl1IGZhaWx1ICovCiAkZmc9cHNfZmVlZHNfa2VsaWFzKCdnb29nbGUnKTsKIGlmKGZpbGVfZXhpc3RzKCRmZykpeyAkaD1mb3BlbigkZmcsJ3InKTsgJGI9ZnJlYWQoJGgsMTIwMDApOyBmY2xvc2UoJGgpOwogICAkaT1zdHJwb3MoJGIsJzxpdGVtPicpOyAkaj1zdHJwb3MoJGIsJzwvaXRlbT4nKTsKICAgJG9bJ3B2el9nb29nbGUnXT0oJGkhPT1mYWxzZSk/c3Vic3RyKCRiLCRpLCRqLSRpKzcpOicnOyB9CiAvKiBrYWluYTI0IHByZWtlIHN1IGVhbl9jb2RlIElSIHNwZWNzICovCiAkZms9cHNfZmVlZHNfa2VsaWFzKCdrYWluYTI0Jyk7CiBpZihmaWxlX2V4aXN0cygkZmspKXsKICAgJGg9Zm9wZW4oJGZrLCdyJyk7ICRyYXN0YT0nJzsgJGJ1Zj0nJzsKICAgd2hpbGUoIWZlb2YoJGgpICYmIHN0cmxlbigkcmFzdGEpPT09MCl7CiAgICAgJGJ1ZiAuPSBmcmVhZCgkaCw2MDAwMCk7CiAgICAgaWYocHJlZ19tYXRjaCgnLzxwcm9kdWN0IGlkPSJcZCsiPig/Oig/ITxcL3Byb2R1Y3Q+KS4pKj88ZWFuX2NvZGU+Lio/PHNwZWNzPi4qPzxcL3Byb2R1Y3Q+L3MnLCRidWYsJG0pKSAkcmFzdGE9JG1bMF07CiAgICAgaWYoc3RybGVuKCRidWYpPjYwMDAwMCkgYnJlYWs7CiAgIH0KICAgZmNsb3NlKCRoKTsKICAgJG9bJ3B2el9zdV9zcGVjcyddPSRyYXN0YT9wcmVnX3JlcGxhY2UoJy88ZGVzY3JpcHRpb24+Lio/PFwvZGVzY3JpcHRpb24+L3MnLCc8ZGVzY3JpcHRpb24+Wy4uLl08L2Rlc2NyaXB0aW9uPicsJHJhc3RhKTonbmVyYXN0YSc7CiB9CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G845'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G845 rewrite flush',B64);
  await new Promise(r=>setTimeout(r,8000));
  try{ out.d=JSON.parse(await (await fetch(WP+'/?ps_g845=G845')).text()); }catch(e){ out.zalias='?'; }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  out.endpointai={};
  for(const u of ['/feed/kaina24','/feed/kainos','/feed/google']){
    const r=await fetch(WP+u); const h=await r.text();
    out.endpointai[u]={status:r.status, baitai:h.length, prekiu:(h.match(/<product id=|<item>/g)||[]).length};
  }
}catch(e){ out.klaida=String(e).slice(0,250); }
const zlib=await import('zlib');
await put('g845.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g845 rewrite');
