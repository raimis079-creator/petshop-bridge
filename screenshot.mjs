process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFhNTCBrdmlldGltdSBrb250ZWtzdGFzCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc194ciddKSB8fCAkX0dFVFsncHNfeHInXSE9PSdYUjIwMjYwODI2JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJFQ9YXJyYXkoJ3YnPT4nWFInLCd0cyc9PmdtZGF0ZSgnYycpKTsKICRwPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnOwogJFRbJ21kNSddPW1kNV9maWxlKCRwKTsgJFRbJ2R5ZGlzJ109ZmlsZXNpemUoJHApOwogJEw9ZmlsZSgkcCk7CiAkVFsnZWlsJ109Y291bnQoJEwpOwogZm9yZWFjaChhcnJheShhcnJheSg3NjUsODAwKSxhcnJheSgxMDkwLDExNDApKSBhcyAkcil7CiAgICRiPWFycmF5KCk7CiAgIGZvcigkaT0kclswXS0xOyRpPG1pbigkclsxXSxjb3VudCgkTCkpOyRpKyspICRiW109KCRpKzEpLic6ICcucnRyaW0oJExbJGldKTsKICAgJFRbJ2Jsb2thaSddWyRyWzBdLictJy4kclsxXV09JGI7CiB9CiAvKiBrdXIgJGNhdF9zbHVncyBzdWRhcm9tYXMgKi8KICR4PWFycmF5KCk7CiBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihzdHJwb3MoJGxuLCdjYXRfc2x1Z3MnKSE9PWZhbHNlKSAkeFtdPSgkaSsxKS4nOiAnLnRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkbG4sMCwxNTApKSk7IH0KICRUWydjYXRfc2x1Z3MnXT0keDsKIC8qIGNsYXNzLXByaWNpbmcucGhwIGdldF9tYXJrdXAgaXIgY2FsY3VsYXRlICovCiAkcDI9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXByaWNpbmcucGhwJzsKICRMMj1maWxlKCRwMik7ICRiPWFycmF5KCk7CiBmb3IoJGk9MTYwOyRpPG1pbigxOTAsY291bnQoJEwyKSk7JGkrKykgJGJbXT0oJGkrMSkuJzogJy5ydHJpbSgkTDJbJGldKTsKICRUWydwcmljaW5nXzE2MF8xOTAnXT0kYjsKICRUWydwcmljaW5nX21kNSddPW1kNV9maWxlKCRwMik7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='XR';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP XML kontekstas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'s');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_xr=XR20260826',{},'r'); const t=await d.text();
  try{ await put('deploy/xr.json', Buffer.from(t,'utf8'), VER); out.ok=1; }catch(e){ out.raw=t.slice(0,300); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/xrrun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
