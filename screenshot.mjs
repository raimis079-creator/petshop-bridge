process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIExQIER5ZGlzIFJlY29uIHYyCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19scGQyJ10pIHx8ICRfR0VUWydwc19scGQyJ10hPT0nTFAyMDI2MDgyNkUnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkVD1hcnJheSgndic9PidMUEQyJywndHMnPT5nbWRhdGUoJ2MnKSk7CiAkUD1XUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbic7CgogLyogcGlsbmFzIHNpemUtc2VydmljZSAqLwogJGY9JFAuJy9hZG1pbi9jbGFzcy13b28tbGl0aHVhbmlhcG9zdC1hZG1pbi1zaXplLXNlcnZpY2UucGhwJzsKIGlmKGZpbGVfZXhpc3RzKCRmKSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJFRbJ3NpemVfc2VydmljZSddPWFycmF5KCdkeWRpcyc9PnN0cmxlbigkcyksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoJHMpKTsgfQoKIC8qIGt1ciBzYXVnb21pIG1ldGEgcmFrdGFpIGFkbWluIGthdGFsb2dlICovCiAkdGVybXM9YXJyYXkoJ3VwZGF0ZV9tZXRhX2RhdGEnLCd1cGRhdGVfcG9zdF9tZXRhJywnX3dvb19saXRodWFuaWFwb3N0JywnZ2V0X21ldGEoJywnLT5wbGFuJyk7CiAkcmV6PWFycmF5KCk7CiBmb3JlYWNoKGFycmF5KCRQLicvYWRtaW4nLCRQLicvaW5jbHVkZXMnKSBhcyAkZCl7CiAgIGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICBmb3JlYWNoKCRpdCBhcyAkeCl7CiAgICAgaWYoISR4LT5pc0ZpbGUoKXx8c3RydG9sb3dlcigkeC0+Z2V0RXh0ZW5zaW9uKCkpIT09J3BocCcpIGNvbnRpbnVlOwogICAgIGlmKHN0cnBvcygkeC0+Z2V0UGF0aG5hbWUoKSwnL3ZlbmRvci8nKSE9PWZhbHNlKSBjb250aW51ZTsKICAgICAkTD1maWxlKCR4LT5nZXRQYXRobmFtZSgpKTsKICAgICBmb3JlYWNoKCRMIGFzICRpPT4kbG4pewogICAgICAgZm9yZWFjaCgkdGVybXMgYXMgJHQpewogICAgICAgICBpZihzdHJwb3MoJGxuLCR0KSE9PWZhbHNlKXsKICAgICAgICAgICBpZighaXNzZXQoJHJlelskdF0pKSAkcmV6WyR0XT1hcnJheSgpOwogICAgICAgICAgIGlmKGNvdW50KCRyZXpbJHRdKTwyNSkgJHJlelskdF1bXT1zdHJfcmVwbGFjZSgkUCwnJywkeC0+Z2V0UGF0aG5hbWUoKSkuJzonLigkaSsxKS4nICcudHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRsbiwwLDE0MCkpKTsKICAgICAgICAgfQogICAgICAgfQogICAgIH0KICAgfQogfQogJFRbJ2dyZXAnXT0kcmV6OwoKIC8qIG9yZGVyIG1ldGEgYm94IGVpbHV0ZXMgYXBpZSBkeWRpICovCiAkbWI9JFAuJy9hZG1pbi9jbGFzcy13b28tbGl0aHVhbmlhcG9zdC1hZG1pbi1vcmRlci1tZXRhLWJveC5waHAnOwogaWYoZmlsZV9leGlzdHMoJG1iKSl7ICRMPWZpbGUoJG1iKTsgJGI9YXJyYXkoKTsKICAgZm9yKCRpPTI3MDskaTxtaW4oMzMwLGNvdW50KCRMKSk7JGkrKykgJGJbXT0oJGkrMSkuJzogJy5ydHJpbSgkTFskaV0pOwogICAkVFsnbWV0YV9ib3hfMjcwXzMzMCddPSRiOyB9CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo=';
const KEY='LP20260826E'; const VER='LPD2';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP LP Dydis Recon v2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_lpd2='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/lp_recon2.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,900); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/lp_recon2run.json', Buffer.from(JSON.stringify(out,null,1)), VER);
