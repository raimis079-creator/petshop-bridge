process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0NyddKSB8fCAkX0dFVFsncHNfaDI0NyddIT09J1JFQzJfMjAyNjA4MjQnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidIMjQ3UjInKTsKICRmPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nL2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLWRpc3BhdGNoLnBocCc7CiAkYz1maWxlX2dldF9jb250ZW50cygkZik7CiAvLyBmdW5rY2lqYSwga3VyaSBzdGF0byBYTUw6IHJhc3RpICdpbXBvcnQvc2VuZCcgaXIgJzxkZXNjcmlwdGlvbicgaW5rYXJ1cwogZm9yZWFjaChhcnJheSgnaW1wb3J0L3NlbmQnLCc8ZGVzY3JpcHRpb24nLCdwYWNrX25vJywnZnVuY3Rpb24gZGlzcGF0Y2gnLCdzZW5kZXInLCd4bWwnKSBhcyAkayl7CiAgJHA9c3RyaXBvcygkYywkayk7ICRUWydwb3onXVska109JHA7CiB9CiAkcD1zdHJpcG9zKCRjLCdpbXBvcnQvc2VuZCcpOwogJFRbJ3NlbmRfYmxva2FzJ109c3Vic3RyKCRjLG1heCgwLCRwLTEyMDApLDI2MDApOwogJHAyPXN0cmlwb3MoJGMsJzxkZXNjcmlwdGlvbicpOwogaWYoJHAyIT09ZmFsc2UpICRUWyd4bWxfYmxva2FzJ109c3Vic3RyKCRjLG1heCgwLCRwMi0zNTAwKSw3MDAwKTsKIC8vIHBhY2sgbnVtZXJpdSBnZW5lcmF2aW1hcwogJHAzPXN0cmlwb3MoJGMsJ3BhY2tfbm8nKTsKIGlmKCRwMyE9PWZhbHNlKSAkVFsncGFja19ibG9rYXMnXT1zdWJzdHIoJGMsbWF4KDAsJHAzLTE1MDApLDMwMDApOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'H247S'};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H247 recon2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h247=REC2_20260824',{},'rec');
    const tx=await d.text(); try{ out.R=JSON.parse(tx); }catch(e){ out.R='ne-json: '+tx.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h247b.json', Buffer.from(JSON.stringify(out,null,1)), 'H247S');
