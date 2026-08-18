process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4NjEnXSk/JF9HRVRbJ3BzX2c4NjEnXTonJykgIT09ICdHODYxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4NjEnKTsKCiAkaWRzPXBzX2ZlZWRzX2lkcygpOwogJGJlX2FiaWVqdT1hcnJheSgpOyAkYmVfZ3Rpbl9zdV9icmVuZHU9YXJyYXkoKTsgJGJlX2d0aW5fYmVfYnJlbmRvPWFycmF5KCk7CiAkdHVzdGk9YXJyYXkoKTsgJHRydW1waT1hcnJheSgpOyAkaWxnaXU9YXJyYXkoKTsKICRiZV9icmVuZG9fcHZ6PWFycmF5KCk7CgogZm9yZWFjaChhcnJheV9jaHVuaygkaWRzLDMwMCkgYXMgJHBrKXsKICBmb3JlYWNoKCRwayBhcyAkaWQpewogICAkaWQ9KGludCkkaWQ7CiAgICRnPShzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKTsKICAgJGJ0PWdldF90aGVfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyk7ICRiPSgkYnQmJiFpc193cF9lcnJvcigkYnQpKT8kYnRbMF0tPm5hbWU6Jyc7CiAgICRwb3N0PWdldF9wb3N0KCRpZCk7ICRwYXY9JHBvc3Q/JHBvc3QtPnBvc3RfdGl0bGU6Jyc7CiAgICRrdD1nZXRfdGhlX3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnKTsgJGthdD0oJGt0JiYhaXNfd3BfZXJyb3IoJGt0KSk/JGt0WzBdLT5uYW1lOicnOwogICAkc2FuZD0oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpOwogICAkYXByPXRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MoaHRtbF9lbnRpdHlfZGVjb2RlKChzdHJpbmcpKCRwb3N0PyRwb3N0LT5wb3N0X2NvbnRlbnQ6JycpLEVOVF9RVU9URVN8RU5UX0hUTUw1LCdVVEYtOCcpKSk7CiAgICRpbD1tYl9zdHJsZW4oJGFwcik7CgogICAvKiBhcHJhc3ltdSBwYXNpc2tpcnN0eW1hcyAqLwogICAka2liaXJhcyA9ICRpbD09PTA/JzAnOigkaWw8ODA/JzEtNzknOigkaWw8MjAwPyc4MC0xOTknOigkaWw8NTAwPycyMDAtNDk5JzonNTAwKycpKSk7CiAgICRpbGdpdVska2liaXJhc109KCRpbGdpdVska2liaXJhc10/PzApKzE7CiAgIGlmKCRpbD09PTAgJiYgY291bnQoJHR1c3RpKTw2MCkgJHR1c3RpW109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5tYl9zdWJzdHIoJHBhdiwwLDU1KSwna2F0Jz0+JGthdCwnc2FuZCc9PiRzYW5kKTsKICAgaWYoJGlsPjAgJiYgJGlsPDgwICYmIGNvdW50KCR0cnVtcGkpPDQwKSAkdHJ1bXBpW109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5tYl9zdWJzdHIoJHBhdiwwLDQ1KSwnYXByJz0+bWJfc3Vic3RyKCRhcHIsMCw3MCksJ2lsJz0+JGlsKTsKCiAgIGlmKCRnPT09JycgJiYgJGI9PT0nJyl7IGlmKGNvdW50KCRiZV9hYmllanUpPDQwMCkgJGJlX2FiaWVqdVtdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+bWJfc3Vic3RyKCRwYXYsMCw1MCksJ2thdCc9PiRrYXQsJ3NhbmQnPT4kc2FuZCk7IH0KICAgaWYoJGc9PT0nJyl7CiAgICAgaWYoJGIhPT0nJykgJGJlX2d0aW5fc3VfYnJlbmR1WyRiXT0oJGJlX2d0aW5fc3VfYnJlbmR1WyRiXT8/MCkrMTsKICAgICBlbHNlICRiZV9ndGluX2JlX2JyZW5kb1ska2F0XT0oJGJlX2d0aW5fYmVfYnJlbmRvWyRrYXRdPz8wKSsxOwogICB9CiAgIGlmKCRiPT09JycgJiYgY291bnQoJGJlX2JyZW5kb19wdnopPDI1KSAkYmVfYnJlbmRvX3B2eltdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+bWJfc3Vic3RyKCRwYXYsMCw1NSksJ2thdCc9PiRrYXQpOwogIH0KICB3cF9jYWNoZV9mbHVzaCgpOwogfQogYXJzb3J0KCRiZV9ndGluX3N1X2JyZW5kdSk7IGFyc29ydCgkYmVfZ3Rpbl9iZV9icmVuZG8pOwogJG9bJ2FwcmFzeW11X3Bhc2lza2lyc3R5bWFzJ109JGlsZ2l1OwogJG9bJ3R1c3RpX2FwcmFzeW1haSddPWFycmF5KCdraWVrJz0+Y291bnQoJHR1c3RpKSwncHZ6Jz0+JHR1c3RpKTsKICRvWyd0cnVtcGlfcHZ6J109JHRydW1waTsKICRvWydiZV9ndGluX2lyX2JlX2JyZW5kbyddPWFycmF5KCdraWVrJz0+Y291bnQoJGJlX2FiaWVqdSksJ3B2eic9PmFycmF5X3NsaWNlKCRiZV9hYmllanUsMCwyNSkpOwogJG9bJ2JlX2d0aW5fc3VfYnJlbmR1X3RvcCddPWFycmF5X3NsaWNlKCRiZV9ndGluX3N1X2JyZW5kdSwwLDE1LHRydWUpOwogJG9bJ2JlX2d0aW5fYmVfYnJlbmRvX2thdCddPWFycmF5X3NsaWNlKCRiZV9ndGluX2JlX2JyZW5kbywwLDE1LHRydWUpOwogJG9bJ2JlX2JyZW5kb19wdnonXT0kYmVfYnJlbmRvX3B2ejsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G861'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G861 kokybes pjuviai',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g861=G861')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  // VF srautas — ar yra svoris
  const U=WP+'/wp-content/petshop-xml-vf-fetcher.php?key=dfjsfgtdfbfb54651bhfbd36dggbdgb87b65dfbdgdbfv2dfbfgn6f23dv5f4dvdsz';
  const x=await (await fetch(U)).text();
  const i=x.indexOf('<product'); const j2=x.indexOf('</product>');
  out.vf_pirma_preke = i>=0 ? x.slice(i, j2+10).replace(/\s+/g,' ').slice(0,1400) : x.slice(0,900);
  const tagai={};
  for(const m of x.matchAll(/<([a-z0-9_]+)>/gi)){ tagai[m[1]]=(tagai[m[1]]||0)+1; }
  out.vf_tagai=Object.fromEntries(Object.entries(tagai).sort((a,b)=>b[1]-a[1]).slice(0,30));
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g861.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g861 pjuviai + vf svoris');
