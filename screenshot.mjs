process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4NjQnXSk/JF9HRVRbJ3BzX2c4NjQnXTonJykgIT09ICdHODY0JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4NjQnKTsKCiAkYnI9YXJyYXkoKTsKIGZvcmVhY2goZ2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2JyYW5kJywnaGlkZV9lbXB0eSc9PmZhbHNlKSkgYXMgJHQpewogICAkYnJbXT1hcnJheSgnaWQnPT4kdC0+dGVybV9pZCwndmFyZGFzJz0+JHQtPm5hbWUsJ3ByZWtpdSc9PiR0LT5jb3VudCk7CiB9CiB1c29ydCgkYnIsIGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuIHN0cmNhc2VjbXAoJGFbJ3ZhcmRhcyddLCRiWyd2YXJkYXMnXSk7IH0pOwogJG9bJ2JyZW5kYWknXT0kYnI7CgogJGlkcz1wc19mZWVkc19pZHMoKTsgJGVpbD1hcnJheSgpOwogZm9yZWFjaChhcnJheV9jaHVuaygkaWRzLDMwMCkgYXMgJHBrKXsKICBmb3JlYWNoKCRwayBhcyAkaWQpewogICAkaWQ9KGludCkkaWQ7CiAgICRidD1nZXRfdGhlX3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcpOwogICBpZigkYnQgJiYgIWlzX3dwX2Vycm9yKCRidCkpIGNvbnRpbnVlOwogICAkcG9zdD1nZXRfcG9zdCgkaWQpOwogICAka3Q9Z2V0X3RoZV90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0Jyk7CiAgICRrYXQ9Jyc7CiAgIGlmKCRrdCAmJiAhaXNfd3BfZXJyb3IoJGt0KSl7CiAgICAgJGd5bD0tMTsKICAgICBmb3JlYWNoKCRrdCBhcyAkdCl7ICRnPWNvdW50KGdldF9hbmNlc3RvcnMoJHQtPnRlcm1faWQsJ3Byb2R1Y3RfY2F0JykpOyBpZigkZz4kZ3lsKXskZ3lsPSRnOyRrYXQ9JHQtPm5hbWU7fSB9CiAgIH0KICAgJGVpbFtdPWFycmF5KAogICAgICdpZCc9PiRpZCwKICAgICAnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksCiAgICAgJ3Bhdic9PiRwb3N0PyRwb3N0LT5wb3N0X3RpdGxlOicnLAogICAgICdrYXQnPT4ka2F0LAogICAgICdzYW5kJz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwKICAgICAndGllayc9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKSwKICAgICAnZ3Rpbic9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKSwKICAgICAna2FpbmEnPT4oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wcmljZScsdHJ1ZSksCiAgICAgJ2xpa3V0aXMnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2snLHRydWUpLAogICAgICdudW9yb2RhJz0+YWRtaW5fdXJsKCdwb3N0LnBocD9wb3N0PScuJGlkLicmYWN0aW9uPWVkaXQnKSwKICAgKTsKICB9CiAgd3BfY2FjaGVfZmx1c2goKTsKIH0KIHVzb3J0KCRlaWwsIGZ1bmN0aW9uKCRhLCRiKXsgJGM9c3RyY2FzZWNtcCgkYVsndGllayddLCRiWyd0aWVrJ10pOyByZXR1cm4gJGM/OnN0cmNhc2VjbXAoJGFbJ3BhdiddLCRiWydwYXYnXSk7IH0pOwogJG9bJ2VpbHVjaXUnXT1jb3VudCgkZWlsKTsKICRvWydiNjQnXT1iYXNlNjRfZW5jb2RlKGd6ZW5jb2RlKHdwX2pzb25fZW5jb2RlKCRlaWwpLDYpKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G864'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G864 brendu lentele',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g864=G864')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g864.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g864 brendu lentele');
