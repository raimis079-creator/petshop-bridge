process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5OTQnXSk/JF9HRVRbJ3BzX2c5OTQnXTonJykgIT09ICdHOTk0JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5OTQnKTsgJFRYPSdwcm9kdWN0X2JyYW5kJzsKCiAvKiB2aXNvcyBwdWJsaXNoIGJlIGJyZW5kbyAqLwogJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JFB9cG9zdHMgcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskUH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgICBXSEVSRSB0ci5vYmplY3RfaWQ9cC5JRCBBTkQgdHQudGF4b25vbXk9JyRUWCcpIik7CiAkZmVlZD1hcnJheV9mbGlwKHBzX2ZlZWRzX2lkcygpKTsKICRlaWw9YXJyYXkoKTsgJHN0PWFycmF5KCd2aXNvJz0+MCwnZmVlZGUnPT4wLCdiZV9ndGluX2lyX2JyZW5kbyc9PjAsJ2ZlZWRlX2JlX2FiaWVqdSc9PjApOwogZm9yZWFjaCgkaWRzIGFzICRpZCl7CiAgICRpZD0oaW50KSRpZDsgJHN0Wyd2aXNvJ10rKzsKICAgJGc9KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpOwogICAkZmU9aXNzZXQoJGZlZWRbJGlkXSk/MTowOyBpZigkZmUpICRzdFsnZmVlZGUnXSsrOwogICBpZigkZz09PScnKXsgJHN0WydiZV9ndGluX2lyX2JyZW5kbyddKys7IGlmKCRmZSkgJHN0WydmZWVkZV9iZV9hYmllanUnXSsrOyB9CiAgICRrdD1nZXRfdGhlX3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnKTsgJGthdD0nJzsKICAgaWYoJGt0ICYmICFpc193cF9lcnJvcigka3QpKSAka2F0PSRrdFswXS0+bmFtZTsKICAgJGVpbFtdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJGlkKSwwLDUyKSwnZ3Rpbic9PiRnLCdmZWVkZSc9PiRmZSwKICAgICAnc3Rvayc9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9ja19zdGF0dXMnLHRydWUpLCdrYXQnPT4ka2F0KTsKIH0KICRvWydzdGF0aXN0aWthJ109JHN0OwogJG9bJ3NhcmFzYXMnXT0kZWlsOwoKIC8qIGJlbmRyYXMgZmVlZCdvIHBqdXZpcyBHb29nbGUgYWtpbWlzICovCiAka2FuZD1wc19mZWVkc19pZHMoKTsgJGJnPTA7ICRiYj0wOyAkYWJ1PTA7CiBmb3JlYWNoKCRrYW5kIGFzICRpZCl7CiAgICRnPShzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgoaW50KSRpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpOwogICAkYj1nZXRfdGhlX3Rlcm1zKChpbnQpJGlkLCRUWCk7ICRiPSgkYiAmJiAhaXNfd3BfZXJyb3IoJGIpKT8xOjA7CiAgIGlmKCRnPT09JycpICRiZysrOwogICBpZighJGIpICRiYisrOwogICBpZigkZz09PScnICYmICEkYikgJGFidSsrOwogfQogJG9bJ2ZlZWRhcyddPWFycmF5KCdrYW5kaWRhdHUnPT5jb3VudCgka2FuZCksJ2JlX2d0aW4nPT4kYmcsJ2JlX2JyZW5kbyc9PiRiYiwnYmVfYWJpZWp1Jz0+JGFidSk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G994'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G994 be abieju',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g994=G994')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g994.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g994');
