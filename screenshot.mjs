process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0NyddKSB8fCAkX0dFVFsncHNfaDI0NyddIT09J1JFQzNfMjAyNjA4MjQnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidIMjQ3UjMnKTsKICRkaXI9V1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcnOwogJGY9JGRpci4nL2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLWRpc3BhdGNoLnBocCc7CiAkYz1maWxlX2dldF9jb250ZW50cygkZik7CiAkVFsneG1sX2dhbHZhJ109c3Vic3RyKCRjLDEyMDAwLDk1MDApOyAvLyBwbyBpbXBvcnQvc2VuZDogZGVzY3JpcHRpb24vbWFuaWZlc3Qvc2hpcG1lbnQvY29uc2lnbmVlL3NlbmRlcgogLy8gc2V0dGluZ3Mga2xhc2Ugc3UgcmVzZXJ2ZV9wYWNrX251bWJlcnMKICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcixGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogZm9yZWFjaCgkaXQgYXMgJGZmKXsKICBpZihzdWJzdHIoJGZmLC00KSE9PScucGhwJykgY29udGludWU7CiAgJGNjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmZik7CiAgJHA9c3RycG9zKCRjYywnZnVuY3Rpb24gcmVzZXJ2ZV9wYWNrX251bWJlcnMnKTsKICBpZigkcCE9PWZhbHNlKXsKICAgJFRbJ3NldHRpbmdzX2ZhaWxhcyddPWJhc2VuYW1lKCRmZik7CiAgICRUWydyZXNlcnZlJ109c3Vic3RyKCRjYyxtYXgoMCwkcC01MDApLDIyMDApOwogICAkcDI9c3RycG9zKCRjYywnZnVuY3Rpb24gZm9ybWF0X3BhY2tfbnVtYmVyJyk7CiAgIGlmKCRwMiE9PWZhbHNlKSAkVFsnZm9ybWF0J109c3Vic3RyKCRjYywkcDIsOTAwKTsKICAgJHAzPXN0cnBvcygkY2MsJ21hbmlmZXN0Jyk7CiAgICRUWydtYW5pZmVzdF9mcmFnJ109c3Vic3RyKCRjYyxtYXgoMCwkcDMtMzAwKSwxMjAwKTsKICAgYnJlYWs7CiAgfQogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'H247T'};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H247 recon3',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h247=REC3_20260824',{},'rec');
    const tx=await d.text(); try{ out.R=JSON.parse(tx); }catch(e){ out.R='ne-json: '+tx.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h247c.json', Buffer.from(JSON.stringify(out,null,1)), 'H247T');
