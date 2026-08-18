process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5NzAnXSk/JF9HRVRbJ3BzX2c5NzAnXTonJykgIT09ICdHOTcwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5NzAnKTsKCiAkdGVybXM9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogJGlkcz1hcnJheV9mbGlwKHBzX2ZlZWRzX2lkcygpKTsKICRlaWw9YXJyYXkoKTsKIGZvcmVhY2goJHRlcm1zIGFzICR0KXsKICAgJGFuYz1nZXRfYW5jZXN0b3JzKCR0LT50ZXJtX2lkLCdwcm9kdWN0X2NhdCcpOwogICAka2VsaWFzPWFycmF5KCk7CiAgIGZvcmVhY2goYXJyYXlfcmV2ZXJzZSgkYW5jKSBhcyAkYSl7ICR4PWdldF90ZXJtKCRhLCdwcm9kdWN0X2NhdCcpOyBpZigkeCAmJiAhaXNfd3BfZXJyb3IoJHgpKSAka2VsaWFzW109JHgtPm5hbWU7IH0KICAgJGtlbGlhc1tdPSR0LT5uYW1lOwogICAvKiBraWVrIHNpdSBrYXRlZ29yaWpvcyBwcmVraXUgcmVhbGlhaSBlaW5hIGkgZmVlZCdhICovCiAgICRwcmVraXU9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCB0ci5vYmplY3RfaWQgRlJPTSB7JFB9dGVybV9yZWxhdGlvbnNoaXBzIHRyCiAgICAgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgICBXSEVSRSB0dC50ZXJtX2lkPSVkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIiwgJHQtPnRlcm1faWQpKTsKICAgJGZlZWRlPTA7IGZvcmVhY2goJHByZWtpdSBhcyAkcGlkKXsgaWYoaXNzZXQoJGlkc1soaW50KSRwaWRdKSkgJGZlZWRlKys7IH0KICAgJGVpbFtdPWFycmF5KCdpZCc9PiR0LT50ZXJtX2lkLCd2YXJkYXMnPT4kdC0+bmFtZSwnc2x1Zyc9PiR0LT5zbHVnLAogICAgICdneWxpcyc9PmNvdW50KCRhbmMpLCdrZWxpYXMnPT5pbXBsb2RlKCcg4oC6ICcsJGtlbGlhcyksCiAgICAgJ3djX2NvdW50Jz0+KGludCkkdC0+Y291bnQsJ2ZlZWRlJz0+JGZlZWRlLCd0ZXZhcyc9PihpbnQpJHQtPnBhcmVudCk7CiB9CiB1c29ydCgkZWlsLCBmdW5jdGlvbigkYSwkYil7IHJldHVybiBzdHJjbXAoJGFbJ2tlbGlhcyddLCRiWydrZWxpYXMnXSk7IH0pOwogJG9bJ2tpZWsnXT1jb3VudCgkZWlsKTsKICRvWydmZWVkZV92aXNvJ109YXJyYXlfc3VtKGFycmF5X2NvbHVtbigkZWlsLCdmZWVkZScpKTsKICRvWydzYXJhc2FzJ109JGVpbDsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G970'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G970 kategorijos',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g970=G970')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g970.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g970');
