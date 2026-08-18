process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAxNiddKT8kX0dFVFsncHNfaDAxNiddOicnKSE9PSdIMDE2JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMTYnKTsKCiAvKiAxLiB0aWtyaSBVUkwgdGVzdGFtcyAqLwogJGJlPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBwLklEIEZST00geyRQfXBvc3RzIHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICBBTkQgcC5wb3N0X3RpdGxlIE5PVCBMSUtFICdURVNUJScKICAgQU5EIE5PVCBFWElTVFMoU0VMRUNUIDEgRlJPTSB7JFB9cG9zdG1ldGEgbSBXSEVSRSBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0ncmFua19tYXRoX3RpdGxlJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJykKICAgT1JERVIgQlkgcC5JRCBERVNDIExJTUlUIDEiKTsKICRrYXQ9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ251bWJlcic9PjEsJ2hpZGVfZW1wdHknPT50cnVlLCdvcmRlcmJ5Jz0+J2NvdW50Jywnb3JkZXInPT4nREVTQycpKTsKICRicmU9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2JyYW5kJywnbnVtYmVyJz0+MSwnaGlkZV9lbXB0eSc9PnRydWUsJ29yZGVyYnknPT4nY291bnQnLCdvcmRlcic9PidERVNDJykpOwogJG9bJ3VybCddPWFycmF5KAogICAncHJla2VfYmVfbWV0YSc9PiRiZT9nZXRfcGVybWFsaW5rKCRiZSk6JycsCiAgICdrYXRlZ29yaWphJz0+KCFpc193cF9lcnJvcigka2F0KSYmJGthdCk/Z2V0X3Rlcm1fbGluaygka2F0WzBdKTonJywKICAgJ2JyZW5kYXMnPT4oIWlzX3dwX2Vycm9yKCRicmUpJiYkYnJlKT9nZXRfdGVybV9saW5rKCRicmVbMF0pOicnCiApOwogJG9bJ3ByZWtlX2JlX21ldGFfaWQnXT0kYmU7CiAkb1snZXhjZXJwdF9pbGdpcyddPSRiZT9tYl9zdHJsZW4od3Bfc3RyaXBfYWxsX3RhZ3MoZ2V0X3Bvc3RfZmllbGQoJ3Bvc3RfZXhjZXJwdCcsJGJlKSkpOjA7CiAkb1snZXhjZXJwdF9wciddPSRiZT9tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoZ2V0X3Bvc3RfZmllbGQoJ3Bvc3RfZXhjZXJwdCcsJGJlKSksMCwyMDApOicnOwoKIC8qIDIuIGtpZWsgcHJla2l1IGFwc2tyaXRhaSB0dXJpIHBvc3RfZXhjZXJwdCAoYXByYXN5bW8gYXRzYXJnYSkgKi8KICRvWydwdWJsaXNoX3N1X2V4Y2VycHQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMKICAgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBUUklNKENPQUxFU0NFKHBvc3RfZXhjZXJwdCwnJykpPD4nJyIpOwoKIC8qIDMuIHNpdGVtYXAgdmFydGFpIOKAlCBpcyBzYWx0aW5pbywgbmUgaXMgc3BlamltbyAqLwogJGRpcj1XUF9QTFVHSU5fRElSLicvc2VvLWJ5LXJhbmstbWF0aCc7CiAkaGl0cz1hcnJheSgpOwogZm9yZWFjaChhcnJheSgnL2luY2x1ZGVzL21vZHVsZXMvc2l0ZW1hcC9jbGFzcy1zaXRlbWFwLnBocCcsJy9pbmNsdWRlcy9tb2R1bGVzL3NpdGVtYXAvY2xhc3Mtcm91dGVyLnBocCcsCiAgICAgICAgICAgICAgICcvaW5jbHVkZXMvbW9kdWxlcy9zaXRlbWFwL2NsYXNzLXNpdGVtYXAteG1sLnBocCcpIGFzICRyZWwpewogICAkeD0kZGlyLiRyZWw7IGlmKCFpc19yZWFkYWJsZSgkeCkpIGNvbnRpbnVlOwogICBmb3JlYWNoKGZpbGUoJHgpIGFzICRpPT4kbCl7CiAgICAgaWYocHJlZ19tYXRjaCgnL2Jsb2dfcHVibGljfGlzX3B1YmxpY3xnZXRfb3B0aW9ufDQwNHxyZXdyaXRlL2knLCRsKSkgJGhpdHNbXT1iYXNlbmFtZSgkcmVsKS4nOicuKCRpKzEpLicgJy50cmltKCRsKTsKICAgfQogfQogJG9bJ3NpdGVtYXBfc2FsdGluaXMnXT1hcnJheV9zbGljZSgkaGl0cywwLDMwKTsKICRvWydzaXRlbWFwX2ZhaWxhaSddPWlzX2RpcigkZGlyLicvaW5jbHVkZXMvbW9kdWxlcy9zaXRlbWFwJyk/c2NhbmRpcigkZGlyLicvaW5jbHVkZXMvbW9kdWxlcy9zaXRlbWFwJyk6bnVsbDsKCiAvKiA0LiBhciByZXdyaXRlIHRhaXN5a2xlcyB0dXJpIHNpdGVtYXAgKi8KICRycj1nZXRfb3B0aW9uKCdyZXdyaXRlX3J1bGVzJyk7CiAkc209YXJyYXkoKTsKIGlmKGlzX2FycmF5KCRycikpIGZvcmVhY2goJHJyIGFzICRrPT4kdil7IGlmKHN0cmlwb3MoJGssJ3NpdGVtYXAnKSE9PWZhbHNlKSAkc21bJGtdPSR2OyB9CiAkb1sncmV3cml0ZV9zaXRlbWFwJ109JHNtOwogJG9bJ3Jld3JpdGVfdmlzbyddPWlzX2FycmF5KCRycik/Y291bnQoJHJyKTowOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H016'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function galva(h){
  const g=(re)=>{const m=h.match(re);return m?m[1]:''};
  return {
    title:g(/<title>([\s\S]*?)<\/title>/i).slice(0,180),
    t_ilg:(g(/<title>([\s\S]*?)<\/title>/i)||'').length,
    description:g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i).slice(0,260),
    d_ilg:(g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)||'').length,
    og_title:g(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i).slice(0,100),
    robots:g(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i),
    canonical:g(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    ldjson:(h.match(/application\/ld\+json/gi)||[]).length,
    rm_zyme:/Rank Math/i.test(h)?1:0
  };
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H016 RM patikra',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h016=H016'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  out.galvos={};
  const U=(out.d&&out.d.url)?out.d.url:{};
  U.preke_su_meta='https://dev.avesa.lt/product/ambrosia-junior-begrudis-su-sviezia-vistiena-ir-lasisa-sausas-maistas-dideliu-veisliu-jauniems-suniukams-fresh-chicken-salmon-12-kg/';
  for(const [k,u] of Object.entries(U)){
    if(!u) continue;
    try{ const x=await fetch(u); const h=await x.text(); out.galvos[k]={http:x.status,...galva(h)}; }
    catch(e){ out.galvos[k]={klaida:String(e).slice(0,120)}; }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h016.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h016 rm patikra');
