process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI3MSddKSB8fCAkX0dFVFsncHNfaDI3MSddIT09J1JVTjIwMjYwODI1RScpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNzFBJyk7CiBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSwgZ2xvYignL2hvbWUvZ3l2dW5haTIvYmFja3Vwcy8qLnBocCcpLCBnbG9iKCcvaG9tZS9neXZ1bmFpMi8qLnBocCcpKSBhcyAkZil7CiAgJHM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoISRzKSBjb250aW51ZTsKICBpZihzdHJpcG9zKCRzLCdEQVpOSUFVU0lPUycpIT09ZmFsc2UgfHwgc3RyaXBvcygkcywnc3V2ZXN0aW4nKSE9PWZhbHNlIHx8IHN0cmlwb3MoJHMsJ25lYXRzaXNrYWl0JykhPT1mYWxzZSl7CiAgICRpbmY9YXJyYXkoJ2ZhaWxhcyc9PiRmLCdkeWRpcyc9PnN0cmxlbigkcyksJ3NhbHRpbmlhaSc9PmFycmF5KCkpOwogICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkcykgYXMgJG49PiRsKXsgaWYocHJlZ19tYXRjaCgnL1wubG9nfGVycm9yX2xvZ3xsb2dzXC98Z2xvYlwofGZvcGVufGZpbGVfZ2V0X2NvbnRlbnRzfGRlcHJlY2F0ZWR8ZmF0YWx8QXJyYXkgdG8gc3RyaW5nfF9jcm9ufHNjaGVkdWxlL2knLCRsKSkgJGluZlsnc2FsdGluaWFpJ11bXT0oJG4rMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE1MCkpOyB9CiAgICRpbmZbJ3NhbHRpbmlhaSddPWFycmF5X3NsaWNlKCRpbmZbJ3NhbHRpbmlhaSddLDAsMjUpOyAkVFsncmFzdGEnXVtdPSRpbmY7CiAgfQogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSw1KTsK'; const SHA='61db6827a123456d4d7cfe862fd451f87716b138';
const MD5={"petshop-rinkiniai.php": "5f79ff63ffe2e57cee87129b41e0ca32"};
const out={v:'H271A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H267 v1 (log+snippet recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h271=RUN20260825E',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h271run.json', Buffer.from(JSON.stringify(out,null,1)), 'H271A');
