process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0NyddKSB8fCAkX0dFVFsncHNfaDI0NyddIT09J1JFQzRfMjAyNjA4MjQnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidIMjQ3UjQnKTsKICRmPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nL2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLWRpc3BhdGNoLnBocCc7CiAkYz1maWxlX2dldF9jb250ZW50cygkZik7CiAkcD1zdHJwb3MoJGMsJ2NvbnNpZ25lZScpOwogJFRbJ2NvbnNpZ25lZV9wb3onXT0kcDsKICRUWyd4bWxfa3VuYXMnXT1zdWJzdHIoJGMsbWF4KDAsJHAtODAwKSw4NTAwKTsKIGZvcmVhY2goYXJyYXkoJ3ZlbmlwYWtfbWFuaWZlc3QnLCdtYW5pZmVzdF9udW1iZXInLCd2ZW5pcGFrX3VzZXJpZCA9JywndmVuaXBha191c2VybmFtZSA9JykgYXMgJGspewogICRwcD1zdHJwb3MoJGMsJGspOwogIGlmKCRwcCE9PWZhbHNlKSAkVFsnZnJhZyddWyRrXT1zdWJzdHIoJGMsbWF4KDAsJHBwLTIwMCksNDUwKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'H247U'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<4;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(6000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H247 recon4',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h247=REC4_20260824',{},'rec');
    const tx=await d.text(); try{ out.R=JSON.parse(tx); }catch(e){ out.R='ne-json: '+tx.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h247d.json', Buffer.from(JSON.stringify(out,null,1)), 'H247U');
