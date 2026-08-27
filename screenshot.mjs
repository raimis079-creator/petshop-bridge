process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEFkcyBwYXRpa3JhCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19hYyddKSB8fCAkX0dFVFsncHNfYWMnXSE9PSdBQzI3JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4Lidwc19mYWt0X3Jla2xhbWEnOwogJG89YXJyYXkoCiAgJ3Bhc2t1dGluaXNfZ2F2aW1hcyc9PmdldF9vcHRpb24oJ3BzX2Fkc19wYXNrdXRpbmlzJyksCiAgJ2VpbHV0ZXMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBkaWVuYSxrYW5hbGFzLGthbXBhbmlqYV9pZCxrYW1wYW5pamEscGFzcGF1ZGltYWksaXNsYWlkb3NfY3Qsa29udmVyc2lqb3Msc2FsdGluaXMsdmVyc2lqYSxpcmFzeXRhX2F0IEZST00gJHQgT1JERVIgQlkgZGllbmEgREVTQywgaXNsYWlkb3NfY3QgREVTQyBMSU1JVCAyNSIsQVJSQVlfQSksCiAgJ3Zpc28nPT4kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTShpc2xhaWRvc19jdCkgYywgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpIEZST00gJHQgV0hFUkUgc2FsdGluaXM9J2Fkc19zY3JpcHQnIixBUlJBWV9BKSwKICk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='HT27';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
const body=JSON.stringify({currency:'EUR',rows:[]});
const K='FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
async function t(url,opts,k){ try{ const r=await fetch(url,{...opts,redirect:'manual'}); out[k]={st:r.status,loc:r.headers.get('location'),b:(await r.text()).slice(0,160)}; }catch(e){ out[k]='ERR '+String(e).slice(0,140); } }
await t('http://dev.avesa.lt/wp-json/ps-web/v1/ads',{method:'POST',headers:{'Content-Type':'application/json','X-PS-Key':K},body},'http_post');
await t('http://dev.avesa.lt/',{method:'GET'},'http_get');
await t('https://dev.avesa.lt/wp-json/ps-web/v1/ads',{method:'POST',headers:{'Content-Type':'application/json','X-PS-Key':K},body},'https_post');
try{ const {execSync}=await import('child_process'); out.cert=execSync("echo | openssl s_client -servername dev.avesa.lt -connect dev.avesa.lt:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates").toString(); }catch(e){ out.cert='ERR '+String(e).slice(0,120); }
await put('deploy/httptest.json', Buffer.from(JSON.stringify(out,null,1)), VER);
