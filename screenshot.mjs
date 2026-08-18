process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5MjAnXSk/JF9HRVRbJ3BzX2c5MjAnXTonJykgIT09ICdHOTIwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5MjAnKTsKCiAkYnJlbmRhaT1hcnJheSgpOwogZm9yZWFjaChnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfYnJhbmQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKSBhcyAkdCkgJGJyZW5kYWlbJHQtPnRlcm1faWRdPSR0LT5uYW1lOwoKICRpZHM9cHNfZmVlZHNfaWRzKCk7ICRlaWw9YXJyYXkoKTsKIGZvcmVhY2goYXJyYXlfY2h1bmsoJGlkcywzMDApIGFzICRwayl7CiAgZm9yZWFjaCgkcGsgYXMgJGlkKXsKICAgJGlkPShpbnQpJGlkOwogICAkYnQ9Z2V0X3RoZV90ZXJtcygkaWQsJ3Byb2R1Y3RfYnJhbmQnKTsKICAgaWYoJGJ0ICYmICFpc193cF9lcnJvcigkYnQpKSBjb250aW51ZTsKICAgJHBvc3Q9Z2V0X3Bvc3QoJGlkKTsKICAgJHRla3N0YXM9dHJpbSh3cF9zdHJpcF9hbGxfdGFncyhodG1sX2VudGl0eV9kZWNvZGUoKHN0cmluZykkcG9zdC0+cG9zdF9jb250ZW50LicgJy4oc3RyaW5nKSRwb3N0LT5wb3N0X2V4Y2VycHQsRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JykpKTsKICAgJHQyPScgJy5tYl9zdHJ0b2xvd2VyKCRwb3N0LT5wb3N0X3RpdGxlLicgJy4kdGVrc3RhcykuJyAnOwoKICAgLyogMS4gZXNhbWFzIGJyZW5kYXMgdGVrc3RlICovCiAgICRyYXN0YT1udWxsOwogICBmb3JlYWNoKCRicmVuZGFpIGFzICR0aWQ9PiR2KXsKICAgICAkdnY9bWJfc3RydG9sb3dlcih0cmltKCR2KSk7CiAgICAgaWYobWJfc3RybGVuKCR2dik8MykgY29udGludWU7CiAgICAgaWYocHJlZ19tYXRjaCgnLyg/PCFbXHB7TH1ccHtOfV0pJy5wcmVnX3F1b3RlKCR2diwnLycpLicoPyFbXHB7TH1ccHtOfV0pL3UnLCR0MikpeyAkcmFzdGE9YXJyYXkoJ3Rlcm1faWQnPT4kdGlkLCdicmVuZGFzJz0+JHYsJ3NhbHRpbmlzJz0+J3Rla3N0YXMnKTsgYnJlYWs7IH0KICAgfQogICAvKiAyLiAiR2FtaW50b2phczogWCIgKi8KICAgJGdhbT0nJzsKICAgaWYocHJlZ19tYXRjaCgnL2dhbWludG9qYXNccypbOuKAky1dXHMqKFteXC5cbixdezIsNDB9KS9pdScsJHRla3N0YXMsJG0pKSAkZ2FtPXRyaW0oJG1bMV0pOwogICAvKiAzLiBza2xpYXVzdHVvc2UgcG8gcGF2YWRpbmltbyBlc2FudGlzIHZhcmRhcyAocHZ6LiAiUHVyZSBQcmV0dHksIDU3UFAwNyIpICovCiAgICRza2w9Jyc7CiAgIGlmKHByZWdfbWF0Y2goJy9cKChbQS1axaDFvcSExIzEmMSWxK7FssWqXVtccHtMfVxzJitcLV17MiwzMH0pWyxcKV0vdScsJHRla3N0YXMsJG0pKSAkc2tsPXRyaW0oJG1bMV0pOwoKICAgJGltZz0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfdGh1bWJuYWlsX2lkJyx0cnVlKTsKICAgJGVpbFtdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+JHBvc3QtPnBvc3RfdGl0bGUsJ3NrdSc9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19za3UnLHRydWUpLAogICAgICd0ZWtzdGFzJz0+bWJfc3Vic3RyKCR0ZWtzdGFzLDAsMjIwKSwKICAgICAndGllayc9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKSwKICAgICAncmFzdGEnPT4kcmFzdGEsJ2dhbWludG9qYXMnPT4kZ2FtLCdza2xpYXVzdHVvc2UnPT4kc2tsLAogICAgICdpbWcnPT4kaW1nP3dwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkaW1nLCd3b29jb21tZXJjZV90aHVtYm5haWwnKTonJyk7CiAgfQogIHdwX2NhY2hlX2ZsdXNoKCk7CiB9CiAkb1sna2llayddPWNvdW50KCRlaWwpOwogJG9bJ3N1X2F0aXRpa21lbml1J109Y291bnQoYXJyYXlfZmlsdGVyKCRlaWwsZnVuY3Rpb24oJHIpe3JldHVybiAkclsncmFzdGEnXSE9PW51bGw7fSkpOwogJG9bJ3N1X2dhbWludG9qdSddPWNvdW50KGFycmF5X2ZpbHRlcigkZWlsLGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ2dhbWludG9qYXMnXSE9PScnO30pKTsKICRvWydiNjQnXT1iYXNlNjRfZW5jb2RlKGd6ZW5jb2RlKHdwX2pzb25fZW5jb2RlKCRlaWwpLDYpKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G920'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G920 brendai is teksto',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g920=G920')).text();
  let d=null; try{ d=JSON.parse(t); out.d=d; }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  if(d && d.b64){
    const zlib=await import('zlib');
    const eil=JSON.parse(zlib.gunzipSync(Buffer.from(d.b64,'base64')).toString('utf8'));
    out.nuotr={ok:0,ne:0};
    for(const r of eil){
      if(!r.img){ out.nuotr.ne++; continue; }
      try{ const ir=await fetch(r.img); if(!ir.ok){out.nuotr.ne++;continue;}
        const buf=Buffer.from(await ir.arrayBuffer());
        const ext=(r.img.split('.').pop().split('?')[0]||'jpg').toLowerCase();
        const st=await put('brendai/'+r.id+'.'+ext, buf, 'b '+r.id);
        if(st===200||st===201) out.nuotr.ok++; else out.nuotr.ne++;
      }catch(e){ out.nuotr.ne++; }
    }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g920.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g920');
